# Ecovate

**Real-time surplus food rescue for campuses and event venues.**

Built for **SUSTAIN X** (Computer Science & Engineering, CHRIST University, by Magnovite) — PS-02 · SDG 2: Zero Hunger. Team **Ecovate**, Table 6.

---

## The problem

Restaurants, hostels, wedding halls, and campus events often end the day with edible food left over, while nearby food-support organizations could use it the same day. That value gets lost when surplus is spotted too late, the right recipient isn't available, or pickup and handoff aren't coordinated — especially on a large campus or venue where surplus shows up unpredictably.

## What Ecovate does

Ecovate replaces the scattered WhatsApp-group workflow most food-rescue efforts run on with a single live webapp that takes a listing from **logged → scored → matched → claimed → picked up**, with both sides watching it happen in real time.

**Core loop:**

```text
Vendor logs surplus → urgency scored → broadcast to top NGOs
   → first NGO to claim locks it (or cancels → item re-broadcasts)
   → pickup confirmed → impact logged
```

### Hero feature: smart broadcast matching

Every item is scored on spoilage risk the moment it's logged, then broadcast **simultaneously** to the best-matched NGOs — not offered to one at a time. First to claim wins, so at-risk food gets moving fast without sacrificing fit.

## Key features

- **Urgency scoring** — ranks every listing by spoilage risk and quantity, not just recency
- **Simultaneous broadcast matching** — sent to several ranked NGOs at once; first claim locks it
- **Escalation engine** — an unclaimed item automatically re-broadcasts wider instead of going stale
- **Claim cancellation with accountability** — an NGO can back out of a claim, which re-opens the item and adjusts that NGO's reliability standing
- **Live sync across views** — vendor and NGO screens stay in sync in real time via the browser's `BroadcastChannel` API, no backend required
- **Impact dashboard** — kg diverted, meals redirected, and an honest count of what went unclaimed
- **NGO leaderboard & activity feed** — visibility into which NGOs are responding fastest and most reliably
- **Map preview & geolocation** — lightweight location context for listings and pickups
- **Role switcher** — flip between Vendor and NGO views to demo the full loop from one browser, or open multiple tabs for a true multi-actor live demo

## Tech stack

- **React 19** + **Vite** — frontend and build tooling
- **Tailwind CSS 4** — styling
- **lucide-react** — icons
- **BroadcastChannel API** — real-time cross-tab sync, no server or database
- **oxlint** — linting

No backend, database, or auth — state lives in-memory on the client for this build, structured so it can move to a real API later.

## Project structure

```text
ecovate/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── common/         # Button, ConfirmModal, Countdown, StatusBadge, RoleSelect, Shell, MapPreview, NotificationHost, LiveDot, AddVendorForm, AddNgoForm
│   │   ├── dashboard/       # ImpactDashboard, NgoLeaderboard, ActivityFeed, StatTile, StatusBreakdown
│   │   ├── ngo/             # NGOView, NGOItemCard, MyClaimsList
│   │   └── vendor/          # VendorView, MultiItemForm, ItemDraftRow, VendorItemCard
│   ├── data/                 # seedVendors.js, seedNGOs.js — demo seed data
│   ├── hooks/                 # useEscalationEngine, useGeolocation, useCountUp, useNow, useRole
│   ├── state/                 # StoreContext, reducer, actionTypes, initialState
│   ├── utils/                 # urgency.js, matching.js, statusMeta.js, maps.js, format.js, id.js
│   ├── App.jsx
│   ├── constants.js
│   ├── types.js
│   ├── index.css
│   └── main.jsx
├── CLAUDE.md                  # full project/build spec
├── index.html
├── package.json
└── vite.config.js
```

## Getting started

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone https://github.com/lukenoronha/ecovate.git
cd ecovate
npm install
npm run dev
```

Open the printed local URL, pick a role (Vendor or NGO) from the role switcher, and log or claim an item. To see live cross-view sync the way it runs in the demo, open a second browser tab at the same URL and select the other role — both stay in sync instantly.

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview the production build locally
npm run lint       # run oxlint
```

## How it works under the hood

- `utils/urgency.js` — computes each item's urgency score from spoilage window, food type, and quantity
- `utils/matching.js` — ranks eligible NGOs and drives the simultaneous broadcast
- `hooks/useEscalationEngine.js` — watches broadcast timers and re-broadcasts unclaimed items
- `state/reducer.js` + `state/StoreContext.jsx` — single source of truth for items, claims, and NGO reliability, kept in sync across tabs via `BroadcastChannel`
- `components/dashboard/` — turns that state into the live impact numbers and NGO leaderboard

See `CLAUDE.md` for the full original build spec (scoring formula, matching rules, escalation and cancellation logic, screen list).

## Team Ecovate

- Luke Roman Noronha
- Sherwin R
- Elfrida Anisha Veigas
- Riya Barboza

## Acknowledgments

Built for **SUSTAIN X**, hosted by the Department of Computer Science and Engineering, CHRIST University, in association with Magnovite.
