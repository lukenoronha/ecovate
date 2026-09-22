# Ecovate — SUSTAIN X Hackathon Project Spec

## Event
SUSTAIN X (CHRIST University CSE dept, by Magnovite). Round 1: Build. Round 2: Pitch & Demo (5–7 min).
Team: Ecovate, Table 6.

## Problem statement
PS-02 | SDG 2 — Zero Hunger: "The Surplus Food Window"
Surplus edible food (restaurants, supermarkets, hostels, wedding halls, events) is wasted because it's identified too late, the right recipient org isn't available, or pickup/distribution is poorly coordinated. Scope: a large campus/event venue with unpredictable daily surplus. Solution must touch: identify → match → prioritize → collect → distribute.

## Hero feature (lead the pitch with this)
Urgency-weighted smart broadcast matching: every listing is scored by spoilage risk, then broadcast simultaneously to the top-ranked matched NGOs (not one at a time). First to claim locks it. This is the single feature to demo live and dramatically — everything else is supporting narrative.

## Differentiator vs existing solutions (WhatsApp-based food rescue groups)
Existing systems run entirely over WhatsApp — hard to track, no prioritization, no real-time visibility, no accountability. Ecovate is a single integrated webapp: listing, matching, claiming, cancellation, and handoff all happen in one place with live updates for both vendors and NGOs.

## Build scope (2-hour hackathon build)
- Single React (Vite + Tailwind) app. No backend, no database, no server.
- Live sync between Vendor view and NGO view via the `BroadcastChannel` browser API (simulate multiple NGOs using separate browser tabs).
- Demo mode flag: production timers use real-world values (3 min broadcast window); a `DEMO_MODE` constant compresses them (~10 sec) for the live pitch, so the logic shown is real but the pacing fits 5–7 min.
- Everything else (auth, real maps, real geolocation) is mocked/simplified.

## Vendor flow
- One-time setup: location (set once), default pickup time.
- Add multiple items in one session: food type, quantity, prep time, spoil window (minutes), optional photo (local preview only, FileReader, never uploaded/stored).
- On submit, auto-split the multi-item form into separate Item listings, each sharing the vendor's location and pickup time.
- Vendor can cancel any listing that hasn't been claimed yet (confirmation modal required).

## Data model
```
Vendor: id, location, defaultPickupTime
Item: id, vendorId, foodType, qty, qtyRemaining, prepTime, spoilMinutes, photo(optional, local preview only), urgencyScore, status (pending → broadcast → claimed → picked_up → completed | cancelled_by_vendor | unclaimed_expired)
NGO: id, name, capacity, reliabilityScore, cancelledCount
Claim: id, itemId, ngoId, qtyClaimed, claimedAt, cancelledAt(optional)
```

## Urgency scoring
```
urgencyScore = (100 - spoilMinutes) * perishabilityWeight + qty * 2
```
perishabilityWeight = 1.5 for cooked/high-risk food, 0.8 for packaged/low-risk food.
On NGO cancellation, bump urgencyScore by a fixed penalty (e.g. +15) to reflect lost time before re-broadcasting.

## Matching logic
1. Rank eligible NGOs by capacity fit + reliabilityScore.
2. Broadcast the item simultaneously to the top 3–5 ranked NGOs (not sequential).
3. First NGO to claim locks the item (or the claimed portion). Partial quantity claims allowed if item qty > claimed qty — remaining qty stays live and re-broadcasts to the next-best NGOs.
4. Broadcast window: 3 minutes (real-world default), compressed under DEMO_MODE. If unclaimed when the window expires, re-broadcast to all remaining NGOs and flag the item "escalated".
5. Final escalation cycle: if still unclaimed after the escalated broadcast expires, mark the item "unclaimed_expired" — tracked as a "missed" metric on the impact dashboard, not hidden.
6. NGO cancellation: an NGO can cancel an active claim before pickup is confirmed (confirmation modal required). On cancel: item status reverts to "broadcast", qtyRemaining restored, urgencyScore penalty applied, NGO's cancelledCount increments and reliabilityScore drops slightly (affects future match ranking) — real-world accountability loop.
7. Once status is "picked_up", cancellation is no longer possible.
8. All status changes sync live across open tabs via BroadcastChannel.

