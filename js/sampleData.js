/**
 * قواعد البيانات والتكويد الرسمي لمعهد الشارقة للسياقة (SDI)
 * Sharjah Driving Institute LLC
 * 
 * فترات العمل المعتمدة:
 * 1. المركبة الخفيفة (LM): مدة الحصة 40 دقيقة
 *    - الفترة الأولى: الحصص 1 إلى 10
 *    - الفترة الثانية: الحصص 11 إلى 20
 * 2. الشاحنة الثقيلة (HT): مدة الحصة 30 دقيقة
 *    - الفترة الأولى: الحصص 1 إلى 12
 *    - الفترة الثانية: الحصص 13 إلى 24
 * 3. الدراجة النارية (MC): مدة الحصة 30 دقيقة
 *    - فترة ثابتة: الحصص 6 إلى 17
 * 
 * تطوير: م/ محمود محمد
 */

// توقيتات المركبة الخفيفة (40 دقيقة)
const LM_TIME_SLOTS = [
    { id: 1,  time: "06:20 - 07:00", shift: "S1" },
    { id: 2,  time: "07:00 - 07:40", shift: "S1" },
    { id: 3,  time: "07:40 - 08:20", shift: "S1" },
    { id: 4,  time: "08:20 - 09:00", shift: "S1" },
    { id: 5,  time: "09:15 - 09:55", shift: "S1" },
    { id: 6,  time: "09:55 - 10:35", shift: "S1" },
    { id: 7,  time: "10:35 - 11:15", shift: "S1" },
    { id: 8,  time: "11:30 - 12:10", shift: "S1" },
    { id: 9,  time: "12:10 - 12:50", shift: "S1" },
    { id: 10, time: "12:50 - 13:30", shift: "S1" },
    { id: 11, time: "13:45 - 14:25", shift: "S2" },
    { id: 12, time: "14:25 - 15:05", shift: "S2" },
    { id: 13, time: "15:05 - 15:45", shift: "S2" },
    { id: 14, time: "16:00 - 16:40", shift: "S2" },
    { id: 15, time: "16:40 - 17:20", shift: "S2" },
    { id: 16, time: "17:20 - 18:00", shift: "S2" },
    { id: 17, time: "18:15 - 18:55", shift: "S2" },
    { id: 18, time: "18:55 - 19:35", shift: "S2" },
    { id: 19, time: "19:35 - 20:15", shift: "S2" },
    { id: 20, time: "20:15 - 20:55", shift: "S2" }
];

// توقيتات الشاحنة الثقيلة (30 دقيقة - 24 حصة)
const HT_TIME_SLOTS = [
    { id: 1,  time: "06:00 - 06:30", shift: "S1" },
    { id: 2,  time: "06:30 - 07:00", shift: "S1" },
    { id: 3,  time: "07:00 - 07:30", shift: "S1" },
    { id: 4,  time: "07:30 - 08:00", shift: "S1" },
    { id: 5,  time: "08:00 - 08:30", shift: "S1" },
    { id: 6,  time: "08:30 - 09:00", shift: "S1" },
    { id: 7,  time: "09:15 - 09:45", shift: "S1" },
    { id: 8,  time: "09:45 - 10:15", shift: "S1" },
    { id: 9,  time: "10:15 - 10:45", shift: "S1" },
    { id: 10, time: "10:45 - 11:15", shift: "S1" },
    { id: 11, time: "11:15 - 11:45", shift: "S1" },
    { id: 12, time: "11:45 - 12:15", shift: "S1" },
    { id: 13, time: "12:45 - 13:15", shift: "S2" },
    { id: 14, time: "13:15 - 13:45", shift: "S2" },
    { id: 15, time: "13:45 - 14:15", shift: "S2" },
    { id: 16, time: "14:15 - 14:45", shift: "S2" },
    { id: 17, time: "14:45 - 15:15", shift: "S2" },
    { id: 18, time: "15:15 - 15:45", shift: "S2" },
    { id: 19, time: "16:00 - 16:30", shift: "S2" },
    { id: 20, time: "16:30 - 17:00", shift: "S2" },
    { id: 21, time: "17:00 - 17:30", shift: "S2" },
    { id: 22, time: "17:30 - 18:00", shift: "S2" },
    { id: 23, time: "18:00 - 18:30", shift: "S2" },
    { id: 24, time: "18:30 - 19:00", shift: "S2" }
];

