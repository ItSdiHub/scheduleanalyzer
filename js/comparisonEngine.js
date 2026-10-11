/**
 * محرك مقارنة ومطابقة خطة اليوم مع جدول الإتاحة المعتمد
 * SDI Schedule Analyzer - Comparison & Conflict Resolution Engine
 * 
 * الوظائف الرئيسية:
 * 1. مطابقة الحصص بين ملف Availability وخطة اليوم Instructor Day Plan.
 * 2. رصد الحصص المضافة يدوياً في خطة اليوم (Manual Extra Sessions).
 * 3. رصد الحصص الملغاة أو غير المدرجة في الخطة.
 * 4. رصد التعارضات والتداخل في الحصص المزدوجة (Double Classes).
 * 5. تتبع وتوزيع فئات التدريب بين الساحة (Y - Yard) والشارع (R - Road).
 * 6. إتاحة اعتماد وتحديث جدول المدرب بنقرة واحدة.
 * 
 * تطوير: م/ محمود محمد
 */

const SDIComparisonEngine = {
    /**
     * تشغيل مقارنة شاملة بين الإتاحة وخطة اليوم
     * @param {Array} availabilityInstructors قائمة المدربين الحالية في النظام
     * @param {Object} dayPlanData بيانات خطة اليوم المستخرجة من SDIDayPlanParser
     * @param {String} overrideDay 'sun' | 'sat' | 'auto'
     */
    compare(availabilityInstructors, dayPlanData, overrideDay = 'auto') {
        if (!dayPlanData || !Array.isArray(dayPlanData.instructors) || dayPlanData.instructors.length === 0) {
            return {
                hasData: false,
                message: "يرجى رفع ملف خطة اليوم (Instructor Day Plan) لبدء المقارنة."
            };
        }

        const availList = availabilityInstructors || [];
        const planList = dayPlanData.instructors || [];

        // 1. تحديد اليوم للمقارنة: تلقائياً من تاريخ الخطة أو خيار المستخدم
        let dayKey = 'sun'; // الافتراضي (الأحد - الثلاثاء - الخميس)
        if (overrideDay === 'sat' || overrideDay === 'sun') {
            dayKey = overrideDay;
        } else if (dayPlanData.date) {
            dayKey = SDIComparisonEngine.detectDayKeyFromDate(dayPlanData.date);
        }

        const dayNameAr = (dayKey === 'sat') ? 'السبت - الإثنين - الأربعاء (SAT-MON-WED)' : 'الأحد - الثلاثاء - الخميس (SUN-TUE-THU)';
        const dayNameEn = (dayKey === 'sat') ? 'Saturday - Monday - Wednesday' : 'Sunday - Tuesday - Thursday';

        // 2. مطابقة كل مدرب في خطة اليوم
        const instructorComparisons = [];
        let totalMatched = 0;
        let totalManualExtra = 0;
        let totalNotInPlan = 0;
        let totalFreeBoth = 0;
        let totalDouble = 0;
        let totalYard = 0;
        let totalRoad = 0;

        // 2. تصفية خطة اليوم ومطابقة المدربين المسجلين في الإتاحة فقط
        const validPlanList = (dayPlanData.instructors || []).filter(p => 
            p && p.instructorId && !String(p.instructorId).startsWith('INST_') &&
            p.instructorName && !p.instructorName.includes('undefined')
        );

        validPlanList.forEach(planInst => {
            // البحث عن المدرب في جدول الإتاحة بالرقم أو الاسم
            const availInst = availList.find(a => 
                String(a.id).trim() === String(planInst.instructorId).trim() ||
                (a.name && planInst.instructorName && a.name.toLowerCase().includes(planInst.instructorName.toLowerCase()))
            );

            // تطبيق توجيه المستخدم: حصر المقارنة بالمدربين المسجلين فعلياً في الإتاحة، وعدم اختراع أو إضافة أي مدرب غير مسجل
            if (!availInst) {
                return;
            }

            const isSupervisor = !!(availInst.isSupervisor || availInst.shift === 'SUP' || planInst.isSupervisor);
            const category = availInst.category || (planInst.sessions[0]?.course?.startsWith('LMFA') ? 'LMFA' : 'LMFM');
            const shift = isSupervisor ? 'SUP' : (availInst.shift || (planInst.sessions.some(s => s.slot >= 11) ? 'S2' : 'S1'));
            const minSlot = isSupervisor ? 1 : (availInst.minSlot || (shift === 'S2' ? 11 : 1));
            const maxSlot = isSupervisor ? (category === 'HT' ? 24 : 20) : (availInst.maxSlot || (shift === 'S2' ? 20 : 10));

            const slotComparisons = [];
            let instMatched = 0;
            let instManualExtra = 0;
            let instNotInPlan = 0;

            // تحديد قائمة الحصص للمقارنة:
            // في حالة المشرف: لا يوجد جدول 20 حصة، بل تقارن الحصص المسندة إليه فقط بدون أي حصص خالية
            let slotsToCheck = [];
            if (isSupervisor) {
                const planSlotNums = planInst.sessions.map(s => s.slot);
                const availSlotNums = (availInst.fullSchedule || [])
                    .filter(s => s[dayKey] === 'occupied')
                    .map(s => s.slot);
                slotsToCheck = [...new Set([...planSlotNums, ...availSlotNums])].sort((a, b) => a - b);
            } else {
                for (let s = minSlot; s <= maxSlot; s++) slotsToCheck.push(s);
            }

            // فحص نطاق الحصص للمدرب
            slotsToCheck.forEach(slot => {
                // حالة الإتاحة
                let isAvailOccupied = false;
                let availSlotObj = null;
                const detailsKey = (dayKey === 'sat') ? 'satDetails' : 'sunDetails';
                let availDetails = {};
                if (availInst && Array.isArray(availInst.fullSchedule)) {
                    availSlotObj = availInst.fullSchedule.find(s => s.slot === slot);
                    if (availSlotObj) {
                        availDetails = availSlotObj[detailsKey] || {};
                        // إذا كانت الحصة مثبتة يدوياً بالخطة (Fixed) أو كانت فارغة في الأساس، تعتبر خالية في الإتاحة الرسمية
                        if (availDetails.isFixed) {
                            isAvailOccupied = false;
                        } else if (dayKey === 'sat') {
                            isAvailOccupied = (availSlotObj.origSat !== undefined) 
                                ? (availSlotObj.origSat === 'occupied') 
                                : (availSlotObj.sat === 'occupied');
                        } else {
                            isAvailOccupied = (availSlotObj.origSun !== undefined) 
                                ? (availSlotObj.origSun === 'occupied') 
                                : (availSlotObj.sun === 'occupied');
                        }
                    }
                }

                // حالة خطة اليوم
                const planSession = planInst.sessions.find(s => s.slot === slot);
                const isPlanOccupied = !!planSession;

                let timeStr = planSession ? planSession.time : (availSlotObj ? SDIComparisonEngine.getTimeString(slot, category) : '');
                if (!timeStr) timeStr = SDIComparisonEngine.getTimeString(slot, category);

                let status = 'FREE_BOTH';
                let statusTextAr = 'خالية في الجدولين';
                let statusTextEn = 'Free in Both';
                let badgeClass = 'badge-free';

                if (isAvailOccupied && isPlanOccupied) {
                    status = 'MATCHING';
                    statusTextAr = '✅ متطابقة مع الإتاحة';
                    statusTextEn = 'Matching';
                    badgeClass = 'badge-matching';
                    instMatched++;
                    totalMatched++;
                } else if (!isAvailOccupied && isPlanOccupied) {
                    // حصة مضافة يدوياً في Day Plan لم تكن في Availability (Fixed)
                    status = 'MANUAL_EXTRA';
                    statusTextAr = '📌 Fixed (مثبتة يدوياً بالخطة)';
                    statusTextEn = 'Fixed (Manual Extra in Plan)';
                    badgeClass = 'badge-fixed';
                    instManualExtra++;
                    totalManualExtra++;
                } else if (isAvailOccupied && !isPlanOccupied) {
                    // حصة محجوزة بالإتاحة لكن غير مدرجة بخطة اليوم
                    status = 'NOT_IN_PLAN';
                    statusTextAr = 'ℹ️ غير مدرجة بالخطة';
                    statusTextEn = 'Missing in Plan';
                    badgeClass = 'badge-missing';
                    instNotInPlan++;
                    totalNotInPlan++;
                } else {
                    if (!isSupervisor) totalFreeBoth++;
                }

                if (planSession) {
                    if (planSession.location === 'Y') totalYard++;
                    else totalRoad++;

                    if (planSession.isDouble) totalDouble++;
                }

                if (planSession?.hasRoadDualConflict) {
                    status = 'CONFLICT_ROAD_DUAL';
                    statusTextAr = '⚠️ تعارض: طالبان بالشارع (ممنوع بالدراجة)';
                    statusTextEn = 'Conflict: 2 Students on Road (MC Disallowed)';
                    badgeClass = 'badge-extra-manual';
                }

                slotComparisons.push({
                    slot: slot,
                    time: timeStr,
                    isAvailOccupied: isAvailOccupied,
                    isPlanOccupied: isPlanOccupied,
                    status: status,
                    statusTextAr: statusTextAr,
                    statusTextEn: statusTextEn,
                    badgeClass: badgeClass,
                    session: planSession || null,
                    location: planSession ? planSession.location : (availDetails.location || 'R'),
                    isDouble: planSession ? planSession.isDouble : !!availDetails.isDouble,
                    isDoublePart2: planSession ? planSession.isDoublePart2 : !!availDetails.isDoublePart2,
                    studentName: planSession ? planSession.studentName : (availDetails.studentName || ''),
                    studentId: planSession ? planSession.studentId : (availDetails.studentId || ''),
                    course: planSession ? planSession.course : (availDetails.course || category),
                    hasDualStudents: !!(planSession?.hasDualStudents || availDetails?.hasDualStudents),
                    student2Name: planSession ? (planSession.student2Name || '') : (availDetails.student2Name || ''),
                    student2Id: planSession ? (planSession.student2Id || '') : (availDetails.student2Id || ''),
                    student2Course: planSession ? (planSession.student2Course || '') : (availDetails.student2Course || '')
                });
            });

            instructorComparisons.push({
                instructorId: planInst.instructorId,
                instructorName: availInst.name || planInst.instructorName,
                shortName: availInst.shortName || planInst.shortName,
                category: category,
                shift: shift,
                minSlot: minSlot,
                maxSlot: maxSlot,
                isRegisteredInAvailability: true,
                isSupervisor: isSupervisor,
                slots: slotComparisons,
                stats: {
                    matched: instMatched,
                    manualExtra: instManualExtra,
                    notInPlan: instNotInPlan,
                    totalPlanSessions: planInst.sessions.length,
                    yardCount: planInst.yardCount || 0,
                    roadCount: planInst.roadCount || 0,
                    doubleCount: planInst.doubleCount || 0,
                    occupancyRate: isSupervisor ? (planInst.sessions.length > 0 ? "100.0" : "0.0") : null
                }
            });
        });

        // 3. فحص المدربين المسجلين في الإتاحة ولكن غير موجودين في خطة اليوم
        const missingFromPlan = [];
        availList.forEach(a => {
            const inPlan = planList.some(p => 
                String(p.instructorId).trim() === String(a.id).trim() ||
                (p.instructorName && a.name && p.instructorName.toLowerCase().includes(a.name.toLowerCase()))
            );
            if (!inPlan) {
                missingFromPlan.push({
                    id: a.id,
                    name: a.name,
                    shortName: a.shortName,
                    shiftCode: a.shiftCode
                });
            }
        });

        const totalPlanSessionsCount = dayPlanData.stats?.totalSessions || (totalMatched + totalManualExtra);

        return {
            hasData: true,
            dayKey: dayKey,
            dayNameAr: dayNameAr,
            dayNameEn: dayNameEn,
            planDate: dayPlanData.date,
            planFileName: dayPlanData.fileName,
            instructors: instructorComparisons,
            missingFromPlanInstructors: missingFromPlan,
            stats: {
                totalPlanSessions: totalPlanSessionsCount,
                matchedSessions: totalMatched,
                manualExtraSessions: totalManualExtra,
                notInPlanSessions: totalNotInPlan,
                yardSessions: totalYard,
                roadSessions: totalRoad,
                doubleSessions: totalDouble,
                yardRate: totalPlanSessionsCount > 0 ? ((totalYard / totalPlanSessionsCount) * 100).toFixed(1) : "0.0",
                roadRate: totalPlanSessionsCount > 0 ? ((totalRoad / totalPlanSessionsCount) * 100).toFixed(1) : "0.0",
                conflictRiskRate: totalPlanSessionsCount > 0 ? ((totalManualExtra / totalPlanSessionsCount) * 100).toFixed(1) : "0.0"
            }
        };
    },

    /**
     * تحويل تاريخ الخطة ليوم المقارنة المناسب
     */
    detectDayKeyFromDate(dateStr) {
        if (!dateStr) return 'sun';
        try {
            const str = String(dateStr).trim();
            // فحص الأسماء المباشرة للأيام
            if (/سبت|اثنين|إثنين|اربعاء|أربعاء|sat|mon|wed/i.test(str)) {
                return 'sat';
            }
            if (/أحد|احد|ثلاثاء|خميس|sun|tue|thu/i.test(str)) {
                return 'sun';
            }

            // تحويل الأرقام العربية المشرقية إن وجدت وإزالة علامات RTL
            const normalized = str
                .replace(/[\u200e\u200f]/g, '')
                .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

            // استخراج الأرقام
            const match = normalized.match(/(\d{1,4})[\/\-](\d{1,2})[\/\-](\d{1,4})/);
            if (!match) return 'sun';

            let d, m, y;
            if (match[1].length === 4) {
                y = parseInt(match[1], 10);
                m = parseInt(match[2], 10) - 1;
                d = parseInt(match[3], 10);
            } else {
                d = parseInt(match[1], 10);
                m = parseInt(match[2], 10) - 1;
                y = parseInt(match[3], 10);
                if (y < 100) y += 2000;
            }

            const dateObj = new Date(y, m, d);
            if (isNaN(dateObj.getTime())) return 'sun';

            const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
            // الأيام: السبت (6)، الإثنين (1)، الأربعاء (3) -> 'sat'
            // الأحد (0)، الثلاثاء (2)، الخميس (4) -> 'sun'
            if (dayOfWeek === 6 || dayOfWeek === 1 || dayOfWeek === 3) {
                return 'sat';
            }
            return 'sun';
        } catch (e) {
            return 'sun';
        }
    },

    /**
     * استرجاع التوقيت المناسب للحصة
     */
    getTimeString(slot, category) {
        if (category === 'MC' && typeof MC_TIME_SLOTS !== 'undefined') {
            const f = MC_TIME_SLOTS.find(t => t.id === slot);
            return f ? f.time : '';
        }
        if (category === 'HT' && typeof HT_TIME_SLOTS !== 'undefined') {
            const f = HT_TIME_SLOTS.find(t => t.id === slot);
            return f ? f.time : '';
        }
        if (typeof LM_TIME_SLOTS !== 'undefined') {
            const f = LM_TIME_SLOTS.find(t => t.id === slot);
            return f ? f.time : '';
        }
        return '';
    },

    /**
     * تصدير نتائج المقارنة كملف Excel منسق
     */
    exportComparisonToExcel(comparisonResult) {
        if (typeof XLSX === 'undefined') {
            alert("مكتبة تصدير Excel غير متوفرة.");
            return;
        }

        const wb = XLSX.utils.book_new();

        // 1. ورقة الملخص الإحصائي
        const summaryData = [
            ["تقرير مطابقة خطة اليوم مع جدول الإتاحة - معهد الشارقة للسياقة (SDI)"],
            ["تاريخ الخطة:", comparisonResult.planDate, "الملف:", comparisonResult.planFileName],
            ["يوم المقارنة:", comparisonResult.dayNameAr],
            [],
            ["المؤشر", "العدد", "النسبة"],
            ["إجمالي حصص خطة اليوم", comparisonResult.stats.totalPlanSessions, "100%"],
            ["حصص متطابقة مع الإتاحة", comparisonResult.stats.matchedSessions, `${((comparisonResult.stats.matchedSessions / comparisonResult.stats.totalPlanSessions) * 100 || 0).toFixed(1)}%`],
            ["حصص مضافة يدوياً بالخطة (خارج الإتاحة)", comparisonResult.stats.manualExtraSessions, `${comparisonResult.stats.conflictRiskRate}%`],
            ["حصص مسجلة بالإتاحة غير مدرجة بالخطة", comparisonResult.stats.notInPlanSessions, "-"],
            ["حصص الساحة (Yard - Y)", comparisonResult.stats.yardSessions, `${comparisonResult.stats.yardRate}%`],
            ["حصص الشارع (Road - R)", comparisonResult.stats.roadSessions, `${comparisonResult.stats.roadRate}%`],
            ["حصص مزدوجة (Double - D)", comparisonResult.stats.doubleSessions, "-"]
        ];
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, "ملخص المقارنة");

        // 2. ورقة التفاصيل الكاملة للحصص
        const detailsHeader = [
            "رقم المدرب",
            "اسم المدرب",
            "الحصة",
            "التوقيت",
            "حالة الإتاحة",
            "حالة خطة اليوم",
            "نتيجة المقارنة",
            "مكان التدريب",
            "نوع الحصة",
            "اسم الطالب",
            "رقم القيد",
            "كود الدورة"
        ];
        const detailsRows = [detailsHeader];

        comparisonResult.instructors.forEach(inst => {
            inst.slots.forEach(s => {
                if (!s.isAvailOccupied && !s.isPlanOccupied) return; // تجاهل الحصص الفارغة في الاثنين

                detailsRows.push([
                    inst.instructorId,
                    inst.instructorName,
                    s.slot,
                    s.time,
                    s.isAvailOccupied ? "مشغولة" : "خالية",
                    s.isPlanOccupied ? "مشغولة" : "خالية",
                    s.statusTextAr,
                    s.location === 'Y' ? "ساحة (Y)" : "شارع (R)",
                    s.isDouble ? "مزدوجة (D)" : "عادية (R)",
                    s.hasDualStudents && s.student2Name ? `${s.studentName || 'طالب 1'} + ${s.student2Name} (دمج ساحة)` : (s.studentName || "-"),
                    s.hasDualStudents && s.student2Id ? `${s.studentId || '-'} / ${s.student2Id}` : (s.studentId || "-"),
                    s.hasDualStudents && s.student2Course ? `${s.course || '-'} / ${s.student2Course}` : (s.course || "-")
                ]);
            });
        });

        const wsDetails = XLSX.utils.aoa_to_sheet(detailsRows);
        XLSX.utils.book_append_sheet(wb, wsDetails, "تفاصيل الحصص والتعارضات");

        const fileName = `SDI_DayPlan_Comparison_${(comparisonResult.planDate || 'date').replace(/[\/\\]/g, '-')}.xlsx`;
        XLSX.writeFile(wb, fileName);
    }
};

if (typeof window !== 'undefined') {
    window.SDIComparisonEngine = SDIComparisonEngine;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SDIComparisonEngine };
}
