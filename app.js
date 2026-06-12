/**
 * DREAM Ledger - Core Application Engine v4
 * 新增：多頁面路由、資產/負債/事件/記帳各頁渲染
 */

// ── 1. 格式化工具 ──────────────────────────────────────────────
function formatCurrency(amount) {
    return new Intl.NumberFormat('zh-TW', {
        style: 'currency', currency: 'TWD', maximumFractionDigits: 0
    }).format(amount);
}
function formatPercentage(value) {
    return new Intl.NumberFormat('zh-TW', {
        style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1
    }).format(value);
}

// Chart 實例快取（防止重複渲染導致 Canvas is already in use）
let _assetChartInstance = null;
let _chartRecIncome     = null;
let _chartRecExpense    = null;
let _chartRecMonthly    = null;

// ── 2. 頁面路由系統 ───────────────────────────────────────────
const PAGE_LABELS = {
    dashboard:   'DREAM LEDGER // DASHBOARD',
    assets:      'DREAM LEDGER // 資產管理',
    liabilities: 'DREAM LEDGER // 負債管理',
    events:      'DREAM LEDGER // 人生事件',
    records:     'DREAM LEDGER // 記帳紀錄',
    about:       'DREAM LEDGER // About',
};

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) targetPage.classList.add('active');

    const targetBtn = document.querySelector(`[data-page="${pageId}"]`);
    if (targetBtn) targetBtn.classList.add('active');

    const brandEl = document.getElementById('page-brand');
    if (brandEl) brandEl.textContent = PAGE_LABELS[pageId] || 'DREAM LEDGER';
}

function initNav() {
    document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.page);
            // 手機端點選後自動收起側邊欄
            if (window.innerWidth <= 768) {
                document.getElementById('layout-root').classList.remove('sidebar-collapsed');
            }
        });
    });
}

// ── 3. Dashboard 渲染 ─────────────────────────────────────────
function renderDashboard() {
    if (typeof dreamUser === "undefined") return;

    const netWorth       = dreamUser.getters.getNetWorth();
    const totalAssets    = dreamUser.getters.getTotalAssets();
    const totalLiab      = dreamUser.getters.getTotalLiabilities();
    const income         = dreamUser.cashflowModel.income.total;
    const expense        = dreamUser.cashflowModel.expense.total;
    const cashflow       = dreamUser.cashflowModel.getMonthlyCashflow();
    const passiveIncome  = dreamUser.cashflowModel.income.kgiDividend;
    const coverageRatio  = passiveIncome / expense;

    const nwEl = document.getElementById("networth");
    if (nwEl) {
        nwEl.textContent = formatCurrency(netWorth);
        nwEl.style.color = netWorth < 0 ? "var(--neon-rose)" : "var(--neon-green)";
    }

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set("totalAssets",      formatCurrency(totalAssets));
    set("totalLiabilities", formatCurrency(totalLiab));
    set("income",           formatCurrency(income));
    set("expense",          formatCurrency(expense));
    set("cashflow",         formatCurrency(cashflow));
    set("debt",             formatCurrency(totalLiab));
    set("passiveIncome",    formatCurrency(passiveIncome));

    const crEl = document.getElementById("coverageRatio");
    if (crEl) {
        crEl.textContent = formatPercentage(coverageRatio);
        crEl.style.color = coverageRatio >= 0.1 ? "var(--neon-green)" : "var(--text-main)";
    }
}

// ── 4. 資產管理頁渲染 ─────────────────────────────────────────
function renderAssets() {
    if (typeof dreamUser === "undefined") return;
    const a = dreamUser.realAssets;
    const totalAssets = dreamUser.getters.getTotalAssets();
    const netWorth    = dreamUser.getters.getNetWorth();
    const dividend    = dreamUser.cashflowModel.income.kgiDividend;
    const expense     = dreamUser.cashflowModel.expense.total;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set("a-totalAssets",  formatCurrency(totalAssets));
    set("a-netWorth",     formatCurrency(netWorth));
    set("a-cash",         formatCurrency(a.cash));
    set("a-kgi",          formatCurrency(a.kgiPolicy));
    set("a-anda",         formatCurrency(a.andaTwd));
    set("a-bot",          formatCurrency(a.botSavings));
    set("a-totalAssets2",   formatCurrency(totalAssets));
    set("a-dividend",       formatCurrency(dividend));
    set("a-coverage",       formatPercentage(dividend / expense));
    set("a-fubonMonthly",   formatCurrency(dreamUser.cashflowModel.expense.loanRepayment.fubon));

    const nwEl = document.getElementById("a-netWorth");
    if (nwEl) nwEl.style.color = netWorth < 0 ? "var(--neon-rose)" : "var(--neon-green)";
}

