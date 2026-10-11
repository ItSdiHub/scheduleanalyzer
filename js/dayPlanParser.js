/**
 * معالج ملفات خطة اليوم للمدربين (Instructor Day Plan Parser)
 * معهد الشارقة للسياقة (Sharjah Driving Institute - SDI)
 * 
 * يدعم كلاً من:
 * 1. ملفات PDF الرسمية المعتمدة
 * 2. ملفات Excel (.xlsx, .xls, .csv)
 * 
 * الميزات:
 * - استخراج بيانات المدرب، التاريخ، والحصص اليومية.
 * - دعم مكان التدريب: Y (Yard / ساحة الباركنج) و R (Road / الشارع).
 * - دعم الحصص المزدوجة: كورس ينتهي بـ D (Double) يعطى الطالب حصتين متتاليتين تلقائياً (Slot S و Slot S+1).
 * - استخراج أرقام القيود وأسماء الطلاب وتوقيت الحصص.
 * 
 * تطوير: م/ محمود محمد
 */

const SDIDayPlanParser = {
    /**
     * معالجة ملف خطة اليوم بصيغة PDF
     */
    async parsePdfFile(file) {
        const lib = (typeof window !== 'undefined' && window.pdfjsLib) ? window.pdfjsLib : (typeof pdfjsLib !== 'undefined' ? pdfjsLib : null);
        if (!lib) {
            throw new Error("مكتبة قراءة الـ PDF غير محملة.");
        }

        try {
            if (typeof window !== 'undefined' && lib.GlobalWorkerOptions) {
                lib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
            }
        } catch (e) {
            console.warn("PDF worker note:", e);
        }

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = lib.getDocument({
            data: arrayBuffer,
            cMapUrl: 'vendor/',
            cMapPacked: true
        });
        const pdfDoc = await loadingTask.promise;

        const instructorsPlans = [];
        let currentInstructor = null;

        for (let p = 1; p <= pdfDoc.numPages; p++) {
            const page = await pdfDoc.getPage(p);
            const content = await page.getTextContent();
            const items = content.items.filter(it => it.str && it.str.trim().length > 0);

            if (items.length === 0) continue;

            // 1. استخراج التاريخ
            const dateItem = items.find(it => /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(it.str.trim()));
            const planDate = dateItem ? dateItem.str.trim() : '';

            // 2. استخراج بيانات المشرف / Staff
            const staffIdItem = items.find(it => it.transform[4] < 120 && /^[A-Z]{4,8}$/.test(it.str.trim()) && it.str.trim() !== 'ALL');
            const supervisorId = staffIdItem ? staffIdItem.str.trim() : '';

            // 3. استخراج بيانات المدرب (الرقم والاسم)
            const headerItems = items.filter(it => it.transform[4] < 140);
            let instId = '';
            let instName = '';

            const idItem = headerItems.find(it => /^\d{5,7}$/.test(it.str.trim()));
            if (idItem) {
                instId = idItem.str.trim();
                const nameItem = headerItems.find(it => 
                    Math.abs(it.transform[4] - idItem.transform[4]) < 5 && 
                    it.transform[5] > idItem.transform[5] && 
                    !/^\d+$/.test(it.str.trim()) && 
                    !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(it.str.trim())
                );
                if (nameItem) {
                    instName = nameItem.str.trim();
                } else {
                    const words = headerItems
                        .filter(it => !/^\d+$/.test(it.str.trim()) && !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(it.str.trim()) && it.str.trim() !== 'ALL' && it.str.trim().length > 2)
                        .map(it => it.str.trim());
                    if (words.length > 0) instName = words.join(' ');
                }
            }

            // 4. تجميع صفوف الحصص (مصفوفة عمودية حسب الإحداثي X)
            const rowItems = items.filter(it => it.transform[4] >= 145);
            const rowClusters = [];
            rowItems.sort((a, b) => a.transform[4] - b.transform[4]);

            rowItems.forEach(it => {
                let cluster = rowClusters.find(c => Math.abs(c.x - it.transform[4]) < 5.5);
                if (!cluster) {
                    cluster = { x: it.transform[4], items: [] };
                    rowClusters.push(cluster);
                }
                cluster.items.push(it);
            });

            const parsedSessions = [];

            rowClusters.forEach(cluster => {
                cluster.items.sort((a, b) => a.transform[5] - b.transform[5]);

                // رقم الحصة
                const rowSlot = cluster.items.find(it => /^\d{1,2}$/.test(it.str.trim()) && it.transform[5] < 185);
                // توقيت الحصة
                const rowTime = cluster.items.find(it => /^\d{2}:\d{2}$/.test(it.str.trim()));
                // كود الدورة
                const rowCourse = cluster.items.find(it => /^(LM[A-Z]{1,3}\d+[RD]|MC[A-Z]*\d*[RD]|HT[A-Z]*\d*[RD])/i.test(it.str.trim()));
                // مكان التدريب: Y (Yard / ساحة) أو R (Road / شارع)
                const rowLocation = cluster.items.find(it => /^[YR]$/i.test(it.str.trim()) && it.transform[5] > 480 && it.transform[5] < 540);
                // رقم قيد / ملف الطالب
                const rowStudentId = cluster.items.find(it => /^\d{7,9}$/.test(it.str.trim()));

                // اسم الطالب (الواقع بين التوقيت وكود الدورة)
                const nameParts = cluster.items.filter(it => it.transform[5] > 220 && it.transform[5] < 415).map(it => it.str.trim());
                const studentName = nameParts.join(' ');

                if (rowSlot || rowTime) {
                    const slotNum = rowSlot ? parseInt(rowSlot.str.trim(), 10) : null;
                    const courseCode = rowCourse ? rowCourse.str.trim().toUpperCase() : 'LMFA30R';
                    
                    // فحص الحصة المزدوجة: إذا انتهى كود الدورة بحرف D
                    const isDouble = /D$/i.test(courseCode);
                    const loc = rowLocation ? rowLocation.str.trim().toUpperCase() : 'R';

                    if (slotNum) {
                        const isMc = /^MC/i.test(courseCode);
                        const existing = parsedSessions.find(s => s.slot === slotNum);
                        if (existing) {
                            // قاعدة الدراجة النارية: مسموح بدمج طالبين في نفس الحصة أثناء تدريب الساحة (Yard - Y) فقط
                            if (isMc && existing.location === 'Y' && loc === 'Y') {
                                existing.hasDualStudents = true;
                                existing.student2Name = studentName || 'طالب مسجل 2';
                                existing.student2Id = rowStudentId ? rowStudentId.str.trim() : '';
                                existing.student2Course = courseCode;
                                return;
                            } else if (isMc && (existing.location === 'R' || loc === 'R')) {
                                existing.hasRoadDualConflict = true;
                            }
                        }

                        parsedSessions.push({
                            slot: slotNum,
                            time: rowTime ? rowTime.str.trim() : '',
                            studentName: studentName || 'طالب مسجل',
                            studentId: rowStudentId ? rowStudentId.str.trim() : '',
                            course: courseCode,
                            location: loc, // 'Y' (Yard) or 'R' (Road)
                            isDouble: isDouble,
                            classType: isDouble ? 'D' : 'R',
                            isDoublePart1: isDouble,
                            isDoublePart2: false,
                            hasDualStudents: false
                        });

                        // تطبيق قاعدة الحصة المزدوجة (D):
                        // إذا كانت الحصة دبل، يتم حجز الحصة التالية (S+1) تلقائياً كحصة متتالية تابعة لنفس الطالب
                        if (isDouble) {
                            parsedSessions.push({
                                slot: slotNum + 1,
                                time: SDIDayPlanParser.getTimeForSlot(slotNum + 1, courseCode),
                                studentName: `(حصة مزدوجة تابعة) ${studentName}`,
                                studentId: rowStudentId ? rowStudentId.str.trim() : '',
                                course: courseCode,
                                location: loc,
                                isDouble: true,
                                classType: 'D',
                                isDoublePart1: false,
                                isDoublePart2: true
                            });
                        }
                    }
                }
            });

            // التعامل الذكي مع الصفحات:
            // 1. إذا وجد رقم مدرب معتمد (instId): ننشئ أو ندمج مع المدرب
            if (instId) {
                let existingPlan = instructorsPlans.find(i => i.instructorId === instId);
                if (existingPlan) {
                    // دمج الحصص مع نفس المدرب في الصفحة السابقة
                    parsedSessions.forEach(newS => {
                        const sIdx = existingPlan.sessions.findIndex(s => s.slot === newS.slot);
                        if (sIdx !== -1) {
                            if (newS.hasDualStudents || newS.student2Name) {
                                existingPlan.sessions[sIdx].hasDualStudents = true;
                                existingPlan.sessions[sIdx].student2Name = newS.student2Name;
                                existingPlan.sessions[sIdx].student2Id = newS.student2Id;
                            }
                        } else {
                            existingPlan.sessions.push(newS);
                        }
                    });
                    existingPlan.sessions.sort((a, b) => a.slot - b.slot);
                    currentInstructor = existingPlan;
                } else {
                    const newPlan = {
                        instructorId: instId,
                        instructorName: instName || `مدرب ${instId}`,
                        shortName: (instName || `مدرب ${instId}`).split(' ').slice(0, 2).join(' '),
                        supervisorId: supervisorId,
                        date: planDate,
                        page: p,
                        sessions: parsedSessions
                    };
                    instructorsPlans.push(newPlan);
                    currentInstructor = newPlan;
                }
            } else if (parsedSessions.length > 0 && currentInstructor) {
                // 2. صفحة استكمال بدون ترويسة مدرب (مثل استكمال حصص المدرب روح الله نور كالحصة 23 و 24):
                // يتم إلحاق هذه الحصص تلقائياً بالمدرب في الصفحة السابقة كما وجه المستخدم بدقة
                parsedSessions.forEach(newS => {
                    const sIdx = currentInstructor.sessions.findIndex(s => s.slot === newS.slot);
                    if (sIdx !== -1) {
                        if (newS.hasDualStudents || newS.student2Name) {
                            currentInstructor.sessions[sIdx].hasDualStudents = true;
                            currentInstructor.sessions[sIdx].student2Name = newS.student2Name;
                            currentInstructor.sessions[sIdx].student2Id = newS.student2Id;
                        }
                    } else {
                        currentInstructor.sessions.push(newS);
                    }
                });
                currentInstructor.sessions.sort((a, b) => a.slot - b.slot);
            } else {
                // 3. صفحة فارغة أو بدون ترويسة مدرب ولا حصص: يتم تجاهلها تماماً وتفادي اختراع أي مدرب شبح
                // لا ننشئ أي مدرب بدون اسم أو رقم معتمد نهائياً
            }
        }

        return SDIDayPlanParser.finalizeDayPlan(instructorsPlans, file.name);
    },

    /**
     * معالجة ملف خطة اليوم بصيغة Excel أو CSV
     */
    async parseExcelFile(file) {
        if (typeof XLSX === 'undefined') {
            throw new Error("مكتبة قراءة الإكسل (SheetJS) غير محملة.");
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                    if (!rows || rows.length < 2) {
                        throw new Error("ملف الإكسل فارغ أو لا يحتوي على صفوف كافية.");
                    }

                    const instructorsMap = {};
                    const header = rows[0].map(h => String(h || '').trim());

                    // تحديد الفهارس
                    let idIdx = header.findIndex(h => /رقم.*المدرب|instructor.*id|inst.*id|code/i.test(h));
                    let nameIdx = header.findIndex(h => /اسم.*المدرب|instructor.*name|instructor/i.test(h));
                    let slotIdx = header.findIndex(h => /رقم.*الحصة|حصة|slot/i.test(h));
                    let timeIdx = header.findIndex(h => /توقيت|وقت|time/i.test(h));
                    let studentIdx = header.findIndex(h => /اسم.*الطالب|طالب|student.*name|student/i.test(h));
                    let regIdx = header.findIndex(h => /رقم.*القيد|رقم.*الملف|student.*id|reg.*no|file.*no/i.test(h));
                    let courseIdx = header.findIndex(h => /دورة|كورس|course|category/i.test(h));
                    let locIdx = header.findIndex(h => /مكان|نوع.*التدريب|location|stage|yard|road|y\/r/i.test(h));
                    let dateIdx = header.findIndex(h => /تاريخ|date/i.test(h));

                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i];
                        if (!row || row.length === 0) continue;

                        const instId = String(row[idIdx !== -1 ? idIdx : 0] || '').trim();
                        if (!instId) continue;

                        const instName = String(row[nameIdx !== -1 ? nameIdx : 1] || `مدرب ${instId}`).trim();
                        const slotNum = parseInt(row[slotIdx !== -1 ? slotIdx : 2], 10);
                        if (isNaN(slotNum)) continue;

                        const timeVal = String(row[timeIdx !== -1 ? timeIdx : 3] || '').trim();
                        const studentName = String(row[studentIdx !== -1 ? studentIdx : 4] || 'طالب').trim();
                        const courseVal = String(row[courseIdx !== -1 ? courseIdx : 5] || 'LMFA30R').trim().toUpperCase();
                        let locVal = String(row[locIdx !== -1 ? locIdx : 6] || 'R').trim().toUpperCase();
                        if (/ساحة|باركنج|yard/i.test(locVal)) locVal = 'Y';
                        else if (/شارع|طريق|road/i.test(locVal)) locVal = 'R';
                        else if (locVal !== 'Y' && locVal !== 'R') locVal = 'R';

                        const regVal = String(row[regIdx !== -1 ? regIdx : 7] || '').trim();
                        const dateVal = String(row[dateIdx !== -1 ? dateIdx : 8] || '').trim();

                        const isDouble = /D$/i.test(courseVal);

                        if (!instructorsMap[instId]) {
                            instructorsMap[instId] = {
                                instructorId: instId,
                                instructorName: instName,
                                shortName: instName.split(' ').slice(0, 2).join(' '),
                                date: dateVal,
                                sessions: []
                            };
                        }

                        const isMc = /^MC/i.test(courseVal);
                        const existing = instructorsMap[instId].sessions.find(s => s.slot === slotNum);
                        if (existing) {
                            if (isMc && existing.location === 'Y' && locVal === 'Y') {
                                existing.hasDualStudents = true;
                                existing.student2Name = studentName;
                                existing.student2Id = regVal;
                                existing.student2Course = courseVal;
                                continue;
                            } else if (isMc && (existing.location === 'R' || locVal === 'R')) {
                                existing.hasRoadDualConflict = true;
                            }
                        }

                        instructorsMap[instId].sessions.push({
                            slot: slotNum,
                            time: timeVal,
                            studentName: studentName,
                            studentId: regVal,
                            course: courseVal,
                            location: locVal,
                            isDouble: isDouble,
                            classType: isDouble ? 'D' : 'R',
                            isDoublePart1: isDouble,
                            isDoublePart2: false,
                            hasDualStudents: false
                        });

                        // حصة مزدوجة
                        if (isDouble) {
                            instructorsMap[instId].sessions.push({
                                slot: slotNum + 1,
                                time: SDIDayPlanParser.getTimeForSlot(slotNum + 1, courseVal),
                                studentName: `(حصة مزدوجة تابعة) ${studentName}`,
                                studentId: regVal,
                                course: courseVal,
                                location: locVal,
                                isDouble: true,
                                classType: 'D',
                                isDoublePart1: false,
                                isDoublePart2: true
                            });
                        }
                    }

                    const list = Object.values(instructorsMap);
                    resolve(SDIDayPlanParser.finalizeDayPlan(list, file.name));
                } catch (err) {
                    reject(err);
                }
            };

            reader.onerror = () => reject(new Error("فشل في قراءة ملف الإكسل."));
            reader.readAsArrayBuffer(file);
        });
    },

    /**
     * إكمال وحساب الإحصائيات العامة لخطة اليوم
     */
    finalizeDayPlan(instructorsPlans, fileName) {
        // تصفية أي مدربين أشباح أو بدون اسم أو بدون رقم وظيفي معتمد
        const validPlans = (instructorsPlans || []).filter(plan => {
            if (!plan) return false;
            if (!plan.instructorId || String(plan.instructorId).startsWith('INST_')) return false;
            if (!plan.instructorName || plan.instructorName.includes('undefined')) return false;
            if (!Array.isArray(plan.sessions) || plan.sessions.length === 0) return false;
            return true;
        });

        if (validPlans.length === 0) {
            throw new Error("لم يتم العثور على أي حصص أو مدربين معتمدين في ملف خطة اليوم المرفوع.");
        }
        instructorsPlans = validPlans;

        let totalSessions = 0;
        let totalYardSessions = 0;
        let totalRoadSessions = 0;
        let totalDoubleSessions = 0;
        let totalRegularSessions = 0;

        instructorsPlans.forEach(plan => {
            // ترتيب الحصص
            plan.sessions.sort((a, b) => a.slot - b.slot);

            plan.sessions.forEach(s => {
                totalSessions++;
                if (s.location === 'Y') totalYardSessions++;
                else totalRoadSessions++;

                if (s.isDouble) totalDoubleSessions++;
                else totalRegularSessions++;
            });

            // إحصائيات المدرب
            plan.yardCount = plan.sessions.filter(s => s.location === 'Y').length;
            plan.roadCount = plan.sessions.filter(s => s.location === 'R').length;
            plan.doubleCount = plan.sessions.filter(s => s.isDouble).length;
            plan.totalCount = plan.sessions.length;
        });

        const defaultDate = instructorsPlans[0]?.date || new Date().toLocaleDateString('ar-AE');

        return {
            success: true,
            fileName: fileName,
            date: defaultDate,
            instructors: instructorsPlans,
            stats: {
                totalInstructors: instructorsPlans.length,
                totalSessions: totalSessions,
                yardSessions: totalYardSessions,
                roadSessions: totalRoadSessions,
                doubleSessions: totalDoubleSessions,
                regularSessions: totalRegularSessions,
                yardPercentage: totalSessions > 0 ? ((totalYardSessions / totalSessions) * 100).toFixed(1) : "0.0",
                roadPercentage: totalSessions > 0 ? ((totalRoadSessions / totalSessions) * 100).toFixed(1) : "0.0"
            }
        };
    },
    /**
     * معالجة مجموعة من ملفات خطة اليوم ودمجها معاً في خطة موحدة
     * تتيح رفع عدة ملفات PDF أو Excel في نفس الوقت وتوحيد الحصص
     * @param {Array<File>|FileList} files
     */
    async parseMultipleFiles(files) {
        const fileList = Array.from(files || []);
        if (fileList.length === 0) {
            throw new Error("لم يتم تحديد أي ملفات للمعالجة.");
        }

        if (fileList.length === 1) {
            const f = fileList[0];
            const lower = f.name.toLowerCase();
            if (lower.endsWith('.pdf')) return await this.parsePdfFile(f);
            return await this.parseExcelFile(f);
        }

        const parsedResults = [];
        const fileNames = [];

        for (const f of fileList) {
            const lower = f.name.toLowerCase();
            try {
                let res;
                if (lower.endsWith('.pdf')) {
                    res = await this.parsePdfFile(f);
                } else if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv')) {
                    res = await this.parseExcelFile(f);
                } else {
                    continue; // تخطي الملفات غير المدعومة
                }
                if (res && res.instructors && res.instructors.length > 0) {
                    parsedResults.push(res);
                    fileNames.push(f.name);
                }
            } catch (err) {
                console.warn(`[SDIDayPlanParser] تعذر تحليل الملف "${f.name}":`, err);
            }
        }

        if (parsedResults.length === 0) {
            throw new Error("فشل استخراج أي بيانات صالحة من الملفات المرفوعة.");
        }

        // دمج المدربين من كافة الملفات المرفوعة
        const mergedInstructorsMap = {};
        let defaultDate = parsedResults[0]?.date || '';

        parsedResults.forEach(res => {
            if (res.date && !defaultDate) defaultDate = res.date;
            (res.instructors || []).forEach(inst => {
                const key = String(inst.instructorId).trim();
                if (!mergedInstructorsMap[key]) {
                    mergedInstructorsMap[key] = {
                        ...inst,
                        sessions: [...inst.sessions]
                    };
                } else {
                    const existing = mergedInstructorsMap[key];
                    if (!existing.instructorName && inst.instructorName) existing.instructorName = inst.instructorName;
                    if (!existing.supervisorId && inst.supervisorId) existing.supervisorId = inst.supervisorId;
                    if (!existing.category && inst.category) existing.category = inst.category;
                    if (!existing.trainingCategory && inst.trainingCategory) existing.trainingCategory = inst.trainingCategory;
                    // دمج الحصص بدون تكرار
                    inst.sessions.forEach(newS => {
                        const sIdx = existing.sessions.findIndex(s => s.slot === newS.slot);
                        if (sIdx !== -1) {
                            if (newS.hasDualStudents || newS.student2Name) {
                                existing.sessions[sIdx].hasDualStudents = true;
                                existing.sessions[sIdx].student2Name = newS.student2Name;
                                existing.sessions[sIdx].student2Id = newS.student2Id;
                                existing.sessions[sIdx].student2Course = newS.student2Course;
                            }
                        } else {
                            existing.sessions.push(newS);
                        }
                    });
                    existing.sessions.sort((a, b) => a.slot - b.slot);
                }
            });
        });

        const mergedList = Object.values(mergedInstructorsMap);
        mergedList.forEach(inst => {
            if (!inst.date && defaultDate) inst.date = defaultDate;
        });
        const combinedTitle = `${fileNames.length} ملفات: ${fileNames.join(' + ')}`;
        const finalPlan = this.finalizeDayPlan(mergedList, combinedTitle);
        if (defaultDate) finalPlan.date = defaultDate;
        return finalPlan;
    },

    /**
     * حساب التوقيت التقديري للحصة عند التكرار المزدوج
     */
    getTimeForSlot(slotNum, courseCode) {
        if (/^MC/i.test(courseCode) && typeof MC_TIME_SLOTS !== 'undefined') {
            const found = MC_TIME_SLOTS.find(t => t.id === slotNum);
            return found ? found.time : "";
        }
        if (/^HT/i.test(courseCode) && typeof HT_TIME_SLOTS !== 'undefined') {
            const found = HT_TIME_SLOTS.find(t => t.id === slotNum);
            return found ? found.time : "";
        }
        if (typeof LM_TIME_SLOTS !== 'undefined') {
            const found = LM_TIME_SLOTS.find(t => t.id === slotNum);
            return found ? found.time : "";
        }
        return "";
    }
};

if (typeof window !== 'undefined') {
    window.SDIDayPlanParser = SDIDayPlanParser;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SDIDayPlanParser };
}
