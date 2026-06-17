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
let _chartRecMonthly    = null;

// ── 2. 頁面路由系統 ───────────────────────────────────────────
const PAGE_LABELS = {
    dashboard:   'DREAM LEDGER // DASHBOARD',
    assets:      'DREAM LEDGER // 資產管理',
    liabilities: 'DREAM LEDGER // 負債管理',
    events:      'DREAM LEDGER // 人生事件',
    records:     'DREAM LEDGER // 記帳紀錄',
    about:       'DREAM LEDGER // About',
    philosophy:  'DREAM LEDGER // Philosophy',
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

    const statusEl = document.getElementById("networth-status");
    if (statusEl) {
        const now = new Date();
        const ym  = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
        statusEl.textContent = netWorth < 0 ? `${ym}  ·  財務重建中` : `${ym}  ·  淨值轉正`;
        statusEl.style.color = netWorth < 0 ? 'var(--text-muted)' : 'var(--neon-green)';
    }

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set("totalAssets",      formatCurrency(totalAssets));
    set("totalLiabilities", formatCurrency(totalLiab));
    set("income",           formatCurrency(income));
    set("expense",          formatCurrency(expense));
    set("cashflow",         formatCurrency(cashflow));
    set("debt",             formatCurrency(totalLiab));
    set("d-assets2",        formatCurrency(totalAssets));
    set("d-liab2",          formatCurrency(totalLiab));
    const nw2El = document.getElementById("d-networth2");
    if (nw2El) {
        nw2El.textContent = formatCurrency(netWorth);
        nw2El.style.color = netWorth < 0 ? "#f9a8d4" : "#93c5fd";
        nw2El.style.textShadow = netWorth < 0 ? "0 0 12px rgba(249,168,212,0.5)" : "0 0 12px rgba(147,197,253,0.5)";
    }
    set("d-kgiInvested",    formatCurrency(dreamUser.kgiPolicyInvested || 0));
    set("passiveIncome",    formatCurrency(passiveIncome));

    const crEl = document.getElementById("coverageRatio");
    if (crEl) {
        crEl.textContent = formatPercentage(coverageRatio);
        crEl.style.color = "#fbbf24";
    }

    // 現金流比例 bar 標籤
    if (income > 0) {
        const expPct  = Math.min(100, expense  / income * 100).toFixed(1);
        const freePct = Math.max(0,   cashflow / income * 100).toFixed(1);
        const expLbl  = document.getElementById("cf-bar-exp-label");
        const freeLbl = document.getElementById("cf-bar-free-label");
        if (expLbl)  expLbl.textContent  = "支出 " + expPct  + "%";
        if (freeLbl) freeLbl.textContent = "現金流 " + freePct + "%";
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
    set("a-fubonMonthly",   formatCurrency(dreamUser.cashflowModel.expense.loanRepayment.creditLoan));

    const nwEl = document.getElementById("a-netWorth");
    if (nwEl) nwEl.style.color = netWorth < 0 ? "#f9a8d4" : "#93c5fd";

    const divEl = document.getElementById("a-dividend");
    if (divEl) divEl.style.color = "#fdba74";
    const covEl = document.getElementById("a-coverage");
    if (covEl) covEl.style.color = "#fbbf24";
}

// ── 5. 負債管理頁渲染 ─────────────────────────────────────────
function renderLiabilities() {
    if (typeof dreamUser === 'undefined') return;
    const l    = dreamUser.realLiabilities;
    const meta = dreamUser.liabilityMeta || {};
    const loan = dreamUser.cashflowModel.expense.loanRepayment;
    const totalLiab    = dreamUser.getters.getTotalLiabilities();
    const monthlyRepay = loan.total;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('l-totalLiabilities', formatCurrency(totalLiab));
    set('l-monthlyRepay',     formatCurrency(monthlyRepay));

    // 負債收入比 & 月還款壓力
    const monthlyIncome  = dreamUser.cashflowModel.income.total;
    const debtToIncomeEl = document.getElementById('l-debtToIncome');
    if (debtToIncomeEl && monthlyIncome > 0) {
        const ratio = totalLiab / monthlyIncome;
        debtToIncomeEl.textContent = ratio.toFixed(1) + ' 倍月薪';
        debtToIncomeEl.style.color = ratio > 12 ? 'var(--neon-rose)' : ratio > 6 ? 'var(--neon-amber)' : 'var(--neon-green)';
    }
    const paymentRatioEl = document.getElementById('l-paymentRatio');
    if (paymentRatioEl && monthlyIncome > 0) {
        const ratio = monthlyRepay / monthlyIncome;
        paymentRatioEl.textContent = formatPercentage(ratio);
        paymentRatioEl.style.color = ratio > 0.2 ? 'var(--neon-rose)' : ratio > 0.15 ? 'var(--neon-amber)' : 'var(--neon-green)';
    }

    // 固定四類別順序：學生貸款 → 信用貸款 → 信用卡分期 → 個人借款
    const LIAB_ORDER = ['creditLoan', 'studentLoan', 'cardInstallment', 'personalLoan'];
    const LIAB_COLORS = {
        creditLoan:      '#dc2626',  // 深紅
        studentLoan:     '#f87171',  // 淺紅
        cardInstallment: '#7c3aed',  // 深紫
        personalLoan:    '#c084fc',  // 粉紫
    };
    const LIAB_SHEENS = {
        creditLoan:      'rgba(220,38,38,1)',
        studentLoan:     'rgba(248,113,113,1)',
        cardInstallment: 'rgba(124,58,237,1)',
        personalLoan:    'rgba(192,132,252,1)',
    };
    const allItems = LIAB_ORDER.map(key => {
        const m          = meta[key] || {};
        const monthlyKey = m.monthlyKey;
        const monthly    = monthlyKey ? (loan[monthlyKey] || 0) : 0;
        return {
            key,
            category: m.category || key,
            label:    m.label    || '',
            amount:   l[key] || 0,
            monthly,
            badge:    m.badge || 'active',
            note:     m.note  || '',
        };
    });
    const activeItems = allItems.filter(item => item.amount > 0);

    // 動態字卡列（固定四張，$0 顯示「無負債」）
    const statGrid = document.getElementById('liab-stat-grid');
    if (statGrid) {
        statGrid.innerHTML = allItems.map(item => {
            const isEmpty = item.amount === 0;
            const hex     = LIAB_COLORS[item.key] || '#ff4d6d';
            const valColor   = isEmpty ? 'var(--text-muted)' : hex;
            const borderRgba = isEmpty ? 'rgba(255,255,255,0.08)' : hex + '72';
            const bgRgba     = isEmpty ? '' : hex + '0d';
            const sheen = LIAB_SHEENS[item.key] || 'rgba(255,255,255,0.9)';
            return `
            <div class="card dark-panel" style="--sheen:${sheen};border:2px solid ${borderRgba}!important;background:linear-gradient(180deg,var(--panel),${bgRgba})!important;box-shadow:0 0 22px ${hex}18">
                <span style="font-size:12px">${item.category}</span>
                ${item.label ? `<span style="font-size:10px;color:var(--text-muted);display:block;margin-bottom:6px">${item.label}</span>` : ''}
                <strong style="color:${valColor};text-shadow:0 0 12px ${hex}66">${isEmpty ? '$0' : formatCurrency(item.amount)}</strong>
                ${isEmpty ? '<div style="font-size:10px;color:var(--text-muted);margin-top:4px">無負債</div>' : ''}
            </div>`;
        }).join('');
    }

    // 右欄月還款合計副本
    const mr2 = document.getElementById('l-monthlyRepay-2');
    if (mr2) mr2.textContent = formatCurrency(monthlyRepay);

    // 負債結構分析（只顯示有餘額的項目，樣式對齊 asset-item）
    const container = document.getElementById('debt-breakdown');
    if (!container) return;
    container.innerHTML = activeItems.map(item => {
        const pct        = (item.amount / totalLiab * 100).toFixed(1);
        const badgeClass = item.badge === 'soon' ? 'badge-soon' : 'badge-active';
        const badgeText  = item.badge === 'soon' ? '即將清償' : '還款中';
        const noteLine   = [item.label, item.note].filter(Boolean).join(' · ');
        return `
        <div class="asset-item" style="align-items:flex-start;flex-direction:column;gap:0;padding-bottom:0">
            <div style="display:flex;justify-content:space-between;width:100%;align-items:flex-start">
                <div>
                    <div class="asset-label">${item.category} <span class="badge ${badgeClass}" style="margin-left:4px">${badgeText}</span></div>
                    ${noteLine ? `<div class="asset-note">${noteLine}</div>` : ''}
                </div>
                <div style="text-align:right">
                    <div class="asset-value" style="color:var(--neon-cyan);text-shadow:0 0 14px rgba(34,211,238,0.55)">${formatCurrency(item.amount)}</div>
                    ${item.monthly ? `<div style="font-size:11px;color:var(--text-muted);margin-top:2px">月付 ${formatCurrency(item.monthly)}</div>` : ''}
                </div>
            </div>
            <div class="debt-bar-bg" style="width:100%;margin-top:10px"><div class="debt-bar-fill" style="width:${pct}%"></div></div>
            <div class="debt-meta" style="width:100%"><span>佔總負債</span><span>${pct}%</span></div>
        </div>`;
    }).join('');
}

// ── 6. 人生事件頁渲染（時間軸） ──────────────────────────────
const CAT_COLOR = {
    Career:            'var(--neon-green)',
    Family:            'var(--neon-rose)',
    Cognition:         '#a78bfa',
    Life:              'var(--neon-amber)',
    Investment:        'var(--neon-cyan)',
    Protection:        '#60a5fa',
    Leverage:          '#f97316',
    'Asset Allocation': '#94a3b8',
};
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
            renderEventAccordion('timeline-list', btn.dataset.cat);
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

// Layer 4 細項明細折疊 toggle
function toggleRecDetail(section) {
    const body  = document.getElementById('rec-detail-' + section);
    const arrow = document.getElementById('rec-arrow-' + section);
    if (!body) return;
    const isOpen = body.classList.toggle('open');
    if (arrow) {
        arrow.textContent = isOpen ? '▼ 收起' : '▶ 展開';
        arrow.style.color = isOpen ? 'var(--neon-cyan)' : '';
    }
}

function toggleRecCard(hdr) {
    const body  = hdr.nextElementSibling;
    const arrow = hdr.querySelector('.rec-toggle-arrow');
    const isOpen = body.classList.toggle('open');
    if (arrow) {
        arrow.textContent   = isOpen ? '▲ 收起' : '▼ 展開';
        arrow.style.color   = isOpen ? 'var(--neon-cyan)' : '';
    }
}

// 記錄表單：新增 / 編輯 dispatcher
let _editingRecordId = null;

function submitRecordForm() {
    if (_editingRecordId) saveEditedRecord();
    else addRecord();
}

function editRecord(id) {
    const records = loadRecords();
    const r = records.find(rec => rec.id === id);
    if (!r) return;
    _editingRecordId = id;

    const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val; };
    set('rec-desc',     r.description || '');
    set('rec-amount',   r.amount || '');
    set('rec-type',     r.type || 'expense');
    set('rec-category', r.category || '其他');
    set('rec-date',     r.date || '');

    const cb = document.getElementById('rec-is-event');
    if (cb) { cb.checked = !!r.isEvent; cb.dispatchEvent(new Event('change')); }

    const noteEl = document.getElementById('rec-note');
    if (noteEl) { noteEl.value = r.note || ''; if (r.note) noteEl.style.display = ''; }

    const titleEl = document.getElementById('rec-form-title');
    if (titleEl) titleEl.textContent = '編輯記錄';
    const submitBtn = document.getElementById('rec-submit-btn');
    if (submitBtn) submitBtn.textContent = '更新記錄';
    const cancelBtn = document.getElementById('rec-cancel-btn');
    if (cancelBtn) cancelBtn.style.display = '';

    titleEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveEditedRecord() {
    if (!_editingRecordId) return;

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
    const idx = records.findIndex(r => r.id === _editingRecordId);
    if (idx === -1) { cancelEditRecord(); return; }

    const old = records[idx];
    if (old.id.startsWith('rec_') && !old.isEvent && old.amount > 0) {
        if (old.type === 'income') dreamUser.realAssets.cash -= old.amount;
        else                       dreamUser.realAssets.cash += old.amount;
    }
    if (!isEvent && amount > 0) {
        if (type === 'income') dreamUser.realAssets.cash += amount;
        else                   dreamUser.realAssets.cash -= amount;
    }

    records[idx] = { ...old, description: desc, amount: isEvent ? 0 : amount, type, category, date, isEvent, note };
    saveRecordsToStorage(records);

    cancelEditRecord();
    renderDashboard();
    renderAssets();
    renderRecords();
    renderRecentRecords();
}

function cancelEditRecord() {
    _editingRecordId = null;
    ['rec-desc', 'rec-amount', 'rec-note'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
    const cb = document.getElementById('rec-is-event');
    if (cb) { cb.checked = false; cb.dispatchEvent(new Event('change')); }

    const titleEl = document.getElementById('rec-form-title');
    if (titleEl) titleEl.textContent = '新增記錄';
    const submitBtn = document.getElementById('rec-submit-btn');
    if (submitBtn) submitBtn.textContent = '+ 新增記錄';
    const cancelBtn = document.getElementById('rec-cancel-btn');
    if (cancelBtn) cancelBtn.style.display = 'none';
}

// 最近紀錄展開（顯示全部）
let _recentShowAll = false;
function expandRecentRecords() {
    _recentShowAll = true;
    renderRecentRecords();
}

// 通用圓餅圖渲染（含舊實例銷毀 + 空資料狀態）
// ── DREAM Ledger Visual Language v1 ──────────────────────────
// 色彩哲學：投資=未來(Cyan)、負債=過去(Amber)、生活=現在(Slate)
// 視覺層級：投資最亮（未來）→ 負債中亮（過去）→ 生活極暗（現在退後）
const VL = {
    investment: '#22d3ee',   // 同步 --neon-cyan，最高存在感
    debt:       '#fbbf24',   // 同步 --neon-amber，謹慎但不驚恐
    // 生活色貼近背景，讓大面積反而消失在畫布中
    _living:    ['#29354A', '#2D3A50', '#313E55', '#354259', '#39465D'],
};

function _semanticColors(labels) {
    let li = 0;
    return labels.map(label => {
        if (/投資|配息|儲蓄/.test(label))                            return VL.investment;
        if (/貸款|負債|分期|信貸|借款/.test(label))                   return VL.debt;
        return VL._living[li++ % VL._living.length];
    });
}

// 清除 chart wrap 內的臨時提示元素
function _clearChartWrap(wrapId, className) {
    const wrap = document.getElementById(wrapId);
    if (wrap) { const el = wrap.querySelector('.' + className); if (el) el.remove(); }
}

function _fmtShort(n) { return '$' + Math.round(Math.abs(n)).toLocaleString('zh-TW'); }

function _renderPieChart(canvasId, wrapId, oldInstance, labels, data, opts = {}) {
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

    const colors = opts.colors || _semanticColors(labels);

    // 根據色段決定 glow（有投資 → 青光，有負債 → 暖金，兩者都有 → 青光優先）
    const hasInv  = colors.includes(VL.investment);
    const hasDebt = colors.includes(VL.debt);
    const glowColor = opts.glowColor
        || (hasInv  ? 'rgba(40,240,215,0.28)' : hasDebt ? 'rgba(201,139,58,0.28)' : null);

    const inlinePlugins = [];

    if (glowColor) {
        inlinePlugins.push({
            id: 'arcGlow',
            beforeDatasetsDraw(chart) {
                chart.ctx.save();
                chart.ctx.shadowBlur  = 14;
                chart.ctx.shadowColor = glowColor;
            },
            afterDatasetsDraw(chart) {
                chart.ctx.restore();
                chart.ctx.shadowBlur = 0;
            }
        });
    }

    if (opts.centerLabel) {
        inlinePlugins.push({
            id: 'centerText',
            afterDraw(chart) {
                const { ctx: c, chartArea } = chart;
                const cx = (chartArea.left + chartArea.right) / 2;
                const cy = (chartArea.top + chartArea.bottom) / 2;
                c.save();
                c.textAlign      = 'center';
                c.textBaseline   = 'middle';
                c.fillStyle      = opts.centerColor || '#e2e8f0';
                c.font           = 'bold 15px system-ui,sans-serif';
                c.fillText(opts.centerValue || '', cx, cy - 9);
                c.fillStyle      = '#64748b';
                c.font           = '10px system-ui,sans-serif';
                c.fillText(opts.centerLabel, cx, cy + 9);
                c.restore();
            }
        });
    }

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                borderColor: 'rgba(5,5,7,0.65)',
                borderWidth: 2,
                hoverOffset: 6
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
            cutout: '62%'
        },
        plugins: inlinePlugins
    });
}