// ── 5. 負債管理頁渲染 ─────────────────────────────────────────
function renderLiabilities() {
    if (typeof dreamUser === "undefined") return;
    const l = dreamUser.realLiabilities;
    const totalLiab      = dreamUser.getters.getTotalLiabilities();
    const loan           = dreamUser.cashflowModel.expense.loanRepayment;
    const monthlyRepay   = loan.total;
    const fubonMonthly   = loan.fubon;
    const studentMonthly = loan.student;
    const massageMonthly = loan.massageChair;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set("l-totalLiabilities", formatCurrency(totalLiab));
    set("l-monthlyRepay",     formatCurrency(monthlyRepay));
    set("l-fubon",            formatCurrency(l.fubonLoan));
    set("l-student",          formatCurrency(l.studentLoan));
    set("l-private",          formatCurrency(l.privateLoan));
    set("l-massage",          formatCurrency(l.massageChair));

    // 兩個覆蓋率指標
    const dividend     = dreamUser.cashflowModel.income.kgiDividend;
    const totalExpense = dreamUser.cashflowModel.expense.total;
    const coverageEl     = document.getElementById("l-coverage");
    const loanCoverageEl = document.getElementById("l-loanCoverage");
    if (coverageEl) {
        coverageEl.textContent = formatPercentage(dividend / totalExpense);
        coverageEl.style.color = dividend / totalExpense >= 0.1 ? "var(--neon-green)" : "var(--text-main)";
    }
    if (loanCoverageEl) {
        const loanRatio = dividend / fubonMonthly;
        loanCoverageEl.textContent = formatPercentage(loanRatio);
        loanCoverageEl.style.color = loanRatio >= 0.5 ? "var(--neon-cyan)" : "var(--neon-amber)";
    }
    set("l-fubonMonthlyNote", formatCurrency(fubonMonthly));

    // 負債結構分析列表
    const breakdown = [
        { label: '富邦信貸',   amount: l.fubonLoan,    monthly: fubonMonthly,   badge: 'active', note: '84 期分期，核心槓桿負債' },
        { label: '學貸',       amount: l.studentLoan,  monthly: studentMonthly, badge: 'active', note: '長期低利政府貸款' },
        { label: '私人借款',   amount: l.privateLoan,  monthly: 0,              badge: 'soon',   note: '預計 2026/07 全額償還' },
        { label: '按摩椅分期', amount: l.massageChair, monthly: massageMonthly, badge: 'active', note: '信用卡分期，餘額遞減中' },
    ];

    const container = document.getElementById('debt-breakdown');
    if (!container) return;
    container.innerHTML = breakdown.map(item => {
        const pct = (item.amount / totalLiab * 100).toFixed(1);
        const badgeClass = item.badge === 'soon' ? 'badge-soon' : 'badge-active';
        const badgeText  = item.badge === 'soon' ? '即將清償' : '還款中';
        return `
        <div style="margin-bottom:20px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                <div>
                    <span style="font-size:14px;color:var(--text-main);font-weight:500">${item.label}</span>
                    <span class="badge ${badgeClass}" style="margin-left:8px">${badgeText}</span>
                </div>
                <div style="text-align:right">
                    <div style="font-size:16px;font-weight:600;color:var(--neon-rose)">${formatCurrency(item.amount)}</div>
                    ${item.monthly ? `<div style="font-size:11px;color:var(--text-muted)">月付 ${formatCurrency(item.monthly)}</div>` : ''}
                </div>
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">${item.note}</div>
            <div class="debt-bar-bg"><div class="debt-bar-fill" style="width:${pct}%"></div></div>
            <div class="debt-meta"><span>佔總負債</span><span>${pct}%</span></div>
        </div>`;
    }).join('');
}

// ── 6. 人生事件頁渲染（時間軸） ──────────────────────────────
const DOT_CLASS = {
    Investment:       '',
    Protection:       '',
    'Asset Allocation': '',
    Leverage:         '',
    Life:             'dot-life',
    Career:           'dot-career',
    Cognition:        'dot-cognition',
    Family:           'dot-family',
};

