export function formatCountdown(msRemaining) {
  const clamped = Math.max(0, msRemaining);
  const totalSeconds = Math.ceil(clamped / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function formatKg(qty) {
  return `${Number(qty).toFixed(1)} kg`;
}

export function formatScore(score) {
  return Math.round(score);
}

export function formatRelativeTime(at, now = Date.now()) {
  const seconds = Math.max(0, Math.round((now - at) / 1000));
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

// Reverse-geocoded addresses (e.g. from Nominatim) can run to a dozen
// comma-separated segments (street, neighborhood, city, county, state,
// postcode, country...). Keep just the first few for card display.
export function formatShortAddress(address, segments = 3) {
  if (!address) return address;
  return address.split(',').slice(0, segments).join(',').trim();
}
