import { useState } from 'react';
import { CircleCheck, ClipboardList, ExternalLink, MapPin, X } from 'lucide-react';
import { useStore } from '../../state/StoreContext';
import { ACTIONS } from '../../state/actionTypes';
import { ConfirmModal } from '../common/ConfirmModal';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { formatKg, formatShortAddress } from '../../utils/format';
import { osmViewUrl } from '../../utils/maps';

function ClaimRow({ claim, item }) {
  const { dispatch } = useStore();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const handleCancel = () => {
    dispatch({ type: ACTIONS.CANCEL_CLAIM, payload: { claimId: claim.id } });
    setConfirmingCancel(false);
  };

  const handleConfirmPickup = () => {
    dispatch({ type: ACTIONS.CONFIRM_PICKUP, payload: { claimId: claim.id } });
  };

  return (
    <div className="animate-slide-up rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-semibold text-slate-900">{item?.foodType ?? 'Item'}</div>
          <div className="mt-0.5 text-xs text-slate-500">{formatKg(claim.qtyClaimed)} claimed</div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
            <span className="flex items-center gap-1" title={item?.location}>
              <MapPin className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.25} />
              {formatShortAddress(item?.location)} · pickup {item?.pickupTime}
            </span>
            {item?.lat != null && item?.lng != null && (
              <a
                href={osmViewUrl(item.lat, item.lng)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-0.5 font-medium text-emerald-600 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.25} />
                Map
              </a>
            )}
          </div>
        </div>
        {claim.pickedUpAt ? <StatusBadge status="picked_up" /> : <StatusBadge status="claimed" />}
      </div>

      {!claim.pickedUpAt && (
        <div className="mt-3 flex gap-2">
          <Button size="sm" icon={CircleCheck} onClick={handleConfirmPickup}>
            Confirm pickup
          </Button>
          <Button size="sm" variant="danger" icon={X} onClick={() => setConfirmingCancel(true)}>
            Cancel claim
          </Button>
        </div>
      )}

      <ConfirmModal
        open={confirmingCancel}
        title="Cancel this claim?"
        description="The item goes back into broadcast for other NGOs, and this affects your reliability score. This can't be undone."
        confirmLabel="Cancel claim"
        onConfirm={handleCancel}
        onCancel={() => setConfirmingCancel(false)}
      />
    </div>
  );
}

export function MyClaimsList({ ngoId }) {
  const { state } = useStore();

  const myClaims = Object.values(state.claims)
    .filter((c) => c.ngoId === ngoId && !c.cancelledAt)
    .sort((a, b) => b.claimedAt - a.claimedAt);

  if (myClaims.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
        <ClipboardList className="h-6 w-6 text-slate-300" strokeWidth={2} />
        <p className="text-sm text-slate-500">You haven't claimed anything yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {myClaims.map((claim) => (
        <ClaimRow key={claim.id} claim={claim} item={state.items[claim.itemId]} />
      ))}
    </div>
  );
}
