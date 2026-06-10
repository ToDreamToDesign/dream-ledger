# CHANGELOG

---

## v0.5

Added

- Repository structure reorganized: data/, docs/, assets/, archive/
- README.md with core philosophy
- ARCHITECTURE.md for Claude Code and future maintainers
- ROADMAP.md
- CHANGELOG.md
- DECISIONS.md
- data/settings.js placeholder

Changed

- user.js, snapshot.js, events.js moved to data/
- model.js moved to archive/ as model.bak.js

Fixed

- model.js duplicate `const dreamUser` declaration removed from page load
- `lifeEvents` undefined — resolved by creating events.js

---

## v0.4

Added

- Real financial model
- Asset page
- Liability page
- Dashboard metrics
- Snapshot architecture

Fixed

- Fubon loan incorrectly counted as asset
- Passive asset calculation
- Hardcoded loan repayment values (12302, 4737, 1250) replaced with dynamic reads from user.js

Notes

- First audited financial snapshot established: 2026-06-09
