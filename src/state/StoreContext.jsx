import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { reducer } from './reducer';
import { createInitialState } from './initialState';
import { ACTIONS } from './actionTypes';
import { BROADCAST_CHANNEL_NAME } from '../constants';
import { makeId } from '../utils/id';

// Internal, channel-only message types. These never go through the reducer
// directly — they exist purely to bring a newly-opened tab up to date.
const SYNC_REQUEST = '__SYNC_REQUEST__';
const SYNC_RESPONSE = '__SYNC_RESPONSE__';

const StoreContext = createContext(null);

// How long a fresh tab waits for another open tab to answer its sync
// request before assuming it's the only one and treating its own initial
// state as authoritative.
const HYDRATION_GRACE_MS = 600;

export function StoreProvider({ children }) {
  const [state, localDispatch] = useReducer(reducer, undefined, createInitialState);
  // True once we've either adopted another tab's state or given up waiting
  // for one. Consumers (like Shell's "does my role still exist?" check) must
  // wait for this before treating a missing vendor/NGO as truly gone --
  // right after mount it may simply not have arrived yet.
  const [hasHydrated, setHasHydrated] = useState(false);

  // Kept current on every render so the channel listener (set up once) can
  // always read the latest state without a stale closure.
  const stateRef = useRef(state);
  stateRef.current = state;

  const channelRef = useRef(null);
  // Every response is broadcast to the whole channel (BroadcastChannel has no
  // point-to-point send), so responses must be addressed by instance id --
  // otherwise every open tab would blindly re-hydrate off any other tab's
  // sync exchange and could rewind a state update that just landed.
  const instanceIdRef = useRef(makeId('tab'));

  useEffect(() => {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const message = event.data;
      if (!message || typeof message !== 'object') return;

      if (message.type === SYNC_REQUEST) {
        // Another tab just opened and wants our current state.
        channel.postMessage({
          type: SYNC_RESPONSE,
          targetId: message.requesterId,
          payload: stateRef.current,
        });
        return;
      }

      if (message.type === SYNC_RESPONSE) {
        if (message.targetId !== instanceIdRef.current) return; // not addressed to us
        localDispatch({ type: ACTIONS.HYDRATE, payload: message.payload });
        setHasHydrated(true);
        return;
      }

      // A normal app action, already applied on the sending tab -- apply it
      // here too. Do NOT rebroadcast (it would just echo forever).
      localDispatch(message);
    };

    // Ask any already-open tabs for the current state.
    channel.postMessage({ type: SYNC_REQUEST, requesterId: instanceIdRef.current });

    // No other tab to hydrate from -- our own initial state is authoritative.
    const graceTimer = setTimeout(() => setHasHydrated(true), HYDRATION_GRACE_MS);

    return () => {
      channel.close();
      clearTimeout(graceTimer);
    };
  }, []);

  const dispatch = useCallback((action) => {
    // Every tab replays the same action through the same reducer, so the
    // reducer must be deterministic given the action -- any id/timestamp it
    // needs has to be decided once, here, and carried on the action, rather
    // than generated independently (and differently!) on each tab.
    const stamped = { ...action, meta: { id: makeId('evt'), now: Date.now(), ...action.meta } };
    localDispatch(stamped);
    channelRef.current?.postMessage(stamped);
  }, []);

  return <StoreContext.Provider value={{ state, dispatch, hasHydrated }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
