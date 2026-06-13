# ui-governance.md

_The laws governing how DREAM Ledger is structured, what each page contains, and what the UI must never do._

---

## Principle: The Interface Serves the Record

The UI is a lens into the data. It must not reinterpret, simplify, or editorialize the underlying facts.

Visual clarity is not a justification for hiding truth.

---

## Global Layout

```
┌─────────────────────────────────────────────┐
│  Sidebar (固定)  │  Main Content             │
│                  │                           │
│  Navigation      │  [Page Brand Tag]         │
│  - 儀表板        │                           │
│  - 資產管理      │  [Page Content]           │
│  - 負債管理      │                           │
│  - 記帳紀錄      │                           │
│  - 人生事件      │                           │
│  - 關於系統      │                           │
│                  │                           │
└─────────────────────────────────────────────┘
```

**Sidebar is permanent.** It is never hidden on desktop. Navigation is always accessible.

Mobile: sidebar collapses to a hamburger toggle. Content is read-only on mobile.

---

## Page Hierarchy

Navigation order is fixed:

| Order | Page ID | ZH | EN | Role |
|-------|---------|----|----|------|
| 1 | `page-dashboard` | 儀表板 | Dashboard | Primary entry. Always loads first. |
| 2 | `page-assets` | 資產管理 | Assets | Investment / Future layer |
| 3 | `page-liabilities` | 負債管理 | Liabilities | Debt / Past layer |
| 4 | `page-records` | 記帳紀錄 | Ledger | Living / Present layer |
| 5 | `page-events` | 人生事件 | Life Events | Decision Archaeology |
| 6 | `page-about` | 關於系統 | About | Identity / Manifesto |

This order is not arbitrary. Pages 2–4 mirror the three semantic color layers (Future → Past → Present). Pages 5–6 are contextual layers.

**Do not reorder navigation without updating this document.**

---

## Page Information Architecture

Each page follows the pattern: **Hero → Stats → Content Grid**

The Hero always shows the most important single number for that page. Stats show supporting metrics. Content Grid holds the detail.

---

### Page 1 — Dashboard (`#page-dashboard`)

**Purpose:** Single-screen summary of the creator's current financial reality.

```
┌──────────────────────────────────┐
│  HERO                            │
│  Net Worth (primary)             │
│  Total Assets │ Total Liabilities│
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  STATS GRID (6 cards)            │
│  Income │ Expense │ Cashflow     │
│  Debt   │ Passive │ Coverage     │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  MAIN GRID (2-column)            │
│  Asset Trend Chart │ Life Events │
└──────────────────────────────────┘
```

**Governance rules:**
- Hero net worth is the primary number. It must not be replaced by any other metric.
- The 6 stats cards are fixed. Their order is fixed.
- Chart (left) and Life Events (right) are the two content panels. Neither may be removed.
- Do not add promotional or decorative panels to the dashboard.

---

### Page 2 — Assets (`#page-assets`)

**Purpose:** Breakdown of Investment / Future layer.

```
┌──────────────────────────────────┐
│  HERO                            │
│  Total Assets (primary)          │
│  Net Worth                       │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  ASSET GRID (2-column)           │
│  Asset Breakdown  │ Passive Income│
│  (cash, policies) │ (yield, cover)│
└──────────────────────────────────┘
```

**Governance rules:**
- Asset color = `--color-investment` (Cyan). Never use debt or alert colors here.
- Passive income is displayed here (not in Liabilities) because it is Investment Return.

---

### Page 3 — Liabilities (`#page-liabilities`)

**Purpose:** Breakdown of Debt / Past layer.

```
┌──────────────────────────────────┐
│  HERO                            │
│  Total Liabilities (primary)     │
│  Monthly Repayment               │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  STAT GRID (4-column)            │
│  [per-debt stat cards]           │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  COVERAGE STATS (2-column)       │
│  Expense Coverage │ Loan Coverage│
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  DEBT BREAKDOWN                  │
│  [individual debt items]         │
└──────────────────────────────────┘
```

