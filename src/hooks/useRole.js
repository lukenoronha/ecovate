import { useState } from 'react';

const STORAGE_KEY = 'ecovate-role';

/**
 * Per-tab identity: which screen this browser tab is acting as. Deliberately
 * NOT synced via BroadcastChannel -- each tab picks its own role so one tab
 * can be the Vendor and others can be NGO A/B/C.
 */
export function useRole() {
  const [role, setRoleState] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const setRole = (next) => {
    setRoleState(next);
    try {
      if (next) sessionStorage.setItem(STORAGE_KEY, next);
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore (e.g. private browsing storage restrictions)
    }
  };

  return [role, setRole];
}
