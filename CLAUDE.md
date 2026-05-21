# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo is a Claude Design handoff bundle, not a finished app. The root holds bundle metadata; the actual prototype lives one level down.

```
./README.md                              ← bundle-level note for coding agents
./project/aureashuttlepoc/CLAUDE.md      ← detailed project guide (READ THIS too)
./project/aureashuttlepoc/README.md      ← project overview
./project/aureashuttlepoc/project/       ← the actual static app (13 HTML screens + js/ + data/)
```

**Always read [project/aureashuttlepoc/CLAUDE.md](project/aureashuttlepoc/CLAUDE.md) before editing.** It contains pricing rules, the design system, the handoff contract with AureaCare/AureaVia, and the explicit "what is NOT included" list (no driver UI, no real backend, no map yet, no real-time tracking). This root file is the entry pointer; the project-level CLAUDE.md is the source of truth for product decisions.

## Stack and runtime

- HTML5 + CSS3 + Vanilla JS ES6+. **No framework, no build, no install, no tests.**
- Open Sans via Google Fonts CDN, JetBrains Mono for code-style chips.
- Icons: SVG via `aIcon(name, opts)` in [project/aureashuttlepoc/project/js/icons.js](project/aureashuttlepoc/project/js/icons.js). **No emoji anywhere.**
- Persistence: `localStorage` only. The auth key `aurea_auth_user` is **shared with AureaVia and AureaCare** to simulate cross-app SSO. Tweaks/UI prefs use `aureashuttle_*` keys.
- Mock data: hard-coded in [project/aureashuttlepoc/project/data/mock-data.js](project/aureashuttlepoc/project/data/mock-data.js), exposed as `window.MOCK`. Extend this file rather than inlining data in screens.

## Running

Open files directly in a browser — no server required:

- [project/aureashuttlepoc/project/canvas.html](project/aureashuttlepoc/project/canvas.html) — review hub: all 13 screens in phone/desktop iframes + live Tweaks panel (FAB bottom-right).
- [project/aureashuttlepoc/project/index.html](project/aureashuttlepoc/project/index.html) — patient flow entry (any email/password works).
- [project/aureashuttlepoc/project/admin-login.html](project/aureashuttlepoc/project/admin-login.html) — admin console entry (any credentials).

For local dev with relative paths and `file://` quirks, a one-liner static server works fine:

```bash
cd "project/aureashuttlepoc/project" && python3 -m http.server 8080
# then open http://localhost:8080/canvas.html
```

## Architecture in one screen

**Two parallel apps, one shared shell.** All 13 HTML files are standalone and pull in the same four modules:

| Shared module | Role |
|---|---|
| [js/styles.css](project/aureashuttlepoc/project/js/styles.css) | Design tokens (`--shuttle-teal*`, `--b-*` lifecycle palette), components, map placeholder |
| [js/navigation.js](project/aureashuttlepoc/project/js/navigation.js) | `requireAuth` / `requireAdmin`, toast, confirm modal, **app switcher** (3 styles via tweak), **`renderWalletRing`** (3 variants), **`readCareHandoff`** (AureaCare → URL params parser), wizard step helper |
| [js/icons.js](project/aureashuttlepoc/project/js/icons.js) | `aIcon(name, opts)` — Feather + Tabler outline subset |
| [data/mock-data.js](project/aureashuttlepoc/project/data/mock-data.js) | `window.MOCK`: 18 Roma structures, pricing, 3 packages, patient + caregiver + car, wallet, 12 rides (full lifecycle), 12 taxi companies, admin KPIs, ESG aggregate |

- **Patient app** (9 screens, mobile-first 360–440px): `index → onboarding → home → book-ride → ride-summary → wallet → my-rides → caregiver → profile`.
- **Admin console** (4 screens, desktop 1440px): `admin-login → admin-dashboard → admin-approvals → admin-taxi-companies`.

No `requireDriver()` and no `"driver"` role — the driver layer is **AureaVia**, linked externally. Don't recreate it here.

## Conventions you'll hit immediately

- **Pricing is fixed by the operations doc:** corsa €80, diritti fissi €11+€11, A/R €102, solo andata €91, pacchetti 5×€102 / 10×€102 / 20×€102. Don't invent variants. Single source: `MOCK.pricing`.
- **Suite marker is `#FF8C00` orange** (invariant across AureaVia/AureaCare/AureaShuttle). AureaShuttle accent is teal `#0EA5A4` (light `#CCFBF1`, dark `#0F766E`). AureaCare blue `#3B82F6` appears **only** on the incoming-handoff banner in `book-ride.html`.
- **Italian microcopy, Roma-centric data** (Gemelli, San Camillo, Bambino Gesù, IDI, Tor Vergata… same 18 structures as AureaCare for cross-app consistency).
- **Ride lifecycle has 8 states** with dedicated `--b-*` tokens: `requested · pending · approved · dispatched · accepted · in_progress · completed · cancelled`. Use `MOCK.rideStatusLabel` for labels.
- **Canvas tweaks (5 keys, all `aureashuttle_*`)** drive live variants for accent hue, wallet ring (`segmented`/`single`/`dual`), app switcher (`dropdown`/`modal`/`sheet`), ESG card (`compact`/`expanded`/`hidden`), and AureaCare handoff banner (`pre-flagged`/`visual`/`sober`). When adding screens that vary by tweak, read the same key and re-render accordingly.
- **Adding a screen?** Register it in `patientScreens` or `adminScreens` inside `canvas.html` so it shows up in the review hub.

## Cross-app handoffs (simulated)

- **Incoming (AureaCare → AureaShuttle):** `book-ride.html?from=aureacare&booking_id=…&dest=…&date=…&time=…&service=…` → `readCareHandoff()` parses, pre-fills the form, and shows a banner (variant from `aureashuttle_handoff_mode`).
- **Outgoing (AureaShuttle → AureaCare):** rides with `linked_care_booking` show "Vedi visita su AureaCare →" on `my-rides.html`. Currently a stub.
- **Forwarding to AureaVia (driver layer):** admin dashboard, approvals modal, and taxi-companies page link out to `https://destone28.github.io/aureaviapoc/…` via `target="_blank" rel="noopener"`. The approval modal carries an "Inoltra alla console flotta AureaVia" checkbox (default checked).

## Explicit non-goals

Don't add these speculatively — they're called out as out-of-scope:

- Any driver-side UI (covered by AureaVia; no `driver-*.html`, no `driver` role, no `drivers` array in mock data).
- Real backend, real auth, real payments (Stripe / PayPal / Google Pay are visual cards only).
- Interactive map — `book-ride.html` currently ships a striped `.map-placeholder` with `// MAPPA — qui andrà l'integrazione OpenStreetMap`. Wire Leaflet + OSM when implementing.
- Real-time ride tracking — the "In corso" status card is mocked; integrate with AureaVia driver telemetry in production.

## Workflow notes

- No lint, no test, no build commands exist. Verify changes by opening the affected HTML in a browser (or via the static server above) and checking the canvas review hub.
- When implementing for a real target codebase, **recreate the visual output pixel-perfectly** — don't mirror the prototype's internal structure unless it happens to fit.