**Governance rules:**
- Debt color = `--color-debt` (Amber). This page uses amber, not rose.
- Monthly repayment is secondary to total liabilities. It must never be promoted to hero-level prominence.
- Debt items display `badge-active` (ongoing) or `badge-soon` (upcoming). These are informational, not alarm states.

---

### Page 4 — Records (`#page-records`)

**Purpose:** Living / Present layer. Day-to-day income and expense tracking.

```
┌──────────────────────────────────┐
│  STAT GRID (4 cards)             │
│  Fixed Income │ Fixed Expense    │
│  Monthly Exp  │ Actual Cashflow  │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  BREAKDOWN GRID (2-column)       │
│  Income Detail │ Expense Detail  │
│  (collapsible) │ (collapsible)   │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  MAIN GRID (2-column)  ← FIXED  │
│  New Record Form │ Recent Records│
│  (Left)          │ (Right)       │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  VL SUMMARY GRID                 │
│  [income / expense totals]       │
└──────────────────────────────────┘
```

**Governance rules:**

The Main Grid layout is **locked**:
- LEFT = New Record entry form. Always left. Always visible.
- RIGHT = Recent Records list. Always right. Never moved below the form.

This layout reflects a workflow: input on the left, immediate feedback on the right. Reversing it breaks the workflow.

**Do not move the record form below the recent list.** This has been explicitly decided.

---

### Page 5 — Life Events (`#page-events`)

**Purpose:** Decision archaeology. Timeline of significant decisions and life events.

```
┌──────────────────────────────────┐
│  HERO                            │
│  [Event overview / intro]        │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  CATEGORY FILTER                 │
│  [All │ Financial │ Career │ ...] │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  TIMELINE LIST                   │
│  [chronological event cards]     │
└──────────────────────────────────┘
```

**Governance rules:**
- Timeline is chronological. Oldest events first.
- Each event card must display: `fact`, `context`, `question`, `decision`.
- `reflection` is optional but must not be suppressed when present.
- Filter does not remove events — it collapses visibility. The underlying data is always complete.

---

### Page 6 — About (`#page-about`)

**Purpose:** Identity and manifesto. Why DREAM Ledger exists.

This page is not functional. It is narrative.

**Governance rules:**
- Must reference [CANONICAL_TIMELINE.md](CANONICAL_TIMELINE.md) as the source of truth.
- Must include the core principle chain: `Question → Decision → Fact → Reflection → Wisdom`.
- Must not include charts, data, or financial figures.

---

## Data Display Rules

**Numbers**
- Always display the audited figure, not a rounded approximation.
- Currency unit must always be explicit (NTD / USD).
- Negative net worth must be displayed as-is. It must not be hidden or softened.

**Timestamps**
- All dates displayed in `YYYY-MM` or `YYYY-MM-DD` format.
- No relative time ("3 months ago") on financial data — absolute dates only.

**Status Indicators**
- `audited` — default text color, no badge required
- `estimated` — Amber (`--color-debt`), signals uncertainty
- These indicators cannot be hidden for aesthetic reasons.

---

## Chart Governance

- Charts visualize data; they do not editorialize it.
- Color usage in charts must follow [design-system.md](design-system.md).
- The Asset Trend chart shows net worth over time. It must not smooth, project, or interpolate data points that do not exist in `data/snapshot.js`.
- Visual scale must not be manipulated to make trends look better or worse than the data shows.

---

## What the UI Must Never Do

- Auto-calculate or infer financial values not present in the data files.
- Display projected future values as if they are current reality.
- Suppress negative information (debt, losses, estimated entries) for visual cleanliness.
- Change the meaning of a field through relabeling.
- Move the record form from the left column of the Records page.
- Reorder the navigation items.
- Remove any of the 6 stat cards from the Dashboard.
- Display passive income under the Liabilities page — it belongs in Assets.

---

## Responsive Behavior

- Primary target: desktop browser (1280px+).
- Mobile view: read-only. Sidebar collapses. No editing on mobile.
- Print layout: out of scope for current version.

---

## Revision Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-06-13 v2 | Full Information Architecture audit | Lock page structures before UI expansion |
| 2026-06-13 v1 | Initial draft | Document governance before UI expansion |
