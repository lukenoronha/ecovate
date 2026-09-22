import { useState } from 'react';
import { Clock, ExternalLink, Flame, HandHeart, MapPin } from 'lucide-react';
import { useStore } from '../../state/StoreContext';
import { ACTIONS } from '../../state/actionTypes';
import { StatusBadge } from '../common/StatusBadge';
import { Countdown } from '../common/Countdown';
import { LiveDot } from '../common/LiveDot';
import { Button } from '../common/Button';
import { ITEM_STATUS } from '../../constants';
import { formatKg, formatScore, formatShortAddress } from '../../utils/format';
import { osmViewUrl } from '../../utils/maps';

function urgencyColor(score) {
  if (score >= 100) return 'text-red-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-slate-400';
}

export function NGOItemCard({ item, ngoId, index = 0 }) {
  const { dispatch } = useStore();
  const [qty, setQty] = useState(item.qtyRemaining);

  const claimQty = Math.min(Math.max(Number(qty) || 0, 0), item.qtyRemaining);
  const canClaim = claimQty > 0;

  const handleClaim = () => {
    if (!canClaim) return;
    dispatch({ type: ACTIONS.CLAIM_ITEM, payload: { itemId: item.id, ngoId, qty: claimQty } });
  };

  return (
    <div
      className="animate-slide-up rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            {[ITEM_STATUS.BROADCAST, ITEM_STATUS.ESCALATED].includes(item.status) && (
              <LiveDot color={item.status === ITEM_STATUS.ESCALATED ? 'amber' : 'blue'} />
            )}
            <span className="truncate font-semibold text-slate-900">{item.foodType}</span>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-500">
            <span>{formatKg(item.qtyRemaining)} available</span>
            <span className={`flex items-center gap-0.5 font-medium ${urgencyColor(item.urgencyScore)}`}>
              <Flame className="h-3.5 w-3.5" strokeWidth={2.25} />
              {formatScore(item.urgencyScore)}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-500">
            <span className="flex items-center gap-1" title={item.location}>
              <MapPin className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.25} />
              {formatShortAddress(item.location)}
            </span>
            {item.lat != null && item.lng != null && (
              <a
                href={osmViewUrl(item.lat, item.lng)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-0.5 font-medium text-emerald-600 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.25} />
                View on map
              </a>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.25} />
              pickup {item.pickupTime}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <StatusBadge status={item.status} />
          <Countdown item={item} />
        </div>
      </div>

      {item.photo && (
        <img src={item.photo} alt={item.foodType} className="mt-3 h-24 w-full rounded-lg object-cover" />
      )}

      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center overflow-hidden rounded-lg border border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
          <input
            type="number"
            min="0"
            max={item.qtyRemaining}
            step="0.5"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-16 border-0 px-2.5 py-2 text-sm focus:outline-none"
          />
          <span className="pr-2.5 text-xs text-slate-400">kg</span>
        </div>
        <Button icon={HandHeart} onClick={handleClaim} disabled={!canClaim} className="ml-auto">
          Claim
        </Button>
      </div>
    </div>
  );
}
