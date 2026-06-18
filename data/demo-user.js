/**
 * DREAM Ledger - Demo User Seed v1.0
 * 對外展示用：Showcase 完整展示模型
 * 用途：公開展示產品能力，呈現使用 DREAM Ledger 3 年後的財務全貌
 * 不代表任何真實人物
 *
 * 財務概況：
 *   總資產 700,000｜總負債 500,000｜淨資產 +200,000
 *   薪資 60,000｜配息 3,000｜自由現金流 ~25,000/月
 */

const demoUserSeed = {
    version: "1.0",
    meta: { owner: "Alex Chen", label: "Demo" },

    user: {
        realAssets: {
            cash:      150000, // 現金
            kgiPolicy: 450000, // 配息型保單（信貸槓桿投入）
            andaTwd:    20000, // 安達台幣保單
            botSavings: 80000, // 台銀儲蓄保單
            deposit:        0
        },
        realLiabilities: {
            creditLoan:  400000, // 富邦信貸（投入保單，正利差運行中）
            studentLoan:  80000, // 學貸尾款（接近還清）
            personalLoan:     0,
            cardInstallment:  0
        },
        income: {
            baseSalary:   60000,
            reimbursement:  3000,
            kgiDividend:    3000  // 配息型保單每月配息
        },
        expense: {
            rent:          15000,
            insurance:     10000, // 多張保單年繳換算
            loanRepayment: { creditLoan: 8500, student: 1500, cardInstallment: 0 },
            telecomSubscription: 3000  // 電信 + 訂閱服務
        }
    },

    liabilityMeta: {
        creditLoan:      { category: '信用貸款',  label: '富邦信貸',   monthlyKey: 'creditLoan',      badge: 'active', note: '投入配息保單，正利差運行中，預計 7 年還清', originalAmount: 500000, totalPeriods: 84 },
        studentLoan:     { category: '學生貸款',  label: '教育部學貸', monthlyKey: 'student',         badge: 'active', note: '接近尾聲，剩餘約 4 年',                    originalAmount: 400000, totalPeriods: 84 },
        personalLoan:    { category: '個人借款',  label: '',           monthlyKey: null,              badge: 'soon',   note: '' },
        cardInstallment: { category: '信用卡分期', label: '',           monthlyKey: 'cardInstallment', badge: 'active', note: '' },
    },

    incomeMeta: {
        baseSalary:    { category: '薪資',    label: '底薪',        sub: '每月固定入帳' },
        reimbursement: { category: '報銷',    label: '費用報銷',    sub: '浮動，每月不同' },
        kgiDividend:   { category: '配息收入', label: '保單配息',    sub: '每月被動現金流' },
    },

    events: [
        {
            year: "2022", category: "Career",
            title: "大學畢業，第一份工作",
            fact:     "2022 年畢業，月薪 42,000，學貸進入寬限期，開始獨立財務管理。",
            context:  "第一個月才發現薪水扣掉房租和生活費後所剩無幾，開始認真面對財務現實。",
            question: "月薪 42,000，要如何在學貸到期前建立足夠的財務緩衝？",
            decision: "設定每月儲蓄 8,000 的硬底線，放棄非必要消費，建立第一層安全網。"
        },
        {
            year: "2022", category: "Investment",
            title: "開始定期定額 0050，每月 3,000",
            fact:     "工作 3 個月後開始每月 3,000 元定期定額投資台灣 50，作為長期資產積累起點。",
            context:  "研究後認為指數化投資優於個股選擇，決定從小額起步，不擇時。",
            question: "每月 3,000，10 年後若年化 8% 能累積多少？",
            decision: "採用定期定額策略，不因市場波動調整，讓時間做複利。"
        },
        {
            year: "2023", category: "Life",
            title: "學貸寬限期結束，正式還款",
            fact:     "學貸開始每月還款 2,500，加上房租和生活費，可支配空間進一步收窄。",
            context:  "固定負債支出佔薪資比例上升，開始系統化追蹤每月現金流。",
            question: "學貸還款期間，投資是否應該暫停？",
            decision: "維持 0050 定期定額不中斷，同時開始用試算表追蹤每月收支。"
        },
        {
            year: "2024", category: "Career",
            title: "升職，薪資從 42,000 調升至 55,000",
            fact:     "工作滿 2 年後升職，月薪調整為 55,000，可支配現金流顯著改善。",
            context:  "薪資增加帶來更大的財務彈性，同時也帶來更多消費誘惑，需要有意識管理。",
            question: "薪資增加後，要先提高生活品質還是加速資產積累？",
            decision: "採 50-30-20 原則：50% 固定支出，30% 生活品質，20% 加速投資。"
        },
        {
            year: "2025", category: "Leverage",
            pivot: true,
            title: "富邦信貸 50 萬，槓桿投入配息型保單",
            fact:     "申請富邦信貸 50 萬，84 期月還 8,500，全額投入配息型保單，年化配息約 8%，利率約 6%，正利差約 2%。",
            context:  "靠薪資線性積累速度過慢，研究利差策略後認定可行，接受短期現金流壓力換取長期資產加速。",
            question: "借錢買保單的正利差策略，下行風險在哪裡？",
            decision: "執行槓桿策略，設定配息 ≥ 月供 80% 的安全線，超出部分由薪資補足。"
        },
        {
            year: "2025", category: "Cognition",
            title: "建立 DREAM Ledger，開始財務考古",
            fact:     "以 GitHub + Claude Code 工作流建立 DREAM Ledger，首次完整盤點所有資產與負債。",
            context:  "過去對財務狀況的認知停留在「大概有多少」，想要真正的數字清晰度。",
            question: "把所有資料放進一個系統之後，會帶來清醒還是焦慮？",
            decision: "選擇面對數字，Reality First，以真實數據作為所有決策的起點。"
        },
        {
            year: "2026", category: "Life",
            title: "淨資產首次轉正，突破 +200,000",
            fact:     "2026 年 6 月，總資產 700,000，總負債 500,000，淨資產達 +200,000，首次轉正。",
            context:  "3 年前畢業時淨資產約 -400,000（純學貸），透過槓桿策略和系統化儲蓄，4 年轉正。",
            question: "淨資產轉正只是一個數字里程碑嗎？還是真的代表什麼？",
            decision: "這不是終點，是起點。真正的財務自由定義是被動收入 ≥ 基本生活支出。"
        },
    ],

    snapshots: [
        { date: "2022-07", assets:  15000, liabilities: 400000, netWorth: -385000, note: "estimated / 剛畢業，僅有現金，學貸寬限期進行中" },
        { date: "2023-01", assets:  55000, liabilities: 400000, netWorth: -345000, note: "estimated / 工作半年，持續儲蓄，學貸尚未還款" },
        { date: "2024-01", assets: 120000, liabilities: 390000, netWorth: -270000, note: "estimated / 升職薪資提升，資產加速積累" },
        { date: "2025-01", assets: 180000, liabilities: 870000, netWorth: -690000, note: "estimated / 信貸槓桿投入保單，負債驟增但資產同步成長" },
        { date: "2025-07", assets: 580000, liabilities: 550000, netWorth:  30000,  note: "estimated / 保單配息累積，槓桿效益開始顯現" },
        { date: "2026-06", assets: 700000, liabilities: 500000, netWorth: 200000,  note: "audited / 淨資產轉正里程碑，系統化財務管理第 4 年" },
    ],

    records: [
        { id: "d001", date: "2026-04-01", description: "薪資入帳",      amount: 60000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "d002", date: "2026-04-01", description: "費用報銷",      amount:  3000, type: "income",  category: "收入", isEvent: false, note: "本月交通與用品報銷" },
        { id: "d003", date: "2026-04-01", description: "保單配息",      amount:  3000, type: "income",  category: "收入", isEvent: false, note: "配息型保單每月被動收入" },
        { id: "d004", date: "2026-04-02", description: "房租",          amount: 15000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "d005", date: "2026-04-05", description: "富邦信貸月供",  amount:  8500, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "d006", date: "2026-04-05", description: "學貸還款",      amount:  1500, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "d007", date: "2026-04-06", description: "保險費用",      amount: 10000, type: "expense", category: "保險", isEvent: false, note: "多張保單合計月均攤" },
        { id: "d008", date: "2026-04-08", description: "超市採買",      amount:  2200, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "d009", date: "2026-04-10", description: "餐廳聚餐",      amount:  1800, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "d010", date: "2026-04-15", description: "電話與訂閱",    amount:  3000, type: "expense", category: "通訊", isEvent: false, note: "" },
        { id: "d011", date: "2026-05-01", description: "薪資入帳",      amount: 60000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "d012", date: "2026-05-01", description: "保單配息",      amount:  3000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "d013", date: "2026-05-02", description: "房租",          amount: 15000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "d014", date: "2026-05-05", description: "富邦信貸月供",  amount:  8500, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "d015", date: "2026-05-05", description: "學貸還款",      amount:  1500, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "d016", date: "2026-05-08", description: "超市採買",      amount:  2400, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "d017", date: "2026-05-15", description: "電話與訂閱",    amount:  3000, type: "expense", category: "通訊", isEvent: false, note: "" },
        { id: "d018", date: "2026-05-18", description: "週末外出",      amount:  1200, type: "expense", category: "休閒", isEvent: false, note: "" },
        { id: "d019", date: "2026-06-01", description: "薪資入帳",      amount: 60000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "d020", date: "2026-06-01", description: "保單配息",      amount:  3000, type: "income",  category: "收入", isEvent: false, note: "" },
        { id: "d021", date: "2026-06-02", description: "房租",          amount: 15000, type: "expense", category: "住",   isEvent: false, note: "" },
        { id: "d022", date: "2026-06-05", description: "富邦信貸月供",  amount:  8500, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "d023", date: "2026-06-05", description: "學貸還款",      amount:  1500, type: "expense", category: "負債", isEvent: false, note: "" },
        { id: "d024", date: "2026-06-08", description: "超市採買",      amount:  2100, type: "expense", category: "食",   isEvent: false, note: "" },
        { id: "d025", date: "2026-06-12", description: "生日慶祝餐敘",  amount:  2800, type: "expense", category: "食",   isEvent: false, note: "朋友生日，主動請客" },
    ]
};