// توقيتات الدراجة النارية (30 دقيقة - فترة ثابتة 6 إلى 17)
const MC_TIME_SLOTS = [
    { id: 6,  time: "09:15 - 09:45", shift: "FIX" },
    { id: 7,  time: "09:45 - 10:15", shift: "FIX" },
    { id: 8,  time: "10:15 - 10:45", shift: "FIX" },
    { id: 9,  time: "10:45 - 11:15", shift: "FIX" },
    { id: 10, time: "11:30 - 12:00", shift: "FIX" },
    { id: 11, time: "12:00 - 12:30", shift: "FIX" },
    { id: 12, time: "12:30 - 13:00", shift: "FIX" },
    { id: 13, time: "13:00 - 13:30", shift: "FIX" },
    { id: 14, time: "13:30 - 14:00", shift: "FIX" },
    { id: 15, time: "14:15 - 14:45", shift: "FIX" },
    { id: 16, time: "14:45 - 15:15", shift: "FIX" },
    { id: 17, time: "15:15 - 15:45", shift: "FIX" }
];

const SDI_CATEGORIES = {
    LMFM: { code: "LMFM", name: "مركبة خفيفة - جير عادي", nameEn: "Light Motor Manual", duration: 40, color: "#2563eb" },
    LMFA: { code: "LMFA", name: "مركبة خفيفة - أوتوماتيك", nameEn: "Light Motor Auto", duration: 40, color: "#7c3aed" },
    MC:   { code: "MC",   name: "دراجة نارية", nameEn: "Motorcycle", duration: 30, color: "#059669" },
    HT:   { code: "HT",   name: "شاحنة ثقيلة (HTFM)", nameEn: "Heavy Truck", duration: 30, color: "#d97706" }
};

/**
 * بيانات المدربين الـ 9 المستخرجة فعلياً من الملف المرفوع بدون أي محاكاة أو بيانات مستحدثة
 */
