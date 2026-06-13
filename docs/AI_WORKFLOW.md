# AI_WORKFLOW.md

_How to collaborate with AI on DREAM Ledger. What AI may do, what it may not do, and how to frame tasks._

---

## Role of AI in This Project

AI is a skilled collaborator, not an author.

AI may propose, generate, and implement. The creator makes all final decisions, especially on:
- Data values
- Narrative framing
- Financial interpretation

---

## What AI May Do

- Read and analyze all files in the project.
- Propose UI changes and implement them when approved.
- Draft new documentation based on existing context.
- Refactor `app.js` for clarity, performance, or correctness.
- Create sandbox or test data in `data/sandbox-seed.js`.
- Suggest architectural improvements.
- Ask clarifying questions before modifying ambiguous code.

---

## What AI Must Not Do

- Modify `data/user.js`, `data/snapshot.js`, or `data/events.js` without explicit creator instruction.
- Infer or fill in financial values not provided by the creator.
- Contradict [constitution.md](constitution.md) or [CANONICAL_TIMELINE.md](CANONICAL_TIMELINE.md).
- Round, estimate, or approximate financial data.
- Reframe a past decision using outcome-based language (violates Anti-Result Bias).
- Commit or push changes without creator approval.

---

## Canonical Context

Before any task involving narrative, events, or personal history, AI must treat the following as authoritative:

1. [docs/CANONICAL_TIMELINE.md](CANONICAL_TIMELINE.md) — primary source of truth
2. [docs/PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) — project identity and purpose
3. [docs/constitution.md](constitution.md) — non-negotiable rules

---

## Framing Tasks Well

Good prompts for this project include:

- Sufficient context ("I'm updating the debt section of the dashboard...")
- Reference to specific files ("in `app.js`, around the liabilities chart...")
- Explicit permission scope ("you can edit `app.js` and `style.css` only")
- The governing principle when relevant ("remember Reality First — don't infer values")

Avoid prompts that:
- Ask AI to "fill in" missing financial data
- Ask for interpretation of whether a past decision was good or bad
- Assume AI has read the latest version of a data file (ask it to read first)

---

## Memory and Continuity

AI memory is session-scoped unless explicitly persisted.

For cross-session continuity:
- Key decisions and context are stored in [CANONICAL_TIMELINE.md](CANONICAL_TIMELINE.md)
- Architecture decisions are in [docs/ARCHITECTURE.md](ARCHITECTURE.md)
- Design decisions are in [docs/design-system.md](design-system.md) and [docs/ui-governance.md](ui-governance.md)

When starting a new session, point AI to these documents before beginning.

---

## Recommended Session Opening

> "Read docs/PROJECT_CONTEXT.md, docs/constitution.md, and docs/CANONICAL_TIMELINE.md before we start. This is a personal financial archaeology system. Do not modify data files unless I explicitly tell you to."

---

## Revision Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-06-13 | Initial draft | Establish AI collaboration boundaries |
