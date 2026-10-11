const fs = require('fs');

// Mock browser objects
global.window = {};
global.document = {
    getElementById: () => null,
    documentElement: { lang: 'ar', dir: 'rtl' },
    querySelectorAll: () => []
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

// Load modules
const { SDIDayPlanParser } = require('../js/dayPlanParser.js');
const { SDIComparisonEngine } = require('../js/comparisonEngine.js');

console.log('--- TEST 1: finalizeDayPlan with continuation and empty page ---');
const simulatedPlans = [
    {
        instructorId: '300100',
        instructorName: 'Rooh Ullah Noor',
        shortName: 'Rooh Ullah',
        sessions: [
            { slot: 13, time: '13:00', studentName: 'Student A', location: 'R', course: 'HTFM20R' },
            { slot: 14, time: '13:30', studentName: 'Student B', location: 'R', course: 'HTFM20R' }
        ]
    }
];

// Suppose page 2 merged slot 23 and 24:
simulatedPlans[0].sessions.push(
    { slot: 23, time: '19:30', studentName: 'Student C', location: 'R', course: 'HTFM20R' },
    { slot: 24, time: '20:00', studentName: 'Student D', location: 'R', course: 'HTFM20R' }
);

const finalized = SDIDayPlanParser.finalizeDayPlan(simulatedPlans, 'DayPlan_Test.pdf');
console.log('Total instructors parsed:', finalized.instructors.length);
console.log('Instructor 1:', finalized.instructors[0].instructorName, 'Sessions:', finalized.instructors[0].sessions.length);
console.log('Slots:', finalized.instructors[0].sessions.map(s => s.slot).join(', '));
if (finalized.instructors.length === 1 && finalized.instructors[0].sessions.length === 4) {
    console.log('✅ TEST 1 PASSED: Multi-page continuation merged successfully, 0 ghost instructors!');
} else {
    console.error('❌ TEST 1 FAILED!');
}

console.log('\n--- TEST 2: Ghost filtration in finalizeDayPlan ---');
try {
    const plansWithGhosts = [
        {
            instructorId: 'INST_2',
            instructorName: 'مدرب undefined',
            sessions: [{ slot: 23 }]
        },
        {
            instructorId: '102671',
            instructorName: 'Maqsood Ali',
            sessions: [{ slot: 1 }]
        }
    ];
    const cleanFinalized = SDIDayPlanParser.finalizeDayPlan(plansWithGhosts, 'Test.pdf');
    console.log('Cleaned count:', cleanFinalized.instructors.length);
    console.log('Cleaned instructor:', cleanFinalized.instructors[0].instructorName);
    if (cleanFinalized.instructors.length === 1 && cleanFinalized.instructors[0].instructorId === '102671') {
        console.log('✅ TEST 2 PASSED: Ghost INST_2 successfully purged!');
    } else {
        console.error('❌ TEST 2 FAILED');
    }
} catch (e) {
    console.error('Test 2 error:', e);
}

console.log('\n--- TEST 3: Comparison with Supervisor Rules ---');
const availabilityInstructors = [
    {
        id: '102671',
        name: 'Maqsood Ali',
        category: 'LMFM',
        shift: 'S1',
        minSlot: 1,
        maxSlot: 10,
        fullSchedule: [
            { slot: 1, sat: 'occupied', sun: 'empty' },
            { slot: 2, sat: 'empty', sun: 'empty' }
        ]
    },
    {
        id: '990011',
        name: 'Supervisor Ahmed',
        isSupervisor: true,
        shift: 'SUP',
        category: 'LMFA',
        fullSchedule: [
            { slot: 11, sat: 'occupied', sun: 'empty' },
            { slot: 15, sat: 'occupied', sun: 'empty' }
        ]
    }
];

const dayPlanData = {
    fileName: 'DayPlan.pdf',
    date: '11/10/2026',
    instructors: [
        {
            instructorId: '990011',
            instructorName: 'Supervisor Ahmed',
            sessions: [
                { slot: 11, time: '13:45', location: 'R', course: 'LMFA30R' },
                { slot: 15, time: '16:25', location: 'R', course: 'LMFA30R' }
            ]
        },
        {
            instructorId: 'GHOST_999',
            instructorName: 'Unregistered Ghost',
            sessions: [{ slot: 5 }]
        }
    ]
};

const compResult = SDIComparisonEngine.compare(availabilityInstructors, dayPlanData, 'sat');
console.log('Compared instructors count:', compResult.instructors.length);
const supComp = compResult.instructors.find(i => i.instructorId === '990011');
console.log('Supervisor stats:', supComp.stats);
console.log('Supervisor slots examined count:', supComp.slots.length);
console.log('Supervisor slots:', supComp.slots.map(s => s.slot).join(', '));

if (compResult.instructors.length === 1 && supComp && supComp.slots.length === 2 && supComp.stats.occupancyRate === '100.0') {
    console.log('✅ TEST 3 PASSED: Supervisor evaluated with 100% occupancy on assigned slots only, ghost skipped!');
} else {
    console.error('❌ TEST 3 FAILED');
}
