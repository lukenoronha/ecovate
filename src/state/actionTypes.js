export const ACTIONS = {
  HYDRATE: 'HYDRATE', // full-state sync when a new tab joins

  CREATE_VENDOR: 'CREATE_VENDOR', // registers a new vendor (multiple vendors can coexist)
  CREATE_NGO: 'CREATE_NGO', // registers a new NGO alongside the seeded demo NGOs
  ADD_ITEMS: 'ADD_ITEMS', // creates items and immediately broadcasts each one
  CANCEL_LISTING: 'CANCEL_LISTING', // vendor cancels a listing with no active claims

  CLAIM_ITEM: 'CLAIM_ITEM', // NGO claims some (or all) of the remaining qty
  CANCEL_CLAIM: 'CANCEL_CLAIM', // NGO cancels its own active claim before pickup
  CONFIRM_PICKUP: 'CONFIRM_PICKUP', // NGO confirms it physically collected its claim

  ESCALATE_ITEM: 'ESCALATE_ITEM', // broadcast window timed out, still qty left
  EXPIRE_ITEM: 'EXPIRE_ITEM', // escalation window timed out, still qty left
};
