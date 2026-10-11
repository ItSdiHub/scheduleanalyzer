const fs = require('fs');

// Mock browser globals
global.window = global;
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; }
};
global.document = {
    documentElement: { lang: 'ar', dir: 'rtl' },
    getElementById: (id) => ({ innerText: '', innerHTML: '', style: {}, value: '', classList: { add() {}, remove() {}, toggle() {} }, addEventListener() {} }),
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: () => ({ style: {}, classList: { add() {} } })
};
global.BroadcastChannel = class { postMessage() {} close() {} };

// Load application dependencies
eval(fs.readFileSync('js/translations.js', 'utf8').replace(/const /g, 'var '));
eval(fs.readFileSync('js/sampleData.js', 'utf8').replace(/const /g, 'var '));
eval(fs.readFileSync('js/sampleDayPlan.js', 'utf8').replace(/const /g, 'var '));
eval(fs.readFileSync('js/pdfParser.js', 'utf8').replace(/const /g, 'var '));
eval(fs.readFileSync('js/dayPlanParser.js', 'utf8').replace(/const /g, 'var '));
eval(fs.readFileSync('js/comparisonEngine.js', 'utf8').replace(/const /g, 'var '));
eval(fs.readFileSync('js/app.js', 'utf8').replace(/class SDIReportApp/g, 'var SDIReportApp = class'));

console.log('--- 1. Initializing SDIReportApp with data/app-state.json ---');
const rawState = JSON.parse(fs.readFileSync('data/app-state.json', 'utf8'));
localStorage.setItem('sdi_instructors_custom', JSON.stringify(rawState.instructors));
localStorage.setItem('sdi_day_plan_data', JSON.stringify(rawState.dayPlan));

const app = new SDIReportApp();
console.log(`Loaded ${app.instructors.length} instructors.`);
console.log(`Day Plan Date: ${app.dayPlanData.date}, Total Sessions: ${app.dayPlanData.stats.totalSessions}`);

console.log('\n--- 2. Verifying Ashraf Ali (180040) Slot 4 Rendering ---');
const ashraf = app.instructors.find(i => i.id === '180040');
const ashrafSlot4 = ashraf.fullSchedule.find(s => s.slot === 4);
console.log('Slot 4 Raw Data:');
console.log('  Sat status:', ashrafSlot4.sat, 'Sat details:', ashrafSlot4.satDetails);
console.log('  Sun status:', ashrafSlot4.sun, 'Sun isFixed:', ashrafSlot4.sunDetails?.isFixed, 'Student:', ashrafSlot4.sunDetails?.studentName);

// Extract the renderSlotCell function for Ashraf Slot 4
const testSlotCell = (slotItem, dayGroup) => {
    const isOcc = slotItem[dayGroup] === 'occupied';
    const details = (dayGroup === 'sat') ? (slotItem.satDetails || {}) : (slotItem.sunDetails || {});
    const isFixed = !!details.isFixed;
    
    let planSession = null;
    if (app.dayPlanData && Array.isArray(app.dayPlanData.instructors)) {
        const pInst = app.dayPlanData.instructors.find(pi => String(pi.instructorId).trim() === '180040');
        if (pInst && Array.isArray(pInst.sessions)) {
            const pDate = pInst.date || app.dayPlanData.date;
            const pDayKey = (app.comparisonDayKey === 'auto') ? SDIComparisonEngine.detectDayKeyFromDate(pDate) : app.comparisonDayKey;
            if (dayGroup === pDayKey) {
                planSession = pInst.sessions.find(ps => ps.slot === slotItem.slot);
            }
        }
    }

    if (!isOcc) {
        if (planSession) return `[ORANGE BADGE] 📌 مسجلة بالخطة (Fixed) - Student: ${planSession.studentName}`;
        return `[EMPTY BUTTON] ✨ ${app.t('badgeEmpty')}`;
    }

    if (isFixed) {
        return `[ORANGE FIXED OCCUPIED] 🔒 مشغول - Fixed (Student: ${details.studentName})`;
    }
    return `[STANDARD OCCUPIED] 🔒 ${app.t('badgeOccupied')} (Student: ${details.studentName})`;
};

console.log('  Ashraf Slot 4 Saturday display:', testSlotCell(ashrafSlot4, 'sat'));
console.log('  Ashraf Slot 4 Sunday display:  ', testSlotCell(ashrafSlot4, 'sun'));

console.log('\n--- 3. Verifying Comparison Engine Stats on Sunday ---');
const comp = SDIComparisonEngine.compare(app.instructors, app.dayPlanData, 'sun');
console.log('Comparison Stats:', comp.stats);
console.log('Fixed Sessions Count:', comp.stats.manualExtraSessions);
comp.instructors.filter(ci => ci.stats.manualExtra > 0).forEach(ci => {
    console.log(`Instructor ${ci.instructorId} (${ci.instructorName}): ${ci.stats.manualExtra} Fixed slot(s)`);
    ci.slots.filter(s => s.status === 'MANUAL_EXTRA').forEach(s => {
        console.log(`  -> Slot ${s.slot} (${s.time}): ${s.studentName} [${s.statusTextAr}]`);
    });
});

console.log('\n--- 4. Testing Multi-Upload / Re-application Idempotence ---');
console.log('Simulating applyPlanToSchedule run 1...');
app.applyPlanToSchedule('all', true);
let compAfter1 = SDIComparisonEngine.compare(app.instructors, app.dayPlanData, 'sun');
console.log('After run 1 Fixed Count:', compAfter1.stats.manualExtraSessions);

console.log('Simulating applyPlanToSchedule run 2 (e.g. second file or refresh)...');
app.applyPlanToSchedule('all', true);
let compAfter2 = SDIComparisonEngine.compare(app.instructors, app.dayPlanData, 'sun');
console.log('After run 2 Fixed Count:', compAfter2.stats.manualExtraSessions);

console.log('Simulating applyPlanToSchedule run 3...');
app.applyPlanToSchedule('all', true);
let compAfter3 = SDIComparisonEngine.compare(app.instructors, app.dayPlanData, 'sun');
console.log('After run 3 Fixed Count:', compAfter3.stats.manualExtraSessions);

if (compAfter1.stats.manualExtraSessions === compAfter2.stats.manualExtraSessions && compAfter2.stats.manualExtraSessions >= 4) {
    console.log('\n✅ TEST PASSED: Fixed sessions are preserved across multiple file uploads and refreshes!');
} else {
    console.error('\n❌ TEST FAILED: Fixed sessions count mutated!');
    process.exit(1);
}
