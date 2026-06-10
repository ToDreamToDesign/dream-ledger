/* ==========================================================================
   ⚙️ DREAM LEDGER 2.0 - ENTERPRISE GENERAL LEDGER ENGINE (V4.3 PROD-FINAL)
   ========================================================================== */

/**
 * 🏛️ Chart of Accounts 科目主字典 (V1 終極鎖定)
 */
const ChartOfAccounts = {
    '1100': { name: 'acc_asset_cash_twd', element: 'Asset', normal: 'DEBIT', displayEffect: 'positive' },
    '1200': { name: 'acc_asset_ins_twd', element: 'Asset', normal: 'DEBIT', displayEffect: 'positive' },
    '2100': { name: 'acc_liab_fubon', element: 'Liability', normal: 'CREDIT', displayEffect: 'negative' },
    '2200': { name: 'acc_liab_student', element: 'Liability', normal: 'CREDIT', displayEffect: 'negative' },
    '3100': { name: 'acc_eq_initial_networth', element: 'Equity', normal: 'CREDIT', displayEffect: 'neutral' },
    '4100': { name: 'acc_rev_salary', element: 'Revenue', normal: 'CREDIT', displayEffect: 'neutral' },
    '5100': { name: 'acc_expense_core', element: 'Expense', normal: 'DEBIT', displayEffect: 'positive' },
    '5200': { name: 'acc_exp_interest', element: 'Expense', normal: 'DEBIT', displayEffect: 'negative' },
    '5400': { name: 'acc_exp_bank_fee', element: 'Expense', normal: 'DEBIT', displayEffect: 'negative' }
};

const MAX_SAFE_FINANCIAL_AMOUNT = 999999999999; // 銀行級單筆百億安全上限
const CURRENT_SCHEMA_VERSION = 3;               
const STRICT_MODE = false;                      

function generateSecureUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return null;
}

function deepFreeze(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    Object.keys(obj).forEach(name => {
        let prop = obj[name];
        if (prop !== null && typeof prop === 'object') deepFreeze(prop);
    });
    return Object.freeze(obj);
}

/**
 * 💡 🎯 ARB 決策落實：流水號尾碼數位萃取公用函數
 * 專門用於防範 Archive / Migration 導致的序列失真，實現 Max 逆向穿透
 */
function extractSequenceNumber(journalNo) {
    if (!journalNo || typeof journalNo !== 'string') return 0;
    const parts = journalNo.split('-');
    if (parts.length < 3) return 0;
    const seqInt = parseInt(parts[2], 10);
    return isNaN(seqInt) ? 0 : seqInt;
}

/**
 * 🎯 JournalNumberProvider (抽象異步發號器)
 */
const JournalNumberProvider = {
    async nextJournalNo(sequenceValue) {
        // [WARNING: LOCAL MODE ONLY // NOT SAFE FOR MULTI-TAB CONCURRENCY]
        // 目前 Sequence 序列由單機 LocalStorage 控制，進入 Phase 3 多視窗/多裝置同步時，
        // 必須無縫更替為 Firebase Transaction 原子計數器或 PostgreSQL Sequence 序列鎖。
        return new Promise((resolve) => {
            const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            const serial = String(sequenceValue).padStart(6, '0');
            resolve(`JE-${todayStr}-${serial}`);
        });
    }
};

/**
 * 💾 STORAGE INTERFACE (🎯 修正點：內嵌 Max 流水號安全升級與故障穿透)
 */
