const fs = require('fs');
const state = JSON.parse(fs.readFileSync('data/app-state.json', 'utf8'));

console.log('--- Checking all slots in Day Plan against Availability ---');

let totalFixedCandidates = 0;

state.dayPlan.instructors.forEach(planInst => {
    const inst = state.instructors.find(i => i.id === planInst.instructorId);
    if (!inst) {
        console.log('Instructor in DayPlan NOT in Availability:', planInst.instructorName, planInst.instructorId);
        return;
    }
    
    planInst.sessions.forEach(s => {
        const emptyRow = (inst.slotsRows || []).find(r => r.slotDisplay === String(s.slot));
        if (emptyRow) {
            console.log('Instructor: ' + inst.name + ' (#' + inst.id + ') | Slot ' + s.slot + ' (' + s.time + ') | Student: ' + s.studentName + ' | In slotsRows: sat=' + emptyRow.sat + ', sun=' + emptyRow.sun);
            totalFixedCandidates++;
        }
    });
});

console.log('Total Fixed Candidates found in current state slotsRows:', totalFixedCandidates);
