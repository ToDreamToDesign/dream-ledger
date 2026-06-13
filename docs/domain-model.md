# domain-model.md

_The entities that exist in DREAM Ledger, their structure, and how they relate._

---

## Overview

DREAM Ledger has nine domain entities. They divide into three categories by their nature:

| Category | Entities |
|----------|---------|
| Financial State | Asset, Liability, Snapshot, CashflowModel |
| Decision Archaeology | LifeEvent, Decision, Reflection |
| Operations | Record, Settings |

---

## Entity Reference

---

### Asset

**What it is:** A single verified financial holding.

**Source:** `data/user.js` → `realAssets`

| Field | Type | Rule |
|-------|------|------|
| name (key) | string | Identifies the asset |
| value | number | Must be audited. No estimates, no rounding. |

**Current instances:**

| Key | Description | Temporal Layer |
|-----|-------------|---------------|
| `cash` | Liquid cash | Investment / Future |
| `kgiPolicy` | 凱基配息型保單 | Investment / Future |
| `andaTwd` | 安達台幣保單 | Investment / Future |
| `botSavings` | 台銀儲蓄保單 | Investment / Future |

**Computed getters (in `user.js`):**
- `getTotalAssets()` — sum of all assets
- `getPassiveAssets()` — assets that generate passive income (currently kgiPolicy only)

---

### Liability

**What it is:** A single verified debt obligation.

**Source:** `data/user.js` → `realLiabilities`

| Field | Type | Rule |
|-------|------|------|
| name (key) | string | Identifies the liability |
| amount | number | Remaining principal. Must be audited. |

**Metadata (`liabilityMeta`):**

Each liability has a metadata entry:

| Field | Description |
|-------|-------------|
| `category` | System-level category (信用貸款, 學生貸款, 個人借款, 信用卡分期) |
| `label` | Creator's personal name for the item |
| `monthlyKey` | Key into `cashflowModel.expense.loanRepayment` |
| `badge` | `active` (ongoing) or `soon` (upcoming / temporary) |
| `note` | Human note about the item |

**Current instances:**

| Key | Category | Temporal Layer |
|-----|----------|---------------|
| `fubonLoan` | 信用貸款 | Debt / Past |
| `studentLoan` | 學生貸款 | Debt / Past |
| `privateLoan` | 個人借款 | Debt / Past |
| `massageChair` | 信用卡分期 | Debt / Past |

---

### CashflowModel

**What it is:** The recurring monthly cash flow — income sources and expense categories.

**Source:** `data/user.js` → `cashflowModel`

**Income fields:**

| Key | Description | Temporal Layer |
|-----|-------------|---------------|
| `baseSalary` | Monthly base salary | Living / Present |
| `reimbursement` | Company expense reimbursement (variable) | Living / Present |
| `kgiDividend` | 凱基保單 monthly dividend | Investment / Future |

**Expense fields:**

| Key | Description | Temporal Layer |
|-----|-------------|---------------|
| `rent` | Monthly rent | Living / Present |
| `insurance` | All insurance premiums | Debt / Past (protection obligation) |
| `loanRepayment` | Loan repayments (fubon + student + massageChair) | Debt / Past |
| `telecomSubscription` | Phone and subscriptions | Living / Present |

**Computed:**
- `getMonthlyCashflow()` = total income − total expense

---

### Snapshot

**What it is:** A point-in-time record of the creator's audited financial state at month-end.

**Source:** `data/snapshot.js`

| Field | Type | Rule |
|-------|------|------|
| `date` | `YYYY-MM` | Month of the snapshot |
| `assets` | number | Must match `user.js getTotalAssets()` at audit time |
| `liabilities` | number | Must match `user.js getTotalLiabilities()` at audit time |
| `netWorth` | number | `assets − liabilities` |
| `note` | string | Optional. Major events or audit status. |

**Audit status** is recorded in the `note` field:
- `"audited"` — creator personally verified all figures
- `"estimated"` — figures reconstructed from memory or incomplete records

Snapshots are append-only. Past snapshots must not be silently altered. If correction is needed, record it in `CHANGELOG.md`.

---

### LifeEvent

**What it is:** A significant decision or event in the creator's life, with context and meaning.

**Source:** `data/events.js`