## Demo NGO seed data (hardcode these 3)
- NGO A — high capacity, high reliability
- NGO B — medium capacity, medium reliability
- NGO C — low capacity, high reliability, closest location (fastest to claim small items)

## Impact dashboard math
1 kg of surplus food ≈ 2 meals. Dashboard shows: items completed, kg diverted, meals saved, and kg unclaimed/expired (honest "still lost" metric).

## Screens to build
1. Vendor setup + multi-item add form (with cancel-listing action per item)
2. Live item feed — per-item urgency score, broadcast/escalated/expired status, countdown
3. NGO claim screen — browse broadcast items, select qty, claim, cancel an active claim (with confirmation)
4. Pickup/handoff confirm screen (simplified — no real geolocation, just a confirm button)
5. Impact dashboard — items completed, kg diverted, meals saved, kg unclaimed

## UI / UX principles (user-friendliness)
- Confirmation modal on every destructive action (vendor cancel listing, NGO cancel claim).
- Color-coded status badges: pending (gray), broadcast (blue), escalated (amber), claimed (purple), picked_up/completed (green), cancelled/expired (red).
- Minimal clicks: vendor item entry and NGO claim should each be completable in under 3 taps.
- Mobile-first responsive layout — this is realistically used on a phone in a kitchen or by an NGO volunteer on the move.

## Pitch structure (5–7 min)
1. Problem (30 sec) — surplus food wasted due to late ID, no coordination, WhatsApp-based chaos.
2. Differentiator (30 sec) — one integrated webapp, not scattered messages; built-in accountability via reliability scoring.
3. Live demo (3–4 min) — hero feature: vendor logs item → urgency score appears → broadcasts to 3 NGO tabs live → one claims it → an NGO cancels to show real-world resilience → item re-broadcasts instantly → another NGO claims → handoff confirm.
4. Impact (30 sec) — kg diverted / meals saved, plus the honest "kg still lost" metric that shows the system measures its own gaps.
5. Close — mention multi-item flexible listing + escalation + cancellation accountability as supporting depth, don't re-demo everything.

## First build prompt (paste this into Claude Code to start)
Build a React (Vite + Tailwind) single-page app called Ecovate for a hackathon demo.
No backend — use in-memory state + the BroadcastChannel API for live sync between a Vendor view and an NGO view (simulate 2–3 NGO tabs). Add a DEMO_MODE constant that compresses the broadcast window from 3 minutes to ~10 seconds for live demo pacing.

Vendor flow: one-time setup (location, default pickup time), then add multiple items (foodType, qty, prepTime, spoilMinutes, optional local-preview-only photo). On submit, auto-split into separate Item listings sharing the vendor's location/pickup time. Vendor can cancel an unclaimed listing (confirmation modal).

Scoring: urgencyScore = (100 - spoilMinutes) * perishabilityWeight + qty * 2. perishabilityWeight = 1.5 for cooked/high-risk food, 0.8 for packaged/low-risk. On NGO cancellation, add a +15 urgency penalty.

Matching: rank NGOs by capacity fit + reliabilityScore, broadcast each item simultaneously to the top 3–5 ranked NGOs. First NGO to claim locks the item or claimed portion (partial qty claims allowed, remainder stays live). Broadcast window expires (3 min real / ~10 sec demo mode) → re-broadcast to all remaining NGOs, mark "escalated". If still unclaimed after that, mark "unclaimed_expired". NGOs can cancel an active claim before pickup (confirmation modal) — this reopens the item, restores qty, applies the urgency penalty, and decrements the NGO's reliabilityScore + increments cancelledCount. Sync all status changes live across open tabs via BroadcastChannel.

Seed 3 demo NGOs: NGO A (high capacity, high reliability), NGO B (medium/medium), NGO C (low capacity, high reliability, closest).

Screens: Vendor setup + multi-item add form with cancel action, live item feed (urgency score + status with color-coded badges), NGO claim screen (browse, select qty, claim, cancel claim), pickup/handoff confirm screen, impact dashboard (items completed, kg diverted, meals saved at 1kg = 2 meals, kg unclaimed).

UI must be mobile-responsive, minimal-click, with confirmation modals on all cancel actions.

Scaffold the full file structure first, then build screen by screen.