const OFFICIAL_INSTRUCTORS = [
    // 1. Maqsood Ali (102671) - عادي - الفترة الأولى (1 إلى 10)
    {
        id: "102671",
        name: "Maqsood Ali Kachkol Amir",
        shortName: "Maqsood Ali",
        category: "LMFM",
        vehicleType: "خفيفة (LM)",
        shift: "S1",
        shiftName: "الفترة الأولى (1 - 10)",
        shiftCode: "LMFM-S1",
        capacity: 40,
        occupied: 11,
        empty: 29,
        rate: 27.5,
        minSlot: 1,
        maxSlot: 20,
        note: "",
        reportPage: 1,
        slotsRows: [
            { slotDisplay: "1", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "4", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "5", sat: "خالية", sun: "خالية" },
            { slotDisplay: "6", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "7", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "8", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "9", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "10", sat: "خالية", sun: "خالية" },
            { slotDisplay: "11 إلى 20", sat: "خالية", sun: "خالية" }
        ],
        fullSchedule: [
            { slot: 1, sat: "occupied", sun: "empty" },
            { slot: 2, sat: "occupied", sun: "occupied" },
            { slot: 3, sat: "occupied", sun: "occupied" },
            { slot: 4, sat: "empty", sun: "occupied" },
            { slot: 5, sat: "empty", sun: "empty" },
            { slot: 6, sat: "occupied", sun: "empty" },
            { slot: 7, sat: "empty", sun: "occupied" },
            { slot: 8, sat: "empty", sun: "occupied" },
            { slot: 9, sat: "occupied", sun: "occupied" },
            { slot: 10, sat: "empty", sun: "empty" },
            { slot: 11, sat: "empty", sun: "empty" },
            { slot: 12, sat: "empty", sun: "empty" },
            { slot: 13, sat: "empty", sun: "empty" },
            { slot: 14, sat: "empty", sun: "empty" },
            { slot: 15, sat: "empty", sun: "empty" },
            { slot: 16, sat: "empty", sun: "empty" },
            { slot: 17, sat: "empty", sun: "empty" },
            { slot: 18, sat: "empty", sun: "empty" },
            { slot: 19, sat: "empty", sun: "empty" },
            { slot: 20, sat: "empty", sun: "empty" }
        ]
    },

    // 2. Umar Zada (104259) - عادي - الفترة الثانية (11 إلى 20)
    {
        id: "104259",
        name: "Umar Zada Muhammad",
        shortName: "Umar Zada",
        category: "LMFM",
        vehicleType: "خفيفة (LM)",
        shift: "S2",
        shiftName: "الفترة الثانية (11 - 20)",
        shiftCode: "LMFM-S2",
        capacity: 40,
        occupied: 10,
        empty: 30,
        rate: 25.0,
        minSlot: 1,
        maxSlot: 20,
        note: "",
        reportPage: 1,
        slotsRows: [
            { slotDisplay: "1 إلى 10", sat: "خالية", sun: "خالية" },
            { slotDisplay: "12", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "13", sat: "خالية", sun: "خالية" },
            { slotDisplay: "16", sat: "خالية", sun: "خالية" },
            { slotDisplay: "17", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "18", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "19", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "20", sat: "خالية", sun: "خالية" }
        ],
        fullSchedule: [
            { slot: 1, sat: "empty", sun: "empty" },
            { slot: 2, sat: "empty", sun: "empty" },
            { slot: 3, sat: "empty", sun: "empty" },
            { slot: 4, sat: "empty", sun: "empty" },
            { slot: 5, sat: "empty", sun: "empty" },
            { slot: 6, sat: "empty", sun: "empty" },
            { slot: 7, sat: "empty", sun: "empty" },
            { slot: 8, sat: "empty", sun: "empty" },
            { slot: 9, sat: "empty", sun: "empty" },
            { slot: 10, sat: "empty", sun: "empty" },
            { slot: 11, sat: "occupied", sun: "occupied" },
            { slot: 12, sat: "empty", sun: "occupied" },
            { slot: 13, sat: "empty", sun: "empty" },
            { slot: 14, sat: "occupied", sun: "occupied" },
            { slot: 15, sat: "occupied", sun: "occupied" },
            { slot: 16, sat: "empty", sun: "empty" },
            { slot: 17, sat: "occupied", sun: "empty" },
            { slot: 18, sat: "empty", sun: "occupied" },
            { slot: 19, sat: "empty", sun: "occupied" },
            { slot: 20, sat: "empty", sun: "empty" }
        ]
    },

    // 3. Loai Awad (105382) - أوتوماتيك - الفترة الثانية (11 إلى 20)
    {
        id: "105382",
        name: "Loai Awad Mohamed Sidahmed",
        shortName: "Loai Awad",
        category: "LMFA",
        vehicleType: "خفيفة (LM)",
        shift: "S2",
        shiftName: "الفترة الثانية (11 - 20)",
        shiftCode: "LMFA-S2",
        capacity: 40,
        occupied: 8,
        empty: 32,
        rate: 20.0,
        minSlot: 1,
        maxSlot: 20,
        note: "ملاحظة: يتضمن حصص مزدوجة",
        reportPage: 2,
        slotsRows: [
            { slotDisplay: "1 إلى 10", sat: "خالية", sun: "خالية" },
            { slotDisplay: "11", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "12", sat: "خالية", sun: "خالية" },
            { slotDisplay: "14", sat: "خالية", sun: "خالية" },
            { slotDisplay: "15", sat: "خالية", sun: "خالية" },
            { slotDisplay: "16", sat: "خالية", sun: "خالية" },
            { slotDisplay: "17", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "20", sat: "خالية", sun: "خالية" }
        ],
        fullSchedule: [
            { slot: 1, sat: "empty", sun: "empty" },
            { slot: 2, sat: "empty", sun: "empty" },
            { slot: 3, sat: "empty", sun: "empty" },
            { slot: 4, sat: "empty", sun: "empty" },
            { slot: 5, sat: "empty", sun: "empty" },
            { slot: 6, sat: "empty", sun: "empty" },
            { slot: 7, sat: "empty", sun: "empty" },
            { slot: 8, sat: "empty", sun: "empty" },
            { slot: 9, sat: "empty", sun: "empty" },
            { slot: 10, sat: "empty", sun: "empty" },
            { slot: 11, sat: "empty", sun: "occupied" },
            { slot: 12, sat: "empty", sun: "empty" },
            { slot: 13, sat: "occupied", sun: "occupied" },
            { slot: 14, sat: "empty", sun: "empty" },
            { slot: 15, sat: "empty", sun: "empty" },
            { slot: 16, sat: "empty", sun: "empty" },
            { slot: 17, sat: "occupied", sun: "empty" },
            { slot: 18, sat: "occupied", sun: "occupied" },
            { slot: 19, sat: "occupied", sun: "occupied" },
            { slot: 20, sat: "empty", sun: "empty" }
        ]
    },

    // 4. Mohammed Yasime (106286) - عادي - الفترة الثانية (11 إلى 20)
    {
        id: "106286",
        name: "Mohammed Yasime Kunnathiyil",
        shortName: "Mohammed Yasime",
        category: "LMFM",
        vehicleType: "خفيفة (LM)",
        shift: "S2",
        shiftName: "الفترة الثانية (11 - 20)",
        shiftCode: "LMFM-S2",
        capacity: 40,
        occupied: 16,
        empty: 24,
        rate: 40.0,
        minSlot: 1,
        maxSlot: 20,
        note: "",
        reportPage: 2,
        slotsRows: [
            { slotDisplay: "1 إلى 10", sat: "خالية", sun: "خالية" },
            { slotDisplay: "13", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "14", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "19", sat: "خالية", sun: "خالية" }
        ],
        fullSchedule: [
            { slot: 1, sat: "empty", sun: "empty" },
            { slot: 2, sat: "empty", sun: "empty" },
            { slot: 3, sat: "empty", sun: "empty" },
            { slot: 4, sat: "empty", sun: "empty" },
            { slot: 5, sat: "empty", sun: "empty" },
            { slot: 6, sat: "empty", sun: "empty" },
            { slot: 7, sat: "empty", sun: "empty" },
            { slot: 8, sat: "empty", sun: "empty" },
            { slot: 9, sat: "empty", sun: "empty" },
            { slot: 10, sat: "empty", sun: "empty" },
            { slot: 11, sat: "occupied", sun: "occupied" },
            { slot: 12, sat: "occupied", sun: "occupied" },
            { slot: 13, sat: "empty", sun: "occupied" },
            { slot: 14, sat: "occupied", sun: "empty" },
            { slot: 15, sat: "occupied", sun: "occupied" },
            { slot: 16, sat: "occupied", sun: "occupied" },
            { slot: 17, sat: "occupied", sun: "occupied" },
            { slot: 18, sat: "occupied", sun: "occupied" },
            { slot: 19, sat: "empty", sun: "empty" },
            { slot: 20, sat: "occupied", sun: "occupied" }
        ]
    },

    // 5. MUHAMMAD NASER (180105) - أوتوماتيك - الفترة الأولى (1 إلى 10)
    {
        id: "180105",
        name: "MUHAMMAD NASER SANAULLAH KHAN",
        shortName: "Muhammad Naser",
        category: "LMFA",
        vehicleType: "خفيفة (LM)",
        shift: "S1",
        shiftName: "الفترة الأولى (1 - 10)",
        shiftCode: "LMFA-S1",
        capacity: 40,
        occupied: 15,
        empty: 25,
        rate: 37.5,
        minSlot: 1,
        maxSlot: 20,
        note: "",
        reportPage: 3,
        slotsRows: [
            { slotDisplay: "5", sat: "خالية", sun: "خالية" },
            { slotDisplay: "6", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "10 إلى 20", sat: "خالية", sun: "خالية" }
        ],
        fullSchedule: [
            { slot: 1, sat: "occupied", sun: "occupied" },
            { slot: 2, sat: "occupied", sun: "occupied" },
            { slot: 3, sat: "occupied", sun: "occupied" },
            { slot: 4, sat: "occupied", sun: "occupied" },
            { slot: 5, sat: "empty", sun: "empty" },
            { slot: 6, sat: "empty", sun: "occupied" },
            { slot: 7, sat: "occupied", sun: "occupied" },
            { slot: 8, sat: "occupied", sun: "occupied" },
            { slot: 9, sat: "occupied", sun: "occupied" },
            { slot: 10, sat: "empty", sun: "empty" },
            { slot: 11, sat: "empty", sun: "empty" },
            { slot: 12, sat: "empty", sun: "empty" },
            { slot: 13, sat: "empty", sun: "empty" },
            { slot: 14, sat: "empty", sun: "empty" },
            { slot: 15, sat: "empty", sun: "empty" },
            { slot: 16, sat: "empty", sun: "empty" },
            { slot: 17, sat: "empty", sun: "empty" },
            { slot: 18, sat: "empty", sun: "empty" },
            { slot: 19, sat: "empty", sun: "empty" },
            { slot: 20, sat: "empty", sun: "empty" }
        ]
    },

    // 6. ABDUL LATHEEF (190209) - عادي - الفترة الأولى (1 إلى 10)
    {
        id: "190209",
        name: "ABDUL LATHEEF THRIKKANDIYOORIL",
        shortName: "Abdul Latheef",
        category: "LMFM",
        vehicleType: "خفيفة (LM)",
        shift: "S1",
        shiftName: "الفترة الأولى (1 - 10)",
        shiftCode: "LMFM-S1",
        capacity: 40,
        occupied: 17,
        empty: 23,
        rate: 42.5,
        minSlot: 1,
        maxSlot: 20,
        note: "",
        reportPage: 3,
        slotsRows: [
            { slotDisplay: "2", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "7", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "9", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "11 إلى 20", sat: "خالية", sun: "خالية" }
        ],
        fullSchedule: [
            { slot: 1, sat: "occupied", sun: "occupied" },
            { slot: 2, sat: "occupied", sun: "empty" },
            { slot: 3, sat: "occupied", sun: "occupied" },
            { slot: 4, sat: "occupied", sun: "occupied" },
            { slot: 5, sat: "occupied", sun: "occupied" },
            { slot: 6, sat: "occupied", sun: "occupied" },
            { slot: 7, sat: "empty", sun: "occupied" },
            { slot: 8, sat: "occupied", sun: "occupied" },
            { slot: 9, sat: "occupied", sun: "empty" },
            { slot: 10, sat: "occupied", sun: "occupied" },
            { slot: 11, sat: "empty", sun: "empty" },
            { slot: 12, sat: "empty", sun: "empty" },
            { slot: 13, sat: "empty", sun: "empty" },
            { slot: 14, sat: "empty", sun: "empty" },
            { slot: 15, sat: "empty", sun: "empty" },
            { slot: 16, sat: "empty", sun: "empty" },
            { slot: 17, sat: "empty", sun: "empty" },
            { slot: 18, sat: "empty", sun: "empty" },
            { slot: 19, sat: "empty", sun: "empty" },
            { slot: 20, sat: "empty", sun: "empty" }
        ]
    },

    // 7. SAIDALAVI PATHAYA (200260) - أوتوماتيك - الفترة الثانية (11 إلى 20)
    {
        id: "200260",
        name: "SAIDALAVI PATHAYA PURAKKAL",
        shortName: "Saidalavi Pathaya",
        category: "LMFA",
        vehicleType: "خفيفة (LM)",
        shift: "S2",
        shiftName: "الفترة الثانية (11 - 20)",
        shiftCode: "LMFA-S2",
        capacity: 40,
        occupied: 16,
        empty: 24,
        rate: 40.0,
        minSlot: 1,
        maxSlot: 20,
        note: "",
        reportPage: 4,
        slotsRows: [
            { slotDisplay: "1 إلى 10", sat: "خالية", sun: "خالية" },
            { slotDisplay: "12", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "14", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "17", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "20", sat: "خالية", sun: "خالية" }
        ],
        fullSchedule: [
            { slot: 1, sat: "empty", sun: "empty" },
            { slot: 2, sat: "empty", sun: "empty" },
            { slot: 3, sat: "empty", sun: "empty" },
            { slot: 4, sat: "empty", sun: "empty" },
            { slot: 5, sat: "empty", sun: "empty" },
            { slot: 6, sat: "empty", sun: "empty" },
            { slot: 7, sat: "empty", sun: "empty" },
            { slot: 8, sat: "empty", sun: "empty" },
            { slot: 9, sat: "empty", sun: "empty" },
            { slot: 10, sat: "empty", sun: "empty" },
            { slot: 11, sat: "occupied", sun: "occupied" },
            { slot: 12, sat: "occupied", sun: "occupied" },
            { slot: 13, sat: "occupied", sun: "occupied" },
            { slot: 14, sat: "occupied", sun: "empty" },
            { slot: 15, sat: "occupied", sun: "occupied" },
            { slot: 16, sat: "occupied", sun: "occupied" },
            { slot: 17, sat: "occupied", sun: "empty" },
            { slot: 18, sat: "occupied", sun: "occupied" },
            { slot: 19, sat: "occupied", sun: "occupied" },
            { slot: 20, sat: "empty", sun: "empty" }
        ]
    },

    // 8. SULIMAN ALMAHDI (200291) - أوتوماتيك - الفترة الأولى (1 إلى 10)
    {
        id: "200291",
        name: "SULIMAN ALMAHDI ALFAKI",
        shortName: "Suliman Almahdi",
        category: "LMFA",
        vehicleType: "خفيفة (LM)",
        shift: "S1",
        shiftName: "الفترة الأولى (1 - 10)",
        shiftCode: "LMFA-S1",
        capacity: 40,
        occupied: 11,
        empty: 29,
        rate: 27.5,
        minSlot: 1,
        maxSlot: 20,
        note: "ملاحظة: يتضمن حصص مزدوجة",
        reportPage: 4,
        slotsRows: [
            { slotDisplay: "4", sat: "خالية", sun: "خالية" },
            { slotDisplay: "5", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "6", sat: "خالية", sun: "خالية" },
            { slotDisplay: "8", sat: "خالية", sun: "خالية" },
            { slotDisplay: "10 إلى 20", sat: "خالية", sun: "خالية" }
        ],
        fullSchedule: [
            { slot: 1, sat: "occupied", sun: "occupied" },
            { slot: 2, sat: "occupied", sun: "occupied" },
            { slot: 3, sat: "occupied", sun: "occupied" },
            { slot: 4, sat: "empty", sun: "empty" },
            { slot: 5, sat: "empty", sun: "occupied" },
            { slot: 6, sat: "empty", sun: "empty" },
            { slot: 7, sat: "occupied", sun: "occupied" },
            { slot: 8, sat: "empty", sun: "empty" },
            { slot: 9, sat: "occupied", sun: "occupied" },
            { slot: 10, sat: "empty", sun: "empty" },
            { slot: 11, sat: "empty", sun: "empty" },
            { slot: 12, sat: "empty", sun: "empty" },
            { slot: 13, sat: "empty", sun: "empty" },
            { slot: 14, sat: "empty", sun: "empty" },
            { slot: 15, sat: "empty", sun: "empty" },
            { slot: 16, sat: "empty", sun: "empty" },
            { slot: 17, sat: "empty", sun: "empty" },
            { slot: 18, sat: "empty", sun: "empty" },
            { slot: 19, sat: "empty", sun: "empty" },
            { slot: 20, sat: "empty", sun: "empty" }
        ]
    },

    // 9. UMMER KUNNAKKATTU (200299) - دراجة نارية - فترة ثابتة (6 إلى 17)
    {
        id: "200299",
        name: "UMMER KUNNAKKATTU THODI",
        shortName: "Ummer Kunnakkattu",
        category: "MC",
        vehicleType: "دراجة نارية (MC)",
        shift: "FIX",
        shiftName: "فترة ثابتة (6 - 17)",
        shiftCode: "MC-FIX",
        capacity: 24,
        occupied: 15,
        empty: 9,
        rate: 62.5,
        minSlot: 6,
        maxSlot: 17,
        note: "",
        reportPage: 5,
        slotsRows: [
            { slotDisplay: "7", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "8", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "9", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "10", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "11", sat: "خالية", sun: "مشغولة" },
            { slotDisplay: "13", sat: "مشغولة", sun: "خالية" },
            { slotDisplay: "14", sat: "خالية", sun: "خالية" },
            { slotDisplay: "16", sat: "خالية", sun: "مشغولة" }
        ],
        fullSchedule: [
            { slot: 6, sat: "occupied", sun: "occupied" },
            { slot: 7, sat: "empty", sun: "occupied" },
            { slot: 8, sat: "occupied", sun: "empty" },
            { slot: 9, sat: "occupied", sun: "empty" },
            { slot: 10, sat: "empty", sun: "occupied" },
            { slot: 11, sat: "empty", sun: "occupied" },
            { slot: 12, sat: "occupied", sun: "occupied" },
            { slot: 13, sat: "occupied", sun: "empty" },
            { slot: 14, sat: "empty", sun: "empty" },
            { slot: 15, sat: "occupied", sun: "occupied" },
            { slot: 16, sat: "empty", sun: "occupied" },
            { slot: 17, sat: "occupied", sun: "occupied" }
        ]
    },
    // 10. Muhammad Junaid Taj Parwar (102463) - أوتوماتيك - الفترة الثانية (11 إلى 20)
    {
        id: "102463",
        name: "Muhammad Junaid Taj Parwar",
        shortName: "Muhammad Junaid",
        category: "LMFA",
        vehicleType: "خفيفة (LM)",
        shift: "S2",
        shiftName: "الفترة الثانية (11 - 20)",
        shiftCode: "LMFA-S2",
        capacity: 20,
        occupied: 12,
        empty: 8,
        rate: 60.0,
        minSlot: 11,
        maxSlot: 20,
        note: "",
        reportPage: 5,
        slotsRows: [
            { slotDisplay: "12", sat: "خالية", sun: "خالية" },
            { slotDisplay: "14", sat: "خالية", sun: "خالية" },
            { slotDisplay: "16", sat: "خالية", sun: "خالية" },
            { slotDisplay: "18", sat: "خالية", sun: "خالية" }
        ],
        fullSchedule: [
            { slot: 11, sat: "occupied", sun: "occupied" },
            { slot: 12, sat: "empty",    sun: "empty" },
            { slot: 13, sat: "occupied", sun: "occupied" },
            { slot: 14, sat: "empty",    sun: "empty" },
            { slot: 15, sat: "occupied", sun: "occupied" },
            { slot: 16, sat: "empty",    sun: "empty" },
            { slot: 17, sat: "occupied", sun: "occupied" },
            { slot: 18, sat: "empty",    sun: "empty" },
            { slot: 19, sat: "occupied", sun: "occupied" },
            { slot: 20, sat: "occupied", sun: "occupied" }
        ]
    },
    // 11. Faizal Nisham Palakkal (105528) - عادي - الفترة الثانية (11 إلى 20)
    {
        id: "105528",
        name: "Faizal Nisham Palakkal",
        shortName: "Faizal Nisham",
        category: "LMFM",
        vehicleType: "خفيفة (LM)",
        shift: "S2",
        shiftName: "الفترة الثانية (11 - 20)",
        shiftCode: "LMFM-S2",
        capacity: 20,
        occupied: 12,
        empty: 8,
        rate: 60.0,
        minSlot: 11,
        maxSlot: 20,
        note: "",
        reportPage: 6,
        slotsRows: [
            { slotDisplay: "13", sat: "خالية", sun: "خالية" },
            { slotDisplay: "15", sat: "خالية", sun: "خالية" },
            { slotDisplay: "17", sat: "خالية", sun: "خالية" },
            { slotDisplay: "20", sat: "خالية", sun: "خالية" }
        ],
        fullSchedule: [
            { slot: 11, sat: "occupied", sun: "occupied" },
            { slot: 12, sat: "occupied", sun: "occupied" },
            { slot: 13, sat: "empty",    sun: "empty" },
            { slot: 14, sat: "occupied", sun: "occupied" },
            { slot: 15, sat: "empty",    sun: "empty" },
            { slot: 16, sat: "occupied", sun: "occupied" },
            { slot: 17, sat: "empty",    sun: "empty" },
            { slot: 18, sat: "occupied", sun: "occupied" },
            { slot: 19, sat: "occupied", sun: "occupied" },
            { slot: 20, sat: "empty",    sun: "empty" }
        ]
    },
    // 12. Ahmed Mohamed Ahmed Ali (106284) - أوتوماتيك - الفترة الثانية (11 إلى 20)
    {
        id: "106284",
        name: "Ahmed Mohamed Ahmed Ali",
        shortName: "Ahmed Mohamed",
        category: "LMFA",
        vehicleType: "خفيفة (LM)",
        shift: "S2",
        shiftName: "الفترة الثانية (11 - 20)",
        shiftCode: "LMFA-S2",
        capacity: 20,
        occupied: 14,
        empty: 6,
        rate: 70.0,
        minSlot: 11,
        maxSlot: 20,
        note: "",
        reportPage: 6,
        slotsRows: [
            { slotDisplay: "12", sat: "خالية", sun: "خالية" },
            { slotDisplay: "15", sat: "خالية", sun: "خالية" },
            { slotDisplay: "17", sat: "خالية", sun: "خالية" }
        ],
        fullSchedule: [
            { slot: 11, sat: "occupied", sun: "occupied" },
            { slot: 12, sat: "empty",    sun: "empty" },
            { slot: 13, sat: "occupied", sun: "occupied" },
            { slot: 14, sat: "occupied", sun: "occupied" },
            { slot: 15, sat: "empty",    sun: "empty" },
            { slot: 16, sat: "occupied", sun: "occupied" },
            { slot: 17, sat: "empty",    sun: "empty" },
            { slot: 18, sat: "occupied", sun: "occupied" },
            { slot: 19, sat: "occupied", sun: "occupied" },
            { slot: 20, sat: "occupied", sun: "occupied" }
        ]
    },
    // 13. Mohammed Aref Ahmed Omar (200283) - أوتوماتيك - الفترة الأولى (1 إلى 10)
    {
        id: "200283",
        name: "Mohammed Aref Ahmed Omar",
        shortName: "Mohammed Aref",
        category: "LMFA",
        vehicleType: "خفيفة (LM)",
        shift: "S1",
        shiftName: "الفترة الأولى (1 - 10)",
        shiftCode: "LMFA-S1",
        capacity: 20,
        occupied: 16,
        empty: 4,
        rate: 80.0,
        minSlot: 1,
        maxSlot: 10,
        note: "",
        reportPage: 7,
        slotsRows: [
            { slotDisplay: "6", sat: "خالية", sun: "خالية" },
            { slotDisplay: "9", sat: "خالية", sun: "خالية" }
        ],
        fullSchedule: [
            { slot: 1,  sat: "occupied", sun: "occupied" },
            { slot: 2,  sat: "occupied", sun: "occupied" },
            { slot: 3,  sat: "occupied", sun: "occupied" },
            { slot: 4,  sat: "occupied", sun: "occupied" },
            { slot: 5,  sat: "occupied", sun: "occupied" },
            { slot: 6,  sat: "empty",    sun: "empty" },
            { slot: 7,  sat: "occupied", sun: "occupied" },
            { slot: 8,  sat: "occupied", sun: "occupied" },
            { slot: 9,  sat: "empty",    sun: "empty" },
            { slot: 10, sat: "occupied", sun: "occupied" }
        ]
    }
];

if (typeof window !== 'undefined') {
    window.LM_TIME_SLOTS = LM_TIME_SLOTS;
    window.HT_TIME_SLOTS = HT_TIME_SLOTS;
    window.MC_TIME_SLOTS = MC_TIME_SLOTS;
    window.SDI_CATEGORIES = SDI_CATEGORIES;
    window.OFFICIAL_INSTRUCTORS = OFFICIAL_INSTRUCTORS;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LM_TIME_SLOTS, HT_TIME_SLOTS, MC_TIME_SLOTS, SDI_CATEGORIES, OFFICIAL_INSTRUCTORS };
}
