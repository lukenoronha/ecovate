import { SEED_NGOS } from '../data/seedNGOs';
import { SEED_VENDORS } from '../data/seedVendors';

/** @returns {{vendors: Record<string, import('../types').Vendor>, items: Record<string, import('../types').Item>, ngos: Record<string, import('../types').NGO>, claims: Record<string, import('../types').Claim>}} */
export function createInitialState() {
  return {
    vendors: Object.fromEntries(SEED_VENDORS.map((vendor) => [vendor.id, vendor])),
    items: {},
    ngos: Object.fromEntries(SEED_NGOS.map((ngo) => [ngo.id, ngo])),
    claims: {},
    activity: [], // recent event log for the dashboard's activity feed, newest last, capped
  };
}
