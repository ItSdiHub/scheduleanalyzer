const fs = require('fs');
const path = require('path');
global.window = global;
global.document = { 
    createElement: () => ({ getContext: () => null }),
    head: { append: () => {}, appendChild: () => {} },
    body: { append: () => {}, appendChild: () => {} }
};
const vm = require('vm');
const pdfCode = fs.readFileSync('vendor/pdf.min.js', 'utf8');
vm.runInThisContext(pdfCode);
const pdfjsLib = global.pdfjsLib;
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(__dirname, 'vendor', 'pdf.worker.min.js');

const { SDIPdfParser } = require('./js/pdfParser.js');
const { SDIDayPlanParser } = require('./js/dayPlanParser.js');
const { SDIComparisonEngine } = require('./js/comparisonEngine.js');
const { OFFICIAL_INSTRUCTORS } = require('./js/sampleData.js');

const pdfPath = 'C:\\Users\\Mahmoud\\.gemini\\antigravity-ide\\brain\\9bc11da5-2e47-4db9-9d04-e0a5bc2a8753\\.user_uploaded\\media_1791718330138.pdf';

if (!fs.existsSync(pdfPath)) {
    console.error('PDF file does not exist at', pdfPath);
    process.exit(1);
}

const buffer = fs.readFileSync(pdfPath);
const mockFile = {
    name: 'TestSchedule.pdf',
    arrayBuffer: async () => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
};

async function test() {
    console.log('--- Testing SDIPdfParser.parsePdfFile ---');
    try {
        const insts = await SDIPdfParser.parsePdfFile(mockFile);
        console.log('SDIPdfParser success! Extracted instructors:', insts.length);
        if (insts.length > 0) {
            console.log('Sample instructor:', insts[0].id, insts[0].name, insts[0].shift, insts[0].category);
        }
    } catch (e) {
        console.error('SDIPdfParser ERROR:', e);
    }

    console.log('\n--- Testing SDIDayPlanParser.parsePdfFile ---');
    try {
        const plan = await SDIDayPlanParser.parsePdfFile(mockFile);
        console.log('SDIDayPlanParser success! Extracted instructors:', plan.instructors.length);
    } catch (e) {
        console.error('SDIDayPlanParser ERROR:', e);
    }
}

test().then(() => console.log('Done testing.')).catch(console.error);
