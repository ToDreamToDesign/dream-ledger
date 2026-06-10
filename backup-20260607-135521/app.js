/* ==========================================================================
   🎛️ DREAM LEDGER 2.0 - TRANSACTION CAPTURE CONTROLLER (V4.3 PROD-FINAL)
   ========================================================================== */

function runBootDiagnostics() {
    const mask = document.getElementById('boot-diagnostic-mask');
    const msgEl = document.getElementById('boot-fatal-message');
    const codeEl = document.getElementById('boot-fatal-code');

    if (typeof crypto === 'undefined' || !crypto.randomUUID) {
        msgEl.innerHTML = "此執行環境不支援安全識別碼產生器 (Missing `crypto.randomUUID` API)。<br>系統已安全鎖定，拒絕退回低安全性隨機數。";
        codeEl.innerText = "STATUS_CODE: CRYPTO_NOT_SUPPORTED // SEVERITY: FATAL";
        mask.style.display = 'flex';
        return false;
    }

    if (JournalEntryRepository.isRecoveryMode) {
        const recoveryBanner = document.getElementById('preview-badge-notice');
        recoveryBanner.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px; width:100%; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-family:'Orbitron'; font-weight:900; color:var(--neon-red);">[SYSTEM RECOVERY MODE // 唯讀復原模式]</span>
                    <span>偵測到快取結構損毀。已鎖死寫入權限以防二次污染，但已為您安全封存歷史殘留，請立即導出備份。</span>
                </div>
                <button class="form-control" style="border-color:var(--neon-red); color:var(--neon-red); background:rgba(239,68,68,0.1); font-weight:bold; padding:4px 12px; cursor:pointer;" onclick="exportCorruptedJSON()">🚨 一鍵導出受損資產</button>
            </div>
        `;
        recoveryBanner.style.background = 'rgba(239, 68, 68, 0.12)';
        recoveryBanner.style.borderColor = 'var(--neon-red)';
        recoveryBanner.style.display = 'flex';
        document.getElementById('form-post-panel').style.opacity = '0.25';
        document.getElementById('form-post-panel').style.pointerEvents = 'none';
    }
    return true;
}

function exportCorruptedJSON() {
    const rawData = JournalEntryRepository.corruptedPayload || "{}";
    const blob = new Blob([rawData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DREAM_LEDGER_CORRUPTED_RECOVERY_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("🔒 GL_RECOVERY_SUCCESS: 原始受損資產已安全導出。");
}

function toggleJournalAccordion() {
    document.getElementById('journalAccordion').classList.toggle('expanded');
}

/**
 * 🎯 去領域化 ViewModel 工廠
 */
const LedgerViewModelFactory = {
    createJournalViewModel: function(entry, isTargetReversed) {
        let viewModels = [];
        entry.lines.forEach(line => {
            const meta = ChartOfAccounts[line.account];
            let actionType = 'neutral';
            let mathSign = '';

            if (line.type === 'DEBIT') {
                if (meta.displayEffect === 'positive') { actionType = 'increase'; mathSign = '+'; }
                else if (meta.displayEffect === 'negative') { actionType = 'increase'; mathSign = '-'; }
            } else if (line.type === 'CREDIT') {
                if (meta.displayEffect === 'positive') { actionType = 'decrease'; mathSign = '-'; }
                else if (meta.displayEffect === 'negative') { actionType = 'decrease'; mathSign = '+'; }
                else if (meta.displayEffect === 'neutral') { actionType = 'increase'; mathSign = '+'; }
            }

            const timeString = new Date(entry.postedAt).toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' });

            viewModels.push({
                rawEntryId: entry.entryId,
                journalNo: entry.journalNo, 
                isReversedVisual: isTargetReversed, 
                eventLabel: entry.event,
                pathText: `[${line.type}] ➔ 科目編碼:${line.account} (${meta.name})`,
                visualType: actionType, 
                mathSign: mathSign,
                amountText: line.amount.toLocaleString(),
                memoTrack: entry.memo,
                timeLabel: timeString
            });
        });
        return viewModels;
    }
};

/**
 * 📥 調度數據敷設至前端 UI 大盤
 */
function renderDashboard(mockEntries = null) {
    const data = getAggregationData(mockEntries);

    document.getElementById('ui-networth').innerText = (data.netWorth >= 0 ? '+$' : '-$') + Math.abs(data.netWorth).toLocaleString();
    document.getElementById('ui-cash').innerText = '$' + data.cash.toLocaleString();
    document.getElementById('ui-debt').innerText = '$' + data.debt.toLocaleString();
    document.getElementById('ui-coverage').innerHTML = data.coverageRate + '<span class="card-unit">%</span>';
    document.getElementById('ui-safety').innerHTML = data.safetyMonths + '<span class="card-unit">MOS</span>';
    
    const cashFlowEl = document.getElementById('ui-cashflow');
    if (data.monthlyCashFlow === null) {
        cashFlowEl.innerText = 'N/A';
        cashFlowEl.style.color = 'var(--text-muted)';
    }

    const safetyCard = document.getElementById('card-safety');
    if (parseFloat(data.safetyMonths) >= 3.0) safetyCard.className = "glass-card card-cyan";
    else safetyCard.className = "glass-card card-alert";

    document.getElementById('debug-debit').innerText = data.totalDebits.toLocaleString();
    document.getElementById('debug-credit').innerText = data.totalCredits.toLocaleString();
    
    const diffEl = document.getElementById('debug-diff');
    const badgeEl = document.getElementById('debug-status-badge');
    diffEl.innerText = data.difference.toLocaleString();
    
    if (data.difference === 0) {
        diffEl.style.color = "var(--neon-green)";
        badgeEl.innerText = "BALANCED";
        badgeEl.className = "debug-badge badge-balanced";
    } else {
        diffEl.style.color = "var(--neon-red)";
        badgeEl.innerText = "🚨 BOOKS OUT OF BALANCE";
        badgeEl.className = "debug-badge badge-out";
    }

    renderAssetPie(data.cash, data.insurance);
    renderDebtBar(data.fubon, data.student);
    renderViewModelTable(data.reversedEntryIds);
}

function renderAssetPie(cash, insurance) {
    const total = cash + insurance;
    const cashPct = total > 0 ? ((cash / total) * 100).toFixed(1) : 0;
    const insPct = total > 0 ? ((insurance / total) * 100).toFixed(1) : 0;
    document.getElementById('ui-asset-chart').innerHTML = `
        <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between;"><span>1200 安達保單資產 (${insPct}%)</span><span style="font-family: monospace;">$${insurance.toLocaleString()}</span></div>
        <div class="bar-container"><div class="bar-fill" style="width: ${insPct}%; background: var(--neon-purple); box-shadow: 0 0 8px var(--neon-purple);"></div></div>
        <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between; margin-top: 10px;"><span>1100 流動台幣現金 (${cashPct}%)</span><span style="font-family: monospace;">$${cash.toLocaleString()}</span></div>
        <div class="bar-container"><div class="bar-fill" style="width: ${cashPct}%; background: var(--neon-cyan); box-shadow: 0 0 8px var(--neon-cyan);"></div></div>
    `;
}

function renderDebtBar(fubon, student) {
    const total = fubon + student;
    const fubonPct = total > 0 ? ((fubon / total) * 100).toFixed(1) : 0;
    const studentPct = total > 0 ? ((student / total) * 100).toFixed(1) : 0;
    document.getElementById('ui-debt-chart').innerHTML = `
        <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between;"><span>2100 富邦信用貸款 (${fubonPct}%)</span><span style="font-family: monospace;">$${fubon.toLocaleString()}</span></div>
        <div class="bar-container"><div class="bar-fill" style="width: ${fubonPct}%; background: var(--neon-red); box-shadow: 0 0 8px var(--neon-red);"></div></div>
        <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between; margin-top: 10px;"><span>2200 國家就學貸款 (${studentPct}%)</span><span style="font-family: monospace;">$${student.toLocaleString()}</span></div>
        <div class="bar-container"><div class="bar-fill" style="width: ${studentPct}%; background: rgba(255,255,255,0.2);"></div></div>
    `;
}

function renderViewModelTable(reversedEntryIds) {
    const container = document.getElementById('journal-rows-container');
    container.innerHTML = '';
    const entries = JournalEntryRepository.getAll();
    
    entries.forEach(entry => {
        const isTargetReversed = reversedEntryIds.has(entry.entryId);
        
        const viewModels = LedgerViewModelFactory.createJournalViewModel(entry, isTargetReversed);
        viewModels.forEach((vm, idx) => {
            let cssClass = 'amt-neutral';
            if (vm.visualType === 'increase') cssClass = 'amt-debit';
            else if (vm.visualType === 'decrease') cssClass = 'amt-credit';

            const rowStyle = vm.isReversedVisual ? 'opacity: 0.22; text-decoration: line-through;' : '';

            const isRevBlocked = JournalEntryRepository.isRecoveryMode;
            const actionButtonHtml = (idx === 0 && !vm.isReversedVisual && vm.eventLabel !== 'OPENING' && !isRevBlocked) 
                ? `<button class="btn-remove-line" style="font-size:0.7rem; border:1px solid rgba(239,68,68,0.4); padding:2px 6px; border-radius:4px; color:var(--neon-red);" onclick="triggerEntryReversal('${vm.rawEntryId}')">沖銷(Reverse)</button>` 
                : `<span style="font-size:0.7rem; color:var(--text-muted); opacity:0.5;">${vm.isReversedVisual ? 'REVERSED' : 'ACTIVE'}</span>`;

            const tr = document.createElement('tr');
            tr.style = rowStyle;
            tr.innerHTML = `
                <td style="font-weight:bold; color:var(--neon-cyan);">${vm.journalNo}</td>
                <td style="color:var(--text-light); font-weight:500; font-size:0.75rem;">${vm.eventLabel}</td>
                <td class="tx-flow" style="font-size:0.8rem; color:var(--text-muted);">${vm.pathText}</td>
                <td class="${cssClass}">${vm.mathSign}$${vm.amountText}</td>
                <td style="color:var(--text-muted); font-family:sans-serif; display:flex; justify-content:space-between; align-items:center; width:100%;">
                    <span>${vm.memoTrack} <small style="opacity:0.5;">(${vm.timeLabel})</small></span>
                    ${actionButtonHtml}
                </td>
            `;
            container.appendChild(tr);
        });
    });
}

/* ==========================================================================
   📥 CAPTURE INTERACTION ENGINE
   ========================================================================== */

function addFormLine() {
    const container = document.getElementById('form-lines-container');
    const secureId = generateSecureUUID();
    const rowId = 'line-' + (secureId ? secureId.substring(0,8) : String(Date.now()));
    
    let optionsHtml = '';
    Object.keys(ChartOfAccounts).forEach(code => {
        optionsHtml += `<option value="${code}">${code} - ${ChartOfAccounts[code].name}</option>`;
    });

    const div = document.createElement('div');
    div.className = 'form-inline-row';
    div.id = rowId;
    
    div.innerHTML = `
        <select class="form-control field-account" onchange="calculateFormBalance()">${optionsHtml}</select>
        <select class="form-control field-type" onchange="calculateFormBalance()"><option value="DEBIT">DEBIT (借)</option><option value="CREDIT">CREDIT (貸)</option></select>
        <input type="number" class="form-control field-amount" value="1000" min="1" oninput="calculateFormBalance()">
        <button class="btn-remove-line" onclick="removeFormLine('${rowId}')">✕</button>
    `;
    container.appendChild(div);
    calculateFormBalance();
}

function removeFormLine(id) {
    const row = document.getElementById(id);
    if (row) row.remove();
    calculateFormBalance();
}

function calculateFormBalance() {
    const rows = document.querySelectorAll('.form-inline-row');
    let totalDebit = 0;
    let totalCredit = 0;

    rows.forEach(row => {
        const type = row.querySelector('.field-type').value;
        const amount = parseInt(row.querySelector('.field-amount').value) || 0;
        if (type === 'DEBIT') totalDebit += amount;
        else totalCredit += amount;
    });

    const diff = totalDebit - totalCredit;
    const indicator = document.getElementById('form-balance-indicator');
    
    document.getElementById('form-total-debit').innerText = totalDebit.toLocaleString();
    document.getElementById('form-total-credit').innerText = totalCredit.toLocaleString();
    
    if (diff === 0 && rows.length > 0) {
        indicator.innerText = "MATCHED (天平平衡)";
        indicator.className = "form-balance-status matched";
        if (!JournalEntryRepository.isRecoveryMode) {
            document.getElementById('btn-post-action').disabled = false;
            document.getElementById('btn-preview-action').disabled = false;
        }
    } else {
        indicator.innerText = `UNBALANCED (差額: ${diff.toLocaleString()})`;
        indicator.className = "form-balance-status unbalanced";
        document.getElementById('btn-post-action').disabled = true;
        document.getElementById('btn-preview-action').disabled = true;
    }
}

function captureFormDraft() {
    const memo = document.getElementById('form-memo').value.trim();
    const event = document.getElementById('form-event').value;
    const rows = document.querySelectorAll('.form-inline-row');
    if (!memo) return null;

    let lines = [];
    rows.forEach(row => {
        lines.push({
            account: row.querySelector('.field-account').value,
            type: row.querySelector('.field-type').value,
            amount: parseInt(row.querySelector('.field-amount').value) || 0
        });
    });
    return { event, memo, lines };
}

function triggerDryRunPreview() {
    const draft = captureFormDraft();
    if (!draft) { alert("現場防呆：請填寫審計軌跡備忘錄。"); return; }

    activePreviewDraft = deepFreeze(structuredClone(draft));
    renderDashboard([activePreviewDraft]);

    document.getElementById('preview-badge-notice').style.display = 'flex';
    document.getElementById('btn-clear-preview').style.display = 'inline-block';
}

function clearDryRunPreview() {
    activePreviewDraft = null;
    renderDashboard();
    document.getElementById('preview-badge-notice').style.display = 'none';
}

async function commitFormPost() {
    if (!activePreviewDraft) {
        alert("🔒 GL_POLICY_BLOCKED: 違反交易治理原則！過帳前必須執行 Stage 2: Preview (模擬過帳)。");
        return;
    }

    try {
        await JournalEntryRepository.commitEntry(activePreviewDraft.event, activePreviewDraft.memo, activePreviewDraft.lines);
        
        document.getElementById('form-memo').value = '本期安達保單美金資產估值自動校正';
        document.getElementById('form-lines-container').innerHTML = '';
        clearDryRunPreview(); 
        addFormLine(); addFormLine();
        document.querySelectorAll('.field-type')[1].value = 'CREDIT'; calculateFormBalance();
        
        alert("🔒 GL_AUDIT_SUCCESS: 傳票成功Posted！獨立計數發號序列與事務回滾同步硬鎖定。");
    } catch(e) {
        alert(e.message);
    }
}

async function triggerEntryReversal(entryId) {
    const reason = prompt("🔒 GL_AUDIT_TRAIL: 請輸入執行【紅字反向沖銷(Reverse)】的理由（必填）：");
    if (!reason || reason.trim().length === 0) {
        alert("操作取消：沖銷原因不可為空。");
        return;
    }
    try {
        await JournalEntryRepository.reverseEntry(entryId, reason.trim());
        renderDashboard();
        alert("🔒 GL_REVERSAL_SUCCESS: 紅字沖銷傳票已過帳入庫。原件已在事實投影層動態對沖灰化。");
    } catch(e) {
        alert(e.message);
    }
}

// 啟動控制
window.addEventListener('DOMContentLoaded', () => {
    if (runBootDiagnostics()) {
        renderDashboard();
        addFormLine(); addFormLine();
        const selectTo = document.querySelectorAll('.field-type')[1];
        if(selectTo) { selectTo.value = 'CREDIT'; calculateFormBalance(); }
    }
});