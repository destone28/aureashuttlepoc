# AureaShuttle · POC

**Trasporto sanitario assistito a Roma** — mockup navigabile della terza app della suite Aurea, pensata per pazienti con piani di cura ricorrenti e per gli amministratori che gestiscono la rete delle compagnie taxi convenzionate.

🌐 **Live demo**: <https://aureashuttlepoc.vercel.app>
📐 **Hub di review** (tutte le 13 schermate): <https://aureashuttlepoc.vercel.app/canvas.html>

---

## Cosa fa

AureaShuttle copre **3 attori**:

- **Paziente** · prenota una corsa A/R verso una struttura sanitaria di Roma, paga tramite pacchetti corse prepagati (5 / 10 / 20), traccia l'impatto ESG personale (giornate caregiver risparmiate, CO₂ evitata, SROI).
- **Admin** · approva le richieste, gestisce le compagnie taxi convenzionate (wallet operativo, KPI mensili), monitora l'impatto ESG aggregato della rete.
- **Tassista** · NON è incluso in questo repo — il driver layer è coperto da **AureaVia**, linkato esternamente dalla console admin.

Il servizio è **handoff-ready con AureaCare**: una visita prenotata su AureaCare può precompilare automaticamente la richiesta corsa via URL params (`?from=aureacare&booking_id=…`).

## Pricing model

Dal documento operativo, fisso e non negoziabile:

| Voce | Costo |
|---|---|
| Corsa netta | €80 |
| Diritti fissi andata | €11 |
| Diritti fissi ritorno | €11 |
| **Totale A/R** | **€102** |
| Solo andata | €91 |

Pacchetti: **5×€102 = €510** · **10×€102 = €1.020** (più scelto) · **20×€102 = €2.040** (best value).

## Suite Aurea

| App | Dominio | Repo |
|---|---|---|
| **AureaVia** (NCC + taxi premium, driver layer) | <https://destone28.github.io/aureaviapoc/> | [aureaviapoc](https://github.com/destone28/aureaviapoc) |
| **AureaCare** (accesso alle cure) | <https://aureacarepoc.vercel.app> | [aureacarepoc](https://github.com/destone28/aureacarepoc) |
| **AureaShuttle** (trasporto sanitario) | <https://aureashuttlepoc.vercel.app> | this repo |

SSO simulato cross-app via chiave `aurea_auth_user` in `localStorage` (convenzione condivisa con AureaVia + AureaCare).

## Stack

- HTML5 + CSS3 + Vanilla JS ES6+ — **zero framework**, zero build step.
- Open Sans (Google Fonts CDN), Leaflet + OpenStreetMap per le mappe.
- Persistenza: `localStorage` (auth, wallet, preferenze tweaks, prenotazioni pendenti).
- Mock data hard-coded in [project/data/mock-data.js](project/data/mock-data.js) come `window.MOCK` — 18 strutture sanitarie Roma-centriche, 12 compagnie taxi, 12 corse paziente, 15 richieste admin, KPI ESG aggregati.

## Run in locale

Nessuna installazione, nessuna build. Apri direttamente i file in browser oppure servi la cartella `project/`:

```bash
cd project && python3 -m http.server 8080
# poi apri:
# http://localhost:8080/canvas.html       hub review 13 schermate + tweaks panel
# http://localhost:8080/index.html        flusso paziente
# http://localhost:8080/admin-login.html  console admin
```

Login simulato: **qualsiasi email/password va bene**.

## Struttura

```
aureashuttlepoc/
├── README.md
├── CLAUDE.md                spec per agenti AI che riprendono il repo
└── project/
    ├── canvas.html              hub review (13 schermate + 5 tweaks live)
    ├── index.html               login paziente
    ├── onboarding.html          wizard 4 step
    ├── home.html                dashboard paziente
    ├── book-ride.html           nuova corsa (con mappa OSM + handoff AureaCare)
    ├── ride-summary.html        riepilogo + invio in approvazione
    ├── wallet.html              wallet + acquisto pacchetti
    ├── my-rides.html            lista corse + modale dettaglio con mappa OSM
    ├── caregiver.html           caregiver + auto (per calcolo ESG)
    ├── profile.html             profilo + dashboard ESG personale + SROI
    ├── admin-login.html         entry admin
    ├── admin-dashboard.html     KPI + chart + ESG aggregato + AureaVia fleet card
    ├── admin-approvals.html     coda approvazioni + modale "inoltra a AureaVia"
    ├── admin-taxi-companies.html  compagnie taxi + wallet operativo
    ├── assets/                  loghi sponsor
    ├── data/mock-data.js        window.MOCK
    └── js/
        ├── styles.css           design system completo
        ├── navigation.js        auth, toast, modal, app switcher, wallet ring, Leaflet helper
        └── icons.js             aIcon(name, opts) — Feather + Tabler subset
```

## Design system

- **Suite marker**: arancione `#FF8C00` (logo, focus ring) — invariante in tutta la suite Aurea.
- **AureaShuttle accent**: teal `#0EA5A4` (CTA, wallet ring, ESG card, badge "Inviata taxi").
- **AureaCare accent**: blue `#3B82F6` — appare **solo** sul banner handoff "in arrivo da AureaCare" in `book-ride.html`.
- 8 stati corsa: `requested · pending · approved · dispatched · accepted · in_progress · completed · cancelled` con palette dedicata.
- Icone solo SVG via `aIcon()` — nessuna emoji.

## Cosa NON è incluso

- Lato tassista — coperto da [AureaVia](https://destone28.github.io/aureaviapoc/).
- Backend reale, pagamenti reali (Stripe / PayPal / Google Pay sono solo card visuali).
- Geocoding reale — il "geocoder" in `navigation.js` riconosce le 18 strutture Roma + 23 landmark/strade della città; per indirizzi sconosciuti centra su Roma.
- Tracking real-time delle corse in corso — il driver e la card "In corso" sono mockati.

## Crediti

Sviluppato da [Emilio Destratis](https://www.linkedin.com/in/emilio-destratis-3894b2119/) · 3DSprinted.
