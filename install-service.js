/**
 * سكربت تثبيت وتشغيل خدمة ويندوز الدائمة لنظام معهد الشارقة للسياقة (SDI)
 * Sharjah Driving Institute LLC - Windows Service Installer
 * 
 * المطور: م/ محمود محمد
 */
const Service = require('node-windows').Service;
const path = require('path');

// إعداد خدمة ويندوز الرسمية
const svc = new Service({
  name: 'SDI Schedule Analyzer Service',
  description: 'خدمة التزامن وقاعدة البيانات اللحظية لنظام تحليل جداول الحصص - معهد الشارقة للسياقة (SDI)',
  script: path.join(__dirname, 'server.js'),
  wait: 2,
  grow: .5,
  maxRetries: 10
});

// تشغيل الخدمة فور اكتمال التثبيت
svc.on('install', function() {
  console.log('================================================================');
  console.log('✅ تم بنجاح تثبيت خدمة (SDI Schedule Analyzer Service) في ويندوز!');
  console.log('🚀 جاري بدء تشغيل الخدمة الآن...');
  console.log('================================================================');
  svc.start();
  console.log('🟢 الخدمة قيد التشغيل الدائم الآن في الخلفية!');
  console.log('📌 يمكنك مراجعتها في أي وقت من خلال: services.msc');
});

// التعامل مع حالة إذا كانت الخدمة مثبتة مسبقاً
svc.on('alreadyinstalled', function() {
  console.log('ℹ️ الخدمة مثبتة مسبقاً في ويندوز! جاري التأكد من تشغيلها...');
  svc.start();
});

// تشغيل عملية التثبيت
svc.install();