const StorageInterface = {
    LOCAL_STORAGE_KEY: 'DREAM_LEDGER_V4_MASTER_STORE',
    
    save: function(entries, journalSequence) {
        try {
            const payload = {
                schemaVersion: CURRENT_SCHEMA_VERSION,
                journalSequence: journalSequence,
                entries: entries
            };
            localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            throw e; 
        }
    },
    
    load: function() {
        const raw = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (!raw) return null;
        try {
            const wrapper = JSON.parse(raw);
            if (!wrapper || typeof wrapper.schemaVersion === 'undefined' || !Array.isArray(wrapper.entries)) {
                throw new Error("MIGRATION_CRITICAL: 核心快取結構破壞。");
            }
            
            // 階梯式安全相容升級 (V2 -> V3)
            if (wrapper.schemaVersion === 2) {
                wrapper.entries = wrapper.entries.map((entry, index) => {
                    if (!entry.journalNo) entry.journalNo = `JE-20260602-${String(index+1).padStart(6,'0')}`;
                    if (!entry.postedAt) entry.postedAt = Date.now();
                    return entry;
                });
                wrapper.schemaVersion = 3;
            }
            
            if (wrapper.schemaVersion !== CURRENT_SCHEMA_VERSION) {
                throw new Error("MIGRATION_CRITICAL: 版本代號不相容。");
            }

            // 🎯 🎯 ARB 建議落實 3：Max Sequence Migration 安全閥門
            // 拒絕盲目信任快取內的 sequence 值或 entries.length，
            // 透過實時掃描現存傳票中的最大號碼，杜絕封存 Archive 後的撞號死局！
            let evaluatedSequence = wrapper.journalSequence || wrapper.entries.length;
            if (wrapper.entries.length > 0) {
                const seqNumbers = wrapper.entries.map(e => extractSequenceNumber(e.journalNo));
                const maxNoFound = Math.max(...seqNumbers);
                if (maxNoFound > evaluatedSequence) {
                    evaluatedSequence = maxNoFound; // 序號指針逆向對齊最高點
                }
            }

            return {
                entries: wrapper.entries,
                journalSequence: evaluatedSequence
            };
        } catch (e) {
            throw e; 
        }
    }
};

/**
 * 🛡️ JOURNAL VALIDATION ENGINE
 */
const JournalValidationEngine = {
    validate: function(line) {
        if (!ChartOfAccounts.hasOwnProperty(line.account)) {
            throw new Error(`🚨 GL_ERR: 科目代碼 [${line.account}] 不存在。`);
        }
        if (!Number.isInteger(line.amount) || line.amount <= 0 || !Number.isFinite(line.amount)) {
            throw new Error(`🚨 GL_ERR: 金額 [${line.amount}] 必須為有效的正整數。`);
        }
        if (line.amount > MAX_SAFE_FINANCIAL_AMOUNT) {
            throw new Error(`🚨 GL_ERR: 金額 [${line.amount}] 溢出銀行核心系統單筆上限防線 (${MAX_SAFE_FINANCIAL_AMOUNT.toLocaleString()} TWD)。`);
        }
        return true;
    }
};

/**
 * 🗃️ JournalEntryRepository (總帳事實倉庫)
 */
