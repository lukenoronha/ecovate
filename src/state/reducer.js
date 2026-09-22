import { ACTIONS } from './actionTypes';
import { CANCELLATION_RELIABILITY_PENALTY, CANCELLATION_URGENCY_PENALTY, ITEM_STATUS } from '../constants';
import { computeUrgencyScore } from '../utils/urgency';
import { selectBroadcastTargets } from '../utils/matching';

// Every open tab replays the same broadcast action through this reducer, so
// it must be a pure function of (state, action) -- any id or timestamp it
// needs comes from action.meta (stamped once, by the dispatching tab, in
// StoreContext) rather than from makeId()/Date.now() called here. Otherwise
// each tab would mint its own different id/timestamp for "the same" event,
// and a later action referencing that id (e.g. cancelling a claim by id)
// would silently miss on every tab except the one that created it.

const ACTIVITY_LIMIT = 50;

function withActivity(state, entries) {
  const list = Array.isArray(entries) ? entries : [entries];
  return [...(state.activity ?? []), ...list].slice(-ACTIVITY_LIMIT);
}

function itemHasActiveClaim(state, itemId) {
  return Object.values(state.claims).some((claim) => claim.itemId === itemId && !claim.cancelledAt);
}

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.HYDRATE: {
      // Adopt another tab's state wholesale when we join late.
      return action.payload;
    }

    case ACTIONS.CREATE_VENDOR: {
      const { id, name, location, defaultPickupTime, lat = null, lng = null } = action.payload;
      return {
        ...state,
        vendors: {
          ...state.vendors,
          [id]: { id, name, location, defaultPickupTime, lat, lng },
        },
        activity: withActivity(state, {
          id: `activity-${action.meta.id}`,
          type: 'vendor_joined',
          message: `${name} joined as a vendor`,
          at: action.meta.now,
        }),
      };
    }

    case ACTIONS.CREATE_NGO: {
      const { id, name, capacity, reliabilityScore } = action.payload;
      return {
        ...state,
        ngos: {
          ...state.ngos,
          [id]: { id, name, capacity, reliabilityScore, cancelledCount: 0 },
        },
        activity: withActivity(state, {
          id: `activity-${action.meta.id}`,
          type: 'ngo_joined',
          message: `${name} joined as an NGO`,
          at: action.meta.now,
        }),
      };
    }

    case ACTIONS.ADD_ITEMS: {
      // payload: { vendorId, items: [{ foodType, perishability, qty, prepTime, spoilMinutes, photo }] }
      const vendor = state.vendors[action.payload.vendorId];
      if (!vendor) return state;
      const newItems = {};
      const entries = [];
      const now = action.meta.now;
      action.payload.items.forEach((draft, index) => {
        const id = `item-${action.meta.id}-${index}`;
        const urgencyScore = computeUrgencyScore({
          spoilMinutes: draft.spoilMinutes,
          qty: draft.qty,
          perishability: draft.perishability,
        });
        const base = {
          id,
          vendorId: vendor.id,
          foodType: draft.foodType,
          perishability: draft.perishability,
          qty: draft.qty,
          qtyRemaining: draft.qty,
          prepTime: draft.prepTime,
          spoilMinutes: draft.spoilMinutes,
          photo: draft.photo ?? null,
          urgencyScore,
          location: vendor.location,
          lat: vendor.lat ?? null,
          lng: vendor.lng ?? null,
          pickupTime: vendor.defaultPickupTime,
          escalated: false,
          createdAt: now,
        };
        // Auto-broadcast immediately on listing -- this is the hero feature:
        // urgency scored, then broadcast simultaneously to top-ranked NGOs.
        const broadcastedTo = selectBroadcastTargets(state.ngos, base);
        newItems[id] = {
          ...base,
          status: ITEM_STATUS.BROADCAST,
          broadcastedTo,
          broadcastAt: now,
        };
        entries.push({
          id: `activity-${action.meta.id}-${index}`,
          type: 'listed',
          message: `${vendor.name} listed ${draft.foodType} (${draft.qty} kg) -- broadcasting now`,
          at: now,
        });
      });
      return { ...state, items: { ...state.items, ...newItems }, activity: withActivity(state, entries) };
    }

    case ACTIONS.CANCEL_LISTING: {
      const { itemId } = action.payload;
      const item = state.items[itemId];
      if (!item) return state;
      const cancellableStatuses = [ITEM_STATUS.PENDING, ITEM_STATUS.BROADCAST, ITEM_STATUS.ESCALATED];
      if (!cancellableStatuses.includes(item.status)) return state;
      // Only listings with zero active (non-cancelled) claims can be pulled.
      if (itemHasActiveClaim(state, itemId)) return state;
      return {
        ...state,
        items: {
          ...state.items,
          [itemId]: { ...item, status: ITEM_STATUS.CANCELLED_BY_VENDOR },
        },
        activity: withActivity(state, {
          id: `activity-${action.meta.id}`,
          type: 'listing_cancelled',
          message: `Listing for ${item.foodType} was cancelled by the vendor`,
          at: action.meta.now,
        }),
      };
    }

    case ACTIONS.CLAIM_ITEM: {
      const { itemId, ngoId, qty } = action.payload;
      const item = state.items[itemId];
      const ngo = state.ngos[ngoId];
      if (!item || !ngo) return state;
      if (![ITEM_STATUS.BROADCAST, ITEM_STATUS.ESCALATED].includes(item.status)) return state;
      if (!item.broadcastedTo.includes(ngoId)) return state;
      if (qty <= 0 || qty > item.qtyRemaining) return state;

      const claimId = `claim-${action.meta.id}`;
      const now = action.meta.now;
      const claim = {
        id: claimId,
        itemId,
        ngoId,
        qtyClaimed: qty,
        claimedAt: now,
        cancelledAt: null,
        pickedUpAt: null,
      };

      const qtyRemaining = item.qtyRemaining - qty;
      const fullyClaimed = qtyRemaining === 0;

      const updatedItem = fullyClaimed
        ? { ...item, qtyRemaining, status: ITEM_STATUS.CLAIMED, broadcastAt: null }
        : {
            // Remainder stays live -- re-broadcast it to the next-best NGOs.
            ...item,
            qtyRemaining,
            broadcastAt: now,
            broadcastedTo: selectBroadcastTargets(state.ngos, { ...item, qtyRemaining }),
          };

      return {
        ...state,
        items: { ...state.items, [itemId]: updatedItem },
        claims: { ...state.claims, [claimId]: claim },
        activity: withActivity(state, {
          id: `activity-${action.meta.id}`,
          type: 'claimed',
          message: `${ngo.name} claimed ${qty} kg of ${item.foodType}`,
          at: now,
        }),
      };
    }

    case ACTIONS.CANCEL_CLAIM: {
      const { claimId } = action.payload;
      const claim = state.claims[claimId];
      if (!claim || claim.cancelledAt || claim.pickedUpAt) return state;
      const item = state.items[claim.itemId];
      const ngo = state.ngos[claim.ngoId];
      if (!item || !ngo) return state;

      const now = action.meta.now;
      const qtyRemaining = item.qtyRemaining + claim.qtyClaimed;

      const updatedItem = {
        ...item,
        qtyRemaining,
        status: ITEM_STATUS.BROADCAST,
        urgencyScore: item.urgencyScore + CANCELLATION_URGENCY_PENALTY,
        broadcastAt: now,
        // Re-broadcast to the full ranked list -- the cancelling NGO's
        // reliability hit already demotes it in future ranking, but it isn't
        // blocked outright, and other NGOs correctly see the item reopen in
        // their Browse tab.
        broadcastedTo: selectBroadcastTargets(state.ngos, { ...item, qtyRemaining }),
      };

      const updatedNgo = {
        ...ngo,
        cancelledCount: ngo.cancelledCount + 1,
        reliabilityScore: Math.max(0, ngo.reliabilityScore - CANCELLATION_RELIABILITY_PENALTY),
      };

      return {
        ...state,
        items: { ...state.items, [claim.itemId]: updatedItem },
        ngos: { ...state.ngos, [ngo.id]: updatedNgo },
        claims: { ...state.claims, [claimId]: { ...claim, cancelledAt: now } },
        activity: withActivity(state, {
          id: `activity-${action.meta.id}`,
          type: 'claim_cancelled',
          message: `${ngo.name} cancelled their claim on ${item.foodType} -- back in broadcast`,
          at: now,
        }),
      };
    }

    case ACTIONS.CONFIRM_PICKUP: {
      const { claimId } = action.payload;
      const claim = state.claims[claimId];
      if (!claim || claim.cancelledAt || claim.pickedUpAt) return state;
      const item = state.items[claim.itemId];
      const ngo = state.ngos[claim.ngoId];
      if (!item) return state;

      const now = action.meta.now;
      const updatedClaim = { ...claim, pickedUpAt: now };
      const claims = { ...state.claims, [claimId]: updatedClaim };

      const stillOutstanding = Object.values(claims).some(
        (c) => c.itemId === item.id && !c.cancelledAt && !c.pickedUpAt,
      );

      const items = state.items;
      const updatedItem =
        item.qtyRemaining === 0 && !stillOutstanding ? { ...item, status: ITEM_STATUS.PICKED_UP } : item;

      return {
        ...state,
        claims,
        items: updatedItem === item ? items : { ...items, [item.id]: updatedItem },
        activity: withActivity(state, {
          id: `activity-${action.meta.id}`,
          type: 'picked_up',
          message: `${ngo?.name ?? 'An NGO'} picked up ${claim.qtyClaimed} kg of ${item.foodType}`,
          at: now,
        }),
      };
    }

    case ACTIONS.ESCALATE_ITEM: {
      const { itemId } = action.payload;
      const item = state.items[itemId];
      if (!item || item.status !== ITEM_STATUS.BROADCAST || item.qtyRemaining <= 0) return state;
      const now = action.meta.now;
      return {
        ...state,
        items: {
          ...state.items,
          [itemId]: {
            ...item,
            status: ITEM_STATUS.ESCALATED,
            escalated: true,
            broadcastAt: now,
            broadcastedTo: selectBroadcastTargets(state.ngos, item),
          },
        },
        activity: withActivity(state, {
          id: `activity-${action.meta.id}`,
          type: 'escalated',
          message: `${item.foodType} escalated -- still unclaimed after the first broadcast window`,
          at: now,
        }),
      };
    }

    case ACTIONS.EXPIRE_ITEM: {
      const { itemId } = action.payload;
      const item = state.items[itemId];
      if (!item || item.status !== ITEM_STATUS.ESCALATED || item.qtyRemaining <= 0) return state;
      return {
        ...state,
        items: {
          ...state.items,
          [itemId]: { ...item, status: ITEM_STATUS.UNCLAIMED_EXPIRED, broadcastAt: null },
        },
        activity: withActivity(state, {
          id: `activity-${action.meta.id}`,
          type: 'expired',
          message: `${item.foodType} expired unclaimed (${item.qtyRemaining} kg lost)`,
          at: action.meta.now,
        }),
      };
    }

    default:
      return state;
  }
}
