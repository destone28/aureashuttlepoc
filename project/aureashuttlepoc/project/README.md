# AureaShuttle POC — project folder

This is the static-app folder. Open `canvas.html` (review hub) or `index.html` (patient flow entry).

See parent-level `README.md` and `CLAUDE.md` for context, architecture, and pricing model.

## Files

| File | Purpose |
|---|---|
| `canvas.html` | Review hub: all 13 screens embedded in iframes + Tweaks panel (5 keys) |
| `index.html` | Patient login + suite footer |
| `onboarding.html` | 4-step wizard: anagrafica → caregiver → auto → GDPR |
| `home.html` | Patient dashboard: wallet ring, next ride, ESG card, recent rides |
| `book-ride.html` | New ride form with map placeholder + AureaCare handoff support |
| `ride-summary.html` | Recap before sending to admin approval |
| `wallet.html` | Big ring + package store (5/10/20 corse) + payment methods |
| `my-rides.html` | Filterable ride list + lifecycle timeline modal |
| `caregiver.html` | Caregiver + car data (drives ESG calculation) |
| `profile.html` | Patient profile + 4 big ESG KPIs + 6-month chart + SROI card |
| `admin-login.html` | Admin entry · split layout with stats sidebar |
| `admin-dashboard.html` | KPI + dual-line chart + ESG aggregate + AureaVia fleet card + recent rides table |
| `admin-approvals.html` | Approval queue with expandable rows + "approve + forward to AureaVia" modal |
| `admin-taxi-companies.html` | Convention companies CRUD + operational wallet recharge |
| `js/styles.css` | Global stylesheet · tokens · components |
| `js/navigation.js` | Auth, toast, modal, app switcher, wallet ring, handoff parser |
| `js/icons.js` | `aIcon(name, opts)` — Feather + Tabler outline SVG icons |
| `data/mock-data.js` | `window.MOCK` — all Roma data |

## Tweaks panel quick reference

Click the floating teal FAB on `canvas.html` to access:

1. **Shuttle accent** — 4 hues (teal default + 3 alternatives)
2. **Wallet ring** — segmented (1 tacca/corsa) / single / dual
3. **App switcher** — dropdown / modal / bottom sheet
4. **ESG card** — compact / expanded / hidden (home + profile)
5. **Handoff** — pre-flagged / visual / sober (book-ride)

State persists to `localStorage`, prefixed `aureashuttle_*`.

## Auth flow (simulated)

Any email/password is accepted. Writes `aurea_auth_user` to `localStorage`:
- Patient → `role: "patient"`, then `requireAuth()` gates the patient screens
- Admin → `role: "admin"`, then `requireAdmin()` gates the admin screens

Logout (via profile → Esci) clears the key.

## Pricing (single source of truth)

```js
window.MOCK.pricing = {
  fare:       80,    // corsa netta
  fixed_one:  11,    // diritti fissi andata
  fixed_back: 11,    // diritti fissi ritorno
  round_trip: 102,   // 80 + 11 + 11
  one_way:    91     // 80 + 11
};
```

Do not invent other prices — these come from the operations document.