function renderRecords() {
    if (typeof dreamUser === 'undefined') return;
    const i   = dreamUser.cashflowModel.income;
    const e   = dreamUser.cashflowModel.expense;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    // 固定收入明細
    const iMeta = dreamUser.incomeMeta || {};
    const incomeItems = [
        { key: 'baseSalary',    amount: i.baseSalary,    freq: '每月'   },
        { key: 'reimbursement', amount: i.reimbursement, freq: '不定期' },
        { key: 'kgiDividend',   amount: i.kgiDividend,   freq: '每月'   },
    ].filter(it => it.amount > 0).map(it => ({
        label:  iMeta[it.key]?.category || it.key,
        sub:    iMeta[it.key]?.label    || '',
        amount: it.amount,
        freq:   it.freq,
    }));

    // 固定支出明細
    const lMeta = dreamUser.liabilityMeta || {};
    const loanExpenses = Object.keys(dreamUser.realLiabilities)
        .map(key => {
            const m = lMeta[key] || {};
            if (!m.monthlyKey) return null;
            const amt = e.loanRepayment[m.monthlyKey] || 0;
            if (!amt) return null;
            return { label: m.category || key, sub: m.label ? m.label + ' · 月還款' : '月還款', amount: amt, freq: '每月' };
        }).filter(Boolean);

    const expenseItems = [
        { label: '住居',    sub: '', amount: e.rent,                 freq: '每月' },
        { label: '保險',    sub: '', amount: e.insurance,            freq: '每月' },
        ...loanExpenses,
        { label: '電信訂閱', sub: '', amount: e.telecomSubscription, freq: '每月' },
    ].filter(it => it.amount > 0);

    // 記帳記錄
    const records    = loadRecords();
    const txRecords  = records.filter(r => !r.isEvent && r.amount > 0);
    const thisMonth  = new Date().toISOString().slice(0, 7);
    const mthRecs    = txRecords.filter(r => r.date.startsWith(thisMonth));
    const mthExpRecs = mthRecs.filter(r => r.type === 'expense');
    const mthIncRecs = mthRecs.filter(r => r.type === 'income');
    const mthExpTotal = mthExpRecs.reduce((s, r) => s + r.amount, 0);
    const mthIncTotal = mthIncRecs.reduce((s, r) => s + r.amount, 0);
    const actualCashflow = i.total + mthIncTotal - e.total - mthExpTotal;
    const cfColor = actualCashflow >= 0 ? 'var(--neon-green)' : 'var(--neon-rose)';

    // ─ 四張字卡 ─
    set('rs-fixed-income',    formatCurrency(i.total));
    set('rs-fixed-expense',   formatCurrency(e.total));
    set('rs-monthly-expense', formatCurrency(mthExpTotal));
    set('rs-monthly-sub',     mthRecs.length + ' 筆記帳');
    const cfEl = document.getElementById('rs-cashflow');
    if (cfEl) { cfEl.textContent = formatCurrency(actualCashflow); cfEl.style.color = cfColor; }

    const incomeSubEl = document.getElementById('rs-income-sub');
    if (incomeSubEl) incomeSubEl.textContent = incomeItems.map(it => it.label).join(' · ') || '無資料';

    const liveAmt   = e.rent + e.insurance + e.telecomSubscription;
    const debtAmt   = e.loanRepayment.total;
    const expFlowEl = document.getElementById('rs-expense-flow');
    if (expFlowEl) {
        const parts = [];
        if (liveAmt > 0) parts.push(`<span style="color:#dc2626">基本開銷</span> ${_fmtShort(liveAmt)}`);
        if (debtAmt > 0) parts.push(`<span style="color:#f9a8d4">負債</span> ${_fmtShort(debtAmt)}`);
        expFlowEl.innerHTML = parts.join('&nbsp;&nbsp;');
    }

    // ─ 細項明細 Tab（Table 格式）─
    function fillDetailTable(tbodyId, items, isExpense) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        const color = isExpense ? 'var(--neon-rose)' : 'var(--neon-green)';
        const sign  = isExpense ? '−' : '+';
        tbody.innerHTML = items.length === 0
            ? `<tr><td colspan="3" style="color:var(--text-muted);padding:12px 8px;text-align:center">尚無資料</td></tr>`
            : items.map(it => {
                const sub = it.sub ? `<div style="font-size:10px;color:var(--text-muted)">${it.sub}</div>` : '';
                return `<tr>
                    <td>${it.label}${sub}</td>
                    <td style="color:var(--text-muted);font-size:11px">${it.freq || '每月'}</td>
                    <td style="color:${color};font-weight:600;white-space:nowrap">${sign}${formatCurrency(it.amount)}</td>
                </tr>`;
            }).join('');
    }
    fillDetailTable('rs-income-items',  incomeItems,  false);
    fillDetailTable('rs-expense-items', expenseItems, true);

    // ─ 本月資金流向圓餅：生活支出 + 負債支出 + 現金流 = 固定收入 ─
    const incTotal = i.total;
    const flowSegments = [
        { label: '基本開銷', amount: liveAmt,                      color: '#dc2626'     },
        { label: '負債支出', amount: debtAmt,                      color: '#f9a8d4'     },
        { label: '現金流',   amount: Math.max(0, actualCashflow),  color: '#3b82f6'      },
    ].filter(s => s.amount > 0);
    _chartRecMonthly = _renderPieChart(
        'chartRecMonthly', 'chartRecMonthlyWrap', _chartRecMonthly,
        flowSegments.map(s => s.label),
        flowSegments.map(s => s.amount),
        { centerLabel: '固定收入', centerValue: _fmtShort(incTotal), colors: flowSegments.map(s => s.color) }
    );
}