const JournalEntryRepository = {
    _entries: [],
    _journalSequence: 0, 
    isRecoveryMode: false, 
    corruptedPayload: null, 

    init: function() {
        try {
            const result = StorageInterface.load();
            if (result) {
                this._entries = result.entries;
                this._journalSequence = result.journalSequence;
            } else {
                this._entries = [
                    deepFreeze({
                        entryId: "init-uuid-001", 
                        journalNo: "JE-20260602-000001", 
                        postedAt: 1780400000000,
                        event: 'OPENING',
                        memo: 'System Day One 導入系統期初累積初始淨值傳票',
                        lines: [
                            { account: '1100', type: 'DEBIT', amount: 150000 },
                            { account: '1200', type: 'DEBIT', amount: 930000 },
                            { account: '2100', type: 'CREDIT', amount: 720000 },
                            { account: '2200', type: 'CREDIT', amount: 180000 },
                            { account: '3100', type: 'CREDIT', amount: 180000 }
                        ].map(l => Object.freeze(l))
                    }),
                    deepFreeze({
                        entryId: "init-uuid-002",
                        journalNo: "JE-20260605-000002",
                        postedAt: Date.now(),
                        event: 'NORMAL',
                        memo: '富邦信貸第六期常態本息拆分扣繳傳票',
                        lines: [
                            { account: '1100', type: 'CREDIT', amount: 15000 },
                            { account: '2100', type: 'DEBIT', amount: 13500 },
                            { account: '5200', type: 'DEBIT', amount: 1400 },
                            { account: '5400', type: 'DEBIT', amount: 100 }
                        ].map(l => Object.freeze(l))
                    })
                ];
                this._journalSequence = 2; 
                StorageInterface.save(this._entries, this._journalSequence);
            }
        } catch(e) {
            console.warn("⚠️ PLATFORM_GOVERNANCE: 快取資料包受損，柔性激活唯讀復原模式。");
            this.isRecoveryMode = true;
            this.corruptedPayload = localStorage.getItem(StorageInterface.LOCAL_STORAGE_KEY);
            this._entries = []; 
            this._journalSequence = 0;
        }
    },

    getAll: function() { return this._entries; },

    commitEntry: async function(event, memo, lines) {
        if (this.isRecoveryMode) throw new Error("🚨 GL_REPOS_ERR: 系統處於復原模式，封鎖全新交易。");
        if (!memo || memo.trim().length === 0) throw new Error("🚨 GL_REPOS_ERR: 審計備忘錄不可為空。");

        let totalDebit = 0;
        let totalCredit = 0;
        const immutableLines = structuredClone(lines);

        immutableLines.forEach(line => {
            JournalValidationEngine.validate(line);
            
            // 💡 🎯 ARB 建議落實 1：// Defensive Freeze 注解
            // 雖然外部 newEntry 在最外層有全域的 deepFreeze 進行遞迴焊死，
            // 但此處在中途先手 Object.freeze(line) 屬於雙重防衛設計，確保中途外部參照保留副作用為零。
            Object.freeze(line); 
            
            if (line.type === 'DEBIT') totalDebit += line.amount;
            else totalCredit += line.amount;
        });

        if (totalDebit !== totalCredit) throw new Error(`🚨 GL_REPOS_ERR: BOOKS_OUT_OF_BALANCE!`);

        const uuid = generateSecureUUID();
        if (!uuid) throw new Error("CRYPTO_NOT_SUPPORTED");

        const nextSeq = this._journalSequence + 1;
        const journalNo = await JournalNumberProvider.nextJournalNo(nextSeq);

        const newEntry = deepFreeze({
            entryId: uuid,
            journalNo: journalNo,
            postedAt: Date.now(),
            event,
            memo,
            lines: immutableLines
        });

        const memoryEntriesSnapshot = structuredClone(this._entries);
        const memorySequenceSnapshot = this._journalSequence;
        
        try {
            this._entries.push(newEntry);
            this._journalSequence = nextSeq; 
            
            StorageInterface.save(this._entries, this._journalSequence); 
            return newEntry;
        } catch (storageError) {
            this._entries = memoryEntriesSnapshot;
            this._journalSequence = memorySequenceSnapshot;
            throw new Error(`🚨 GL_ATOM_ERR: 磁碟寫入失敗！記憶體與 Sequence 指針已啟動原子性 Rollback。`);
        }
    },

    /**
     * 🎯 🎯 ARB 建議落實 2：reverseEntry 補齊安全 UUID 熔斷防線
     */
    reverseEntry: async function(targetEntryId, reason) {
        if (this.isRecoveryMode) throw new Error("🚨 GL_REPOS_ERR: 復原模式下禁止對沖。");
        
        const target = this._entries.find(e => e.entryId === targetEntryId);
        if (!target) throw new Error("🚨 GL_REPOS_ERR: 找不到指定之原始傳票。");

        const alreadyReversed = this._entries.some(e => e.event === 'REVERSAL' && e.reversalOf === targetEntryId);
        if (alreadyReversed) {
            throw new Error("🚨 GL_REPOS_ERR: 鐵律攔截！該傳票先前已完成反向對沖，禁止重複沖銷。");
        }

        const reversedLines = target.lines.map(line => {
            const l = { account: line.account, type: line.type === 'DEBIT' ? 'CREDIT' : 'DEBIT', amount: line.amount };
            return Object.freeze(l); 
        });

        // 🎯 🎯 ARB 建議落實 2：反向沖銷端的唯一指紋 UUID 熔斷校驗
        const uuid = generateSecureUUID();
        if (!uuid) {
            throw new Error("🚨 CRYPTO_SECURITY_CRITICAL: Secure UUID API (crypto.randomUUID) Required for Reversal Event. Operation Halted.");
        }

        const nextSeq = this._journalSequence + 1;
        const reversalNo = await JournalNumberProvider.nextJournalNo(nextSeq);
        
        const reversalEntry = deepFreeze({
            entryId: uuid, // 注入安全校驗後的唯一主鍵
            journalNo: reversalNo,
            postedAt: Date.now(),
            event: "REVERSAL",
            reversalOf: targetEntryId, 
            memo: `【紅字沖銷】➔ 沖銷傳票 ${target.journalNo}。原因: ${reason}`,
            lines: reversedLines
        });

        const memoryEntriesSnapshot = structuredClone(this._entries);
        const memorySequenceSnapshot = this._journalSequence;

        try {
            this._entries.push(reversalEntry);
            this._journalSequence = nextSeq;
            
            StorageInterface.save(this._entries, this._journalSequence);
            return reversalEntry;
        } catch (storageError) {
            this._entries = memoryEntriesSnapshot;
            this._journalSequence = memorySequenceSnapshot;
            throw new Error(`🚨 GL_ATOM_ERR: 沖銷分錄磁碟寫入失敗。記憶體與指針已完全 Rollback。`);
        }
    }
};

