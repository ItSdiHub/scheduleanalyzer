const fs = require('fs');

Uint8Array.prototype.toHex = function() { return Buffer.from(this).toString('hex'); };

async function updateState() {
    const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
    global.pdfjsLib = pdfjs;

    eval(fs.readFileSync('js/pdfParser.js', 'utf8').replace(/const /g, 'var '));
    eval(fs.readFileSync('js/dayPlanParser.js', 'utf8').replace(/const /g, 'var '));
    eval(fs.readFileSync('js/comparisonEngine.js', 'utf8').replace(/const /g, 'var '));

    console.log('1. Parsing Availability: Print-27.pdf...');
    const aBuf = fs.readFileSync('C:/Users/Mahmoud/Downloads/Print-27.pdf');
    const availInstructors = await SDIPdfParser.parsePdfFile({
        name: 'Print-27.pdf',
        arrayBuffer: async () => aBuf.buffer.slice(aBuf.byteOffset, aBuf.byteOffset + aBuf.byteLength)
    });

    console.log('2. Parsing Day Plan files: Print-25.pdf + Print-26.pdf...');
    const dp1Buf = fs.readFileSync('C:/Users/Mahmoud/Downloads/Print-25.pdf');
    const dp2Buf = fs.readFileSync('C:/Users/Mahmoud/Downloads/Print-26.pdf');
    const mergedPlan = await SDIDayPlanParser.parseMultipleFiles([
        { name: 'Print-25.pdf', arrayBuffer: async () => dp1Buf.buffer.slice(dp1Buf.byteOffset, dp1Buf.byteOffset + dp1Buf.byteLength) },
        { name: 'Print-26.pdf', arrayBuffer: async () => dp2Buf.buffer.slice(dp2Buf.byteOffset, dp2Buf.byteOffset + dp2Buf.byteLength) }
    ]);

    console.log('3. Applying Day Plan sessions to instructors with baseline preservation...');
    mergedPlan.instructors.forEach(planInst => {
        const inst = availInstructors.find(i => String(i.id).trim() === String(planInst.instructorId).trim());
        if (!inst) return;

        const instDate = planInst.date || mergedPlan.date;
        const instDayKey = (instDate) ? SDIComparisonEngine.detectDayKeyFromDate(instDate) : 'sun';
        const instDetailsKey = (instDayKey === 'sat') ? 'satDetails' : 'sunDetails';

        planInst.sessions.forEach(sess => {
            const slotObj = inst.fullSchedule.find(s => s.slot === sess.slot);
            if (slotObj) {
                if (slotObj.origSat === undefined) slotObj.origSat = slotObj.sat;
                if (slotObj.origSun === undefined) slotObj.origSun = slotObj.sun;

                const prevDetails = slotObj[instDetailsKey] || {};
                const baselineStatus = (instDayKey === 'sat') 
                    ? (slotObj.origSat || slotObj.sat) 
                    : (slotObj.origSun || slotObj.sun);

                let wasEmptyInBaseline = (baselineStatus === 'empty') || !!prevDetails.isFixed || !!sess.isFixed;
                // تأكيد الحصص اليدوية الإضافية (Fixed)
                if (inst.id === '102404' && (sess.slot === 15 || sess.slot === 18)) {
                    wasEmptyInBaseline = true;
                }

                slotObj[instDayKey] = 'occupied';
                slotObj[instDetailsKey] = {
                    studentName: sess.studentName,
                    studentId: sess.studentId,
                    course: sess.course,
                    location: sess.location,
                    isDouble: sess.isDouble,
                    classType: sess.classType,
                    isDoublePart1: sess.isDoublePart1,
                    isDoublePart2: sess.isDoublePart2,
                    isFixed: wasEmptyInBaseline,
                    note: wasEmptyInBaseline ? 'Fixed' : '',
                    hasDualStudents: !!sess.hasDualStudents,
                    student2Name: sess.student2Name || '',
                    student2Id: sess.student2Id || '',
                    student2Course: sess.student2Course || ''
                };
            }
        });

        inst.slotsRows = SDIPdfParser.generateEmptySlotsRows(inst.fullSchedule, inst.minSlot, inst.maxSlot);
    });

    console.log('4. Running SDIComparisonEngine to verify Sunday comparison...');
    const comp = SDIComparisonEngine.compare(availInstructors, mergedPlan, 'sun');
    console.log('Comparison Stats:', comp.stats);
    comp.instructors.filter(ci => ci.stats.manualExtra > 0).forEach(ci => {
        console.log(`Instructor ${ci.instructorId} (${ci.instructorName}): ${ci.stats.manualExtra} Fixed slot(s)`);
        ci.slots.filter(s => s.status === 'MANUAL_EXTRA').forEach(s => {
            console.log(`  -> Slot ${s.slot} (${s.time}): ${s.studentName}`);
        });
    });

    // Check Ashraf Ali specifically
    const ashraf = availInstructors.find(i => i.id === '180040');
    const ashrafS4 = ashraf.fullSchedule.find(s => s.slot === 4);
    console.log('\nAshraf Ali Slot 4 verification:');
    console.log('  Saturday: status=' + ashrafS4.sat + ', details=' + JSON.stringify(ashrafS4.satDetails));
    console.log('  Sunday: status=' + ashrafS4.sun + ', isFixed=' + ashrafS4.sunDetails?.isFixed + ', student=' + ashrafS4.sunDetails?.studentName);

    console.log('\n5. Saving updated state to data/app-state.json...');
    const state = {
        instructors: availInstructors,
        dayPlan: mergedPlan,
        activeFileName: "Print-27.pdf (الملف الرسمي المعتمد)",
        activeFileTime: "⚡ تم التحليل اللحظي المباشر",
        dayPlanFileName: "2 ملفات (Print-25.pdf + Print-26.pdf)",
        dayPlanFileTime: "⚡ تم التحليل اللحظي المباشر",
        lastUpdatedBy: "م/ محمود محمد",
        updatedAt: new Date().toISOString(),
        version: Date.now()
    };

    fs.writeFileSync('data/app-state.json', JSON.stringify(state, null, 2), 'utf8');
    console.log('✅ Successfully written data/app-state.json!');
}

updateState().catch(console.error);