// ── 8. Dashboard 手風琴事件列表 ──────────────────────────────
function renderEventAccordion(containerId = 'event-list', filterCat = 'all') {
    if (typeof lifeEvents === 'undefined') return;
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = "";

    const isDashboard = containerId === 'event-list';
    let events = filterCat === 'all' ? lifeEvents : lifeEvents.filter(e => e.category === filterCat);
    if (isDashboard) events = [...events].sort((a, b) => b.year - a.year);
    events.forEach(event => {
        const catColor = CAT_COLOR[event.category] || 'var(--text-muted)';
        const card = document.createElement("div");
        card.className = "collapsible-event";
        card.innerHTML = `
            <div class="event-summary">
                <div>
                    <div class="event-meta">
                        <span class="event-year">${event.year}</span>
                        <span class="event-tag" style="color:${catColor};border-color:${catColor}33">${event.category}</span>
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

    if (isDashboard) {
        requestAnimationFrame(() => {
            const items = el.querySelectorAll('.collapsible-event');
            const wrap  = document.getElementById('event-expand-wrap');
            if (items.length > 3) {
                let h = 0;
                for (let i = 0; i < 3; i++) h += items[i].offsetHeight + 10;
                el.style.maxHeight = h + 'px';
                el.dataset.collapsedHeight = h;
                el.dataset.expanded = 'false';
                if (wrap) wrap.style.display = 'block';
            } else {
                el.style.maxHeight = 'none';
                if (wrap) wrap.style.display = 'none';
            }
            // 第二幀：event-card 高度已穩定，同步給 chart-card
            requestAnimationFrame(() => {
                const eventCard = document.getElementById('panel-events');
                const chartCard = document.querySelector('.chart-card');
                if (eventCard && chartCard) {
                    chartCard.style.height = eventCard.offsetHeight + 'px';
                    if (_assetChartInstance) _assetChartInstance.resize();
                }
            });
        });
    }
}

function toggleEventList() {
    const el  = document.getElementById('event-list');
    const btn = document.getElementById('event-expand-btn');
    if (!el || !btn) return;

    if (el.dataset.expanded === 'true') {
        el.style.maxHeight = el.dataset.collapsedHeight + 'px';
        el.style.overflowY = 'hidden';
        el.dataset.expanded = 'false';
        btn.textContent = '展開全部 ▼';
    } else {
        const items = el.querySelectorAll('.collapsible-event');
        const limit = Math.min(items.length, 8);
        let h = 0;
        for (let i = 0; i < limit; i++) h += items[i].offsetHeight + 10;
        el.style.maxHeight = h + 'px';
        el.style.overflowY = items.length > 8 ? 'auto' : 'hidden';
        el.dataset.expanded = 'true';
        btn.textContent = '收起 ▲';
    }
}

// ── 9. Chart.js 雙曲線（資產 + 淨值）+ 審計標注 ────────────
function renderAssetChart() {
    const ctx = document.getElementById('assetChart');
    if (!ctx) return;

    const hasSS = typeof snapshotSystem !== 'undefined';
    const labels        = hasSS ? snapshotSystem.getLabels()                          : ['2026-06'];
    const assetData     = hasSS ? snapshotSystem.getAssetSeries()                     : [1125002];
    const netWorthData  = hasSS ? snapshotSystem.getNetWorthSeries()                  : [-134653];
    const liabData      = hasSS ? snapshots.map(s => s.liabilities ?? 0)             : [1259655];

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
                    borderColor: '#6ee7b7',
                    backgroundColor: 'rgba(110,231,183,0.04)',
                    borderWidth: 2, tension: 0.2,
                    pointBackgroundColor: assetData.map((_, i) => {
                        const snap = snapshots?.[i];
                        return snap?.note?.startsWith('audited') ? '#6ee7b7' : 'rgba(110,231,183,0.4)';
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
                    borderColor: '#93c5fd',
                    backgroundColor: 'rgba(147,197,253,0.03)',
                    borderWidth: 2, tension: 0.2,
                    borderDash: [4, 3],
                    pointBackgroundColor: netWorthData.map((_, i) => {
                        const snap = snapshots?.[i];
                        return snap?.note?.startsWith('audited') ? '#93c5fd' : 'rgba(147,197,253,0.4)';
                    }),
                    pointRadius: netWorthData.map((_, i) => {
                        const snap = snapshots?.[i];
                        return snap?.note?.startsWith('audited') ? 6 : 3;
                    }),
                    pointHoverRadius: 7,
                    fill: false
                },
                {
                    label: '真實負債',
                    data: liabData,
                    borderColor: '#f9a8d4',
                    backgroundColor: 'rgba(249,168,212,0.03)',
                    borderWidth: 2, tension: 0.2,
                    borderDash: [6, 4],
                    pointBackgroundColor: liabData.map((_, i) => {
                        const snap = snapshots?.[i];
                        return snap?.note?.startsWith('audited') ? '#f9a8d4' : 'rgba(249,168,212,0.4)';
                    }),
                    pointRadius: liabData.map((_, i) => {
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
                            const prefix = ['總資產', '淨資產', '真實負債'][ctx.datasetIndex] || '';
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
const SANDBOX_VERSION = "2.0";

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
        // 版本變更時一律重置 records（保留舊版記錄會造成角色資料錯亂）
        localStorage.setItem(LS_RECORDS + ':sandbox', JSON.stringify(sandboxSeed.records));
    }

    const u = data.user;

    // 替換資產（保留 getter 結構，只換數值）
    Object.keys(dreamUser.realAssets).forEach(k => delete dreamUser.realAssets[k]);
    Object.assign(dreamUser.realAssets, u.realAssets);

    // 替換負債
    Object.keys(dreamUser.realLiabilities).forEach(k => delete dreamUser.realLiabilities[k]);
    Object.assign(dreamUser.realLiabilities, u.realLiabilities);

    // 替換顯示元數據（category/label 層）
    if (data.liabilityMeta) dreamUser.liabilityMeta = data.liabilityMeta;
    if (data.incomeMeta)    dreamUser.incomeMeta    = data.incomeMeta;

    // 替換收入（逐欄賦值，保留 getter）
    dreamUser.cashflowModel.income.baseSalary    = u.income.baseSalary;
    dreamUser.cashflowModel.income.reimbursement = u.income.reimbursement;
    dreamUser.cashflowModel.income.kgiDividend   = u.income.kgiDividend;

    // 替換支出（逐欄賦值，保留 getter）
    dreamUser.cashflowModel.expense.rent                        = u.expense.rent;
    dreamUser.cashflowModel.expense.insurance                   = u.expense.insurance;
    dreamUser.cashflowModel.expense.telecomSubscription         = u.expense.telecomSubscription;
    dreamUser.cashflowModel.expense.loanRepayment.creditLoan      = u.expense.loanRepayment.creditLoan;
    dreamUser.cashflowModel.expense.loanRepayment.student        = u.expense.loanRepayment.student;
    dreamUser.cashflowModel.expense.loanRepayment.cardInstallment = u.expense.loanRepayment.cardInstallment;

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
        container.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:16px 0;text-align:center">尚無記錄 — 使用上方表單新增第一筆</div>';
        if (btn) btn.style.display = 'none';
        return;
    }

    const MAX = _recentShowAll ? 999 : 3;
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
            <div style="display:flex;align-items:center;gap:10px;margin-left:12px;flex-shrink:0">
                ${amtEl}
                <span style="font-size:13px;color:var(--text-muted);cursor:pointer;opacity:0.45;transition:opacity 0.2s"
                      onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.45'"
                      onclick="editRecord('${r.id}')">✎</span>
                <span style="font-size:12px;color:var(--text-muted);cursor:pointer;opacity:0.45;transition:opacity 0.2s"
                      onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.45'"
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
    renderEventAccordion('timeline-list');
    renderRecords();
    renderEventAccordion();
    renderAssetChart();
    renderRecentRecords();

    console.log(`🚀 [DREAM Ledger v4] 啟動完成，模式：${activeUser}`);
});