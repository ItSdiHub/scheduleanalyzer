const fs = require('fs');

Uint8Array.prototype.toHex = function() { return Buffer.from(this).toString('hex'); };

async function run() {
    const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
    global.pdfjsLib = pdfjs;

    // Load parser files into context
    const pdfParserCode = fs.readFileSync('js/pdfParser.js', 'utf8').replace(/const /g, 'var ');
    const dayPlanParserCode = fs.readFileSync('js/dayPlanParser.js', 'utf8').replace(/const /g, 'var ');
    const comparisonEngineCode = fs.readFileSync('js/comparisonEngine.js', 'utf8').replace(/const /g, 'var ');
    eval(pdfParserCode);
    eval(dayPlanParserCode);
    eval(comparisonEngineCode);

    console.log('--- 1. Parsing Availability: Print-27.pdf ---');
    const availFileBuf = fs.readFileSync('C:/Users/Mahmoud/Downloads/Print-27.pdf');
    const availFileObj = {
        name: 'Print-27.pdf',
        arrayBuffer: async () => availFileBuf.buffer.slice(availFileBuf.byteOffset, availFileBuf.byteOffset + availFileBuf.byteLength)
    };
    const availInstructors = await SDIPdfParser.parsePdfFile(availFileObj);
    console.log(`Extracted ${availInstructors.length} instructors from Print-27.pdf:`);
    availInstructors.forEach(i => console.log(`  - ${i.id}: ${i.name} (Shift: ${i.shift}, Cap: ${i.capacitySat}/${i.capacitySun})`));

    console.log('\n--- 2. Parsing Day Plan 1: Print-25.pdf ---');
    const dp1Buf = fs.readFileSync('C:/Users/Mahmoud/Downloads/Print-25.pdf');
    const dp1File = {
        name: 'Print-25.pdf',
        arrayBuffer: async () => dp1Buf.buffer.slice(dp1Buf.byteOffset, dp1Buf.byteOffset + dp1Buf.byteLength)
    };
    const dp1 = await SDIDayPlanParser.parsePdfFile(dp1File);
    console.log(`Print-25: date=${dp1.date}, totalSessions=${dp1.stats.totalSessions}, instructors=${dp1.instructors.length}`);
    dp1.instructors.forEach(i => console.log(`  - ${i.instructorId}: ${i.instructorName} (${i.sessions.length} sessions, date: ${i.date})`));

    console.log('\n--- 3. Parsing Day Plan 2: Print-26.pdf ---');
    const dp2Buf = fs.readFileSync('C:/Users/Mahmoud/Downloads/Print-26.pdf');
    const dp2File = {
        name: 'Print-26.pdf',
        arrayBuffer: async () => dp2Buf.buffer.slice(dp2Buf.byteOffset, dp2Buf.byteOffset + dp2Buf.byteLength)
    };
    const dp2 = await SDIDayPlanParser.parsePdfFile(dp2File);
    console.log(`Print-26: date=${dp2.date}, totalSessions=${dp2.stats.totalSessions}, instructors=${dp2.instructors.length}`);
    dp2.instructors.forEach(i => console.log(`  - ${i.instructorId}: ${i.instructorName} (${i.sessions.length} sessions, date: ${i.date})`));

    console.log('\n--- 4. Merging Day Plan Files (Print-25 + Print-26) ---');
    const mergedPlan = await SDIDayPlanParser.parseMultipleFiles([dp1File, dp2File]);
    console.log(`Merged: date=${mergedPlan.date}, totalSessions=${mergedPlan.stats.totalSessions}, instructors=${mergedPlan.instructors.length}`);
    mergedPlan.instructors.forEach(i => console.log(`  - ${i.instructorId}: ${i.instructorName} (${i.sessions.length} sessions)`));

    console.log('\n--- 5. Checking Candidate Fixed Slots (Day Plan vs Baseline Availability) ---');
    const dayKey = 'sun'; // 11/10/2026 is Sunday
    mergedPlan.instructors.forEach(pInst => {
        const aInst = availInstructors.find(a => String(a.id).trim() === String(pInst.instructorId).trim());
        if (!aInst) {
            console.log(`Instructor ${pInst.instructorId} (${pInst.instructorName}) NOT in Availability!`);
            return;
        }
        pInst.sessions.forEach(sess => {
            const slotObj = aInst.fullSchedule.find(s => s.slot === sess.slot);
            const isOccSun = slotObj ? (slotObj.sun === 'occupied') : false;
            const isOccSat = slotObj ? (slotObj.sat === 'occupied') : false;
            if (!isOccSun) {
                console.log(`[FIXED CANDIDATE SUN] Inst ${aInst.id} (${aInst.name}): Slot ${sess.slot} (${sess.time}) is EMPTY on Sunday in Availability! Student: ${sess.studentName}`);
            }
        });
    });
}

run().catch(console.error);
