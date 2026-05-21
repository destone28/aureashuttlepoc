# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A handoff bundle from Claude Design (claude.ai/design) containing the **AureaShuttle POC** — a static, navigable mockup of the third product in the Aurea suite (after AureaVia, alongside AureaCare). It is a **medical transport assistance** app: prepaid ride-package wallet, booking of taxi rides to healthcare facilities in Rome, admin approval flow, and explicit forwarding to the AureaVia driver layer.

These are **design prototypes, not production code**. When reimplementing for a real target codebase, recreate the visual output pixel-perfectly in whatever technology fits — don't mirror the prototype's internal structure unless it happens to fit. Read HTML/CSS directly; don't render in a browser or take screenshots unless asked.

The user's primary review surface is `project/canvas.html` (the review hub embedding all 13 screens). Read it in full and follow its imports before implementing.

## Stack

- HTML5 + CSS3 + Vanilla JavaScript ES6+ — **zero framework**, no build step
- Open Sans via Google Fonts CDN
- SVG icons inline via `project/js/icons.js` (Feather + Tabler outline subset — **no emoji**)
- Persistence: `localStorage` only (auth, wallet, tweak preferences, pending rides)
- Mock data hard-coded in `project/data/mock-data.js`, exposed as `window.MOCK`

## Running it

No build, no install, no tests. Open files directly in a browser:

- `project/canvas.html` — review hub with all 13 screens in phone/desktop frames + live Tweaks panel
- `project/index.html` — patient flow entry (any email/password works; auth is simulated)
- `project/admin-login.html` — admin console entry (any credentials)

## Architecture

### Two parallel apps, one shared shell

- **Patient app** (9 screens): mobile-first frames at 360–440px wide. `index → onboarding → home → book-ride → ride-summary → wallet → my-rides → caregiver → profile`.
- **Admin console** (4 screens): desktop layout at 1440px wide. `admin-login → admin-dashboard → admin-approvals → admin-taxi-companies`.

Both share `js/styles.css`, `js/navigation.js`, `js/icons.js`, and `data/mock-data.js`. Each HTML file is standalone and pulls these in.

### Simulated SSO across the Aurea suite

`js/navigation.js` reads/writes the localStorage key **`aurea_auth_user`** (`{ email, role, apps }`). This is the convention shared with AureaVia and AureaCare to simulate cross-app SSO without a backend. `requireAuth()` / `requireAdmin()` redirect to the relevant login if the key is missing or `role` doesn't match.

For AureaShuttle:
- Patient: `{ email, role: "patient", apps: ["aureavia","aureashuttle","aureacare"] }`
- Admin:   `{ email, role: "admin", apps: ["aureashuttle"] }`

**There is no `requireDriver()` and no `"driver"` role** — see "What is NOT included" below.

### Canvas tweaks panel

`canvas.html` embeds every screen in `<iframe>`s and exposes a live tweaks panel that writes to localStorage keys (all prefixed `aureashuttle_*`) and either injects CSS into iframes or reloads them:

| Key | Effect |
|---|---|
| `aureashuttle_accent`, `_accent_dark`, `_accent_light` | Overrides `--shuttle-teal*` CSS variables across all frames |
| `aureashuttle_wallet_variant` | `segmented` (default) / `single` / `dual` — switches `renderWalletRing` mode on home + wallet |
| `aureashuttle_app_switcher_style` | `dropdown` / `modal` / `sheet` — switches `mountAppSwitcher` behavior |
| `aureashuttle_esg_display` | `compact` / `expanded` / `hidden` — switches ESG card variant on home + profile |
| `aureashuttle_handoff_mode` | `pre-flagged` / `visual` / `sober` — switches the incoming-from-AureaCare banner on book-ride |

When adding a new screen, register it in the `patientScreens` or `adminScreens` arrays in `canvas.html`.

### Design system

