# CHANGELOG

---

## v0.8

Added

- Linked section in DEC-006, DEC-007, DEC-008
- Linked section in SNAPSHOT-2026-06.md
- Linked section in REF-2026-06.md
- 三層雙向導航：Decision ↔ Snapshot ↔ Reflection

Notes

- 每筆新增的 DEC / SNAPSHOT / REF 請補上 Linked 區塊，維持三層可互相導航

---

## v0.7

Added

- archive/reflections/2026/REF-2026-06.md — 第一份月度反思紀錄
- 月反思格式確立：What happened / What changed / What surprised me / What would I do differently / What did I learn

Notes

- 每月底新增一份 REF-YYYY-MM.md，路徑為 archive/reflections/YYYY/
- Snapshot（事實）+ Decision（決策）+ Reflection（反思）三條時間軸正式閉環

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
