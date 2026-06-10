function renderEvents() {
    const container = document.getElementById("event-list");
    if (!container) return;

    // 從 model.js 讀取並顯示前五筆事件
    container.innerHTML = lifeEvents
        .slice(0, 5)
        .map(event => `
            <div class="event-item">
                <div class="event-year">${event.year}</div>
                <div style="color: #ffffff;">${event.title}</div>
            </div>
        `)
        .join("");
}

function initChart() {
    const ctx = document.getElementById('assetChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2024', '2025', '2025', '2026', '2026'],
            datasets: [
                {
                    label: '總資產',
                    data: [120000, 650000, 1200000, 1800000, 2680000],
                    tension: 0.4,
                    borderColor: '#32d4d7', 
                    borderWidth: 3,
                    pointBackgroundColor: '#32d4d7',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: '#263341' }, 
                    ticks: { color: '#7e8f9f' }  
                },
                y: {
                    grid: { color: '#263341' },
                    ticks: { color: '#7e8f9f' }
                }
            }
        }
    });
}

// 控制左邊側邊欄摺疊
function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const layoutRoot = document.getElementById('layout-root');

    if (!toggleBtn || !layoutRoot) return;

    toggleBtn.addEventListener('click', () => {
        layoutRoot.classList.toggle('sidebar-collapsed');
    });
}

// 控制右側/底部面板摺疊的動態函式
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.toggle('collapsed');
        
        // 改變按鈕文字
        const btn = panel.querySelector('.collapse-panel-btn');
        if (btn) {
            btn.textContent = panel.classList.contains('collapsed') ? '展開' : '摺疊';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderEvents();
    initChart();
    initSidebarToggle();
});
// 控制左邊側邊欄摺疊與手機端遮罩關閉
function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const layoutRoot = document.getElementById('layout-root');
    const overlay = document.getElementById('sidebar-overlay');

    if (!layoutRoot) return;

    // 漢堡選單點擊
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            layoutRoot.classList.toggle('sidebar-collapsed');
        });
    }

    // 點擊手機遮罩時，自動收回側邊欄
    if (overlay) {
        overlay.addEventListener('click', () => {
            layoutRoot.classList.remove('sidebar-collapsed');
        });
    }
}

// 控制右側/底部面板摺疊的動態函式
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.toggle('collapsed');
        const btn = panel.querySelector('.collapse-panel-btn');
        if (btn) {
            btn.textContent = panel.classList.contains('collapsed') ? '展開' : '摺疊';
        }
    }
}

// 確保在載入時初始化所有功能
document.addEventListener("DOMContentLoaded", () => {
    renderEvents();
    initChart();
    initSidebarToggle();
});