# data-environments.md

_The data layer of DREAM Ledger: what each file contains, its role, and how they relate._

---

## Overview

DREAM Ledger has a four-layer data architecture. Each layer has a distinct purpose and governance rule.

---

## Layer 1 — Current Reality

**File:** `data/user.js`

Contains the present-day audited financial state of the creator.

Fields:
- `realAssets` — verified asset holdings (cash, policies, savings)
- `realLiabilities` — verified liabilities (loans, installments)
- `income` — current income sources
- `expenses` — current expense categories
- `liabilityMeta` — display metadata for debt categories
- `getters` — computed values (net worth, totals)

**Rules:**
- All values must be audited before entry.
- No estimated or rounded values.
- Each entry should note its last audit date.
- Automated processes must not modify this file without human review.

---

## Layer 2 — Historical Reality

**File:** `data/snapshot.js`

Contains monthly audited financial snapshots over time.

Each snapshot entry must include:
- `date` — `YYYY-MM` format
- `netWorth` — total net worth at that point
- `audited: true/false` — whether the figures were verified

Used to power time-series charts (Asset Trend).

**Rules:**
- Snapshots should not be retroactively altered unless a factual error is discovered.
- If an error is corrected, note the correction in [CHANGELOG.md](CHANGELOG.md).

---

## Layer 3 — Decision Archaeology

**File:** `data/events.js`

Stores significant life decisions and events.

Each entry must contain:
- `id` — e.g. `EVT-000`, `DEC-001`
- `date` — when it occurred
- `title` — short descriptor
- `fact` — objective, verifiable statement of what happened
- `context` — the environment and constraints at the time
- `question` — the core question the decision was answering
- `decision` — what was actually chosen
- `reflection` *(optional)* — what was learned afterward

**Rules:**
- Record the information available at the time of the decision.
- Do not apply hindsight to the `decision` field (see [constitution.md](constitution.md) Article 3).
- Canonical source of truth for events: [CANONICAL_TIMELINE.md](CANONICAL_TIMELINE.md).

Individual decision files: `archive/decisions/`

---

## Layer 4 — Visualization

**File:** `app.js`

Reads from Layers 1–3 and renders the dashboard, charts, and reports.

`app.js` is the only file that transforms data into UI. It must not mutate source data.

---

## Sandbox Environment

**File:** `data/sandbox-seed.js`

Contains synthetic test data for UI development and layout testing.

Must not be mixed with real data. Must not be loaded in production context.

---

## Settings

**File:** `data/settings.js`

Application-level configuration (display preferences, feature flags, etc.).

Does not contain financial data.

---

## Data Flow

```
data/user.js        ─┐
data/snapshot.js    ─┤──► app.js ──► Dashboard / Charts / Reports
data/events.js      ─┘
```

---

## File Mutation Policy

| File | Who May Modify |
|------|----------------|
| `data/user.js` | Creator only, after manual audit |
| `data/snapshot.js` | Creator only, at month-end audit |
| `data/events.js` | Creator only, at time of event |
| `data/sandbox-seed.js` | Developer, for UI testing |
| `data/settings.js` | Developer, for config changes |
| `app.js` | Developer, read-only access to data |
