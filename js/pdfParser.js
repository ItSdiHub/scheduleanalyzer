/**
 * معالج ملفات الـ PDF الرسمية لمعهد الشارقة للسياقة (SDI)
 * Sharjah Driving Institute LLC - Instructor Availability PDF Parser
 * مبني على مكتبة PDF.js مع فرز بصري فائق الدقة (Visual Coordinate Stream Reconstruction)
 * 
 * المطور: م/ محمود محمد
 */

const SDIPdfParser = {
    /**
     * قراءة واستخراج البيانات من ملف PDF المرفوع
     */
    async parsePdfFile(file) {
        const lib = (typeof window !== 'undefined' && window.pdfjsLib) ? window.pdfjsLib : (typeof pdfjsLib !== 'undefined' ? pdfjsLib : null);
        if (!lib) {
            throw new Error("مكتبة قراءة الـ PDF (pdf.min.js) غير متوفرة.");
        }

        // ضبط مسار الـ worker للمتصفح
        try {
            if (typeof window !== 'undefined' && lib.GlobalWorkerOptions) {
                lib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
            }
        } catch (e) {
            console.warn("PDF worker configuration note:", e);
        }

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = lib.getDocument({
            data: arrayBuffer,
            cMapUrl: 'vendor/',
            cMapPacked: true
        });
        const pdfDoc = await loadingTask.promise;

        const instructorsMap = {};
        let lastActiveInstId = null;
        let lastActiveInstName = null;

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            // 1. تصفية العناصر النصية وترتيبها بصرياً (من الأعلى إلى الأسفل Y ثم من اليسار إلى اليمين X)
            const items = textContent.items.filter(it => it.str && it.str.trim().length > 0);
            items.sort((a, b) => {
                const yDiff = b.transform[5] - a.transform[5];
                if (Math.abs(yDiff) > 4) return yDiff; // فرق السطر الرأسي
                return a.transform[4] - b.transform[4]; // نفس السطر: اليسار إلى اليمين
            });

            // 2. إعادة تجميع الأسطر المرئية المتناسقة
            const lines = [];
            let currentLine = [];
            let currentY = null;

            for (const item of items) {
                if (currentY === null || Math.abs(item.transform[5] - currentY) > 4) {
                    if (currentLine.length > 0) {
                        lines.push(currentLine.map(it => it.str.trim()).join(' '));
                    }
                    currentLine = [item];
                    currentY = item.transform[5];
                } else {
                    currentLine.push(item);
                }
            }
            if (currentLine.length > 0) {
                lines.push(currentLine.map(it => it.str.trim()).join(' '));
            }

            // 3. استخراج المدرب والطلاب من الأسطر المرئية
            let pageInstId = null;
            let pageInstName = null;
            const pageStudents = [];

            for (const line of lines) {
                // الكشف عن رأس بيانات المدرب:
                // يدعم الإنجليزية والعربية ومختلف صيغ الـ ID
                const instMatch = line.match(/(?:Instructor|المدرب)\s*(?:ID|Code|No)?\s*[:\-]?\s*(\d{4,8})\s*(?:ALL\s*-\s*)?(.*)/i);
                if (instMatch) {
                    pageInstId = instMatch[1].trim();
                    let name = instMatch[2].trim().replace(/^(?:ALL\s*-\s*|-|\:)/i, '').trim();
                    pageInstName = name || `مدرب ${pageInstId}`;
                    lastActiveInstId = pageInstId;
                    lastActiveInstName = pageInstName;
                    continue;
                }

                // الكشف عن صف الطالب مع الحصة والتوقيت
                // يدعم [06:20-07:00] و (06:20-07:00) ومسافات إضافية
                const slotTimeMatch = line.match(/(\d{1,2})\s*[\[\(]\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*[\]\)]/);
                if (slotTimeMatch) {
                    const slotNum = parseInt(slotTimeMatch[1], 10);
                    const timeStr = `${slotTimeMatch[2]}-${slotTimeMatch[3]}`;

                    // أيام التدريب
                    const daysMatch = line.match(/\b(SAT-MON-WED|SUN-TUE-THU|SAT-THU|FRI-SAT|SAT-FRI|DAILY)\b/i);
                    const days = daysMatch ? daysMatch[1].toUpperCase() : 'SAT-THU';

                    // نوع الدورة
                    const courseMatch = line.match(/\b(LM[FA]M?\d*\w*|MC[FA]?M?\d*\w*|HT[FA]?M?\d*\w*)\b/i);
                    const course = courseMatch ? courseMatch[1].toUpperCase() : 'LMFM30R';

                    // رقم ملف الطالب
                    const idMatch = line.match(/\b(2[4-9]\d{6,7}|\d{7,8})\b/);
                    const stId = idMatch ? idMatch[1] : '';

                    // اسم الطالب
                    let stName = '';
                    if (idMatch && courseMatch) {
                        const idIdx = line.indexOf(stId);
                        const courseIdx = line.indexOf(courseMatch[0]);
                        if (idIdx !== -1 && courseIdx > idIdx) {
                            stName = line.slice(idIdx + stId.length, courseIdx).trim();
                        }
                    }

                    pageStudents.push({
                        id: stId,
                        name: stName,
                        course: course,
                        days: days,
                        slot: slotNum,
                        time: timeStr
                    });
                }
            }

            // في حال لم يتم التقاط المدرب في حلقة الأسطر، ابحث عنه في النص الخام للصفحة
            if (!pageInstId) {
                const fullPageText = items.map(it => it.str).join(' ');
                const rawInstMatch = fullPageText.match(/(?:Instructor|المدرب)\s*[:\-]?\s*(\d{4,8})/i);
                if (rawInstMatch) {
                    pageInstId = rawInstMatch[1].trim();
                    const nameMatch = fullPageText.match(/ALL\s*-\s*([A-Za-z\s]+?)(?=\s+Instructor|\s+Student|\s+Total|$)/i);
                    pageInstName = nameMatch ? nameMatch[1].trim() : `مدرب ${pageInstId}`;
                    lastActiveInstId = pageInstId;
                    lastActiveInstName = pageInstName;
                } else if (lastActiveInstId && pageStudents.length > 0) {
                    // صفحة تابعة لنفس المدرب السابق
                    pageInstId = lastActiveInstId;
                    pageInstName = lastActiveInstName;
                }
            }

            // تسجيل المدرب والطلاب المستخرجين في الصفحة
            if (pageInstId) {
                if (!instructorsMap[pageInstId]) {
                    instructorsMap[pageInstId] = {
                        id: pageInstId,
                        name: pageInstName || `مدرب ${pageInstId}`,
                        shortName: (pageInstName || `مدرب ${pageInstId}`).split(' ').slice(0, 2).join(' '),
                        students: []
                    };
                }
                instructorsMap[pageInstId].students.push(...pageStudents);
            }
        }

        const parsedInstructors = Object.values(instructorsMap);
        if (parsedInstructors.length === 0) {
            throw new Error("لم يتم العثور على جداول تدريب معتمدة في ملف الـ PDF. يرجى التأكد من اختيار ملف Instructor Availability الصادر من المعهد.");
        }

        // تحويل البيانات المستخرجة إلى هيكل المدربين الرسمي المعتمد للمعهد
        return this.buildOfficialInstructorsFromParsed(parsedInstructors);
    },

    /**
     * تحويل الطلاب المستخرجين إلى كائنات المدربين مع التكويد الذكي وحساب الحصص الفارغة
     */
    buildOfficialInstructorsFromParsed(parsedList) {
        return parsedList.map((p, index) => {
            // 1. تحديد الفئة من كود الدورة (LMFM, LMFA, MC, HT)
            let category = "LMFM";
            let vehicleType = "خفيفة (LM)";
            let minSlot = 1;
            let maxSlot = 20;

            const firstCourse = p.students[0]?.course || "";
            if (/^LMFA/i.test(firstCourse)) {
                category = "LMFA";
                vehicleType = "خفيفة (LM)";
            } else if (/^MC/i.test(firstCourse)) {
                category = "MC";
                vehicleType = "دراجة نارية (MC)";
                minSlot = 6;
                maxSlot = 17;
            } else if (/^HT/i.test(firstCourse)) {
                category = "HT";
                vehicleType = "شاحنة ثقيلة (HT)";
                minSlot = 1;
                maxSlot = 12;
            }

            // 2. تحديد الفترة (الوردية) والتكويد الذكي
            let shift = "S1"; // الفترة الأولى
            let shiftName = "الفترة الأولى (1 - 10)";
            let shiftCode = `${category}-S1`;

            if (category === "MC") {
                shift = "FIX";
                shiftName = "فترة ثابتة (6 - 17)";
                shiftCode = "MC-FIX";
                minSlot = 6;
                maxSlot = 17;
            } else if (category === "HT") {
                const maxSlotEncountered = p.students.length > 0 ? Math.max(...p.students.map(s => s.slot)) : 1;
                if (maxSlotEncountered > 12) {
                    shift = "S2";
                    shiftName = "الفترة الثانية (13 - 24)";
                    shiftCode = "HTFM-S2";
                    minSlot = 13;
                    maxSlot = 24;
                } else {
                    shift = "S1";
                    shiftName = "الفترة الأولى (1 - 12)";
                    shiftCode = "HTFM-S1";
                    minSlot = 1;
                    maxSlot = 12;
                }
            } else {
                // مركبة خفيفة (LM)
                const hasEvening = p.students.some(s => s.slot >= 11);
                const hasMorning = p.students.some(s => s.slot <= 10);

                if (hasEvening && !hasMorning) {
                    shift = "S2";
                    shiftName = "الفترة الثانية (11 - 20)";
                    shiftCode = `${category}-S2`;
                    minSlot = 11;
                    maxSlot = 20;
                } else {
                    const maxSlotEncountered = p.students.length > 0 ? Math.max(...p.students.map(s => s.slot)) : 1;
                    if (maxSlotEncountered > 10) {
                        shift = "S2";
                        shiftName = "الفترة الثانية (11 - 20)";
                        shiftCode = `${category}-S2`;
                        minSlot = 11;
                        maxSlot = 20;
                    } else {
                        shift = "S1";
                        shiftName = "الفترة الأولى (1 - 10)";
                        shiftCode = `${category}-S1`;
                        minSlot = 1;
                        maxSlot = 10;
                    }
                }
            }

            // 3. بناء الجدول الكامل لجميع الحصص
            const fullSchedule = [];
            const startSlot = (category === "MC") ? 6 : ((category === "HT" && shift === "S2") ? 13 : 1);
            const endSlot = (category === "MC") ? 17 : ((category === "HT") ? 24 : 20);

            for (let s = startSlot; s <= endSlot; s++) {
                fullSchedule.push({
                    slot: s,
                    sat: "empty",
                    sun: "empty",
                    origSat: "empty",
                    origSun: "empty"
                });
            }

            // 4. إسقاط حجوزات الطلاب
            p.students.forEach(st => {
                const sObj = fullSchedule.find(s => s.slot === st.slot);
                if (sObj) {
                    if (st.days === "SAT-MON-WED") {
                        sObj.sat = "occupied";
                        sObj.origSat = "occupied";
                    } else if (st.days === "SUN-TUE-THU") {
                        sObj.sun = "occupied";
                        sObj.origSun = "occupied";
                    } else if (st.days === "SAT-THU") {
                        sObj.sat = "occupied";
                        sObj.origSat = "occupied";
                        sObj.sun = "occupied";
                        sObj.origSun = "occupied";
                    }
                }
            });

            // 5. حساب الإشغال والحصص الفارغة ضمن فترة عمل وردية المدرب
            let occCount = 0;
            let empCount = 0;
            const shiftSlots = fullSchedule.filter(s => s.slot >= minSlot && s.slot <= maxSlot);
            shiftSlots.forEach(s => {
                if (s.sat === "occupied") occCount++; else empCount++;
                if (s.sun === "occupied") occCount++; else empCount++;
            });
            const cap = occCount + empCount;
            const rate = cap > 0 ? parseFloat(((occCount / cap) * 100).toFixed(1)) : 0.0;

            // 6. توليد صفوف الحصص الفارغة للتقرير الثاني
            const slotsRows = SDIPdfParser.generateEmptySlotsRows(fullSchedule, category, shift);

            return {
                id: p.id,
                name: p.name,
                shortName: p.shortName,
                category: category,
                vehicleType: vehicleType,
                shift: shift,
                shiftName: shiftName,
                shiftCode: shiftCode,
                capacity: cap,
                occupied: occCount,
                empty: empCount,
                rate: rate,
                minSlot: minSlot,
                maxSlot: maxSlot,
                note: "",
                reportPage: Math.floor(index / 2) + 1,
                slotsRows: slotsRows,
                fullSchedule: fullSchedule
            };
        });
    },

    generateEmptySlotsRows(schedule, category = "LMFM", shift = "S1") {
        if (typeof category === 'number') {
            const minSlot = category;
            const maxSlot = shift;
            if (minSlot >= 11) {
                shift = 'S2';
                category = 'LMFM';
            } else if (minSlot === 6 && maxSlot === 17) {
                category = 'MC';
                shift = 'FIX';
            } else {
                shift = 'S1';
                category = 'LMFM';
            }
        }

        if (shift === 'SUP') {
            // المشرف / السوبرفايزر: ليس لديه أي حصص فارغة
            return [];
        }
        const rows = [];

        if (category === "MC") {
            // الدراجة النارية: الحصص من 6 إلى 17 فقط
            schedule.filter(s => s.slot >= 6 && s.slot <= 17).forEach(s => {
                if (s.sat === "empty" || s.sun === "empty") {
                    rows.push({
                        slotDisplay: String(s.slot),
                        sat: s.sat === "occupied" ? "مشغولة" : "خالية",
                        sun: s.sun === "occupied" ? "مشغولة" : "خالية"
                    });
                }
            });
            return rows;
        }

        if (category === "HT") {
            // الشاحنة الثقيلة: إزالة الحصص التي ليست في فترة عمله
            if (shift === "S1") {
                schedule.filter(s => s.slot >= 1 && s.slot <= 12).forEach(s => {
                    if (s.sat === "empty" || s.sun === "empty") {
                        rows.push({
                            slotDisplay: String(s.slot),
                            sat: s.sat === "occupied" ? "مشغولة" : "خالية",
                            sun: s.sun === "occupied" ? "مشغولة" : "خالية"
                        });
                    }
                });
            } else {
                schedule.filter(s => s.slot >= 13 && s.slot <= 24).forEach(s => {
                    if (s.sat === "empty" || s.sun === "empty") {
                        rows.push({
                            slotDisplay: String(s.slot),
                            sat: s.sat === "occupied" ? "مشغولة" : "خالية",
                            sun: s.sun === "occupied" ? "مشغولة" : "خالية"
                        });
                    }
                });
            }
            return rows;
        }

        // المركبة الخفيفة (LM): إزالة الحصص التي ليست في فترة عمله
        if (shift === "S1") {
            // الفترة الصباحية الأولى: فقط الحصص 1 إلى 10 (تمت إزالة وحذف الحصص 11 إلى 20 تماماً)
            schedule.filter(s => s.slot >= 1 && s.slot <= 10).forEach(s => {
                if (s.sat === "empty" || s.sun === "empty") {
                    rows.push({
                        slotDisplay: String(s.slot),
                        sat: s.sat === "occupied" ? "مشغولة" : "خالية",
                        sun: s.sun === "occupied" ? "مشغولة" : "خالية"
                    });
                }
            });
        } else {
            // الفترة المسائية الثانية: فقط الحصص 11 إلى 20 (تمت إزالة وحذف الحصص 1 إلى 10 تماماً)
            schedule.filter(s => s.slot >= 11 && s.slot <= 20).forEach(s => {
                if (s.sat === "empty" || s.sun === "empty") {
                    rows.push({
                        slotDisplay: String(s.slot),
                        sat: s.sat === "occupied" ? "مشغولة" : "خالية",
                        sun: s.sun === "occupied" ? "مشغولة" : "خالية"
                    });
                }
            });
        }

        return rows;
    }
};

if (typeof window !== 'undefined') {
    window.SDIPdfParser = SDIPdfParser;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SDIPdfParser };
}
