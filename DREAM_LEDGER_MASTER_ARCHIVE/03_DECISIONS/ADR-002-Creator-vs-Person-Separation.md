# ADR-002: Creator 與 Person 必須嚴格分離

## Status
Accepted

## Context
在 DREAM Ledger 的初始構想中，創作者的產品哲學（Creator Context）與個人的財務／生活紀錄（User/Person Context）常被混淆。這會導致未來系統在面臨多使用者擴充、家庭成員共同使用，或是進行長期維護時，造成資料結構與語意上的混亂。

## Decision
我們決定將 DREAM Ledger 的系統邊界明確劃分為兩大核心空間：

1. **Creator Space（創作者空間，如 00_CREATOR/）**：
   - 僅用於定義產品的世界觀、本體論（Ontology）、設計哲學與創世宣言。
   - 此空間屬於產品的「核心 Kernel」，**不包含任何特定個人的財務、事件或生命實證數據**。

2. **Person Space（使用者空間，如 10_PEOPLE/）**：
   - 引入 `Person` 本體。任何使用者（包含作為第一位使用者的創作者本人 `person-0001-meng-fanzong`）皆在此空間留下獨立的生命軌跡。
   - 所有的 Question → Decision → Fact → Reflection → Wisdom 鏈條均必須完全歸屬於某個特定的 Person。
   - 財務數據（保單、信貸、股票等）僅作為該 Person 決策軌跡下的「證據 (Evidence)」。

## Consequences
- **架構純淨化**：創作者的人生故事與資產，不會污染產品的底層哲學文件。
- **高擴充性**：未來可無縫新增 `Person-0002`（如妻子）、`Person-0003`（如孩子），每個人擁有完全獨立的生命帳本，但共享同一套 Creator 世界觀。
- **走向 Human Ledger**：DREAM Ledger 從「財務記帳軟體」正式昇華為「人類決策軌跡框架」。