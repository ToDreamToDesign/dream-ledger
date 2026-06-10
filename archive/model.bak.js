/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  DREAM Ledger - model.js                                     ║
 * ║  ⚠️  此檔案為歷史備份，不載入於正式頁面                       ║
 * ║  正式資料請編輯 user.js                                      ║
 * ║  備份基準日：2026-06-09（loanRepayment 尚未拆分前的版本）     ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * 變更紀錄：
 *   2026-06-10  從 index.html 移除載入，改由 user.js 取代
 *               loanRepayment 在 user.js 已拆分為 fubon / student / massageChair 三欄
 */

// 變數名稱加上 _bak 前綴，防止意外與 user.js 發生命名衝突
const dreamUser_bak = {
    meta: {
        owner: "孟繁宗 (DREAM 君)",
        status: "Archived",
        governanceLaws: [
            "Reality First (真實第一: 拒絕示意數字與通膨數據)",
            "Event > Theory (事件先於理論)",
            "Anti-Result Bias (抗結果偏誤品質軸)"
        ]
    },

    realAssets: {
        cash: 52000,
        kgiPolicy: 923221,
        andaTwd: 17281,
        botSavings: 132500
    },

    realLiabilities: {
        fubonLoan: 859476,
        studentLoan: 322679,
        privateLoan: 55000,
        massageChair: 22500
    },

    getters: {
        getTotalAssets() {
            return Object.values(dreamUser_bak.realAssets).reduce((a, b) => a + b, 0);
        },
        getTotalLiabilities() {
            return Object.values(dreamUser_bak.realLiabilities).reduce((a, b) => a + b, 0);
        },
        getNetWorth() {
            return this.getTotalAssets() - this.getTotalLiabilities();
        }
    },

    cashflowModel: {
        income: {
            baseSalary: 60000,
            reimbursement: 2804,
            kgiDividend: 6333,
            get salary() { return this.baseSalary + this.reimbursement; },
            get total() { return this.baseSalary + this.reimbursement + this.kgiDividend; }
        },
        expense: {
            rent: 15000,
            insurance: 14586,
            loanRepayment: 18289,   // ← 備份時尚未拆分（fubon 12302 + student 4737 + massageChair 1250）
            telecomSubscription: 4421,
            get total() {
                return this.rent + this.insurance + this.loanRepayment + this.telecomSubscription;
            }
        },
        getMonthlyCashflow() {
            return this.income.total - this.expense.total;
        }
    }
};
