# ROADMAP

_Where DREAM Ledger has been, where it is, and where it is going._

---

## Phase 0 — Governance Layer ✅

Establish the governance chain before any further implementation.

- [x] `docs/PROJECT_CONTEXT.md` — Why this exists
- [x] `docs/constitution.md` — What cannot be betrayed
- [x] `docs/design-system.md` — Five-layer semantic color system
- [x] `docs/ui-governance.md` — Information architecture locked
- [x] `docs/data-environments.md` — Data layer rules
- [x] `docs/domain-model.md` — Entity definitions and relationships
- [x] `docs/AI_WORKFLOW.md` — Collaboration boundaries
- [x] `docs/semantic-color-migration-plan.md` — CSS migration audit and plan
- [x] `docs/decision-architecture.md` — Core model: Question → Decision → Fact → Reflection → Wisdom

**Status:** Complete. Documents are the authority. Code follows.

---

## Phase 1 — Reality Foundation ✅

- [x] Dashboard
- [x] Assets page
- [x] Liabilities page
- [x] Snapshot system (`data/snapshot.js`)
- [x] Git repository

---

## Phase 2 — Decision Archaeology ✅ (mostly)

- [x] `data/events.js`
- [x] Life Events timeline page
- [x] Category filter
- [x] Reflection records (`archive/reflections/YYYY/REF-YYYY-MM.md`)
- [x] Decision files (`archive/decisions/DEC-NNN.md`)
- [x] Decision ↔ Snapshot ↔ Reflection linking
- [ ] Decision detail page (individual DEC page within the app)

---

## Phase 3 — Semantic Color System

Migrate the codebase from functional color names to the Decision Semantic Color System defined in `docs/design-system.md`.

**Prerequisite:** Phase 0 complete. ✅

Steps (from `docs/semantic-color-migration-plan.md`):

- [ ] Add semantic token aliases to `style.css` (`--color-investment`, `--color-debt`, `--color-alert`, `--color-brand`, `--color-living`)
- [ ] Migrate `index.html` inline styles to semantic tokens
- [ ] Migrate `app.js` dynamic color assignments
- [ ] Migrate `style.css` class definitions
- [ ] Remove legacy `--neon-*` tokens after full migration
- [ ] Validate visual weight rule: Investment visible > Debt > Living

---

## Phase 4 — Records & Living Layer

Complete the Living / Present layer of the system.

**Records page information architecture (4 layers):**
- [ ] Layer 1 — Stat Grid: 4 cards (固定收入 / 固定支出 / 本月支出 / 現金流)
- [ ] Layer 2 — Operation Grid: New Record Form (LEFT, locked) | Cashflow Doughnut Chart (RIGHT)
- [ ] Layer 3 — Audit Strip: Recent Records (3 entries, expandable to full history)
- [ ] Layer 4 — Detail Grid: 固定收入明細 / 固定支出明細 (collapsible, default closed)

**Living layer persistence and workflow:**
- [ ] Persist Records across sessions (currently in-browser only)
- [ ] Monthly cashflow summary by category
- [ ] Record → LifeEvent promotion workflow

---

## Phase 5 — Showcase Mode

A read-only, shareable presentation of the creator's financial narrative — suitable for showing to a collaborator, financial advisor, or future self.

- [ ] Showcase layout (distinct from dashboard)
- [ ] Timeline of decisions + financial impact
- [ ] "Why DREAM Ledger exists" narrative view (About page v2)
- [ ] Privacy layer (redact specific numbers while preserving structure)

---

## Phase 6 — Decision Engine

Close the loop between present Records and past Decisions.

- [ ] Cashflow forecast (based on CashflowModel + known liabilities)
- [ ] Liability projection (remaining balance over time)
- [ ] Dividend projection (passive income growth curve)
- [ ] "What question does this month answer?" — linking current data to past decisions
- [ ] Wisdom archive (the final output of the Reflection chain)

---

## Deferred / No Date

- Decision detail page (Phase 2 remainder)
- Mobile editing (currently read-only on mobile by design)
- Light mode
- Print stylesheet
- Multi-currency display (USD assets exist but display is TWD-only)

---

_Updated: 2026-06-13_
