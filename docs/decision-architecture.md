# decision-architecture.md

_The core model of DREAM Ledger: why it exists, what it does, and what it produces._

---

## The One Sentence

DREAM Ledger is not an accounting tool.

It is a system that uses financial facts to carry the context of life decisions.

---

## Why Accounting Is Not Enough

A conventional ledger answers: **how much?**

DREAM Ledger answers: **why, and then what happened?**

The financial data is not the product. It is the evidence.

---

## The Decision Chain

Every piece of data in DREAM Ledger exists in relation to this chain:

```
Question
   ↓
Decision
   ↓
Fact
   ↓
Reflection
   ↓
Wisdom
```

This is not a workflow to be completed. It is a lens to be applied.

---

### Question

The condition that made a decision necessary.

> "The family needs long-term care. I don't know how to afford it and build a future at the same time."

A Question is not a problem to be solved. It is a constraint to be navigated under.

**Rule:** Questions must be recorded at the time they were live. A Question cannot be written after the Fact.

---

### Decision

What was actually chosen, given the constraints at the time.

> "Take the bank loan. Use the capital to buy a dividend policy. Cover care costs from the dividend."

A Decision is not a plan. It is a commitment made under uncertainty.

**Rule:** Decisions must reflect only the information available at the moment of choice. No outcome-informed hindsight. (See [constitution.md](constitution.md) Article 3.)

---

### Fact

The objective, verifiable record of what happened.

> "2020-09: Fubon credit loan disbursed. ¥859,476. Monthly repayment: ¥12,000."

A Fact is not an interpretation. It does not contain judgment.

**Rule:** Facts must be independently verifiable. If it cannot be verified, it belongs in Context or Reflection, not Fact.

---

### Reflection

What was learned — after time has passed, with the benefit of outcome.

> "The dividend arrives monthly as planned. But the total loan principal is still heavier than anticipated. I understood the mechanics but underestimated the psychological weight."

A Reflection is the one place where hindsight, emotion, and interpretation are permitted.

**Rule:** Reflections are private. They must not contaminate the Decision or Fact record. See [domain-model.md](domain-model.md) → Reflection.

---

### Wisdom

What can be carried forward — the distillation of the full chain.

> "Protection decisions made under crisis become financial obligations for years. The urgency of the crisis is temporary. The obligation is not."

Wisdom is not a data field. It is the final output of the system.

**Status:** Not yet implemented. Currently emerges only in the narrative form of [archive/reflections/](../archive/reflections/).

---

## The Three Layers of Reality

The Decision Chain runs across three temporal layers. Every entity in DREAM Ledger belongs to one:

| Layer | Time | Color | Entities |
|-------|------|-------|----------|
| Investment / Future | Future potential being built | `--color-investment` (Cyan) | Asset, Passive Income, Dividend |
| Debt / Past | Decisions already locked in | `--color-debt` (Amber) | Liability, Repayment, Insurance |
| Living / Present | Daily reality right now | `--color-living` (Graphite) | Record, Expense, Income |

The Decision Chain itself runs through all three layers:

```
Question   — emerged from the Past (Debt layer)
Decision   — made in the Present (Living layer)
Fact       — created in the Present, persists into History
Reflection — evaluated from the Future (Investment layer)
Wisdom     — belongs to no layer. It escapes time.
```

---

## What Each Page Serves

Every page in DREAM Ledger serves a specific position in this chain:

| Page | Chain Role | What It Shows |
|------|-----------|---------------|
| Dashboard | Summary view | The current state of all three layers at once |
| Assets | Investment layer | What is being built toward the future |
| Liabilities | Debt layer | What past decisions still require |
| Records | Living layer | What is happening right now |
| Life Events | Decision → Fact | The chain of choices and their verifiable outcomes |
| About | Wisdom | Why this system exists at all |

This is why the navigation order is not arbitrary. Pages 2–4 (Assets → Liabilities → Records) move in temporal order: Future → Past → Present.

See [ui-governance.md](ui-governance.md) for layout rules.

---

## What DREAM Ledger Is Not

| It is not | Because |
|-----------|---------|
| A budgeting app | Budgets are forward projections. DREAM Ledger records what actually happened. |
| A net worth tracker | Net worth is one output, not the purpose. |
| A financial planning tool | Planning requires future modeling. DREAM Ledger records present reality. |
| A journaling app | Journals are private. DREAM Ledger's Fact layer must be verifiable. |
| A report generator | Reports summarize. DREAM Ledger preserves — including the uncomfortable truths. |

---

## The Canonical Narrative

The creator's specific narrative that gave rise to this system is preserved in:

→ [docs/CANONICAL_TIMELINE.md](CANONICAL_TIMELINE.md)

All future contributors, collaborators, and AI assistants must treat that document as the origin story. It is not to be summarized, abstracted, or replaced with a generic example.

---

## Why This Document Exists

The governance chain of DREAM Ledger is:

```
PROJECT_CONTEXT       — Why does this exist?
constitution          — What cannot be changed?
decision-architecture — What is the core model?
design-system         — What does it look like?
ui-governance         — How is it laid out?
data-environments     — Where does the data live?
domain-model          — What are the entities?
AI_WORKFLOW           — How does AI collaborate?
```

This document occupies the third position because the core model must be defined before any visual or structural decisions are made.

Without it, every design decision is arbitrary.
With it, every design decision is derivable.

---

_Created: 2026-06-13_
