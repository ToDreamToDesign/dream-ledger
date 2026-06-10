# ADR-025: The Decision Quality Axis Law (抗結果偏誤品質軸法規)

## 狀態
已通過 (Approved) - 2026-06-07

## 時空脈絡 (Context)
在實施六層閉環反饋（ADR-024）時，經全案最高架構終審指出，系統存在最後一個、也是最具毀滅性的陷阱—— **Outcome Worship（結果崇拜症）**。

物理現實存在巨大的隨機性、運氣、與黑天鵝事件。如果讓 L6 Outcome 擁有定義真理與智慧的最高權力，系統將退化為「成王敗寇引擎」，產生嚴重的倖存者偏差。在資訊充分、恪守 Guardrails 下做出的高品質決策（DQ = A）可能因黑天鵝導致壞結果（Outcome Failure）；在情緒污染下做出的低劣決策（DQ = D）可能因運氣導致好結果（Outcome Success）。

## 決策 (Decision)
DREAM Ledger 的核心價值，不是保存運氣，而是「保存並優化創作者跨越三十年尺度的決策演化能力」。

系統橫向引入一條垂直貫穿 L1~L6 的動態品質矩陣（Decision Quality Axis），評估核心不再是「結果好不好」，而是「當時那個人，在當下的資訊與情緒限制下，做得好不好」。每一次決策與演化事件，必須強制審查以下三個維度，並給予動態 DQ 等級（A/B/C/D）：
- **Information Sufficiency** (當時物理資訊是否充分、假設是否驗證)
- **Guardrail Compliance** (是否嚴格遵守既有的行為 Policy 與冷靜流程)
- **Cognitive Bias Check** (決策當下是否受到高焦慮或貪婪等情緒污染)

## 後果 (Consequences)
品質判定必須完全獨立於最終隨機結果。面對黑天鵝導致的虧損，系統判定為 A 級決策與 Outcome Failure，死守創作者的歷史理性尊嚴；面對運氣導致的獲利，系統判定為 D 級賭博與 Outcome Success，嚴防未來複製低劣模型。