# Semantic Color Migration Plan

_Audit of current color variable usage across the codebase._
_Status: Read-only analysis. No CSS has been modified._

---

## Variable Usage Count (Total across all files)

| Variable | style.css | index.html | app.js | Total |
|----------|-----------|------------|--------|-------|
| `--neon-cyan` | 15 | 13 | 7 | **35** |
| `--text-muted` | 13 | 40 | 15 | 68 |
| `--border` | 13 | 14 | 2 | 29 |
| `--neon-rose` | 1 | 9 | 6 | **16** |
| `--neon-green` | 4 | 2 | 6 | **12** |
| `--neon-amber` | 3 | 3 | 3 | **9** |
| `--panel` | 6 | — | — | 6 |
| `--text-main` | 5 | 13 | 4 | 22 |
| `--bg` | 3 | — | — | 3 |

---

## Variable-by-Variable Semantic Audit

---

### `--neon-cyan` — 35 uses

**Current role in code:** Investment assets + UI chrome (active states, brand color, interactive controls)

The problem: cyan does two jobs simultaneously.

**Job A — Semantic (Investment / Future)**
These usages align with the Decision Semantic Color System:

| Location | Usage | Verdict |
|----------|-------|---------|
| `#totalAssets` | Total assets display | ✓ Investment/Future |
| `#a-totalAssets`, `#a-totalAssets2` | Assets page values | ✓ Investment/Future |
| `.card-cashflow strong` | Cashflow card value | ✓ Investment/Future |
| `.card-passive-assets strong` | Passive assets value | ✓ Investment/Future |
| `.timeline-dot` (default) | Timeline default dot | ✓ Investment/Future |
| Net worth positive state (app.js:74, 115) | Positive net worth color | ✓ Investment/Future |
| Chart legend `─ 資產` | Asset line in chart | ✓ Investment/Future |

**Job B — UI Chrome (Active State / Brand)**
These usages have nothing to do with Investment semantics:

| Location | Usage | Verdict |
|----------|-------|---------|
| Nav link active state | UI interaction color | ⚠️ UI Chrome |
| `.toggle-btn span` | Hamburger menu bars | ⚠️ UI Chrome |
| `.filter-btn.active` | Active filter tabs | ⚠️ UI Chrome |
| `.user-tab.active` | Active user tab | ⚠️ UI Chrome |
| `.rec-submit` | Submit button style | ⚠️ UI Chrome |
| Checkbox `accent-color` | Form input accent | ⚠️ UI Chrome |
| `.node-context strong` | Decision node label | ⚠️ UI Chrome |
| `Reality First` branding text | Brand identity | ⚠️ UI Chrome |
| `✓ 審計` audit counter | Status indicator | ⚠️ UI Chrome |
| `記事` event badge | Tag label | ⚠️ UI Chrome |

**Migration decision required:**
Split into two tokens:
- `--color-investment` (semantic) — for financial data
- `--color-brand` or `--color-active` (UI chrome) — for interactive states

Until this is resolved, both will point to the same hex value `#32d4d7`.

---

### `--neon-rose` — 16 uses

**Current role:** All negative things — debt, liabilities, expenses, warnings, negative cashflow.

The problem: the new semantic system redefines debt as **Amber (Past / Reverence)**, not Rose.

**Current usages of rose:**

| Location | Usage | New Semantic |
|----------|-------|-------------|
| `#totalLiabilities` | Total liabilities display | → **Debt (Amber)** |
| `.card-debt strong` | Debt summary card | → **Debt (Amber)** |
| `.debt-bar-fill` | Individual debt bar | → **Debt (Amber)** |
| `.badge-active` | Active debt badge | → **Debt (Amber)** |
| `l-totalLiabilities` | Liabilities page total | → **Debt (Amber)** |
| Liability amounts in app.js | Per-item debt values | → **Debt (Amber)** |
| `.amt-out` | Cash outflow in records | → **Living (Gray)?** |
| `cfColor` negative cashflow | Negative cashflow | → **Living (Gray)?** |
| Net worth negative (app.js:74, 115) | Negative net worth | → **Uncertain** |
| Income/expense tracking (app.js:940) | Expense side | → **Living (Gray)?** |
| `.sandbox-banner` | Sandbox warning | → UI utility, keep Rose |
| `.dot-family` | Family events dot | → Contextual |

**Open question — documented for creator decision:**

> If Debt = Amber (Past / Reverence), what color represents "negative cashflow this month" or "spending exceeds income"?
>
> Option A: Collapse both into Amber (debt and negative flow share "past" semantics)
> Option B: Retain Rose strictly for flow-state negatives (cashflow, delta), not for debt obligations
>
> This distinction must be decided before the CSS rename pass begins.

