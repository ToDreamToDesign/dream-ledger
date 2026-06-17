/**
 * DREAM Ledger - Snapshot System
 * 每月底新增一筆，圖表自動生長為真實人生資產曲線
 *
 * 格式說明：
 *   date        : "YYYY-MM"  月份標籤
 *   assets      : 總資產（與 user.js getTotalAssets() 對齊）
 *   liabilities : 總負債（與 user.js getTotalLiabilities() 對齊）
 *   netWorth    : 淨資產 = assets - liabilities
 *   note        : 當月重大事件備注（可選）
 *
 * ⚠️ 新增規則：
 *   每月底從 user.js 的 realAssets / realLiabilities 核對後填入
 *   過去推估數字請在 note 標注 "estimated"，真實核對請標 "audited"
 */

const snapshots = [
    // ── 歷史推估點（非精確審計，僅供圖表趨勢參考）──
    {
        date: "2024-01",
        assets: 52000,
        liabilities: 0,
        netWorth: 52000,
        note: "estimated / 工作初期，持有現金為主，尚無重大負債"
    },
    {
        date: "2024-12",
        assets: 184500,
        liabilities: 322679,
        netWorth: -138179,
        note: "estimated / 台銀儲蓄保單累積 + 學貸"
    },
    {
        date: "2025-12",
        assets: 317000,
        liabilities: 400179,
        netWorth: -83179,
        note: "estimated / 安達台幣 + 安達美元保單加入，負債隨學貸遞減"
    },
    // ── 真實審計點（與 user.js 精確對齊）──
    {
        date: "2026-06",
        assets: 1153550,
        liabilities: 1259655,
        netWorth: -106105,
        note: "audited / 搬遷完成，現金 50,548，房屋押金 30,000 列入資產，淨值改善 +28,548"
    }

    // ════════════════════════════════════════════════════════════
    // 📅 未來快照框架（每月底核對 user.js 後取消註解並填入數字）
    // ════════════════════════════════════════════════════════════
    //
    // {
    //     date: "2026-07",
    //     assets: ???,
    //     liabilities: ???,        // 私人借款 55,000 清償後應減少
    //     netWorth: ???,
    //     note: "audited / 私人借款 55,000 全額清償，負債結構簡化"
    // },
    // {
    //     date: "2026-08",
    //     assets: ???,
    //     liabilities: ???,        // 學貸 & 富邦信貸本金持續遞減
    //     netWorth: ???,
    //     note: "audited / 例行月結"
    // },
    // {
    //     date: "2026-09",
    //     assets: ???,
    //     liabilities: ???,
    //     netWorth: ???,
    //     note: "audited / 凱基保單價值更新後重新核對"
    // },
    //
    // 新增格式：
    //   date        "YYYY-MM"
    //   assets      執行 getTotalAssets() 取得
    //   liabilities 執行 getTotalLiabilities() 取得
    //   netWorth    assets - liabilities
    //   note        "audited / 說明"  或  "estimated / 說明"
];

// 快照系統工具函式
const snapshotSystem = {
    // 取得最新一筆快照
    getLatest() {
        return snapshots[snapshots.length - 1];
    },

    // 取得所有月份標籤（供 Chart.js 使用）
    getLabels() {
        return snapshots.map(s => s.date);
    },

    // 取得資產數列
    getAssetSeries() {
        return snapshots.map(s => s.assets);
    },

    // 取得淨資產數列
    getNetWorthSeries() {
        return snapshots.map(s => s.netWorth);
    },

    // 新增快照（每月底呼叫）
    addSnapshot(snapshot) {
        const last = this.getLatest();
        if (last && last.date === snapshot.date) {
            console.warn(`[Snapshot] ${snapshot.date} 已存在，請先移除舊快照再新增`);
            return false;
        }
        snapshots.push(snapshot);
        console.log(`[Snapshot] ✅ ${snapshot.date} 已記錄：資產 ${snapshot.assets}，淨值 ${snapshot.netWorth}`);
        return true;
    }
};