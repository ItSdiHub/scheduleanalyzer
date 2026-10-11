const pdfjsLib = require('pdfjs-dist');
const fs = require('fs');

async function test() {
    const data = new Uint8Array(fs.readFileSync('C:/Users/Mahmoud/.gemini/antigravity-ide/brain/9bc11da5-2e47-4db9-9d04-e0a5bc2a8753/.user_uploaded/media_1791718330138.pdf'));
    const doc = await pdfjsLib.getDocument({ data }).promise;
    console.log('Total pages:', doc.numPages);
    for (let p = 1; p <= doc.numPages; p++) {
        const page = await doc.getPage(p);
        const textContent = await page.getTextContent();
        const items = textContent.items.filter(it => it.str && it.str.trim().length > 0);
        const idItem = items.filter(it => it.transform[4] < 140).find(it => /^\d{5,7}$/.test(it.str.trim()));
        const nameItem = items.filter(it => it.transform[4] < 140).find(it => !/^\d+$/.test(it.str.trim()) && !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(it.str.trim()) && it.str.trim().length > 3);
        const rowItems = items.filter(it => it.transform[4] >= 145);
        console.log(`Page ${p}: items=${items.length}, id=${idItem ? idItem.str : 'NONE'}, name=${nameItem ? nameItem.str : 'NONE'}, rowItems=${rowItems.length}`);
        if (!idItem || rowItems.length <= 5) {
            console.log(`   Sample text on page ${p}:`, items.slice(0, 15).map(it => it.str).join(' | '));
        }
    }
}
test();