// 啟動事實倉庫
JournalEntryRepository.init();

/**
 * ⚙️ 全動態 O(N) 總帳運算引擎
 */
function getAggregationData(customEntries = null) {
    let AccountBalances = {};
    Object.keys(ChartOfAccounts).forEach(code => { AccountBalances[code] = 0; });

    const targetEntries = customEntries ? [...JournalEntryRepository.getAll(), ...customEntries] : JournalEntryRepository.getAll();

    const reversedEntryIds = new Set();
    targetEntries.forEach(entry => {
        if (entry.event === 'REVERSAL' && entry.reversalOf) {
            reversedEntryIds.add(entry.reversalOf); 
            reversedEntryIds.add(entry.entryId);    
        }
    });

    targetEntries.forEach(entry => {
        if (reversedEntryIds.has(entry.entryId)) return;

        entry.lines.forEach(line => {
            const meta = ChartOfAccounts[line.account];
            if (meta.normal === 'DEBIT') {
                if (line.type === 'DEBIT') AccountBalances[line.account] += line.amount;
                else AccountBalances[line.account] -= line.amount;
            } else {
                if (line.type === 'CREDIT') AccountBalances[line.account] += line.amount;
                else AccountBalances[line.account] -= line.amount;
            }
        });
    });

    const cash = AccountBalances['1100'];
    const insurance = AccountBalances['1200'];
    const fubon = AccountBalances['2100'];
    const student = AccountBalances['2200'];
    const initialNetworth = AccountBalances['3100'];

    const totalAssets = cash + insurance;
    const totalLiabilities = fubon + student;
    const netWorth = totalAssets - totalLiabilities;

    const coverageRate = fubon > 0 ? ((insurance / fubon) * 100).toFixed(2) : 0;
    const safetyMonths = (cash / 18000).toFixed(1);
    const monthlyCashFlow = null; 

    let totalDebits = 0;
    let totalCredits = 0;
    Object.keys(ChartOfAccounts).forEach(code => {
        const bal = AccountBalances[code];
        const meta = ChartOfAccounts[code];
        if (bal >= 0) {
            if (meta.normal === 'DEBIT') totalDebits += bal;
            else totalCredits += bal;
        } else {
            if (meta.normal === 'DEBIT') totalCredits += Math.abs(bal);
            else totalDebits += Math.abs(bal);
        }
    });

    return {
        netWorth, cash, debt: totalLiabilities, coverageRate, safetyMonths, monthlyCashFlow,
        insurance, fubon, student, initialNetworth, totalDebits, totalCredits, difference: totalDebits - totalCredits,
        reversedEntryIds 
    };
}
