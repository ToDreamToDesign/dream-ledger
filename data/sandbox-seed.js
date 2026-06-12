/**
 * DREAM Ledger - Sandbox Seed Data v1.0
 * 虛構測試帳戶：Alex Chen（工程師）
 * 此檔案為 localStorage sandbox 的初始預設值，不代表任何真實人物
 */

const sandboxSeed = {
    version: "1.0",
    meta: {
        owner: "Alex Chen",
        label: "Sandbox"
    },
    // 資料結構需與 data/user.js 的 dreamUser 屬性名稱相容
    user: {
        realAssets: {
            cash:       120000,  // 現金
            kgiPolicy:  450000,  // ETF 投資組合（複用欄位名）
            andaTwd:     80000,  // 定期存款（複用欄位名）
            botSavings:      0
        },
        realLiabilities: {
            fubonLoan:       0,
            studentLoan: 200000, // 學貸
            privateLoan:     0,
            massageChair:  15000 // 信用卡分期（複用欄位名）
        },
        income: {
            baseSalary:   65000,
            reimbursement:    0,
            kgiDividend:   1800  // ETF 季配息（月均攤）
        },
        expense: {
            rent:          18000,
            insurance:      3500,
            loanRepayment: { fubon: 0, student: 4000, massageChair: 1000 },
            telecomSubscription: 1200
        }
    },
    // 與 user.js 同架構，category 通用、label 為 Sandbox 角色（Alex Chen）的個人標籤
    liabilityMeta: {
        fubonLoan:    { category: '信用貸款', label: '',          monthlyKey: 'fubon',        badge: 'active', note: '' },
        studentLoan:  { category: '學生貸款', label: '助學貸款', monthlyKey: 'student',      badge: 'active', note: '政府低利學貸，按月還款中' },
        privateLoan:  { category: '私人借款', label: '',          monthlyKey: null,           badge: 'soon',   note: '' },
        massageChair: { category: '分期付款', label: '家電分期', monthlyKey: 'massageChair', badge: 'active', note: '信用卡分期，餘額遞減中' },
    },
    incomeMeta: {
        baseSalary:    { category: '薪資',    label: '底薪',        sub: '保底基準，每月確認' },
        reimbursement: { category: '報銷',    label: '費用報銷',    sub: '浮動，每月不同' },
        kgiDividend:   { category: '配息收入', label: 'ETF 季配息', sub: '月均攤計算' },
    },
    events: [
        {
            year: "2018", category: "Career",
            title: "大學畢業，第一份工作（IT 支援）",
            fact:     "2018 年畢業後進入中型企業擔任 IT 支援，月薪 32,000，學貸同步進入還款期。",
            context:  "薪資偏低，還款壓力不小，幾乎沒有可儲蓄的空間。",
            question: "這份工作是職涯起點還是終點？低薪期如何建立財務基礎？",
            decision: "先求穩定，同時自學程式技能，規劃轉換跑道。"
        },
        {
            year: "2019", category: "Life",
            title: "租屋獨立，第一次完全自理生活",
            fact:     "與家人同住至 2019 年，搬出後每月房租 12,000，生活支出大幅上升。",
            context:  "獨立生活後第一次感受固定成本壓力，外食、水電、交通全部自行負擔。",
            question: "獨立生活的總成本是否在財務能力範圍內？",
            decision: "設定每月生活費上限，拒絕不必要消費，以節約度過適應期。"
        },
        {
            year: "2020", category: "Investment",
            title: "COVID 期間開始學習投資，定期定額 ETF",
            fact:     "2020 年 3 月股市大跌，第一次接觸 ETF 定期定額，開始每月投入 5,000 元。",
            context:  "市場低點讓我首次認識長期投資邏輯，疫情反而成為投資教育的起點。",
            question: "市場下跌時應該買進還是觀望？長期定投真的有效嗎？",
            decision: "選擇定期定額而非擇時，將情緒從投資決策中移除，每月固定扣款。"
        },
        {
            year: "2021", category: "Career",
            title: "轉換跑道，成為軟體工程師",
            fact:     "2021 年通過技術面試，正式轉職為後端工程師，薪資從 32,000 跳升至 55,000。",
            context:  "自學兩年後薪資翻近倍，驗證了技能投資的回報，學貸壓力明顯減輕。",
            question: "轉職的風險與回報如何評估？薪資提升後資源應如何重新分配？",
            decision: "薪資增加的 70% 投入儲蓄與投資，不因收入增加而增加生活消費。"
        },
        {
            year: "2022", category: "Cognition",
            title: "第一次完整盤點個人資產，面對學貸現實",
            fact:     "2022 年用試算表首次完整統計資產與負債，確認學貸剩餘 22 萬，淨值約 -5 萬。",
            context:  "過去對財務狀況模糊，盤點後才意識到儘管薪資提升，學貸仍是主要拖累。",
            question: "了解真實財務狀況後，心態上能接受負淨值嗎？",
            decision: "選擇面對數字而非逃避，制定學貸加速還款計畫，同時不中斷 ETF 投資。"
        },
        {
            year: "2023", category: "Career",
            title: "升遷為 Senior Engineer，薪資調整至 65,000",
            fact:     "2023 年升遷，薪資調整至 65,000，ETF 月投入從 5,000 提升至 12,000。",
            context:  "薪資提升讓每月可投資金額顯著增加，複利效果開始加速。",
            question: "收入增加後，資源如何在生活品質、投資、還債之間平衡？",
            decision: "加速學貸還款，維持 ETF 定投，生活費維持不變，拒絕生活消費膨脹。"
        },
        {
            year: "2024", category: "Investment",
            title: "ETF 累積達 40 萬，複利效果開始顯現",
            fact:     "2024 年 ETF 組合總值突破 40 萬，年配息約 1.2 萬，複利效果實際可見。",
            context:  "四年定期定額讓資產累積速度明顯加快，配息開始能覆蓋部分日常支出。",
            question: "是否應該加大投資力道？還是優先把學貸清償？",
            decision: "維持現有投資比例，同步還款，讓兩條軌道並行推進。"
        },
        {
            year: "2024", category: "Family",
            title: "父親退休，開始思考家庭財務責任",
            fact:     "2024 年父親正式退休，家庭收入結構改變，未來可能需承擔部分家庭開支。",
            context:  "父親退休讓我第一次認真思考長照、醫療、家庭財務責任這些過去覺得遙遠的議題。",
            question: "自己的財務規劃是否應該將家庭責任納入考量？",
            decision: "開始研究長照保險與家庭緊急備用金，將家庭責任納入財務規劃框架。"
        },
        {
            year: "2025", category: "Leverage",
            title: "評估信貸槓桿投資可行性",
            fact:     "2025 年研究以信貸槓桿加速 ETF 累積的可行性，評估利率差距與風險邊界。",
            context:  "隨著收入穩定，開始思考如何在風險可控的範圍內提高資產累積速度。",
            question: "利率差距約 2-3%，槓桿在數學上成立嗎？風險容忍度在哪裡？",
            decision: "暫緩執行，先確保緊急備用金充足，待信用條件更成熟後再評估。"
        },
        {
            year: "2026", category: "Cognition",
            title: "建立 DREAM Ledger，開始系統化財務追蹤",
            fact:     "2026 年開始使用 DREAM Ledger，首次建立完整的財務決策考古系統。",
            context:  "過去的試算表無法記錄決策脈絡，DREAM Ledger 是第一個真正的財務決策系統。",
            question: "系統化追蹤能讓財務決策更理性嗎？還是只會帶來焦慮？",
            decision: "選擇 Reality First，以事實數據作為所有決策起點，拒絕示意數字。"
        }
    ],
    snapshots: [
        { date: "2022-01", assets: 150000, liabilities: 220000, netWorth:  -70000, note: "estimated / 工作初期，ETF 定投起步，學貸為主要負債" },
        { date: "2023-01", assets: 270000, liabilities: 210000, netWorth:   60000, note: "estimated / 轉職後薪資提升，ETF 加速累積" },
        { date: "2024-01", assets: 400000, liabilities: 208000, netWorth:  192000, note: "estimated / ETF 組合突破 30 萬，學貸持續遞減" },
        { date: "2025-01", assets: 560000, liabilities: 207000, netWorth:  353000, note: "estimated / ETF 複利效果顯現，淨值持續上升" },
        { date: "2026-06", assets: 650000, liabilities: 215000, netWorth:  435000, note: "audited / 現況：ETF 45 萬 + 現金 12 萬 + 存款 8 萬" }
    ],
    records: [
        // ── 2026-04 ──────────────────────────────────────────────
        { id: "r001", date: "2026-04-01", description: "薪資入帳",        amount: 65000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "r002", date: "2026-04-02", description: "房租",            amount: 18000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "r003", date: "2026-04-05", description: "ETF 定期定額",    amount: 12000, type: "expense", category: "投資", isEvent: false, note: "" },
        { id: "r004", date: "2026-04-05", description: "學貸還款",        amount:  4000, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "r005", date: "2026-04-08", description: "超市採買",        amount:  1850, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "r006", date: "2026-04-12", description: "醫療掛號費",      amount:   300, type: "expense", category: "健康", isEvent: false, note: "" },
        { id: "r007", date: "2026-04-15", description: "ETF 季配息入帳",  amount:  1200, type: "income",  category: "投資", isEvent: true,  note: "較上季增加 80 元，持續累積中" },
        { id: "r008", date: "2026-04-20", description: "朋友聚餐",        amount:   680, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "r009", date: "2026-04-25", description: "電信費",          amount:  1200, type: "expense", category: "通訊", isEvent: false, note: "" },
        { id: "r010", date: "2026-04-28", description: "健身房月費",      amount:  1500, type: "expense", category: "健康", isEvent: false, note: "" },
        // ── 2026-05 ──────────────────────────────────────────────
        { id: "r011", date: "2026-05-01", description: "薪資入帳",        amount: 65000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "r012", date: "2026-05-02", description: "房租",            amount: 18000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "r013", date: "2026-05-05", description: "ETF 定期定額",    amount: 12000, type: "expense", category: "投資", isEvent: false, note: "" },
        { id: "r014", date: "2026-05-05", description: "學貸還款",        amount:  4000, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "r015", date: "2026-05-10", description: "技術書籍",        amount:   890, type: "expense", category: "學習", isEvent: false, note: "" },
        { id: "r016", date: "2026-05-15", description: "加班費",          amount:  3200, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "r017", date: "2026-05-18", description: "超市採買",        amount:  2100, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "r018", date: "2026-05-22", description: "ETF 組合創新高",  amount:     0, type: "income",  category: "投資", isEvent: true,  note: "總值首次突破 45 萬，較去年同期增長 32%，繼續持有不動" },
        { id: "r019", date: "2026-05-25", description: "電信費",          amount:  1200, type: "expense", category: "通訊", isEvent: false, note: "" },
        { id: "r020", date: "2026-05-30", description: "朋友婚禮紅包",    amount:  2000, type: "expense", category: "人情", isEvent: false, note: "" },
        // ── 2026-06 ──────────────────────────────────────────────
        { id: "r021", date: "2026-06-01", description: "薪資入帳",        amount: 65000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "r022", date: "2026-06-02", description: "房租",            amount: 18000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "r023", date: "2026-06-05", description: "ETF 定期定額",    amount: 12000, type: "expense", category: "投資", isEvent: false, note: "" },
        { id: "r024", date: "2026-06-05", description: "學貸還款",        amount:  4000, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "r025", date: "2026-06-08", description: "超市採買",        amount:  1650, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "r026", date: "2026-06-10", description: "ETF 季配息入帳",  amount:  1800, type: "income",  category: "投資", isEvent: true,  note: "較上季再增加 600 元，年化配息率穩定成長" },
        { id: "r027", date: "2026-06-12", description: "旅遊規劃存款",    amount:  5000, type: "expense", category: "儲蓄", isEvent: false, note: "" }
    ]
};