function renderTimeline(filterCat = 'all') {
    if (typeof lifeEvents === 'undefined') return;
    const container = document.getElementById('timeline-list');
    if (!container) return;

    const filtered = filterCat === 'all' ? lifeEvents : lifeEvents.filter(e => e.category === filterCat);

    container.innerHTML = filtered.map(evt => {
        const dotClass = DOT_CLASS[evt.category] || '';
        return `
        <div class="timeline-item" data-cat="${evt.category}">
            <div class="timeline-dot ${dotClass}"></div>
            <div class="timeline-year">${evt.year}</div>
            <div style="display:flex;align-items:center;margin-bottom:6px">
                <span class="timeline-title">${evt.title}</span>
                <span class="timeline-cat">${evt.category}</span>
            </div>
            <div style="font-size:12px;color:var(--text-muted);line-height:1.6">
                <div><strong style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.5px">Fact</strong> ${evt.fact}</div>
                <div style="margin-top:4px"><strong style="color:var(--neon-cyan);font-size:10px;text-transform:uppercase;letter-spacing:.5px">Context</strong> ${evt.context}</div>
                <div style="margin-top:4px"><strong style="color:var(--neon-amber);font-size:10px;text-transform:uppercase;letter-spacing:.5px">Decision</strong> ${evt.decision}</div>
            </div>
        </div>`;
    }).join('');
}

function initTimelineFilter() {
    document.querySelectorAll('#cat-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#cat-filter .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTimeline(btn.dataset.cat);
        });
    });
}

// ── 7. 記帳紀錄頁渲染 ────────────────────────────────────────

// 展開明細區（隱藏的項目顯示出來，隱藏展開按鈕）
function recSeeAll(containerId, btn) {
    document.querySelectorAll('#' + containerId + ' .rec-hidden-item')
        .forEach(el => el.classList.remove('rec-hidden-item'));
    btn.style.display = 'none';
}

// 可折疊明細卡 toggle（固定收入 / 固定支出）
function toggleRecCard(hdr) {
    const body  = hdr.nextElementSibling;
    const arrow = hdr.querySelector('.rec-toggle-arrow');
    const isOpen = body.classList.toggle('open');
    if (arrow) {
        arrow.textContent   = isOpen ? '▲ 收起' : '▼ 展開';
        arrow.style.color   = isOpen ? 'var(--neon-cyan)' : '';
    }
}

// 最近紀錄展開（顯示全部）
let _recentShowAll = false;
function expandRecentRecords() {
    _recentShowAll = true;
    renderRecentRecords();
}

// 通用圓餅圖渲染（含舊實例銷毀 + 空資料狀態）
function _renderPieChart(canvasId, wrapId, oldInstance, labels, data) {
    const ctx  = document.getElementById(canvasId);
    const wrap = document.getElementById(wrapId || canvasId + 'Wrap');
    if (!ctx) return null;
    if (oldInstance) oldInstance.destroy();

    if (!data.length || data.every(d => d === 0)) {
        ctx.style.display = 'none';
        if (wrap && !wrap.querySelector('.rec-chart-empty')) {
            const div = document.createElement('div');
            div.className = 'rec-chart-empty';
            div.style.cssText = 'text-align:center;color:var(--text-muted);font-size:12px;padding:70px 0';
            div.textContent = '本月尚無記錄';
            wrap.appendChild(div);
        }
        return null;
    }
    ctx.style.display = '';
    if (wrap) { const old = wrap.querySelector('.rec-chart-empty'); if (old) old.remove(); }

    const COLORS = ['#32d4d7','#34d399','#fbbf24','#a78bfa','#f43f5e','#fb923c','#60a5fa','#4ade80','#f9a8d4','#6ee7b7'];
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: COLORS.slice(0, data.length),
                borderColor: 'rgba(15,23,42,0.8)',
                borderWidth: 2,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#64748b', font: { size: 10 }, padding: 8, boxWidth: 10 } },
                tooltip: { callbacks: { label: ctx => {
                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                    const pct   = total ? (ctx.parsed / total * 100).toFixed(1) : 0;
                    return ` ${ctx.label}: $${ctx.parsed.toLocaleString()} (${pct}%)`;
                }}}
            },
            cutout: '52%'
        }
    });
}