---

### `--neon-amber` — 9 uses

**Current role:** Passive income, urgency badges, repayment amounts, decision archaeology.

**Current usages:**

| Location | Usage | New Semantic |
|----------|-------|-------------|
| `.card-passive-income strong` | Passive income card | ⚠️ Passive income = Investment (Future) or Debt service return? |
| `#l-monthlyRepay` | Monthly repayment amount | ✓ Debt (Past) |
| `.badge-soon` | "Upcoming" debt badge | ✓ Debt (Past) — urgency of past obligation |
| Loan coverage low (app.js:143) | Low coverage warning | ✓ Debt (Past) |
| `.node-question strong` | Question node label | UI chrome |
| `Decision` label (app.js:236) | Decision archaeology label | UI chrome |
| `.dot-life` | Life events timeline dot | Contextual |

**Open question — documented for creator decision:**

> Passive income (凱基保單 dividend) is generated by an investment asset.
> Should the passive income card be:
>
> Option A: Amber (because the underlying asset was purchased with a loan — it is debt-financed future income, past obligation / future return)
> Option B: Cyan (because it represents investment return / future orientation)
>
> This is a DREAM Ledger-specific philosophical question that only the creator can answer.

---

### `--neon-green` — 12 uses

**Current role:** Income, positive deltas, coverage ratios, career timeline, decision nodes.

**Current usages:**

| Location | Usage | New Semantic |
|----------|-------|-------------|
| `.card-income strong` | Income card | → Living (Present)? or separate? |
| `.hero-left .growth` | Net worth growth indicator | → Investment (Future) delta |
| `.amt-in` | Cash inflow in records | → Living (Present) |
| Net worth positive (app.js:74, 115) | Positive net worth color | → Investment (Future) — conflicts with cyan |
| Coverage ratio positive (app.js:89, 138) | Good coverage rate | → Living (Present) health indicator |
| `cfColor` positive cashflow | Positive cashflow | → Living (Present) |
| `.dot-career` | Career events timeline | Contextual |
| `.node-decision strong` | Decision node label | UI chrome |
| Income/expense tracking (app.js:940) | Income side | → Living (Present) |

**Note:** Net worth positive is currently green in `app.js` but the `--text-cyan` class and most asset displays use cyan. This is an existing inconsistency in the codebase — net worth positive has two different colors depending on context.

**Green's likely fate:** Either maps to Living / Present (as "present-moment income and flow") or is retired in favor of cyan for all positive financial values. Decision needed.

---

## Summary — Migration Risk Assessment

| Variable | Touch Count | Risk | Blocker |
|----------|-------------|------|---------|
| `--neon-cyan` | 35 | High | Must split semantic vs. UI chrome before rename |
| `--neon-rose` | 16 | High | Debt → Amber reclassification changes card colors significantly |
| `--neon-green` | 12 | Medium | Fate unclear; overlaps with cyan for positive values |
| `--neon-amber` | 9 | Medium | Passive income card semantic TBD |

---

## Decisions — CLOSED 2026-06-13

**Decision 1 — Negative Cashflow Color**
> ✓ RESOLVED: Rose is retained, redefined as `--color-alert` (Alert / Negative Flow layer).
> Debt = Amber. Negative cashflow = Rose. They are distinct semantic layers.
> A negative month is a warning state, not a debt. They must not share a color.

**Decision 2 — Passive Income Color**
> ✓ RESOLVED: Passive income = Cyan (`--color-investment`).
> Passive income represents Investment Return / Future orientation regardless of how the underlying asset was funded.
> Funding source does not change time direction. All dividends and policy returns = Investment.

**Decision 3 — Cyan Split**
> ✓ RESOLVED: Cyan splits into two separate tokens.
> `--color-investment` — financial semantic (assets, returns, net worth positive)
> `--color-brand` — UI chrome (navigation, buttons, brand identity)
> Both point to `#32d4d7` today. They may diverge in a future brand pass.

---

## Recommended Migration Sequence

1. ~~Resolve the three open decisions.~~ (Done)
2. ~~Update `docs/design-system.md` with the resolved mappings.~~ (Done)
3. Add new semantic token names to `style.css` as aliases (do not remove old names yet).
4. Migrate `index.html` — largest file, most inline styles, highest risk.
5. Migrate `app.js` — dynamic color assignments in JavaScript.
6. Migrate `style.css` class definitions.
7. Remove legacy token names only after all references are confirmed migrated.

Do not skip step 3 (alias phase). It prevents breakage during the transition.

---

_Generated: 2026-06-13. Read-only analysis. No code was modified._
