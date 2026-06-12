/**
 * DREAM Ledger - 創作者配置與真實財務實體數據庫
 * 範式版本: Ontology v1 (Reality First)
 * 最後審計: 2026-06-09 (由創作者 DREAM 君親自核對修正)
 */
 
const dreamUser = {
    meta: {
        owner: "孟繁宗 (DREAM 君)",
        status: "Active",
        governanceLaws: [
            "Reality First (真實第一: 拒絕示意數字與通膨數據)",
            "Event > Theory (事件先於理論)",
            "Anti-Result Bias (抗結果偏誤品質軸)",
            "Responsibility Through Experience (責任來自經歷: 人生的成長取決於所經歷的，被迫承擔才是真正的清醒)"
        ]
    },
 
    // 1. 基礎核心資產 (真實持有實體，已完全沖銷錯誤的富邦項目)
    realAssets: {
        cash: 52000,         // 現金
        kgiPolicy: 923221,   // 凱基配息型保單 (核心被動資產，一次性投入，無需持續繳費)
        andaTwd: 17281,      // 安達台幣保單 (前6期 5000/月，第7期起調整為 2000/月)
        botSavings: 132500   // 台銀儲蓄保單 (暫以累積投入金額為保單價值；長照險無解約價值故不列入)
    },
 
    // 2. 真實負債明細 (全面歸位，不遺漏任何隱性分期)
    realLiabilities: {
        fubonLoan: 859476,   // 富邦信貸剩餘本金 (曾被錯誤混疊為資產，已撥亂反正)
        studentLoan: 322679, // 學貸
        privateLoan: 55000,  // 私人借款 (預計 2026/07 償還，屆時可移除此項)
        massageChair: 22500  // 按摩椅分期
    },
 
    // 3. 即時動態財務指標計算 (打破硬編碼，數據驅動 Dashboard)
    getters: {
        // 總資產合計：$1,125,002
        getTotalAssets() {
            return Object.values(dreamUser.realAssets).reduce((a, b) => a + b, 0);
        },
 
        // 總負債合計：$1,259,655
        getTotalLiabilities() {
            return Object.values(dreamUser.realLiabilities).reduce((a, b) => a + b, 0);
        },
 
        // 真實淨值：$-134,653 (DREAM Ledger 為你升起的第一面事實旗幟)
        getNetWorth() {
            return this.getTotalAssets() - this.getTotalLiabilities();
        },
 
        // 被動資產修正：$923,221 (僅保留真實能產生利差與配息的凱基保單)
        getPassiveAssets() {
            return dreamUser.realAssets.kgiPolicy; 
        }
    },
 
    // 4. 負債顯示元數據 — category（系統通用類別）+ label（個人自訂名稱）
    //    Dashboard 預設顯示 category，展開後顯示 label
    liabilityMeta: {
        fubonLoan:    { category: '信用貸款', label: '富邦信貸',   monthlyKey: 'fubon',        badge: 'active', note: '84 期分期，核心槓桿負債' },
        studentLoan:  { category: '學生貸款', label: '教育部學貸', monthlyKey: 'student',      badge: 'active', note: '長期低利政府貸款' },
        privateLoan:  { category: '私人借款', label: '',           monthlyKey: null,           badge: 'soon',   note: '預計 2026/07 全額償還' },
        massageChair: { category: '分期付款', label: '按摩椅分期', monthlyKey: 'massageChair', badge: 'active', note: '信用卡分期，餘額遞減中' },
    },

    // 5. 收入顯示元數據 — category（系統通用）+ label（個人自訂）
    incomeMeta: {
        baseSalary:    { category: '薪資',    label: '底薪',        sub: '保底基準，每月確認' },
        reimbursement: { category: '報銷',    label: '費用報銷',    sub: '浮動，每月不同' },
        kgiDividend:   { category: '配息收入', label: '凱基保單配息', sub: '被動現金流' },
    },

    // 6. 現金流與生活審計數據 (全面淘汰 75k/42k 舊估算值，回填兩天內核對的真實日常)
    cashflowModel: {
        income: {
            baseSalary: 60000,   // 每月底薪 (保底基準，實際入帳依當月確認)
            reimbursement: 2804, // 公司費用報銷 (浮動，每月不同)
            kgiDividend: 6333,   // 凱基保單每月配息
            get salary() { return this.baseSalary + this.reimbursement; }, // 薪資合計
            get total() { return this.baseSalary + this.reimbursement + this.kgiDividend; } // 總收入
        },
        expense: {
            rent: 15000,              // 房租
            insurance: 14586,         // 保險 (含安達美元保單 161 USD，以匯率 30 換算)
            loanRepayment: {
                fubon:       12302,   // 富邦信貸月還款 (84期，第4期起)
                student:      4737,   // 學貸月還款
                massageChair: 1250,   // 按摩椅分期月還款
                get total() { return this.fubon + this.student + this.massageChair; }
            },
            telecomSubscription: 4421, // 電信與各類訂閱
            get total() {
                return this.rent + this.insurance + this.loanRepayment.total + this.telecomSubscription;
            }
        },
        // 真實自由現金流 (動態計算，隨收入變動即時更新)
        getMonthlyCashflow() {
            return this.income.total - this.expense.total;
        }
    }
};
 
// 導出配置以供 app.js 與 model.js 進行渲染焊接
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dreamUser;
}