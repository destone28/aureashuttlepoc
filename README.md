# AureaShuttle POC

> Handoff bundle from Claude Design (claude.ai/design): a static, navigable mockup of **AureaShuttle**, the third product in the Aurea suite (after AureaVia, alongside AureaCare).
> Domain: **medical transport assistance** — taxi rides to healthcare facilities, admin approval, prepaid ride-package wallet, ESG/SROI tracking.

🌐 **Live preview**: `project/canvas.html` (review hub with all 13 screens + Tweaks)
🚀 **Webapp entry points**: `project/index.html` (patient) · `project/admin-login.html` (admin)

---

## Quick start

No build, no install. Open the HTML files directly in any modern browser, or serve the `project/` folder via any static host (Vercel, Netlify, GitHub Pages, `python -m http.server`, etc).

```bash
# Optional local server
cd project && python3 -m http.server 8080
# then open http://localhost:8080/canvas.html  (review)
#      or  http://localhost:8080/index.html    (patient app)
```

Any email/password is accepted — auth is fully simulated via `localStorage`.

## What's inside

```
aureashuttlepoc/
├── README.md              ← this file
├── CLAUDE.md              ← spec for Claude Code reimplementation
└── project/
    ├── canvas.html              review hub (13 screens + Tweaks panel)
    ├── index.html               patient login
    ├── onboarding.html          4-step wizard (anagrafica + caregiver + auto + GDPR)
    ├── home.html                patient dashboard · wallet + next ride + ESG
    ├── book-ride.html           new ride form (with AureaCare handoff)
    ├── ride-summary.html        confirm screen
    ├── wallet.html              wallet + package store + payment methods
    ├── my-rides.html            ride list · filters + lifecycle timeline modal
    ├── caregiver.html           caregiver + car (for ESG calculation)
    ├── profile.html             patient profile + detailed ESG dashboard + SROI
    ├── admin-login.html         admin entry
    ├── admin-dashboard.html     KPI + chart + ESG aggregate + last requests + AureaVia fleet card
    ├── admin-approvals.html     approval queue with forward-to-AureaVia modal
    ├── admin-taxi-companies.html  taxi companies CRUD + wallet recharge
    ├── js/styles.css            global stylesheet
    ├── js/navigation.js         auth, toast, app switcher, wallet ring, handoff parser
    ├── js/icons.js              aIcon(name, opts) — Feather + Tabler outline subset
    └── data/mock-data.js        window.MOCK · all hard-coded Roma data
```

## Architecture in two lines

- **Patient app** (9 screens): mobile-first 360–440px. Wallet sempre visibile, 4-voci bottom nav, ESG card come elemento distintivo.
- **Admin console** (4 screens): desktop 1280–1920px. Sidebar 72px, ESG aggregato, modale "approva + inoltra a AureaVia".
- **Driver layer**: NON in questo repo. Coperto da [AureaVia](https://destone28.github.io/aureaviapoc/) (linkato esternamente dalla console admin).

Cross-app SSO: shared `localStorage` key `aurea_auth_user` (same convention used by AureaVia + AureaCare). Per il dettaglio architetturale leggere `CLAUDE.md`.

## Suite Aurea

| App | Repo | Status |
|---|---|---|
| **AureaVia** (NCC/taxi premium + driver layer) | [destone28/aureaviapoc](https://github.com/destone28/aureaviapoc) | Live |
| **AureaCare** (accesso alle cure) | [destone28/aureacarepoc](https://github.com/destone28/aureacarepoc) | Live |
| **AureaShuttle** (trasporto sanitario) | this repo | POC v0.1 |

---

🧡 Suite marker arancione `#FF8C00` · 🟢 AureaShuttle teal `#0EA5A4` · 🔵 AureaCare blue `#3B82F6`
