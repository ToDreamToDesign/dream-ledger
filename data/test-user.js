/**
 * DREAM Ledger - Test User Seed v1.0
 * 功能測試用：剛畢業新人模型
 * 用途：測試 CRUD、記帳流程、UI 功能，不代表任何真實人物
 *
 * 財務概況：
 *   薪資 45,000｜學貸 400,000｜信用卡分期 20,000
 *   0050 定期定額 2,000/月｜生活開銷約 8,000/月
 */

const testUserSeed = {
    version: "1.0",
    meta: { owner: "Sam Lin", label: "Test User" },

    user: {
        realAssets: {
            cash:      18000,  // 現金（月底剩餘）
            kgiPolicy:  4000,  // 0050 ETF 目前市值（剛開始累積）
            andaTwd:    2000,  // 小額儲蓄
            botSavings:    0,
            deposit:       0
        },
        realLiabilities: {
            creditLoan:       0,
            studentLoan:  400000, // 教育部學貸
            personalLoan:     0,
            cardInstallment: 20000 // 電腦設備 24 期，剩餘 20,000
        },
        income: {
            baseSalary:   45000,
            reimbursement:    0,
            kgiDividend:      0
        },
        expense: {
            rent:          10000,
            insurance:      1000,  // 水電
            loanRepayment: { creditLoan: 0, student: 4000, cardInstallment: 833 },
            telecomSubscription: 4800  // 電話 800 + Netflix 250 + 0050定額 2,000 + 雜項 1,750
        }
    },

    liabilityMeta: {
        creditLoan:      { category: '信用貸款',  label: '',             monthlyKey: 'creditLoan',      badge: 'active', note: '' },
        studentLoan:     { category: '學生貸款',  label: '教育部學貸',   monthlyKey: 'student',         badge: 'active', note: '寬限期結束，預計 8 年還完' },
        personalLoan:    { category: '個人借款',  label: '',             monthlyKey: null,              badge: 'soon',   note: '' },
        cardInstallment: { category: '信用卡分期', label: '電腦設備分期', monthlyKey: 'cardInstallment', badge: 'active', note: '24 期，剩餘約 24 期' },
    },

    incomeMeta: {
        baseSalary:    { category: '薪資',    label: '底薪',      sub: '每月固定' },
        reimbursement: { category: '報銷',    label: '費用報銷',  sub: '浮動' },
        kgiDividend:   { category: '配息收入', label: '0050 配息', sub: '累積中，目前微量' },
    },

    events: [
        {
            year: "2025", category: "Career",
            title: "大學畢業，第一份工作",
            fact:     "2025 年畢業，月薪 45,000，學貸進入 1 年寬限期，開始獨立生活。",
            context:  "第一個月薪水入帳就發現，房租加生活費之後可以自由運用的錢比想像中少。",
            question: "月薪 45,000，扣掉固定支出，每月能存多少？",
            decision: "設定每月強制儲蓄目標，先維持基本生活品質，再逐步優化。"
        },
        {
            year: "2026", category: "Investment",
            title: "開始定期定額 0050，每月 2,000",
            fact:     "工作半年後開始每月定期定額投資台灣 50（0050），每月 2,000 元。",
            context:  "金額不大，但認識到複利效果需要時間，決定盡早起步。",
            question: "每月 2,000，持續 10 年能累積多少？",
            decision: "選 0050 不擇時，讓時間做事，不輕易中斷。"
        },
        {
            year: "2026", category: "Life",
            title: "學貸寬限期結束，正式還款",
            fact:     "2026 年學貸開始每月還款 4,000，加上信用卡分期 833，固定負債支出近 5,000。",
            context:  "學貸還款壓縮了原本就有限的可支配現金，需要更精確追蹤每月流向。",
            question: "固定支出佔薪資 35%，財務還有餘裕嗎？",
            decision: "開始使用 DREAM Ledger 系統化追蹤，找出可優化的支出項目。"
        },
    ],

    snapshots: [
        { date: "2025-07", assets:  22000, liabilities: 400000, netWorth: -378000, note: "estimated / 剛畢業，第一個月薪資，學貸寬限期" },
        { date: "2025-12", assets:  35000, liabilities: 400000, netWorth: -365000, note: "estimated / 工作半年，持續儲蓄" },
        { date: "2026-03", assets:  30000, liabilities: 420000, netWorth: -390000, note: "estimated / 設備分期開始，負債增加" },
        { date: "2026-06", assets:  24000, liabilities: 420000, netWorth: -396000, note: "audited / 學貸開始還款，0050 起步" },
    ],

    records: [
        { id: "t001", date: "2026-04-01", description: "薪資入帳",      amount: 45000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "t002", date: "2026-04-02", description: "房租",          amount: 10000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "t003", date: "2026-04-05", description: "設備分期",      amount:   833, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "t004", date: "2026-04-06", description: "水電費",        amount:  1000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "t005", date: "2026-04-08", description: "超市採買",      amount:  1500, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "t006", date: "2026-04-10", description: "早午餐外食",    amount:   800, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "t007", date: "2026-04-15", description: "電話費",        amount:   800, type: "expense", category: "通訊", isEvent: false, note: "" },
        { id: "t008", date: "2026-04-15", description: "Netflix",       amount:   250, type: "expense", category: "通訊", isEvent: false, note: "" },
        { id: "t009", date: "2026-04-20", description: "交通費",        amount:   600, type: "expense", category: "行",   isEvent: false, note: "" },
        { id: "t010", date: "2026-04-25", description: "日用品雜費",    amount:   900, type: "expense", category: "雜",   isEvent: false, note: "" },
        { id: "t011", date: "2026-05-01", description: "薪資入帳",      amount: 45000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "t012", date: "2026-05-02", description: "房租",          amount: 10000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "t013", date: "2026-05-05", description: "0050 定期定額", amount:  2000, type: "expense", category: "投資", isEvent: false, note: "本月第一次定期定額" },
        { id: "t014", date: "2026-05-05", description: "設備分期",      amount:   833, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "t015", date: "2026-05-07", description: "水電費",        amount:   980, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "t016", date: "2026-05-10", description: "超市採買",      amount:  1400, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "t017", date: "2026-05-15", description: "電話費",        amount:   800, type: "expense", category: "通訊", isEvent: false, note: "" },
        { id: "t018", date: "2026-05-15", description: "Netflix",       amount:   250, type: "expense", category: "通訊", isEvent: false, note: "" },
        { id: "t019", date: "2026-05-20", description: "朋友聚餐",      amount:   650, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "t020", date: "2026-05-25", description: "交通費",        amount:   550, type: "expense", category: "行",   isEvent: false, note: "" },
        { id: "t021", date: "2026-06-01", description: "薪資入帳",      amount: 45000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "t022", date: "2026-06-02", description: "房租",          amount: 10000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "t023", date: "2026-06-05", description: "0050 定期定額", amount:  2000, type: "expense", category: "投資", isEvent: false, note: "" },
        { id: "t024", date: "2026-06-05", description: "學貸首期還款",  amount:  4000, type: "expense", category: "負債", isEvent: false, note: "寬限期結束，正式開始還款" },
        { id: "t025", date: "2026-06-05", description: "設備分期",      amount:   833, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "t026", date: "2026-06-08", description: "超市採買",      amount:  1300, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "t027", date: "2026-06-12", description: "午餐外食",      amount:   420, type: "expense", category: "食",   isEvent: false, note: "" },
    ]
};
