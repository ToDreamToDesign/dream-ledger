# CHANGELOG

---

## v0.6

Added

- archive/snapshots/2026/SNAPSHOT-2026-06.md — 第一份正式月結快照（audited）
- 月結格式確立：資產／負債明細、淨值、現金流、被動收入覆蓋率、備注

Notes

- 每月底新增一份 SNAPSHOT-YYYY-MM.md，路徑為 archive/snapshots/YYYY/

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
