/**
 * DREAM Ledger - Sandbox Seed Data v2.0
 * Showcase User v1.0：Alex Chen（畢業滿一年的上班族）
 * 此檔案為 localStorage sandbox 的初始預設值，不代表任何真實人物
 *
 * 支出欄位映射說明（暫用現有欄位結構）：
 *   insurance           → 水電瓦斯（$1,000）
 *   telecomSubscription → Netflix + 電話費 + 0050 定期定額（$3,050）
 *   kgiPolicy (資產)    → 0050 ETF 目前市值
 */

const sandboxSeed = {
    version: "2.0",
    meta: {
        owner: "Alex Chen",
        label: "Sandbox"
    },
    // 資料結構需與 data/user.js 的 dreamUser 屬性名稱相容
    user: {
        realAssets: {
            cash:       20000,  // 現金
            kgiPolicy:   2000,  // 0050 ETF 投資（上個月開始，目前市值）
            andaTwd:     3000,  // 安達儲蓄保單（現值）
            botSavings:     0
        },
        realLiabilities: {
            fubonLoan:       0,
            studentLoan: 400000, // 教育部學貸（本月開始還款）
            privateLoan:     0,
            massageChair:  20000 // MacBook 24 期，已繳 12 期，剩餘 20,000
        },
        income: {
            baseSalary:   45000,
            reimbursement:    0,
            kgiDividend:      0  // 0050 配息目前微量，暫計 0
        },
        expense: {
            rent:          10000,
            insurance:      1000, // 水電瓦斯（暫用保險欄位）
            loanRepayment: { fubon: 0, student: 4000, massageChair: 1667 },
            telecomSubscription: 3050  // Netflix 250 + 電話費 800 + 0050 定期定額 2,000
        }
    },
    // 與 user.js 同架構，category 通用、label 為 Showcase 角色的個人標籤
    liabilityMeta: {
        fubonLoan:    { category: '信用貸款', label: '',             monthlyKey: 'fubon',        badge: 'active', note: '' },
        studentLoan:  { category: '學生貸款', label: '教育部學貸',   monthlyKey: 'student',      badge: 'active', note: '2026/06 開始還款，預計 8 年還完 40 萬' },
        privateLoan:  { category: '個人借款', label: '',             monthlyKey: null,           badge: 'soon',   note: '' },
        massageChair: { category: '信用卡分期', label: 'MacBook 分期', monthlyKey: 'massageChair', badge: 'active', note: '24 期零利率，已繳 12 期，剩餘 12 期' },
    },
    incomeMeta: {
        baseSalary:    { category: '薪資',    label: '底薪',     sub: '保底基準，每月確認' },
        reimbursement: { category: '報銷',    label: '費用報銷', sub: '浮動，每月不同' },
        kgiDividend:   { category: '配息收入', label: '0050 配息', sub: '目前微量，累積中' },
    },
    events: [
        {
            year: "2025", category: "Career",
            title: "大學畢業，開始第一份工作",
            fact:     "2025 年大學畢業，進入公司擔任職員，月薪 45,000 元，學貸進入 1 年寬限期。",
            context:  "第一份薪水入帳後發現，扣除房租和生活費，可支配的空間其實不大。",
            question: "月薪 45,000，如何在不需還學貸的一年內打好財務基礎？",
            decision: "優先壓低生活支出，月租維持在 10,000 以下，並開始研究投資入門。"
        },
        {
            year: "2025", category: "Life",
            title: "搬出家裡，首次獨立租屋",
            fact:     "畢業後搬離家裡，在公司附近租套房，月租 10,000 元。",
            context:  "第一次完全自立，固定支出從 0 到每月至少一萬，消費心態開始改變。",
            question: "租金佔月薪 22%，這個比例在台灣一線城市還算合理嗎？",
            decision: "選擇步行可達公司的地點，省去交通費，用地點便利性抵消租金壓力。"
        },
        {
            year: "2026", category: "Cognition",
            title: "購入 MacBook，第一次使用分期付款",
            fact:     "為提升工作效率購買 MacBook Pro，售價 40,000 元，選擇 24 期零利率分期，每月 1,667 元。",
            context:  "零利率讓分期看起來很划算，但每月多出 1,667 元固定支出，影響現金流彈性。",
            question: "零利率分期是真的省錢，還是讓消費決策變得模糊？",
            decision: "完成購買，但決定記錄這筆決策，觀察分期對未來財務的實際影響。"
        },
        {
            year: "2026", category: "Investment",
            title: "開始定期定額投資 0050，每月 2,000 元",
            fact:     "工作約半年後決定開始投資，選擇台灣 50（0050），設定每月定期定額 2,000 元。",
            context:  "雖然金額不大，但認識到早起步複利效果更顯著，決定從小額開始。",
            question: "每月 2,000 元，20 年後若年化報酬 8% 能累積多少？",
            decision: "選擇 0050 定期定額，不擇時，不預測，專注在持續投入和生活成本控制。"
        },
        {
            year: "2026", category: "Cognition",
            title: "學貸寬限期結束，正式開始還款",
            fact:     "2026 年 6 月學貸寬限期屆滿，開始每月還款 4,000 元，預計 8 年還完剩餘 40 萬。",
            context:  "學貸還款加上 MacBook 分期，固定債務支出達每月 5,667 元，佔月薪 12.6%。",
            question: "學貸 + 分期 + 投資，每月固定支出接近兩萬，財務韌性足夠嗎？",
            decision: "維持 0050 定期定額不中斷，學貸按時還款，同時開始使用 DREAM Ledger 系統化追蹤現金流。"
        },
    ],
    snapshots: [
        { date: "2025-07", assets:  25000, liabilities: 400000, netWorth: -375000, note: "estimated / 剛開始工作，第一個月薪水，學貸寬限期進行中" },
        { date: "2025-12", assets:  38000, liabilities: 400000, netWorth: -362000, note: "estimated / 工作半年，持續儲蓄，學貸尚未開始還款" },
        { date: "2026-03", assets:  46000, liabilities: 420000, netWorth: -374000, note: "estimated / 購入 MacBook 分期，負債增加 40,000" },
        { date: "2026-06", assets:  25000, liabilities: 420000, netWorth: -395000, note: "audited / 學貸開始還款，0050 起步，本月現況" },
    ],
    records: [
        // ── 2026-04 ─────────────────────────────────────────────────
        { id: "r001", date: "2026-04-01", description: "薪資入帳",     amount: 45000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "r002", date: "2026-04-02", description: "房租",         amount: 10000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "r003", date: "2026-04-05", description: "MacBook 分期", amount:  1667, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "r004", date: "2026-04-06", description: "水電費",       amount:  1000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "r005", date: "2026-04-10", description: "超市採買",     amount:  1200, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "r006", date: "2026-04-15", description: "電話費",       amount:   800, type: "expense", category: "通訊", isEvent: false, note: "" },
        { id: "r007", date: "2026-04-15", description: "Netflix",      amount:   250, type: "expense", category: "通訊", isEvent: false, note: "" },
        { id: "r008", date: "2026-04-20", description: "外食咖啡",     amount:   350, type: "expense", category: "食",   isEvent: false, note: "" },
        // ── 2026-05 ─────────────────────────────────────────────────
        { id: "r009", date: "2026-05-01", description: "薪資入帳",     amount: 45000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "r010", date: "2026-05-02", description: "房租",         amount: 10000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "r011", date: "2026-05-05", description: "0050 定期定額", amount: 2000, type: "expense", category: "投資", isEvent: false, note: "第一次定期定額，開始投資旅程" },
        { id: "r012", date: "2026-05-05", description: "MacBook 分期", amount:  1667, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "r013", date: "2026-05-06", description: "水電費",       amount:   980, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "r014", date: "2026-05-10", description: "超市採買",     amount:  1400, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "r015", date: "2026-05-15", description: "電話費",       amount:   800, type: "expense", category: "通訊", isEvent: false, note: "" },
        { id: "r016", date: "2026-05-15", description: "Netflix",      amount:   250, type: "expense", category: "通訊", isEvent: false, note: "" },
        { id: "r017", date: "2026-05-22", description: "好友聚餐",     amount:   780, type: "expense", category: "食",   isEvent: false, note: "" },
        // ── 2026-06 ─────────────────────────────────────────────────
        { id: "r018", date: "2026-06-01", description: "薪資入帳",     amount: 45000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "r019", date: "2026-06-02", description: "房租",         amount: 10000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "r020", date: "2026-06-05", description: "0050 定期定額", amount: 2000, type: "expense", category: "投資", isEvent: false, note: "" },
        { id: "r021", date: "2026-06-05", description: "學貸首期還款", amount:  4000, type: "expense", category: "負債", isEvent: false, note: "寬限期結束，正式開始還款，預計 8 年" },
        { id: "r022", date: "2026-06-05", description: "MacBook 分期", amount:  1667, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "r023", date: "2026-06-08", description: "超市採買",     amount:   850, type: "expense", category: "食",   isEvent: false, note: "" },
    ]
};