- **Suite marker**: orange `#FF8C00` (logo, focus ring, cross-app CTAs) — inherited from AureaVia, **invariant across suite**.
- **AureaShuttle accent**: teal `#0EA5A4` (+ light `#CCFBF1`, dark `#0F766E`, soft bg `#F0FBFA`) for app-specific patterns (CTA hero, wallet ring, ESG card, "Inviata taxi" badge).
- **AureaCare accent**: care-blue `#3B82F6` (+ light `#E6F1FB`, dark `#1E4FBF`) — appears **only** in the incoming-from-AureaCare handoff banner (visually signals provenance).
- Ride lifecycle badge palette (8 states): `requested` (neutral) · `pending` (warm) · `approved` (green) · `dispatched` (teal) · `accepted` (blue) · `in_progress` (amber) · `completed` (olive) · `cancelled` (red). All defined as `--b-*` tokens in `styles.css`.
- All icons are stroke SVG via `aIcon(name, opts)` from `icons.js`. **No emoji anywhere.**
- Microcopy is **Italian**; data is **Roma-centric** (Gemelli, San Camillo, Bambino Gesù, IDI, Tor Vergata, etc. — same 18 structures as AureaCare).

### Pricing model (from operations doc, do not invent)

- Corsa netta: **€80**
- Diritti fissi andata: **€11**
- Diritti fissi ritorno: **€11**
- **Totale corsa A/R = €102** · **Solo andata = €91**
- Packages: 5×€102 = **€510** · 10×€102 = **€1.020** (most-chosen) · 20×€102 = **€2.040** (best value)

### Mock data shape

`window.MOCK` exposes: 18 `structures` (re-used 1:1 from AureaCare for cross-app consistency), `pricing`, 3 `packages`, 1 logged-in `patient` + `caregiver` + `caregiverCar`, `wallet` with movements, 12 `rides` covering the full lifecycle, 12 `taxiCompanies` (Roma), 15 `adminRides` for the approval queue, `admin_kpi` + `admin_trend`, `esgAggregate` + `esgPersonal`, 12 `patients` for the admin patient list, and `rideStatusLabel` lookup.

When adding screens that need data, extend `mock-data.js` rather than inlining.

### Handoff with AureaCare

**Incoming (AureaCare → AureaShuttle)**: the URL `book-ride.html?from=aureacare&booking_id=AC-…&dest=…&date=…&time=…&service=…` triggers `readCareHandoff()` in `navigation.js`. The form is pre-filled and a banner is shown (variant controlled by `aureashuttle_handoff_mode`).

**Outgoing (AureaShuttle → AureaCare)**: rides with `linked_care_booking` populated show a "Vedi visita su AureaCare →" link on `my-rides.html` (the modal detail view). Currently simulated — to be wired to the live AureaCare deploy when available.

### Forwarding to AureaVia (the driver layer)

The admin console explicitly hands off to the AureaVia console via external links:

- `admin-dashboard.html` → "Flotta AureaVia" card → `https://destone28.github.io/aureaviapoc/admin-dashboard.html`
- `admin-approvals.html` → approval modal contains a "Inoltra alla console flotta AureaVia" checkbox (default checked). Each approved ride row shows a "Vedi su AureaVia →" link to `ride-detail.html`.
- `admin-taxi-companies.html` → top banner linking to the AureaVia admin.

All external links use `target="_blank" rel="noopener"`.

## What is explicitly NOT included

- ❌ **Driver-side UI**: the taxi-driver experience (driver login, available-rides list, ride detail with state transitions, driver profile, vehicle info, reviews, activity history) is **fully covered by AureaVia**. AureaVia is the **shared driver layer** of the Aurea suite. AureaShuttle does not duplicate it.
  - There are **no `driver-*.html` files** in this repo.
  - There is **no `requireDriver()`** in `navigation.js`.
  - There is **no `"driver"` role** written to `aurea_auth_user`.
  - There is **no `drivers` or `loggedDriver` array** in mock-data.
  - Wherever the admin needs to reference the driver side (e.g. "see who accepted this ride"), AureaShuttle links externally to AureaVia files: `index.html`, `rides-list.html`, `ride-detail.html`, `profile.html`, `vehicle.html`, `reviews.html`, `activity.html`.
- ❌ **Real backend, real auth, real payments** (UI selectors only — Stripe / PayPal / Google Pay are visual cards, no integration).
- ❌ **Interactive map** — `book-ride.html` ships a striped placeholder. Replace with OpenStreetMap (Leaflet) integration in production.
- ❌ **Real-time ride tracking** — the "In corso" status with driver card is mocked; integrate with AureaVia driver telemetry in production.

Don't add these speculatively.
