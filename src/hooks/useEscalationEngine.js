import { useEffect } from 'react';
import { useStore } from '../state/StoreContext';
import { ACTIONS } from '../state/actionTypes';
import { BROADCAST_WINDOW_MS, ESCALATION_WINDOW_MS, ITEM_STATUS } from '../constants';

const TICK_MS = 500;

// Runs in every open tab. Each tab independently notices when a broadcast or
// escalation window has elapsed and dispatches the transition; the reducer's
// status guards make this idempotent if more than one tab fires at once.
export function useEscalationEngine() {
  const { state, dispatch } = useStore();

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      for (const item of Object.values(state.items)) {
        if (item.qtyRemaining <= 0 || item.broadcastAt == null) continue;
        const elapsed = now - item.broadcastAt;

        if (item.status === ITEM_STATUS.BROADCAST && elapsed >= BROADCAST_WINDOW_MS) {
          dispatch({ type: ACTIONS.ESCALATE_ITEM, payload: { itemId: item.id } });
        } else if (item.status === ITEM_STATUS.ESCALATED && elapsed >= ESCALATION_WINDOW_MS) {
          dispatch({ type: ACTIONS.EXPIRE_ITEM, payload: { itemId: item.id } });
        }
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [state.items, dispatch]);
}