function renderRecords() {
    if (typeof dreamUser === 'undefined') return;
    const i   = dreamUser.cashflowModel.income;
    const e   = dreamUser.cashflowModel.expense;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    // 固定收入 / 支出明細陣列
    const incomeItems = [
        { label: '底薪',     sub: '保底基準，每月確認', amount: i.baseSalary },
        { label: '費用報銷', sub: '浮動收入',           amount: i.reimbursement },
        { label: '凱基配息', sub: '被動現金流',         amount: i.kgiDividend },
    ].filter(it => it.amount > 0);

    const expenseItems = [
        { label: '房租',       sub: '',   amount: e.rent },
        { label: '保險',       sub: '',   amount: e.insurance },
        { label: '富邦信貸',   sub: '月還款', amount: e.loanRepayment.fubon },
        { label: '學貸',       sub: '月還款', amount: e.loanRepayment.student },
        { label: '按摩椅分期', sub: '月還款', amount: e.loanRepayment.massageChair },
        { label: '電信與訂閱', sub: '',   amount: e.telecomSubscription },
    ].filter(it => it.amount > 0);

    // 記帳記錄
    const records   = loadRecords();
    const txRecords = records.filter(r => !r.isEvent && r.amount > 0);

    // 本月記錄（用於字卡 + 圓餅圖）
    const thisMonth  = new Date().toISOString().slice(0, 7);
    const mthRecs    = txRecords.filter(r => r.date.startsWith(thisMonth));
    const mthExpRecs = mthRecs.filter(r => r.type === 'expense');
    const mthIncRecs = mthRecs.filter(r => r.type === 'income');
    const mthExpTotal = mthExpRecs.reduce((s, r) => s + r.amount, 0);
    const mthIncTotal = mthIncRecs.reduce((s, r) => s + r.amount, 0);
    const actualCashflow = i.total + mthIncTotal - e.total - mthExpTotal;
    const cfColor = actualCashflow >= 0 ? 'var(--neon-green)' : 'var(--neon-rose)';

    // ─ 字卡（Row 1）─
    set('rs-fixed-income',    formatCurrency(i.total));
    set('rs-income-sub',      incomeItems.length + ' 項收入');
    set('rs-fixed-expense',   formatCurrency(e.total));
    set('rs-expense-sub',     expenseItems.length + ' 項支出');
    set('rs-monthly-expense', formatCurrency(mthExpTotal));
    set('rs-monthly-sub',     mthRecs.length + ' 筆記帳');
    const cfEl = document.getElementById('rs-cashflow');
    if (cfEl) { cfEl.textContent = formatCurrency(actualCashflow); cfEl.style.color = cfColor; }

    // ─ 可折疊明細卡（Row 3）─
    set('rs-income-detail-val', formatCurrency(i.total));
    set('rs-income-detail-sub', incomeItems.length + ' 項收入來源');
    set('rs-expense-detail-val', formatCurrency(e.total));
    set('rs-expense-detail-sub', expenseItems.length + ' 項支出來源');

    function fillDetailList(containerId, items, isExpense) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = items.length === 0
            ? '<div style="color:var(--text-muted);font-size:12px;padding:8px 0">尚無資料</div>'
            : items.map(it => {
                const sign = isExpense ? '-' : '+';
                const cc   = isExpense ? 'amt-out' : 'amt-in';
                return `<div class="record-row">
                    <div>
                        <div class="record-name">${it.label}</div>
                        ${it.sub ? `<div class="record-sub">${it.sub}</div>` : ''}
                    </div>
                    <div class="record-amt ${cc}">${sign}${formatCurrency(it.amount)}</div>
                </div>`;
            }).join('');
    }
    fillDetailList('rs-income-items',  incomeItems, false);
    fillDetailList('rs-expense-items', expenseItems, true);

    // ─ 圓餅圖 ─
    _chartRecIncome = _renderPieChart(
        'chartRecIncome', null, _chartRecIncome,
        incomeItems.map(it => it.label),
        incomeItems.map(it => it.amount)
    );

    const expChartItems = [
        { label: '房租',   amount: e.rent },
        { label: '保險',   amount: e.insurance },
        { label: '貸款',   amount: e.loanRepayment.total },
        { label: '電信訂閱', amount: e.telecomSubscription },
    ].filter(it => it.amount > 0);
    _chartRecExpense = _renderPieChart(
        'chartRecExpense', null, _chartRecExpense,
        expChartItems.map(it => it.label),
        expChartItems.map(it => it.amount)
    );

    const catMap = {};
    mthExpRecs.forEach(r => { catMap[r.category] = (catMap[r.category] || 0) + r.amount; });
    const monthCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    _chartRecMonthly = _renderPieChart(
        'chartRecMonthly', 'chartRecMonthlyWrap', _chartRecMonthly,
        monthCats.map(([cat]) => cat),
        monthCats.map(([, amt]) => amt)
    );
}

