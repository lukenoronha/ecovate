import { Timer } from 'lucide-react';
import { useNow } from '../../hooks/useNow';
import { formatCountdown } from '../../utils/format';
import { BROADCAST_WINDOW_MS, ESCALATION_WINDOW_MS, ITEM_STATUS } from '../../constants';

// Live "time left in this broadcast wave" readout, driven by item.broadcastAt.
export function Countdown({ item }) {
  const now = useNow(250);
  if (item.broadcastAt == null) return null;
  if (![ITEM_STATUS.BROADCAST, ITEM_STATUS.ESCALATED].includes(item.status)) return null;

  const windowMs = item.status === ITEM_STATUS.ESCALATED ? ESCALATION_WINDOW_MS : BROADCAST_WINDOW_MS;
  const msRemaining = item.broadcastAt + windowMs - now;
  const isUrgent = msRemaining <= windowMs * 0.2;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-xs transition-colors ${
        isUrgent ? 'animate-pulse bg-red-50 font-semibold text-red-600' : 'text-slate-500'
      }`}
      title="Time left in this broadcast window"
    >
      <Timer className="h-3 w-3" strokeWidth={2.25} />
      {formatCountdown(msRemaining)}
    </span>
  );
}
