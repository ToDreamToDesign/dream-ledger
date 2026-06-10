# DREAM Ledger Architecture

---

## Layer 1 — Current Reality

**`data/user.js`**

Stores current assets, liabilities, income and expenses.

Represents present-day reality.

All numbers must be audited before entry.
No estimated or rounded values.

---

## Layer 2 — Historical Reality

**`data/snapshot.js`**

Stores monthly audited financial snapshots.

Provides historical time-series data for the asset chart.

Each snapshot is marked as `audited` or `estimated`.

---

## Layer 3 — Decision Archaeology

**`data/events.js`**

Stores significant life decisions.

Each event contains:

- `fact` — objective, verifiable statement
- `context` — the environment in which the decision was made
- `question` — the core question the decision was answering
- `decision` — what was actually chosen

---

## Layer 4 — Visualization

**`app.js`**

Transforms data into dashboards, charts and reports.

No business logic should live here.
All calculations belong in `user.js` getters.

---

## Layer 5 — Configuration

**`data/settings.js`**

Global display and behavior settings.

---

## Layer 6 — Reflection

*Future layer.*

Transforms events and snapshots into lessons and insights.

AI-assisted pattern detection across decisions and outcomes.

---

## File Load Order

```html
data/user.js       → Layer 1
data/snapshot.js   → Layer 2
data/events.js     → Layer 3
data/settings.js   → Layer 5
app.js             → Layer 4
```
