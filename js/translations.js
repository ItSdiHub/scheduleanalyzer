/**
 * ملف الترجمة والتعريب ثنائي اللغة - معهد الشارقة للسياقة (SDI)
 * Sharjah Driving Institute LLC - Bilingual (Arabic / English) Engine
 * 
 * تطوير: م/ محمود محمد
 */

const SDI_TRANSLATIONS = {
    ar: {
        // العلامة التجارية والعناوين
        brandTitle: "نظام تحليل وتقارير الحصص الرسمية",
        brandSub: "معهد الشارقة للسياقة | Sharjah Driving Institute",
        developedBy: "تطوير: م/ محمود محمد",

        // شريط التنقل والتبويبات
        tabReport1: "1. لوحة المؤشرات الإحصائية (صفحتان)",
        tabReport2: "2. التقرير التفصيلي للحصص الفارغة",
        tabInteractive: "3. المحرر التفاعلي لجدول الحصص وفترات العمل",
        tabCoding: "4. نموذج تسجيل وتكويد المدربين",
        pagesText: "صفحات",
        pageOneText: "صفحة واحدة",

        // أزرار الإجراءات
        btnExportExcel: "تصدير Excel",
        btnPrintReport1: "طباعة المؤشرات (2 صفحة)",
        btnPrintReport2: "طباعة الحصص الفارغة (5 صفحات)",
        btnPrintAll: "طباعة الحزمة كاملة (7 صفحات PDF)",
        btnUploadFile: "رفع ملف التدريب (PDF / Excel)",
        btnUploadAvailability: "رفع جدول الإتاحة (Availability)",
        btnUploadDayPlan: "رفع خطة اليوم (Day Plan)",
        btnZeroData: "تصفير البيانات",
        btnShare: "مشاركة",
        btnLanguage: "🌐 English",

        // شريط الحالة والاتصال
        statusOnline: "متصل مباشر",
        statusOffline: "غير متصل (حفظ محلي)",
        userConnected: "متصل",
        usersConnected: "متصلين",
        activeFileLabel: "الملف النشط حالياً:",
        activeFileDefault: "Instructor Availability.pdf (الملف الرسمي المعتمد)",
        activeFileTimeInstant: "⚡ تم التحليل اللحظي المباشر",
        activeFileZeroSlots: "⚡ تم تصفير كافة الحصص (0% إشغال)",
        activeFileWiped: "لا يوجد ملف نشط (تم تصفير البيانات بالكامل)",

        // التقرير الأول
        r1BannerTitle: "📊 التقرير الأول: لوحة المؤشرات الإحصائية",
        r1BannerSub: "مطابق بنسبة 100% للتقرير المعتمد (الصفحة 1: المؤشرات وفئات التدريب | الصفحة 2: ملخص أداء المدربين)",
        r1BannerBtn: "🖨️ حفظ كـ PDF الآن (صفحتان)",
        r1Title: "لوحة المؤشرات الإحصائية - معهد الشارقة للسياقة",
        r1Sub: "ملخص سعة التشغيل وتوزيع الحصص التدريبية",
        r1KpiSection: "المؤشرات العامة (الإجمالي)",
        r1KpiCap: "إجمالي السعة المتاحة",
        r1KpiCapSub: "إجمالي الحصص الأسبوعية",
        r1KpiOcc: "إجمالي الحصص المشغولة",
        r1KpiOccSub: "حصة محجوزة للطلاب",
        r1KpiEmp: "إجمالي الحصص الفارغة",
        r1KpiEmpSub: "حصة قابلة للجدولة",
        r1KpiRate: "نسبة الإشغال الكلية",
        r1KpiRateSub: "سعة التشغيل المحققة",
        r1CatSection: "سعة التشغيل حسب فئة التدريب",
        r1PerfSection: "ملخص توزيع الحصص وأداء المدربين",
        r1Page1Footer: "إحصائيات معهد الشارقة للسياقة الرسمية | Sharjah Driving Institute",
        r1Page2Footer: "تطوير: م/ محمود محمد | إحصائيات معهد الشارقة للسياقة",

        // التقرير الثاني
        r2BannerTitle: "🗓️ التقرير الثاني: التقرير التفصيلي للحصص الفارغة (موزع حسب الأيام)",
        r2BannerSub: "مطابق بنسبة 100% للتقرير المعتمد (مقسم لجميع المدربين المستخرجين من الملف في نفس الوقت)",
        r2BannerBtn: "🖨️ حفظ كـ PDF الآن (تقرير الحصص الفارغة)",
        r2Title: "التقرير التفصيلي للحصص الفارغة - معهد الشارقة للسياقة",
        r2Sub: "البيان الأسبوعي للحصص المتاحة ومواعيد العمل المعتمدة (موزع حسب الأيام)",
        r2SingleNote: " (جدول تدريبي فردي: {name})",
        r2PageFooter: "تطوير: م/ محمود محمد | معهد الشارقة للسياقة",
        r2EmptyStateTitle: "لا توجد جداول تدريبية معروضة حالياً",
        r2EmptyStateDesc: "تم تصفير البيانات بنجاح. يمكنك رفع ملف التدريب المعتمد لاستخراج الجداول فورياً، أو تسجيل مدربين جدد.",

        // أسماء الفئات
        catLMFM: "مركبة خفيفة - جير عادي (LMFM)",
        catLMFA: "مركبة خفيفة - أوتوماتيك (LMFA)",
        catMC: "دراجة نارية (MC)",
        catHT: "شاحنة ثقيلة (HTFM)",

        // المحرر التفاعلي
        editorPeriodsTitle: "تصفية الفترات:",
        filterMorning: "الفترة الصباحية",
        filterEvening: "الفترة المسائية",
        filterAll: "جميع الفترات",
        selectInstructorLabel: "اختيار المدرب",
        allInstructorsPill: "عرض كافة المدربين",
        allMorningPill: "عرض كافة مدربي الصباحي",
        allEveningPill: "عرض كافة مدربي المسائي",
        noInstructorsInPeriod: "لا يوجد مدربين مسجلين في هذه الفترة حالياً.",

        // جدول الحصص
        thSlotAndTime: "الحصة والتوقيت",
        thSatDays: "🗓️ السبت - الإثنين - الأربعاء",
        thSatDaysSub: "(SAT-MON-WED)",
        thSunDays: "🗓️ الأحد - الثلاثاء - الخميس",
        thSunDaysSub: "(SUN-TUE-THU)",
        thWeeklyAction: "حجز أسبوعي",
        thWeeklyActionSub: "(SAT-THU)",
        badgeOccupied: "مشغولة",
        badgeEmpty: "خالية",
        btnBook: "حجز 🔒",
        btnFree: "تفريغ 🔄",
        slotTitle: "حصة",

        // تفاصيل المدرب المختار
        instShiftRegistered: "الوردية المسجلة:",
        instSlotsRange: "نطاق الحصص:",
        instSlotsCount: "حصص معتمدة فقط",
        instShiftRate: "نسبة إشغال الوردية:",
        btnEditCoding: "⚙️ تعديل التكويد",
        btnClearRange: "🟢 تفريغ النطاق",
        btnBookRange: "🔒 حجز النطاق",

        // نموذج تسجيل وتكويد المدربين
        prominentFormTitle: "نموذج تسجيل وتكويد المدربين وتحديد فترات العمل",
        prominentFormBadge: "إزالة الحصص خارج فترة العمل تلقائياً",
        btnHideForm: "🔼 إخفاء النموذج",
        btnShowForm: "🔽 إظهار نموذج التسجيل",
        lblInstName: "اسم المدرب:",
        lblInstId: "الرقم الوظيفي / الكود:",
        lblInstCategory: "فئة التدريب والمركبة:",
        lblInstShift: "فترة العمل المعتمدة:",
        lblShiftCodePreview: "⚡ كود الوردية:",
        btnClearFields: "🔄 مسح الحقول",
        btnSaveInstructor: "💾 حفظ وتكويد المدرب وتطبيق الفترة",

        // التبويب الرابع: لوحة تكويد المدربين
        tab4HeaderTitle: "لوحة تسجيل وتكويد المدربين - معهد الشارقة للسياقة",
        tab4HeaderSub: "نموذج تسجيل فترات العمل (الصباحية والمسائية) وتوليد الأكواد وإزالة الحصص خارج فترة العمل المعتمدة",
        tab4TotalKpi: "إجمالي المدربين المسجلين",
        tab4MorningKpi: "مدربو الفترة الصباحية",
        tab4EveningKpi: "مدربو الفترة المسائية",
        tab4TableStaffId: "الرقم الوظيفي",
        tab4TableName: "اسم المدرب",
        tab4TableCat: "فئة التدريب",
        tab4TableShift: "فترة العمل المعتمدة",
        tab4TableCode: "كود الوردية",
        tab4TableRange: "نطاق الحصص الفعلي",
        tab4TableActions: "إجراءات التكويد",
        btnSwitchMorning: "🌅 تحويل لصباحي",
        btnSwitchEvening: "🌇 تحويل لمسائي",
        btnSchedule: "🎮 جدول الحصص",
        btnEdit: "✏️ تعديل",
        btnDelete: "🗑️",

        // نوافذ التصفير والمشاركة
        resetModalTitle: "🔄 تصفير بيانات وجداول النظام",
        resetModalDesc: "اختر نوع التصفير المطلوب تطبيقه فورياً عبر النظام ولدى جميع المستخدمين المتصلين:",
        resetOption1Title: "1. تصفير كافة الحصص (تفريغ الجداول 0% إشغال)",
        resetOption1Desc: "تحويل كافة حصص جميع المدربين إلى 'خالية' (مشغولة = 0، نسبة الإشغال = 0.0%) مع الاحتفاظ بالمدربين وفترات عملهم لتجهيز توزيع جديد.",
        resetOption2Title: "2. تصفير شامل ومسح كافة المدربين (0 مدربين)",
        resetOption2Desc: "مسح جميع بيانات المدربين والبدء من الصفر بانتظار رفع ملف تدريب جديد من المعهد أو تسجيل مدربين يدويين.",
        resetOption3Title: "3. استعادة البيانات الأولية المعتمدة (9 مدربين)",
        resetOption3Desc: "إعادة تحميل قائمة المدربين الرسمية الافتراضية من ملف Availability المعتمد.",
        btnClose: "إغلاق",
        btnCancel: "إلغاء",

        shareModalTitle: "🌐 مشاركة البرنامج مع المستخدمين في نفس الوقت",
        shareModalDesc: "البرنامج يدعم التزامن اللحظي (Real-Time Sync) بالكامل! أي تغيير يتم إجراؤه سينعكس تلقائياً وفورياً لدى جميع المستخدمين المتصلين.",
        shareLocalLabel: "💻 الرابط على جهازك الحالي:",
        shareNetworkLabel: "👥 رابط باقي المستخدمين (على أجهزتهم في المعهد عبر Wi-Fi / الشبكة المحلية):",
        shareHint: "⚡ افتح هذا الرابط من أي جهاز كمبيوتر أو لابتوب أو جوال متصل بنفس شبكة المعهد ليعمل الفريق كاملاً في وقت واحد بتزامن حي!",
        btnCopy: "📋 نسخ",
        btnCopyLink: "📋 نسخ الرابط",

        // نافذة تسجيل المدرب
        modalInstructorTitle: "📝 نموذج تسجيل وتكويد المدرب - SDI",
        modalInstructorSub: "تسجيل وتحديد فئة التدريب وفترة العمل (الصباحية / المسائية) وتوليد كود الوردية تلقائياً",
        modalInstShortName: "الاسم المختصر (للعرض السريع):",
        modalAutoCodeTitle: "⚡ كود الوردية المولد تلقائياً:",
        modalSaveBtn: "💾 حفظ التكويد والبيانات",
        modalDeleteBtn: "🗑️ حذف المدرب",

        // طبقة السحب والإفلات والتحميل
        dragTitle: "أفلت ملف التدريب هنا للتحليل الفوري في نفس الوقت",
        dragSub: "يدعم ملفات معهد الشارقة للسياقة بصيغة PDF أو Excel (.xlsx, .xls, .csv)",
        dragBadge: "⚡ تحليل فوري للجداول، فترات العمل، والحصص الفارغة",
        loadingTitle: "جاري تحليل الملف في نفس الوقت...",
        loadingSub: "يتم الآن فك وتجميع بيانات الحصص والجداول التدريبية تلقائياً",

        // خيارات الفئات والورديات
        optionLMFM: "🚗 مركبة خفيفة - جير عادي (LMFM - 40 دقيقة)",
        optionLMFA: "🚙 مركبة خفيفة - أوتوماتيك (LMFA - 40 دقيقة)",
        optionHT: "🚛 شاحنة ثقيلة (HTFM - 30 دقيقة)",
        optionMC: "🏍️ دراجة نارية (MC - 30 دقيقة)",
        optionShiftMorning: "🌅 الفترة الصباحية (الأولى) - الحصص 1 إلى 10 (أو 1 إلى 12 للشاحنة)",
        optionShiftEvening: "🌇 الفترة المسائية (الثانية) - الحصص 11 إلى 20 (أو 13 إلى 24 للشاحنة)",
        optionShiftFix: "⏱️ فترة ثابتة (خاصة بالدراجة النارية 6 إلى 17)",
        optionShiftSup: "👔 مشرف / سوبرفايزر (Supervisor) - حصص استثنائية (معدل إشغال 100%)",

        // فحص وإضافة المدربين تلقائياً عند رفع الملف
        toastRosterVerifiedAll: "✅ تم فحص الملف: جميع المدربين ({count} مدرب) مسجلون بالنظام مسبقاً، وتم تحديث جداولهم بنجاح.",
        toastRosterNewAndUpdated: "🎉 تم فحص الملف: تم رصد {newCount} مدرب غير مسجل وتمت إضافتهم تلقائياً ({newNames})، وتحديث {updatedCount} مدرب مسجل مسبقاً.",
        toastRosterAllNew: "🎉 تم رصد وإضافة {newCount} مدرب جديد تلقائياً في النظام وتوليد أكوادهم: ({newNames})",
        badgeAutoAdded: "⚡ مضاف تلقائياً",
        badgeAutoAddedTitle: "تم رصد هذا المدرب في ملف التدريب وإضافته تلقائياً إلى النظام",

        // التبويب الخامس: مقارنة خطة اليوم (Instructor Day Plan)
        tabComparison: "5. مقارنة الخطة اليومية (Day Plan vs Availability)",
        btnUploadDayPlan: "رفع خطة اليوم (Day Plan)",
        btnUploadAvailability: "رفع جدول الإتاحة (Availability)",
        badgeYard: "🅿️ ساحة (Y)",
        badgeRoad: "🛣️ شارع (R)",
        badgeRegular: "👤 عادي (R)",
        badgeDouble: "⚡ دبل (D)",
        badgeDoublePart2: "⚡ دبل تابعة",
        statusMatching: "✅ متطابقة مع الإتاحة",
        statusManualExtra: "⚠️ مضافة يدوياً بالخطة",
        statusMissingInPlan: "ℹ️ غير مدرجة بالخطة",
        comparisonTitle: "مقارنة خطة اليوم الفعلية مع جدول الإتاحة المعتمد",
        comparisonSub: "مطابقة الحصص التدريبية، رصد الحصص المضافة يدوياً المسببة للتعارضات، وتوزيع تدريب الساحة (Y) والشارع (R)",
        kpiTotalPlan: "إجمالي حصص خطة اليوم",
        kpiMatched: "حصص متطابقة مع الإتاحة",
        kpiManualExtra: "حصص مضافة يدوياً بالخطة",
        kpiMissingInPlan: "مسجلة بالإتاحة وشاغرة بالخطة",
        kpiYardSessions: "حصص الساحة والباركنج (Yard - Y)",
        kpiRoadSessions: "حصص تدريب الشارع (Road - R)",
        kpiDoubleClasses: "حصص مزدوجة متتالية (Double - D)",
        btnApplyToSchedule: "⚡ اعتماد الحصص وتحديث الجدول التفاعلي",
        btnExportComparison: "📥 تصدير المقارنة Excel",
        btnPrintComparison: "🖨️ طباعة تقرير المطابقة PDF",
        daySelectLabel: "يوم المقارنة المعتمد:",
        filterAllComparison: "كافة الحصص",
        filterConflictsOnly: "التعارضات والزائدة فقط",
        filterExtraOnly: "المضافة يدوياً فقط",
        filterMatchingOnly: "المتطابقة فقط",
        activeDayPlanLabel: "خطة اليوم النشطة:",
        badgeDualStudents: "👥 طالبان (2 Students)",
        badgeDualYardValid: "👥 طالبان بالساحة (مسموح بالدراجة)",
        statusRoadDualConflict: "⚠️ تعارض: طالبان بالشارع (ممنوع بالدراجة)"
    },

    en: {
        // Brand & Titles
        brandTitle: "Official Schedule & Reports System",
        brandSub: "Sharjah Driving Institute LLC | SDI Official Portal",
        developedBy: "Developed by: Eng. Mahmoud Mohamed",

        // Navigation & Tabs
        tabReport1: "1. Statistical Indicators Dashboard (2 Pages)",
        tabReport2: "2. Detailed Empty Slots Report",
        tabInteractive: "3. Interactive Schedule & Shifts Editor",
        tabCoding: "4. Instructors Coding & Registration",
        pagesText: "Pages",
        pageOneText: "1 Page",

        // Action Buttons
        btnExportExcel: "Export Excel",
        btnPrintReport1: "Print Indicators (2 Pages)",
        btnPrintReport2: "Print Empty Slots (5 Pages)",
        btnPrintAll: "Print Complete Package (7 Pages PDF)",
        btnUploadFile: "Upload Schedule (PDF / Excel)",
        btnUploadAvailability: "Upload Availability (PDF/Excel)",
        btnUploadDayPlan: "Upload Day Plan (Multi-File)",
        btnZeroData: "Zero-Out Data",
        btnShare: "Share",
        btnLanguage: "🌐 عربي",

        // Status & Connection Bar
        statusOnline: "Connected Live",
        statusOffline: "Offline (Local Storage)",
        userConnected: "Online",
        usersConnected: "Online",
        activeFileLabel: "Active File:",
        activeFileDefault: "Instructor Availability.pdf (Official Institute File)",
        activeFileTimeInstant: "⚡ Real-Time Live Analysis",
        activeFileZeroSlots: "⚡ All Slots Zeroed Out (0% Occupancy)",
        activeFileWiped: "No Active File (All Data Cleared)",

        // Report 1
        r1BannerTitle: "📊 Report 1: Statistical Indicators Dashboard",
        r1BannerSub: "100% Matches Approved Report (Page 1: Indicators & Categories | Page 2: Instructors Summary)",
        r1BannerBtn: "🖨️ Save as PDF Now (2 Pages)",
        r1Title: "Statistical Indicators Dashboard - Sharjah Driving Institute",
        r1Sub: "Summary of Operational Capacity and Training Slot Allocation",
        r1KpiSection: "Overall Key Indicators (Total)",
        r1KpiCap: "Total Available Capacity",
        r1KpiCapSub: "Total Weekly Slots",
        r1KpiOcc: "Total Occupied Slots",
        r1KpiOccSub: "Reserved Slots for Students",
        r1KpiEmp: "Total Empty Slots",
        r1KpiEmpSub: "Available for Scheduling",
        r1KpiRate: "Overall Occupancy Rate",
        r1KpiRateSub: "Achieved Capacity Rate",
        r1CatSection: "Capacity by Training Category",
        r1PerfSection: "Instructors Slot Allocation & Performance Summary",
        r1Page1Footer: "Official SDI Statistics | Sharjah Driving Institute",
        r1Page2Footer: "Developed by: Eng. Mahmoud Mohamed | Sharjah Driving Institute",

        // Report 2
        r2BannerTitle: "🗓️ Report 2: Detailed Empty Slots Report (Distributed by Days)",
        r2BannerSub: "100% Matches Approved Report (Distributed for all extracted instructors in real-time)",
        r2BannerBtn: "🖨️ Save as PDF Now (Empty Slots)",
        r2Title: "Detailed Empty Slots Report - Sharjah Driving Institute",
        r2Sub: "Weekly Schedule of Available Slots & Approved Shifts (Distributed by Days)",
        r2SingleNote: " (Individual Schedule: {name})",
        r2PageFooter: "Developed by: Eng. Mahmoud Mohamed | Sharjah Driving Institute",
        r2EmptyStateTitle: "No Training Schedules to Display",
        r2EmptyStateDesc: "Data has been zeroed out. You can upload an official institute training file or register new instructors.",

        // Category Names
        catLMFM: "Light Motor - Manual (LMFM)",
        catLMFA: "Light Motor - Automatic (LMFA)",
        catMC: "Motorcycle (MC)",
        catHT: "Heavy Truck (HTFM)",

        // Interactive Editor
        editorPeriodsTitle: "Filter Shifts:",
        filterMorning: "Morning Shift",
        filterEvening: "Evening Shift",
        filterAll: "All Shifts",
        selectInstructorLabel: "Select Instructor",
        allInstructorsPill: "View All Instructors",
        allMorningPill: "View All Morning Instructors",
        allEveningPill: "View All Evening Instructors",
        noInstructorsInPeriod: "No instructors registered in this shift currently.",

        // Slots Grid
        thSlotAndTime: "Slot & Timing",
        thSatDays: "🗓️ Sat - Mon - Wed",
        thSatDaysSub: "(SAT-MON-WED)",
        thSunDays: "🗓️ Sun - Tue - Thu",
        thSunDaysSub: "(SUN-TUE-THU)",
        thWeeklyAction: "Weekly Booking",
        thWeeklyActionSub: "(SAT-THU)",
        badgeOccupied: "Occupied",
        badgeEmpty: "Empty",
        btnBook: "Book 🔒",
        btnFree: "Free 🔄",
        slotTitle: "Slot",

        // Focused Instructor
        instShiftRegistered: "Registered Shift:",
        instSlotsRange: "Slot Range:",
        instSlotsCount: "Approved Slots Only",
        instShiftRate: "Shift Occupancy Rate:",
        btnEditCoding: "⚙️ Edit Coding",
        btnClearRange: "🟢 Free Shift",
        btnBookRange: "🔒 Book Shift",

        // Coding Form
        prominentFormTitle: "Instructor Coding & Shift Assignment Form",
        prominentFormBadge: "Slots outside shift eliminated automatically",
        btnHideForm: "🔼 Hide Form",
        btnShowForm: "🔽 Show Registration Form",
        lblInstName: "Instructor Name:",
        lblInstId: "Staff ID / Code:",
        lblInstCategory: "Training Category & Vehicle:",
        lblInstShift: "Approved Work Shift:",
        lblShiftCodePreview: "⚡ Shift Code:",
        btnClearFields: "🔄 Clear Fields",
        btnSaveInstructor: "💾 Save & Code Instructor",

        // Tab 4 Coding Manager
        tab4HeaderTitle: "Instructor Registration & Coding Dashboard - SDI",
        tab4HeaderSub: "Manage instructor shifts, generate smart codes, and remove slots outside approved shifts",
        tab4TotalKpi: "Total Instructors",
        tab4MorningKpi: "Morning Instructors",
        tab4EveningKpi: "Evening Instructors",
        tab4TableStaffId: "Staff ID",
        tab4TableName: "Instructor Name",
        tab4TableCat: "Category",
        tab4TableShift: "Approved Shift",
        tab4TableCode: "Shift Code",
        tab4TableRange: "Actual Slot Range",
        tab4TableActions: "Actions",
        btnSwitchMorning: "🌅 Switch to Morning",
        btnSwitchEvening: "🌇 Switch to Evening",
        btnSchedule: "🎮 Schedule",
        btnEdit: "✏️ Edit",
        btnDelete: "🗑️",

        // Modals
        resetModalTitle: "🔄 Zero-Out & Reset System Data",
        resetModalDesc: "Choose the zero-out reset mode to apply live across all connected users:",
        resetOption1Title: "1. Zero-Out All Slots (0% Occupancy)",
        resetOption1Desc: "Turn all slots for all instructors to 'Empty' (Occupied = 0, Rate = 0.0%) while keeping instructor profiles and coding intact.",
        resetOption2Title: "2. Full Wipe & Reset (0 Instructors)",
        resetOption2Desc: "Wipe all instructor records and start completely clean from zero, ready for uploading a new institute file or manual coding.",
        resetOption3Title: "3. Restore Default Initial Data (9 Instructors)",
        resetOption3Desc: "Reload the official 9 demo instructors from the availability template file.",
        btnClose: "Close",
        btnCancel: "Cancel",

        shareModalTitle: "🌐 Live Multi-User Sharing",
        shareModalDesc: "The system supports full Real-Time Sync! Any update is broadcast instantly to all connected users without refreshing.",
        shareLocalLabel: "💻 URL on your current computer:",
        shareNetworkLabel: "👥 URL for other colleagues (on institute LAN / Wi-Fi):",
        shareHint: "⚡ Open this link on any PC, laptop, or mobile on the same network to collaborate live in real-time!",
        btnCopy: "📋 Copy",
        btnCopyLink: "📋 Copy Link",

        // Instructor Modal
        modalInstructorTitle: "📝 Instructor Registration & Coding Form - SDI",
        modalInstructorSub: "Register category and shift (morning / evening) and auto-generate shift code",
        modalInstShortName: "Short Name (for quick display):",
        modalAutoCodeTitle: "⚡ Auto-Generated Shift Code:",
        modalSaveBtn: "💾 Save Coding & Details",
        modalDeleteBtn: "🗑️ Delete Instructor",

        // Drag & Drop and Loading
        dragTitle: "Drop training schedule file here for instant live analysis",
        dragSub: "Supports SDI files in PDF or Excel (.xlsx, .xls, .csv)",
        dragBadge: "⚡ Instant analysis of schedules, shifts, and empty slots",
        loadingTitle: "Analyzing file in real-time...",
        loadingSub: "Extracting and computing training schedules and empty slots automatically",

        // Categories & Shifts Options
        optionLMFM: "🚗 Light Motor - Manual (LMFM - 40 mins)",
        optionLMFA: "🚙 Light Motor - Automatic (LMFA - 40 mins)",
        optionHT: "🚛 Heavy Truck (HTFM - 30 mins)",
        optionMC: "🏍️ Motorcycle (MC - 30 mins)",
        optionShiftMorning: "🌅 Morning Shift (1st) - Slots 1 to 10 (or 1 to 12 for Truck)",
        optionShiftEvening: "🌇 Evening Shift (2nd) - Slots 11 to 20 (or 13 to 24 for Truck)",
        optionShiftFix: "⏱️ Fixed Shift (Motorcycle 6 to 17)",
        optionShiftSup: "👔 Supervisor - Ad-hoc Sessions (100% Occupancy Rate)",

        // Roster Verification & Auto-Registration
        toastRosterVerifiedAll: "✅ File verified: All {count} instructors in the file are already registered; their schedules have been updated.",
        toastRosterNewAndUpdated: "🎉 File verified: Found {newCount} new instructor(s) and auto-registered them ({newNames}). Updated {updatedCount} existing instructor(s).",
        toastRosterAllNew: "🎉 Auto-registered {newCount} new instructor(s) into the system: ({newNames})",
        badgeAutoAdded: "⚡ Auto-Added",
        badgeAutoAddedTitle: "This instructor was detected in the schedule file and auto-registered into the system",

        // Tab 5: Day Plan vs Availability Comparison
        tabComparison: "5. Day Plan vs Availability Comparison",
        btnUploadDayPlan: "Upload Day Plan (PDF/Excel)",
        btnUploadAvailability: "Upload Availability (PDF/Excel)",
        badgeYard: "🅿️ Yard (Y)",
        badgeRoad: "🛣️ Road (R)",
        badgeRegular: "👤 Regular (R)",
        badgeDouble: "⚡ Double (D)",
        badgeDoublePart2: "⚡ Double (Part 2)",
        statusMatching: "✅ Matching with Availability",
        statusManualExtra: "⚠️ Manual Extra in Day Plan",
        statusMissingInPlan: "ℹ️ Missing in Day Plan",
        comparisonTitle: "Day Plan vs Availability Comparison",
        comparisonSub: "Match actual daily training with official availability, detect manual extra bookings & Yard (Y) vs Road (R) distribution",
        kpiTotalPlan: "Total Day Plan Sessions",
        kpiMatched: "Matching Sessions",
        kpiManualExtra: "Manual Extra Sessions",
        kpiMissingInPlan: "Missing in Day Plan",
        kpiYardSessions: "Yard / Parking (Y) Sessions",
        kpiRoadSessions: "Road Training (R) Sessions",
        kpiDoubleClasses: "Double Consecutive Classes (D)",
        btnApplyToSchedule: "⚡ Apply Plan to Schedule",
        btnExportComparison: "📥 Export Comparison Excel",
        btnPrintComparison: "🖨️ Print Comparison PDF",
        daySelectLabel: "Comparison Day:",
        filterAllComparison: "All Sessions",
        filterConflictsOnly: "Conflicts & Extra Only",
        filterExtraOnly: "Manual Extra Only",
        filterMatchingOnly: "Matching Only",
        activeDayPlanLabel: "Active Day Plan:",
        badgeDualStudents: "👥 2 Students (Dual)",
        badgeDualYardValid: "👥 2 Students in Yard (MC Allowed)",
        statusRoadDualConflict: "⚠️ Conflict: 2 Students on Road (MC Disallowed)"
    }
};

if (typeof window !== 'undefined') {
    window.SDI_TRANSLATIONS = SDI_TRANSLATIONS;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SDI_TRANSLATIONS };
}
