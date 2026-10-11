/**
 * خادم نظام تقارير الحصص الرسمي والتزامن اللحظي متعدد المستخدمين
 * Sharjah Driving Institute (SDI) - Schedule Analyzer Realtime Server
 * 
 * الميزات:
 * 1. تقديم ملفات النظام والمحرر (Static File Server).
 * 2. تزامن فوري ثنائي الاتجاه عبر WebSocket بين جميع المستخدمين والأجهزة المتصلة.
 * 3. حفظ الحالة المركزية المشتركة في data/app-state.json لضمان عدم ضياع التعديلات.
 * 4. دعم تعدد المستخدمين على نفس الشبكة المحلية (LAN / Wi-Fi).
 * 
 * تطوير: م/ محمود محمد
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = process.env.PORT || 5173;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const STATE_FILE = path.join(DATA_DIR, 'app-state.json');

// التأكد من وجود مجلد البيانات
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// تحميل البيانات الافتراضية الأولية من sampleData.js و sampleDayPlan.js
let defaultInstructors = [];
try {
    const { OFFICIAL_INSTRUCTORS } = require('./js/sampleData.js');
    defaultInstructors = OFFICIAL_INSTRUCTORS;
} catch (e) {
    console.error('Could not load sampleData.js:', e.message);
}

let defaultDayPlan = null;
try {
    const { DEFAULT_DAY_PLAN_DATA } = require('./js/sampleDayPlan.js');
    defaultDayPlan = DEFAULT_DAY_PLAN_DATA;
} catch (e) {
    console.error('Could not load sampleDayPlan.js:', e.message);
}

// الحالة المركزية في الذاكرة
let appState = {
    instructors: defaultInstructors,
    dayPlan: defaultDayPlan,
    activeFileName: "Instructor Availability.pdf (الملف الرسمي المعتمد)",
    activeFileTime: "⚡ تم التحليل اللحظي المباشر",
    dayPlanFileName: defaultDayPlan?.fileName || "Instructor Day Plan.pdf",
    dayPlanFileTime: "⚡ تم التحليل اللحظي المباشر",
    lastUpdatedBy: "نظام SDI المعتمد",
    updatedAt: new Date().toISOString(),
    version: 1
};

// قراءة الحالة المحفوظة سابقاً إن وجدت
if (fs.existsSync(STATE_FILE)) {
    try {
        const raw = fs.readFileSync(STATE_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.instructors) && parsed.instructors.length > 0) {
            appState = parsed;
            if (!appState.dayPlan && defaultDayPlan) {
                appState.dayPlan = defaultDayPlan;
                appState.dayPlanFileName = defaultDayPlan.fileName || "Instructor Day Plan.pdf (الملف الرسمي المعتمد)";
                appState.dayPlanFileTime = "⚡ تم التحليل اللحظي المباشر";
            }
            if (appState.instructors.length < 5 && defaultInstructors.length > appState.instructors.length) {
                appState.instructors = JSON.parse(JSON.stringify(defaultInstructors));
            }
            console.log(`[SDI Server] Loaded persistent state with ${appState.instructors.length} instructors (v${appState.version}).`);
        }
    } catch (err) {
        console.error('[SDI Server] Error reading state file:', err.message);
    }
} else {
    saveStateToDisk();
}

function saveStateToDisk() {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(appState, null, 2), 'utf8');
    } catch (err) {
        console.error('[SDI Server] Failed to save state to disk:', err.message);
    }
}

// استخراج عناوين IP المحلية للمشاركة عبر الشبكة
function getLocalIps() {
    const nets = os.networkInterfaces();
    const ips = [];
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                ips.push(net.address);
            }
        }
    }
    return ips;
}

// MIME Types للملفات الثابتة
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

// إنشاء خادم HTTP
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // --- واجهات البرمجة REST API ---
    if (pathname === '/api/state' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(appState));
        return;
    }

    if (pathname === '/api/state' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (data.instructors && Array.isArray(data.instructors)) {
                    appState.instructors = data.instructors;
                    if (data.activeFileName) appState.activeFileName = data.activeFileName;
                    if (data.activeFileTime) appState.activeFileTime = data.activeFileTime;
                    if (data.dayPlan !== undefined) appState.dayPlan = data.dayPlan;
                    if (data.dayPlanFileName) appState.dayPlanFileName = data.dayPlanFileName;
                    if (data.dayPlanFileTime) appState.dayPlanFileTime = data.dayPlanFileTime;
                    appState.lastUpdatedBy = data.user || data.clientId || 'مستخدم';
                    appState.updatedAt = new Date().toISOString();
                    appState.version = (appState.version || 1) + 1;
                    
                    saveStateToDisk();

                    broadcastMessage({
                        type: 'STATE_UPDATED',
                        payload: appState,
                        senderId: data.clientId,
                        action: data.action || 'تحديث البيانات'
                    }, data.clientId);

                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: true, version: appState.version }));
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid state format' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    if (pathname === '/api/reset' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            let resetType = 'slots';
            try {
                if (body) {
                    const parsed = JSON.parse(body);
                    if (parsed.type) resetType = parsed.type;
                }
            } catch (e) {}

            let actionDesc = 'تصفير الحصص بالكامل (0% إشغال)';

            if (resetType === 'wipe') {
                appState.instructors = [];
                appState.activeFileName = "تم تصفير ومسح البيانات بالكامل";
                appState.activeFileTime = "⚡ تم التصفير اللحظي";
                actionDesc = 'تصفير شامل ومسح كافة المدربين';
            } else if (resetType === 'default') {
                appState.instructors = JSON.parse(JSON.stringify(defaultInstructors));
                appState.activeFileName = "Instructor Availability.pdf (الملف الرسمي المعتمد)";
                appState.activeFileTime = "⚡ تم التحليل اللحظي المباشر";
                actionDesc = 'استعادة البيانات الأصلية المعتمدة';
            } else {
                // 'slots': تصفير كافة الحصص لجميع المدربين ليصبح الإشغال 0%
                appState.instructors.forEach(inst => {
                    inst.occupied = 0;
                    inst.empty = inst.capacity;
                    inst.rate = "0.0";
                    if (Array.isArray(inst.fullSchedule)) {
                        inst.fullSchedule.forEach(s => {
                            s.sat = 'empty';
                            s.sun = 'empty';
                        });
                    }
                    if (Array.isArray(inst.slotsRows)) {
                        inst.slotsRows.forEach(r => {
                            r.sat = 'خالية';
                            r.sun = 'خالية';
                        });
                    }
                });
                appState.activeFileTime = "⚡ تم تصفير كافة الحصص (0% إشغال)";
                actionDesc = 'تصفير وتفريغ كافة الحصص بالكامل (0% إشغال)';
            }

            appState.lastUpdatedBy = actionDesc;
            appState.updatedAt = new Date().toISOString();
            appState.version = (appState.version || 1) + 1;

            saveStateToDisk();

            broadcastMessage({
                type: 'STATE_UPDATED',
                payload: appState,
                action: actionDesc
            });

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, resetType, state: appState }));
        });
        return;
    }

    if (pathname === '/api/info' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            port: PORT,
            onlineUsers: wss.clients.size,
            localIps: getLocalIps(),
            instructorsCount: appState.instructors.length,
            version: appState.version,
            updatedAt: appState.updatedAt
        }));
        return;
    }

    // --- خدمة الملفات الثابتة (Static Files) ---
    let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\') {
        safePath = '/index.html';
    }

    const filePath = path.join(ROOT_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

// إنشاء خادم WebSocket
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcastMessage(data, excludeClientId = null) {
    const raw = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            if (!excludeClientId || client.clientId !== excludeClientId) {
                client.send(raw);
            }
        }
    });
}

function broadcastOnlineUsers() {
    const count = wss.clients.size;
    const msg = JSON.stringify({
        type: 'ONLINE_USERS_COUNT',
        count: count
    });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
}

wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    ws.clientId = 'client_' + Math.random().toString(36).substring(2, 9);
    ws.isAlive = true;

    console.log(`[SDI Realtime] New user connected (${ws.clientId}) from ${clientIp}. Total online: ${wss.clients.size}`);

    ws.send(JSON.stringify({
        type: 'INIT_STATE',
        clientId: ws.clientId,
        payload: appState,
        onlineUsers: wss.clients.size,
        localIps: getLocalIps(),
        port: PORT
    }));

    broadcastOnlineUsers();

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());

            if (data.type === 'SYNC_STATE') {
                if (data.payload && Array.isArray(data.payload.instructors)) {
                    appState.instructors = data.payload.instructors;
                    if (data.payload.activeFileName) appState.activeFileName = data.payload.activeFileName;
                    if (data.payload.activeFileTime) appState.activeFileTime = data.payload.activeFileTime;
                    if (data.payload.dayPlan !== undefined) appState.dayPlan = data.payload.dayPlan;
                    if (data.payload.dayPlanFileName) appState.dayPlanFileName = data.payload.dayPlanFileName;
                    if (data.payload.dayPlanFileTime) appState.dayPlanFileTime = data.payload.dayPlanFileTime;
                    appState.lastUpdatedBy = data.userName || ws.clientId;
                    appState.updatedAt = new Date().toISOString();
                    appState.version = (appState.version || 1) + 1;

                    saveStateToDisk();

                    console.log(`[SDI Realtime] State updated by ${ws.clientId} (action: ${data.action || 'update'}). Broadcasting to ${wss.clients.size} clients.`);

                    broadcastMessage({
                        type: 'STATE_UPDATED',
                        payload: appState,
                        senderId: ws.clientId,
                        action: data.action || 'تحديث البيانات'
                    }, ws.clientId);
                }
            } else if (data.type === 'PING') {
                ws.send(JSON.stringify({ type: 'PONG' }));
            }
        } catch (err) {
            console.error('[SDI Realtime] Error handling message:', err.message);
        }
    });

    ws.on('close', () => {
        console.log(`[SDI Realtime] User disconnected (${ws.clientId}). Remaining online: ${wss.clients.size}`);
        broadcastOnlineUsers();
    });

    ws.on('error', (err) => {
        console.error(`[SDI Realtime] WebSocket error (${ws.clientId}):`, err.message);
    });
});

const interval = setInterval(() => {
    wss.clients.forEach(ws => {
        if (ws.isAlive === false) {
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on('close', () => {
    clearInterval(interval);
});

server.listen(PORT, '0.0.0.0', () => {
    const localIps = getLocalIps();
    console.log('================================================================');
    console.log(`🚀 خادم نظام تقارير الحصص والتزامن اللحظي المباشر يعمل بنجاح!`);
    console.log(`📍 الرابط المحلي على جهازك:  http://localhost:${PORT}`);
    localIps.forEach(ip => {
        console.log(`🌐 رابط المشاركة مع أجهزة الشبكة: http://${ip}:${PORT}`);
    });
    console.log('⚡ تقنية التزامن المباشر: WebSocket ثنائي الاتجاه نشط على /ws');
    console.log('👥 التحديث التلقائي مفعّل فورياً لجميع المستخدمين المتصلين!');
    console.log('================================================================');
});
