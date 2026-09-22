import { useState } from 'react';

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`,
      { headers: { Accept: 'application/json' } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.display_name ?? null;
  } catch {
    return null; // offline, blocked, or rate-limited -- caller falls back to raw coordinates
  }
}

/**
 * Wraps the browser's real Geolocation API (actual device GPS/network
 * position, not mocked) and reverse-geocodes it to a human-readable address
 * via OpenStreetMap's free Nominatim service (no API key required).
 */
export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const locate = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported on this device.');
        resolve(null);
        return;
      }
      setLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          const address = await reverseGeocode(lat, lng);
          setLoading(false);
          resolve({ lat, lng, address: address ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
        },
        (err) => {
          setLoading(false);
          setError(err.code === err.PERMISSION_DENIED ? 'Location permission denied.' : 'Could not get location.');
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10_000 },
      );
    });
  };

  return { locate, loading, error };
}
