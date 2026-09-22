import { useEffect, useRef, useState } from 'react';
import { CircleCheck, PackageCheck, TriangleAlert, XCircle } from 'lucide-react';
import { useStore } from '../../state/StoreContext';
import { ITEM_STATUS } from '../../constants';

// Which item-status transitions are worth surfacing to the vendor, and how.
const NOTICE_CONFIG = {
  [ITEM_STATUS.CLAIMED]: { icon: PackageCheck, tone: 'purple', verb: 'claimed' },
  [ITEM_STATUS.ESCALATED]: { icon: TriangleAlert, tone: 'amber', verb: 'still unclaimed -- escalated to more NGOs' },
  [ITEM_STATUS.PICKED_UP]: { icon: CircleCheck, tone: 'emerald', verb: 'picked up' },
  [ITEM_STATUS.UNCLAIMED_EXPIRED]: { icon: XCircle, tone: 'red', verb: 'expired unclaimed' },
};

const TONE_CLASSES = {
  purple: 'border-purple-200 bg-purple-50 text-purple-800',
  amber: 'border-amber-200 bg-amber-50 text-amber-800',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  red: 'border-red-200 bg-red-50 text-red-800',
};

// Live toasts (and, if permitted, real OS notifications) whenever one of this
// vendor's own listings changes status -- claimed, escalated, picked up, or
// expired -- so the vendor doesn't have to keep staring at the screen to know
// an order came in.
export function NotificationHost({ vendorId }) {
  const { state } = useStore();
  const [toasts, setToasts] = useState([]);
  const prevStatuses = useRef({});
  const askedPermission = useRef(false);

  useEffect(() => {
    if (!vendorId) return;
    if (!askedPermission.current && 'Notification' in window && Notification.permission === 'default') {
      askedPermission.current = true;
      Notification.requestPermission();
    }
  }, [vendorId]);

  useEffect(() => {
    if (!vendorId) return;
    const myItems = Object.values(state.items).filter((item) => item.vendorId === vendorId);
    const previous = prevStatuses.current;
    const next = {};
    const newToasts = [];

    for (const item of myItems) {
      next[item.id] = item.status;
      const before = previous[item.id];
      const config = NOTICE_CONFIG[item.status];
      // Skip the very first sighting of an item (nothing "changed" yet) and
      // ignore statuses we don't have a notice for.
      if (before !== undefined && before !== item.status && config) {
        newToasts.push({ id: `${item.id}-${item.status}-${Date.now()}`, foodType: item.foodType, ...config });
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Ecovate', { body: `${item.foodType} was ${config.verb}.` });
        }
      }
    }
    prevStatuses.current = next;

    if (newToasts.length > 0) {
      setToasts((current) => [...current, ...newToasts]);
      newToasts.forEach((toast) => {
        setTimeout(() => setToasts((current) => current.filter((t) => t.id !== toast.id)), 6000);
      });
    }
  }, [state.items, vendorId]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 mx-auto flex w-full max-w-sm flex-col gap-2 px-4">
      {toasts.map((toast) => {
        const Icon = toast.icon;
        return (
          <div
            key={toast.id}
            className={`animate-slide-up pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm shadow-lg ${TONE_CLASSES[toast.tone]}`}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.25} />
            <span>
              <span className="font-semibold">{toast.foodType}</span> was {toast.verb}.
            </span>
          </div>
        );
      })}
    </div>
  );
}