// ── 8. Dashboard 手風琴事件列表 ──────────────────────────────
function renderEventAccordion() {
    if (typeof lifeEvents === 'undefined') return;
    const el = document.getElementById("event-list");
    if (!el) return;
    el.innerHTML = "";

    lifeEvents.forEach(event => {
        const card = document.createElement("div");
        card.className = "collapsible-event";
        card.innerHTML = `
            <div class="event-summary">
                <div>
                    <div class="event-meta">
                        <span class="event-year">${event.year}</span>
                        <span class="event-tag">${event.category}</span>
                    </div>
                    <h4 class="event-title">${event.title}</h4>
                </div>
                <div class="toggle-icon">▼</div>
            </div>
            <div class="event-details" style="max-height:0;overflow:hidden;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);opacity:0;padding:0 20px">
                <div class="ontology-block">
                    <div class="ontology-node node-fact"><strong>客觀事實 (Fact)</strong><p>${event.fact}</p></div>
                    <div class="ontology-node node-context"><strong>決策脈絡 (Context)</strong><p>${event.context}</p></div>
                    <div class="ontology-node node-question"><strong>核心提問 (Question)</strong><p>${event.question}</p></div>
                    <div class="ontology-node node-decision"><strong>最終決策 (Decision)</strong><p>${event.decision}</p></div>
                </div>
            </div>`;

        const summary = card.querySelector(".event-summary");
        const details = card.querySelector(".event-details");
        const icon    = card.querySelector(".toggle-icon");

        summary.addEventListener("click", () => {
            const isOpen = card.classList.toggle("is-open");
            if (isOpen) {
                details.style.maxHeight = details.scrollHeight + 20 + "px";
                details.style.opacity = "1";
                details.style.padding = "0 20px 20px 20px";
                icon.style.transform = "rotate(180deg)";
                icon.style.color = "var(--neon-cyan)";
            } else {
                details.style.maxHeight = "0";
                details.style.opacity = "0";
                details.style.padding = "0 20px";
                icon.style.transform = "rotate(0deg)";
                icon.style.color = "var(--text-muted)";
            }
        });
        el.appendChild(card);
    });
}

