# constitution.md

_The non-negotiable rules of DREAM Ledger. These override convenience, tooling opinions, and feature requests._

---

## Article 1 — Reality First

All data entered must reflect verified, audited reality.

No estimates. No rounded numbers. No projected values presented as current fact.

If a number is uncertain, it must be marked `estimated: true`.

---

## Article 2 — Event Over Theory

A decision recorded here happened. It is not a hypothesis.

Every entry must include:

- `fact` — objective, verifiable statement
- `context` — the environment at the time
- `question` — the core question being answered
- `decision` — what was actually chosen

Interpretation belongs in `reflection`. Facts belong in `fact`.

---

## Article 3 — Anti Result Bias

A decision is not good because the outcome was good.

A decision is not bad because the outcome was bad.

Record the information available at the time of the decision. Do not retroactively judge past decisions using present knowledge.

---

## Article 4 — Canonical Timeline is Law

[docs/CANONICAL_TIMELINE.md](CANONICAL_TIMELINE.md) is the single source of truth for the project's personal and historical context.

No page, component, or AI prompt should contradict it.

When in conflict, the Canonical Timeline wins.

---

## Article 5 — Technology is Expendable

The stack, framework, or tooling may change.

The data and the meaning behind the data must survive any migration.

Portability is a design requirement, not a nice-to-have.

---

## Article 6 — No Silent Data Mutation

Data files (`data/user.js`, `data/snapshot.js`, `data/events.js`) must not be modified by automated processes without explicit human review.

Any change to source-of-truth data files requires a logged, intentional decision.

---

## Article 7 — Preservation Over Performance

If there is a conflict between visual polish and truthful record-keeping, record-keeping wins.

A chart that looks clean but hides reality violates this constitution.
