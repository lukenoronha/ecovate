// Data model reference (JSDoc typedefs only — plain JS objects at runtime).
// Mirrors the model defined in CLAUDE.md.

/**
 * @typedef {Object} Vendor
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {string} defaultPickupTime
 * @property {number|null} lat            captured via the browser Geolocation API, optional
 * @property {number|null} lng
 */

/**
 * @typedef {'high'|'low'} Perishability
 */

/**
 * @typedef {'pending'|'broadcast'|'escalated'|'claimed'|'picked_up'|'completed'|'cancelled_by_vendor'|'unclaimed_expired'} ItemStatus
 */

/**
 * @typedef {Object} Item
 * @property {string} id
 * @property {string} vendorId
 * @property {string} foodType
 * @property {Perishability} perishability
 * @property {number} qty
 * @property {number} qtyRemaining
 * @property {number} prepTime          minutes
 * @property {number} spoilMinutes
 * @property {string|null} photo        local FileReader data URL preview only, never uploaded
 * @property {number} urgencyScore
 * @property {ItemStatus} status
 * @property {string} location          copied from vendor at creation time
 * @property {number|null} lat          copied from vendor at creation time
 * @property {number|null} lng
 * @property {string} pickupTime        copied from vendor at creation time
 * @property {string[]} broadcastedTo   NGO ids the current broadcast wave went to
 * @property {number|null} broadcastAt  timestamp of the current broadcast window start
 * @property {boolean} escalated
 * @property {number} createdAt
 */

/**
 * @typedef {Object} NGO
 * @property {string} id
 * @property {string} name
 * @property {'high'|'medium'|'low'} capacity
 * @property {number} reliabilityScore
 * @property {number} cancelledCount
 */

/**
 * @typedef {Object} Claim
 * @property {string} id
 * @property {string} itemId
 * @property {string} ngoId
 * @property {number} qtyClaimed
 * @property {number} claimedAt
 * @property {number|null} cancelledAt
 * @property {number|null} pickedUpAt
 */

export {};
