/**
 * بيانات خطة اليوم الرسمية المعتمدة المستخرجة من ملف Instructor Day Plan
 * معهد الشارقة للسياقة (Sharjah Driving Institute - SDI)
 * التاريخ: 11/10/2026
 * 
 * المطور: م/ محمود محمد
 */

const DEFAULT_DAY_PLAN_DATA = {
    fileName: "Instructor Day Plan.pdf (الملف الرسمي المعتمد)",
    date: "11/10/2026",
    instructors: [
        // 1. Muhammad Junaid Taj Parwar (102463) - الفترة المسائية S2
        {
            instructorId: "102463",
            instructorName: "Muhammad Junaid Taj Parwar",
            shortName: "Muhammad Junaid",
            supervisorId: "AHMEDU",
            date: "11/10/2026",
            yardCount: 2,
            roadCount: 8,
            doubleCount: 0,
            sessions: [
                { slot: 11, time: "13:45", studentName: "ABDUR RAHMAN NUR NABI", studentId: "26870830", course: "LMFA30R", location: "Y", isDouble: false, classType: "R" },
                { slot: 12, time: "14:25", studentName: "SAEED MOHAMMED SAEED MU", studentId: "26598430", course: "LMFA10R", location: "R", isDouble: false, classType: "R" },
                { slot: 13, time: "15:05", studentName: "ABDEL RAHMAN AZZAM A AB", studentId: "26198024", course: "LMFA30R", location: "R", isDouble: false, classType: "R" },
                { slot: 14, time: "16:00", studentName: "MD KAMRUL HASAN MD ABDU", studentId: "26617703", course: "LMFA30R", location: "R", isDouble: false, classType: "R" },
                { slot: 15, time: "16:40", studentName: "ABDEL RAHMAN AZZAM A AB", studentId: "26198024", course: "LMFA30R", location: "R", isDouble: false, classType: "R" },
                { slot: 16, time: "17:20", studentName: "SANJEEV KUMAR INDER DEV", studentId: "26102021", course: "LMFA30R", location: "R", isDouble: false, classType: "R" },
                { slot: 17, time: "18:15", studentName: "SHAZALAL LAHU SHARIF", studentId: "26587328", course: "LMFA30R", location: "R", isDouble: false, classType: "R" },
                { slot: 18, time: "18:55", studentName: "ABDUS SAMAD HAYDAR AL", studentId: "26906207", course: "LMFA10R", location: "R", isDouble: false, classType: "R" },
                { slot: 19, time: "19:35", studentName: "AMAL NAGARAJAN SREELATH", studentId: "26393764", course: "LMFA10R", location: "R", isDouble: false, classType: "R" },
                { slot: 20, time: "20:15", studentName: "MUHAMMAD UZAIR IQBAL SA", studentId: "26467957", course: "LMFA15R", location: "Y", isDouble: false, classType: "R" }
            ]
        },

        // 2. Faizal Nisham Palakkal (105528) - الفترة المسائية S2
        {
            instructorId: "105528",
            instructorName: "Faizal Nisham Palakkal",
            shortName: "Faizal Nisham",
            supervisorId: "AHMEDU",
            date: "11/10/2026",
            yardCount: 3,
            roadCount: 7,
            doubleCount: 0,
            sessions: [
                { slot: 11, time: "13:45", studentName: "ABUBAKIR SULTAN NESRO", studentId: "26271708", course: "LMFM30R", location: "R", isDouble: false, classType: "R" },
                { slot: 12, time: "14:25", studentName: "MUHAMMAD QASIM SARDAR", studentId: "26415506", course: "LMFM30R", location: "Y", isDouble: false, classType: "R" },
                { slot: 13, time: "15:05", studentName: "PRANAV DIVAKARAN PARAMB", studentId: "26642510", course: "LMFM30R", location: "R", isDouble: false, classType: "R" },
                { slot: 14, time: "16:00", studentName: "AHAMED IRSHAD KOTTILING", studentId: "26558152", course: "LMFM30R", location: "R", isDouble: false, classType: "R" },
                { slot: 15, time: "16:40", studentName: "HASSAN HUSSEIN AHMED HU", studentId: "26910120", course: "LMFM30R", location: "R", isDouble: false, classType: "R" },
                { slot: 16, time: "17:20", studentName: "JUMA KABIRA", studentId: "26415256", course: "LMFM30R", location: "Y", isDouble: false, classType: "R" },
                { slot: 17, time: "18:15", studentName: "MAIDEEN SHAH AMANULLA S", studentId: "26707863", course: "LMFM05R", location: "R", isDouble: false, classType: "R" },
                { slot: 18, time: "18:55", studentName: "RAHUL KOZHIKKARA GANGA", studentId: "26203730", course: "LMFM30R", location: "R", isDouble: false, classType: "R" },
                { slot: 19, time: "19:35", studentName: "ATHUL ANILKUMAR SINDHU", studentId: "26568881", course: "LMFM30R", location: "Y", isDouble: false, classType: "R" },
                { slot: 20, time: "20:15", studentName: "MD SIFUL ISLAM MD ABDUL", studentId: "26889640", course: "LMFM30R", location: "R", isDouble: false, classType: "R" }
            ]
        },

        // 3. Ahmed Mohamed Ahmed Ali (106284) - الفترة المسائية S2 (حصص مجدولة وحصص فارغة)
        {
            instructorId: "106284",
            instructorName: "Ahmed Mohamed Ahmed Ali",
            shortName: "Ahmed Mohamed",
            supervisorId: "AHMEDU",
            date: "11/10/2026",
            yardCount: 4,
            roadCount: 4,
            doubleCount: 2,
            sessions: [
                { slot: 11, time: "13:45", studentName: "JASSIM HUSSAIN MOHAMMAD", studentId: "26777211", course: "LMFA10D", location: "R", isDouble: true, classType: "D", isDoublePart1: true, isDoublePart2: false },
                { slot: 12, time: "14:25", studentName: "(حصة مزدوجة تابعة) JASSIM HUSSAIN MOHAMMAD", studentId: "26777211", course: "LMFA10D", location: "R", isDouble: true, classType: "D", isDoublePart1: false, isDoublePart2: true, parentSlot: 11 },
                { slot: 13, time: "15:05", studentName: "RASHED OSMAN ALI OSMA", studentId: "26273660", course: "LMFA30R", location: "R", isDouble: false, classType: "R" },
                { slot: 14, time: "16:00", studentName: "MOHAMMED KHALID MOHAMME", studentId: "26435675", course: "LMFA10R", location: "R", isDouble: false, classType: "R" },
                { slot: 16, time: "17:20", studentName: "OMAR EISA ABDULLA AHMED", studentId: "26488481", course: "LMFA10R", location: "Y", isDouble: false, classType: "R" },
                { slot: 18, time: "18:55", studentName: "AMRO MAZIN NADER MANSO", studentId: "26238982", course: "LMFA30R", location: "Y", isDouble: false, classType: "R" },
                { slot: 19, time: "19:35", studentName: "ALI MOHAMED ALI MOHAMED", studentId: "25714400", course: "LMFA10R", location: "Y", isDouble: false, classType: "R" },
                { slot: 20, time: "20:15", studentName: "HAMDAN KHALED ALI AHMED", studentId: "26428704", course: "LMFA10R", location: "Y", isDouble: false, classType: "R" }
            ]
        },

        // 4. Mohammed Aref Ahmed Omar (200283) - الفترة الصباحية S1
        {
            instructorId: "200283",
            instructorName: "Mohammed Aref Ahmed Omar",
            shortName: "Mohammed Aref",
            supervisorId: "AHMEDU",
            date: "11/10/2026",
            yardCount: 2,
            roadCount: 8,
            doubleCount: 0,
            sessions: [
                { slot: 1,  time: "06:20", studentName: "MUHAMMAD ADNAN NAZIR M", studentId: "26235588", course: "LMFA30R", location: "R", isDouble: false, classType: "R" },
                { slot: 2,  time: "07:00", studentName: "DIDARUL ISLAM NURUSSA", studentId: "26854118", course: "LMFA30R", location: "R", isDouble: false, classType: "R" },
                { slot: 3,  time: "07:40", studentName: "ANAS AHMED MOHAMED AB", studentId: "26861893", course: "LMFA30R", location: "R", isDouble: false, classType: "R" },
                { slot: 4,  time: "08:20", studentName: "MOHAMMED HASHIQUE KOTTI", studentId: "26451531", course: "LMFA30R", location: "R", isDouble: false, classType: "R" },
                { slot: 5,  time: "09:15", studentName: "FAHAD ALI GHARIB AZIZ A", studentId: "26155316", course: "LMFA10R", location: "Y", isDouble: false, classType: "R" },
                { slot: 6,  time: "09:55", studentName: "MAHAMMED KAIF ALI SAB G", studentId: "26453346", course: "LMFA30R", location: "R", isDouble: false, classType: "R" },
                { slot: 7,  time: "10:35", studentName: "OMAR MOAHANNAD AL TOOB", studentId: "26524900", course: "LMFA30R", location: "R", isDouble: false, classType: "R" },
                { slot: 8,  time: "11:30", studentName: "AFROJ ANSARI MUSTFA H", studentId: "26700999", course: "LMFA30R", location: "Y", isDouble: false, classType: "R" },
                { slot: 9,  time: "12:10", studentName: "OBAID RASHED ALI KHALFA", studentId: "26985190", course: "LMFA10R", location: "R", isDouble: false, classType: "R" },
                { slot: 10, time: "12:50", studentName: "MOHAMED AHMED ABDELRAHM", studentId: "26659800", course: "LMFA05R", location: "R", isDouble: false, classType: "R" }
            ]
        },

        // 5. UMMER KUNNAKKATTU THODI (200299) - دراجة نارية MC - فترة ثابتة (6 إلى 17)
        {
            instructorId: "200299",
            instructorName: "UMMER KUNNAKKATTU THODI",
            shortName: "Ummer Kunnakkattu",
            supervisorId: "AHMEDU",
            date: "11/10/2026",
            yardCount: 3,
            roadCount: 2,
            doubleCount: 0,
            sessions: [
                { slot: 6,  time: "09:15", studentName: "MOHAMMED IRFAN NAZIR", studentId: "26880011", course: "MCFM15R", location: "Y", isDouble: false, classType: "R" },
                { slot: 7,  time: "09:45", studentName: "ABDUL RAHIM ALI", studentId: "26771122", course: "MCFM15R", location: "R", isDouble: false, classType: "R" },
                // الحصة 8: دمج طالبين في ساحة الدراجة النارية Y (مسموح ومعتمد وفق لائحة المعهد)
                { 
                    slot: 8,  
                    time: "10:15", 
                    studentName: "SALMAN FARIS K", 
                    studentId: "26992233", 
                    course: "MCFM15R", 
                    location: "Y", 
                    isDouble: false, 
                    classType: "R",
                    hasDualStudents: true,
                    student2Name: "MOHAMMED RASHID",
                    student2Id: "26993344",
                    student2Course: "MCFM15R"
                },
                { slot: 9,  time: "10:45", studentName: "FAHAD SULTAN OMAR", studentId: "26554433", course: "MCFM15R", location: "R", isDouble: false, classType: "R" },
                { slot: 10, time: "11:30", studentName: "KHALID MAHMOUD HASSAN", studentId: "26443322", course: "MCFM15R", location: "Y", isDouble: false, classType: "R" }
            ]
        }
    ],
    stats: {
        totalInstructors: 5,
        totalSessions: 43,
        yardSessions: 14,
        roadSessions: 29,
        doubleSessions: 2,
        regularSessions: 41,
        yardPercentage: "32.6",
        roadRate: "67.4"
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DEFAULT_DAY_PLAN_DATA };
}