// ── 9. Chart.js 雙曲線（資產 + 淨值）+ 審計標注 ────────────
function renderAssetChart() {
    const ctx = document.getElementById('assetChart');
    if (!ctx) return;

    const hasSS = typeof snapshotSystem !== 'undefined';
    const labels       = hasSS ? snapshotSystem.getLabels()          : ['2026-06'];
    const assetData    = hasSS ? snapshotSystem.getAssetSeries()      : [1125002];
    const netWorthData = hasSS ? snapshotSystem.getNetWorthSeries()   : [-134653];

    // 更新審計標注
    const metaEl = document.getElementById('chart-snapshot-meta');
    if (metaEl && hasSS) {
        const auditedCount   = snapshots.filter(s => s.note?.startsWith('audited')).length;
        const estimatedCount = snapshots.filter(s => s.note?.startsWith('estimated')).length;
        metaEl.innerHTML =
            `歷史快照 &nbsp;` +
            `<span style="color:var(--text-muted)">~ ${estimatedCount} 推估</span>` +
            ` &nbsp;<span style="color:var(--neon-cyan)">✓ ${auditedCount} 審計</span>`;
    }

    // 銷毀舊實例，防止 "Canvas is already in use" 錯誤
    if (_assetChartInstance) {
        _assetChartInstance.destroy();
        _assetChartInstance = null;
    }

    _assetChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: '總資產',
                    data: assetData,
                    borderColor: '#32d4d7',
                    backgroundColor: 'rgba(50,212,215,0.04)',
                    borderWidth: 2, tension: 0.2,
                    pointBackgroundColor: assetData.map((_, i) => {
                        const snap = snapshots?.[i];
                        return snap?.note?.startsWith('audited') ? '#32d4d7' : 'rgba(50,212,215,0.4)';
                    }),
                    pointRadius: assetData.map((_, i) => {
                        const snap = snapshots?.[i];
                        return snap?.note?.startsWith('audited') ? 6 : 3;
                    }),
                    pointHoverRadius: 7,
                    fill: false
                },
                {
                    label: '淨資產',
                    data: netWorthData,
                    borderColor: '#f43f5e',
                    backgroundColor: 'rgba(244,63,94,0.03)',
                    borderWidth: 2, tension: 0.2,
                    borderDash: [4, 3],
                    pointBackgroundColor: netWorthData.map((_, i) => {
                        const snap = snapshots?.[i];
                        return snap?.note?.startsWith('audited') ? '#f43f5e' : 'rgba(244,63,94,0.4)';
                    }),
                    pointRadius: netWorthData.map((_, i) => {
                        const snap = snapshots?.[i];
                        return snap?.note?.startsWith('audited') ? 6 : 3;
                    }),
                    pointHoverRadius: 7,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => {
                            const prefix = ctx.datasetIndex === 0 ? '總資產' : '淨資產';
                            const snap   = snapshots?.[ctx.dataIndex];
                            const tag    = snap?.note?.startsWith('audited') ? ' ✓' : ' ~';
                            return `${prefix}: $${ctx.parsed.y.toLocaleString()}${tag}`;
                        },
                        afterBody: ctxArr => {
                            const snap = snapshots?.[ctxArr[0]?.dataIndex];
                            if (!snap?.note) return [];
                            const noteText = snap.note.replace(/^(audited|estimated) \/ /, '');
                            return ['', noteText];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#64748b', font: { size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: {
                        color: '#64748b', font: { size: 11 },
                        callback: v => {
                            if (Math.abs(v) >= 10000) return (v / 10000).toFixed(0) + 'w';
                            return v.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// ── 10. 側邊欄控制 ────────────────────────────────────────────
function initSidebarToggle() {
    const toggleBtn  = document.getElementById('sidebar-toggle');
    const layoutRoot = document.getElementById('layout-root');
    const overlay    = document.getElementById('sidebar-overlay');
    if (toggleBtn && layoutRoot) {
        toggleBtn.addEventListener('click', () => layoutRoot.classList.toggle('sidebar-collapsed'));
    }
    if (overlay && layoutRoot) {
        overlay.addEventListener('click', () => layoutRoot.classList.remove('sidebar-collapsed'));
    }
}

// ── 11. Sandbox 管理 ──────────────────────────────────────────
const LS_ACTIVE_USER  = "dream-ledger:activeUser";
const LS_SANDBOX      = "dream-ledger:sandbox";
const LS_RECORDS      = "dream-ledger:records";
const SANDBOX_VERSION = "1.0";

function getActiveUser() {
    return localStorage.getItem(LS_ACTIVE_USER) || 'primary';
}

function getSandboxData() {
    const raw = localStorage.getItem(LS_SANDBOX);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}

// 將 user-added records（id 以 'rec_' 開頭）的金額套用到 dreamUser.realAssets.cash
function applyRecordsDelta(records) {
    records
        .filter(r => r.id.startsWith('rec_') && !r.isEvent && r.amount > 0)
        .forEach(r => {
            if (r.type === 'income')  dreamUser.realAssets.cash += r.amount;
            else                       dreamUser.realAssets.cash -= r.amount;
        });
}

function activateSandbox() {
    let data = getSandboxData();
    if (!data || data.version !== SANDBOX_VERSION) {
        data = sandboxSeed;
        localStorage.setItem(LS_SANDBOX, JSON.stringify(sandboxSeed));
        // 初始化 sandbox records（如果 localStorage 中沒有）
        if (!localStorage.getItem(LS_RECORDS + ':sandbox')) {
            localStorage.setItem(LS_RECORDS + ':sandbox', JSON.stringify(sandboxSeed.records));
        }
    }

    const u = data.user;

    // 替換資產（保留 getter 結構，只換數值）
    Object.keys(dreamUser.realAssets).forEach(k => delete dreamUser.realAssets[k]);
    Object.assign(dreamUser.realAssets, u.realAssets);

    // 替換負債
    Object.keys(dreamUser.realLiabilities).forEach(k => delete dreamUser.realLiabilities[k]);
    Object.assign(dreamUser.realLiabilities, u.realLiabilities);

    // 替換收入（逐欄賦值，保留 getter）
    dreamUser.cashflowModel.income.baseSalary    = u.income.baseSalary;
    dreamUser.cashflowModel.income.reimbursement = u.income.reimbursement;
    dreamUser.cashflowModel.income.kgiDividend   = u.income.kgiDividend;

    // 替換支出（逐欄賦值，保留 getter）
    dreamUser.cashflowModel.expense.rent                        = u.expense.rent;
    dreamUser.cashflowModel.expense.insurance                   = u.expense.insurance;
    dreamUser.cashflowModel.expense.telecomSubscription         = u.expense.telecomSubscription;
    dreamUser.cashflowModel.expense.loanRepayment.fubon         = u.expense.loanRepayment.fubon;
    dreamUser.cashflowModel.expense.loanRepayment.student       = u.expense.loanRepayment.student;
    dreamUser.cashflowModel.expense.loanRepayment.massageChair  = u.expense.loanRepayment.massageChair;

    // 替換人生事件
    lifeEvents.length = 0;
    data.events.forEach(e => lifeEvents.push(e));

    // 替換快照
    snapshots.length = 0;
    data.snapshots.forEach(s => snapshots.push(s));

    // Reload 時重新套用 user-added records 對現金的影響
    const storedRecords = JSON.parse(localStorage.getItem(LS_RECORDS + ':sandbox') || '[]');
    applyRecordsDelta(storedRecords);

    // 顯示 Sandbox banner
    const banner = document.getElementById('sandbox-banner');
    if (banner) banner.style.display = 'flex';
}

function switchUser(userType) {
    localStorage.setItem(LS_ACTIVE_USER, userType);
    location.reload();
}

function resetSandbox() {
    if (!confirm('重建 Sandbox？所有 Sandbox 記錄將被清除並恢復預設資料。')) return;
    localStorage.removeItem(LS_SANDBOX);
    localStorage.removeItem(LS_RECORDS + ':sandbox');
    location.reload();
}

function updateUserSwitcherUI(activeUser) {
    document.querySelectorAll('.user-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.user === activeUser);
    });
}

// ── 12. Records CRUD ──────────────────────────────────────────
function getRecordsKey() {
    return LS_RECORDS + ':' + getActiveUser();
}

function loadRecords() {
    const raw = localStorage.getItem(getRecordsKey());
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
}

function saveRecordsToStorage(records) {
    localStorage.setItem(getRecordsKey(), JSON.stringify(records));
}

function addRecord() {
    const desc     = document.getElementById('rec-desc')?.value.trim();
    const amount   = parseFloat(document.getElementById('rec-amount')?.value || '0');
    const type     = document.getElementById('rec-type')?.value || 'expense';
    const category = document.getElementById('rec-category')?.value || '其他';
    const date     = document.getElementById('rec-date')?.value || new Date().toISOString().slice(0, 10);
    const note     = document.getElementById('rec-note')?.value.trim() || '';
    const isEvent  = document.getElementById('rec-is-event')?.checked || false;

    if (!desc) return;
    if (!isEvent && (isNaN(amount) || amount <= 0)) return;

    const records = loadRecords();
    records.unshift({
        id:          'rec_' + Date.now(),
        date,
        description: desc,
        amount:      isEvent ? 0 : amount,
        type,
        category,
        isEvent,
        note
    });
    saveRecordsToStorage(records);
    renderRecentRecords();

    // 即時更新財務引擎（user-added 記錄才套用，記事不套用）
    if (!isEvent && amount > 0) {
        if (type === 'income')  dreamUser.realAssets.cash += amount;
        else                    dreamUser.realAssets.cash -= amount;
        renderDashboard();
        renderAssets();
        renderRecords();
    }

    // 清空表單
    ['rec-desc', 'rec-amount', 'rec-note'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const cb = document.getElementById('rec-is-event');
    if (cb) { cb.checked = false; cb.dispatchEvent(new Event('change')); }
}

function deleteRecord(id) {
    const records = loadRecords();
    const rec = records.find(r => r.id === id);

    // 如果是 user-added 記錄，刪除時反向還原現金
    if (rec && rec.id.startsWith('rec_') && !rec.isEvent && rec.amount > 0) {
        if (rec.type === 'income')  dreamUser.realAssets.cash -= rec.amount;
        else                        dreamUser.realAssets.cash += rec.amount;
        renderDashboard();
        renderAssets();
        renderRecords();
    }

    saveRecordsToStorage(records.filter(r => r.id !== id));
    renderRecentRecords();
}

function renderRecentRecords() {
    const container = document.getElementById('records-list');
    const btn       = document.getElementById('rs-recent-see-all');
    const badge     = document.getElementById('rs-recent-badge');
    if (!container) return;

    const records = loadRecords();
    if (badge) badge.textContent = records.length + ' 筆';

    if (records.length === 0) {
        container.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:16px 0;text-align:center">尚無記錄 — 使用左側表單新增第一筆</div>';
        if (btn) btn.style.display = 'none';
        return;
    }

    const MAX = _recentShowAll ? 999 : 5;
    if (btn) btn.style.display = (!_recentShowAll && records.length > MAX) ? 'block' : 'none';

    container.innerHTML = records.slice(0, MAX).map(r => {
        const isNote  = r.isEvent && r.amount === 0;
        const sign    = r.type === 'income' ? '+' : '-';
        const color   = r.type === 'income' ? 'var(--neon-green)' : 'var(--neon-rose)';
        const amtEl   = isNote
            ? '<span style="font-size:11px;color:var(--neon-cyan)">記事</span>'
            : `<span style="font-size:15px;font-weight:600;color:${color}">${sign}$${r.amount.toLocaleString()}</span>`;
        const noteEl  = r.note
            ? `<div style="font-size:11px;color:var(--text-muted);margin-top:4px;padding-left:8px;border-left:2px solid var(--border);line-height:1.6">${r.note}</div>`
            : '';
        const eventBadge = r.isEvent
            ? '<span style="font-size:9px;color:var(--neon-cyan);border:1px solid rgba(50,212,215,0.4);border-radius:3px;padding:1px 5px;margin-left:6px;vertical-align:middle">記事</span>'
            : '';
        return `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">
            <div style="flex:1;min-width:0">
                <div style="font-size:13px;color:var(--text-main)">${r.description}${eventBadge}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${r.date} · ${r.category}</div>
                ${noteEl}
            </div>
            <div style="display:flex;align-items:center;gap:12px;margin-left:12px;flex-shrink:0">
                ${amtEl}
                <span style="font-size:12px;color:var(--text-muted);cursor:pointer;opacity:0.5;transition:opacity 0.2s"
                      onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.5'"
                      onclick="deleteRecord('${r.id}')">✕</span>
            </div>
        </div>`;
    }).join('');
}

function initRecordForm() {
    const checkbox = document.getElementById('rec-is-event');
    const textarea = document.getElementById('rec-note');
    const amountInput = document.getElementById('rec-amount');
    if (checkbox && textarea) {
        checkbox.addEventListener('change', () => {
            textarea.style.display = checkbox.checked ? 'block' : 'none';
            if (amountInput) amountInput.style.display = checkbox.checked ? 'none' : '';
        });
    }
    const dateInput = document.getElementById('rec-date');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().slice(0, 10);
    }
}

// ── 13. 系統啟動 ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // 先判斷使用者模式，Sandbox 模式需在渲染前覆寫資料
    const activeUser = getActiveUser();
    if (activeUser === 'sandbox') {
        activateSandbox();
    } else {
        // Primary：初始化 primary records（若不存在）
        if (!localStorage.getItem(LS_RECORDS + ':primary')) {
            localStorage.setItem(LS_RECORDS + ':primary', JSON.stringify([]));
        }
    }
    updateUserSwitcherUI(activeUser);

    // Landing overlay
    const landingOverlay = document.getElementById('landing-overlay');
    const landingEnter   = document.getElementById('landing-enter');
    if (landingEnter && landingOverlay) {
        landingEnter.addEventListener('click', () => {
            landingOverlay.classList.add('fade-out');
            setTimeout(() => landingOverlay.remove(), 600);
        });
    }

    initNav();
    initSidebarToggle();
    initTimelineFilter();
    initRecordForm();

    renderDashboard();
    renderAssets();
    renderLiabilities();
    renderTimeline();
    renderRecords();
    renderEventAccordion();
    renderAssetChart();
    renderRecentRecords();

    console.log(`🚀 [DREAM Ledger v4] 啟動完成，模式：${activeUser}`);
});