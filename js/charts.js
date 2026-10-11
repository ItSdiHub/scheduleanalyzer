/**
 * نظام الرسوم البيانية التفاعلية لتحليل حصص معهد الشارقة للسياقة (SDI)
 * مبني على Chart.js
 */

const SDICharts = {
    instances: {},

    /**
     * تهيئة وتحديث كافة الرسوم البيانية
     */
    initOrUpdateAll(stats, timeSlotStats, dayGroupStats) {
        if (typeof Chart === 'undefined') {
            console.warn("Chart.js غير متوفرة بعد.");
            return;
        }

        // تهيئة التنسيقات العامة للخطوط والعربية
        Chart.defaults.font.family = "'Cairo', 'Segoe UI', sans-serif";
        Chart.defaults.color = document.body.classList.contains('dark-theme') ? '#cbd5e1' : '#475569';

        this.renderOccupancyDonut(stats);
        this.renderCategoryBar(stats);
        this.renderDaysComparison(dayGroupStats);
        this.renderSlotsTimeline(timeSlotStats);
    },

    /**
     * 1. رسم دائري لنسبة الإشغال الكلية
     */
    renderOccupancyDonut(stats) {
        const ctx = document.getElementById('chart-occupancy-donut');
        if (!ctx) return;

        const data = {
            labels: ['الحصص المشغولة', 'الحصص الشاغرة'],
            datasets: [{
                data: [stats.totalOcc, stats.totalEmp],
                backgroundColor: ['#f97316', '#10b981'],
                hoverBackgroundColor: ['#ea580c', '#059669'],
                borderWidth: 2,
                borderColor: document.body.classList.contains('dark-theme') ? '#1e293b' : '#ffffff'
            }]
        };

        if (this.instances.occupancyDonut) {
            this.instances.occupancyDonut.data = data;
            this.instances.occupancyDonut.update();
            return;
        }

        this.instances.occupancyDonut = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        rtl: true,
                        callbacks: {
                            label: function(context) {
                                const val = context.parsed;
                                const pct = ((val / stats.totalCap) * 100).toFixed(1);
                                return ` ${context.label}: ${val} حصة (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * 2. رسم الأعمدة المقارنة للفئات
     */
    renderCategoryBar(stats) {
        const ctx = document.getElementById('chart-categories-bar');
        if (!ctx) return;

        const labels = [];
        const occData = [];
        const empData = [];

        Object.entries(stats.categories).forEach(([code, c]) => {
            labels.push(SDI_CATEGORIES[code]?.name || code);
            occData.push(c.occ);
            empData.push(c.emp);
        });

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'مشغولة',
                    data: occData,
                    backgroundColor: '#f97316',
                    borderRadius: 6
                },
                {
                    label: 'شاغرة',
                    data: empData,
                    backgroundColor: '#10b981',
                    borderRadius: 6
                }
            ]
        };

        if (this.instances.categoryBar) {
            this.instances.categoryBar.data = data;
            this.instances.categoryBar.update();
            return;
        }

        this.instances.categoryBar = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { usePointStyle: true }
                    },
                    tooltip: { rtl: true }
                },
                scales: {
                    x: {
                        stacked: false,
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(148, 163, 184, 0.15)' }
                    }
                }
            }
        });
    },

    /**
     * 3. رسم مقارنة مجموعات الأيام (سبت/اثنين/أربعاء مقابل أحد/ثلاثاء/خميس)
     */
    renderDaysComparison(dayGroupStats) {
        const ctx = document.getElementById('chart-days-comparison');
        if (!ctx) return;

        const data = {
            labels: ['السبت - الإثنين - الأربعاء', 'الأحد - الثلاثاء - الخميس'],
            datasets: [
                {
                    label: 'مشغولة',
                    data: [dayGroupStats.sat.occ, dayGroupStats.sun.occ],
                    backgroundColor: '#3b82f6',
                    borderRadius: 6
                },
                {
                    label: 'شاغرة',
                    data: [dayGroupStats.sat.emp, dayGroupStats.sun.emp],
                    backgroundColor: '#94a3b8',
                    borderRadius: 6
                }
            ]
        };

        if (this.instances.daysComparison) {
            this.instances.daysComparison.data = data;
            this.instances.daysComparison.update();
            return;
        }

        this.instances.daysComparison = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { usePointStyle: true } },
                    tooltip: { rtl: true }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.15)' } }
                }
            }
        });
    },

    /**
     * 4. منحنى توزيع الحصص خلال اليوم (1 إلى 20)
     */
    renderSlotsTimeline(timeSlotStats) {
        const ctx = document.getElementById('chart-slots-timeline');
        if (!ctx) return;

        const labels = timeSlotStats.map(s => `حصة ${s.slot}`);
        const occData = timeSlotStats.map(s => s.occ);
        const empData = timeSlotStats.map(s => s.emp);

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'الحصص المشغولة',
                    data: occData,
                    borderColor: '#ea580c',
                    backgroundColor: 'rgba(234, 88, 12, 0.15)',
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2.5
                },
                {
                    label: 'الحصص الشاغرة',
                    data: empData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2.5
                }
            ]
        };

        if (this.instances.slotsTimeline) {
            this.instances.slotsTimeline.data = data;
            this.instances.slotsTimeline.update();
            return;
        }

        this.instances.slotsTimeline = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { usePointStyle: true } },
                    tooltip: { rtl: true }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.15)' } }
                }
            }
        });
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SDICharts };
}
