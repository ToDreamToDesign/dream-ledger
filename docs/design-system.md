# design-system.md

_DREAM Ledger Visual Language — the laws governing color, typography, and component tokens._

---

## Design Philosophy

Dark. Precise. No decoration for its own sake.

Every color choice carries semantic meaning rooted in **time and meaning**, not financial category.

Using a color outside its semantic role is a violation of this system.

---

## Decision Semantic Color System — Five Layers

Finalized: 2026-06-13.

This is the complete color constitution of DREAM Ledger.

---

### Layer 1 — Future / Investment

| Property | Value |
|----------|-------|
| CSS token (target) | `--color-investment` |
| Color | Neon Cyan / Teal |
| Hex | `#32d4d7` |
| Time Dimension | Future（未來） |
| Semantics | Asset accumulation, investment returns, passive income, net worth positive, defensive capability, hope |
| Visual Weight | **Highest** |

Applies to:
- Total assets
- Passive assets (保單、ETF 持倉)
- Passive income / dividend returns (配息 = Investment Return, regardless of how the asset was funded)
- Net worth when positive
- Asset trend line in charts

**Rule:** Passive income belongs here. The source of funding does not change the temporal direction of the return.

---

### Layer 2 — Past / Debt

| Property | Value |
|----------|-------|
| CSS token (target) | `--color-debt` |
| Color | Warm Amber / Bronze |
| Hex | `#fbbf24` |
| Time Dimension | Past（過去） |
| Semantics | Historical decisions, responsibility, repayment obligations, reverence |
| Visual Weight | Medium-high |

Applies to:
- Total liabilities display
- Individual debt items (信貸, 學貸, 分期)
- Monthly repayment amounts
- Debt progress bars
- "Upcoming" / "soon" badges on debt obligations
- Low coverage ratio warnings

**Rule:** Debt color signals history and obligation — not danger. It is not a warning color.

---

### Layer 3 — Present / Living

| Property | Value |
|----------|-------|
| CSS token (target) | `--color-living` |
| Color | Graphite Gray / Slate Gray |
| Hex | `#64748b` (maps to existing `--text-muted`) |
| Time Dimension | Present（現在） |
| Semantics | Daily dissipation, cost of survival, routine expense |
| Visual Weight | **Lowest** |

Applies to:
- Living expense categories
- Income / expense records (expense side)
- Coverage ratio neutral states

**Rule:** Living costs must visually recede. Even when they are numerically the largest, they hold the lowest visual presence. This is intentional and must not be "corrected" for visual balance.

---

### Layer 4 — Warning / Negative Flow

| Property | Value |
|----------|-------|
| CSS token (target) | `--color-alert` |
| Color | Neon Rose |
| Hex | `#f43f5e` |
| Time Dimension | Present moment (situational) |
| Semantics | Negative cashflow, spending-over-income, warning states, system alerts |
| Visual Weight | Context-dependent (high salience when active) |

Applies to:
- Net worth when negative
- Monthly cashflow when negative
- Spending > income indicators
- Sandbox / dev-mode banners
- Cash outflow in transaction records
- Income/expense tracking (expense delta)

**Rule:** This layer is for flow states and alerts — not for debt. Debt is Amber. A negative month is Rose. They are different things.

---

### Layer 5 — Brand / Identity

| Property | Value |
|----------|-------|
| CSS token (target) | `--color-brand` |
| Color | Brand Cyan |
| Hex | `#32d4d7` (same as Investment today; may diverge in future) |
| Time Dimension | N/A — UI layer, not semantic |
| Semantics | DREAM Ledger identity, active navigation, interactive states, brand presence |
| Visual Weight | UI chrome |

Applies to:
- Logo and navigation active states
- "Reality First" identity text
- Button hover / active states
- Toggle controls, form accents
- Filter/tab active indicators
- Decision archaeology node labels (UI context)
- Audit indicators (✓ badges, 記事 tags)

**Rule:** Brand color and Investment color share the same hex value today, but they are architecturally separate tokens. They must never be collapsed back into one variable. If the brand direction changes, `--color-brand` may diverge from `--color-investment`.

---

## Visual Weight Summary

```
Investment (Future)    ████████████  Highest
Debt (Past)            ████████      Medium-high
Alert (Negative Flow)  ██████        Context-dependent
Living (Present)       ██            Lowest
Brand                  —             UI layer, not financial
```

**The Visual Weight Rule** (binding — not a suggestion):

> Visual weight reflects temporal significance and meaning, not financial magnitude.
>
> Investment holds the highest visual weight even when its amount is the smallest.
> Living holds the lowest visual weight even when its amount is the largest.
>
> No implementation may invert this hierarchy for aesthetic or "balance" reasons.

---

## Current CSS Variables → Target Token Mapping

The current `style.css` uses legacy functional color names. The target names are defined above. Until the rename pass is complete, both coexist.

| Current Variable | Hex | Target Token | Status |
|-----------------|-----|-------------|--------|
| `--neon-cyan` | `#32d4d7` | `--color-investment` + `--color-brand` | Pending split |
| `--neon-amber` | `#fbbf24` | `--color-debt` | Pending rename |
| `--neon-rose` | `#f43f5e` | `--color-alert` | Pending rename |
| `--neon-green` | `#34d399` | Review in progress | Pending decision |
| `--text-muted` | `#64748b` | `--color-living` (shared with muted text) | Pending decision |

See [semantic-color-migration-plan.md](semantic-color-migration-plan.md) for full usage audit and sequencing.

---

## Surface Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#090d10` | Page background |
| `--panel` | `#11171e` | Card / panel surfaces |
| `--panel-hover` | `#161f29` | Interactive panel hover state |
| `--border` | `rgba(255,255,255,0.05)` | Subtle dividers |

---

## Text Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--text-main` | `#f1f5f9` | Primary readable text |
| `--text-muted` | `#64748b` | Labels, metadata — also doubles as Living / Present color |

---

## Typography

Font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC", sans-serif`

| Role | Size | Weight |
|------|------|--------|
| Hero headline | 3.4rem | 700 |
| Section heading | 1.1rem | 600 |
| Card value | 1.8rem | 600 |
| Body / label | 0.85rem | 500 |
| Navigation ZH | 0.875rem | 500 |
| Navigation EN | 0.68rem | 500, uppercase |
| Meta / tag | 0.75–0.8rem | 500 |

---

## Status Badges

| State | Color | Meaning |
|-------|-------|---------|
| `audited` | `--text-main` | Verified, confirmed entry |
| `estimated` | `--color-debt` (Amber) | Unconfirmed — signals caution, not error |

---

## Revision Log

| Date | Change |
|------|--------|
| 2026-06-13 v3 | Five-layer system finalized. Three decisions closed: Alert layer added, Passive Income = Investment, Cyan split into Investment + Brand |
| 2026-06-13 v2 | Decision Semantic Color System — temporal model replacing functional model |
| 2026-06-13 v1 | Initial draft — functional color model |
