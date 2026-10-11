/**
 * سكربت إلغاء تثبيت وإيقاف خدمة ويندوز لنظام معهد الشارقة للسياقة (SDI)
 */
const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
  name: 'SDI Schedule Analyzer Service',
  script: path.join(__dirname, 'server.js')
});

svc.on('uninstall', function() {
  console.log('================================================================');
  console.log('🗑️ تم إيقاف وإلغاء تثبيت خدمة (SDI Schedule Analyzer Service) بنجاح.');
  console.log('================================================================');
});

svc.uninstall();