| Field | Type | Rule |
|-------|------|------|
| `year` | string | Year of the event |
| `category` | string | One of: Career, Family, Investment, Protection, Cognition |
| `title` | string | Short descriptor |
| `fact` | string | Objective, verifiable statement of what happened |
| `context` | string | Environment and constraints at the time |
| `question` | string | The core question the decision was answering |
| `decision` | string | What was actually chosen |

**Rules:**
- `fact` must be verifiable. No interpretation.
- `decision` must reflect information available at the time — not outcome-informed hindsight.
- `reflection` (when present) belongs in a separate Reflection entity, not in this field.

**Categories and semantic color:**

| Category | Meaning | Timeline Dot Color |
|----------|---------|-------------------|
| Career | Work, income, professional identity | `--neon-green` (legacy) |
| Family | Family relationships, caregiving | `--neon-rose` (legacy) |
| Investment | Financial decisions, asset building | `--color-investment` (target) |
| Protection | Insurance, risk management | `--color-debt` (target) |
| Cognition | Insight, system building, mental models | `--color-brand` (target) |

---

### Decision

**What it is:** An extended, permanent record of a significant decision. More detailed than LifeEvent.

**Source:** `archive/decisions/DEC-NNN.md`

| Field | Rule |
|-------|------|
| ID (`DEC-NNN`) | Sequential. Never reuse a retired ID. |
| Date | When the decision was made. |
| Title | Same as linked LifeEvent title. |
| Question | The core question. |
| Decision | What was chosen. |
| Outcome | `Done`, `Ongoing`, or a specific result. |

**Relationship to LifeEvent:** Every LifeEvent with a `DEC-NNN` ID has a corresponding Decision file. They share the same Question and Decision fields. Decision files add Outcome tracking over time.

---

### Reflection

**What it is:** A monthly written reflection on decisions, events, and financial state.

**Source:** `archive/reflections/YYYY/REF-YYYY-MM.md`

Reflections are free-form markdown documents. They are not structured data.

**Links:** Each reflection references related Decisions and Snapshots in a `Linked` section.

**Rule:** Reflections are private. They may include emotional content, speculation, and outcome interpretation that would violate Anti-Result Bias if placed in a LifeEvent or Decision record.

---

### Record

**What it is:** A single day-to-day financial transaction — income or expense.

**Source:** In-app ledger (entered via Records page form, stored in-browser)

| Field | Type | Rule |
|-------|------|------|
| `date` | `YYYY-MM-DD` | Transaction date |
| `type` | `income` \| `expense` | Direction of flow |
| `category` | string | User-defined category |
| `amount` | number | Positive value. Direction determined by `type`. |
| `description` | string | Brief description |
| `note` | string | Optional 記事 (longer note) |
| `isEvent` | boolean | Whether to promote to LifeEvent |

**Temporal Layer:** Living / Present. Records capture the now.

---

### Settings

**What it is:** Application-level configuration.

**Source:** `data/settings.js`

| Field | Value |
|-------|-------|
| `currency` | `TWD` |
| `locale` | `zh-TW` |
| `owner` | `孟繁宗 (DREAM 君)` |
| `version` | `0.9` |

Settings do not contain financial data and are not subject to audit requirements.

---

## Entity Relationships

```
                    ┌─────────────┐
                    │  Snapshot   │◄──── Asset (aggregated)
                    │  (monthly)  │◄──── Liability (aggregated)
                    └──────┬──────┘
                           │ linked
                    ┌──────▼──────┐
                    │  Reflection │
                    │  (monthly)  │
                    └──────┬──────┘
                           │ linked
┌───────────┐       ┌──────▼──────┐
│ LifeEvent │──────►│  Decision   │
│ (events.js│       │ (archive/)  │
└───────────┘       └─────────────┘

CashflowModel ◄──── Asset (kgiDividend)
              ◄──── Liability (monthlyRepayment)

Record ──────────── feeds into monthly cashflow totals
```

---

## What Does Not Exist Yet

| Entity | Status | Note |
|--------|--------|------|
| Wisdom | Not implemented | Described in `constitution.md` as the final output of the Reflection chain |
| LifeEvent.reflection | Not implemented | Currently stored separately as Reflection files |
| Record persistence | In-browser only | Records are not written back to `data/` files |

---

_Last updated: 2026-06-13_
