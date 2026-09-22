import { useState } from 'react';
import { ClipboardList, HeartHandshake, Search, Star, XCircle } from 'lucide-react';
import { useStore } from '../../state/StoreContext';
import { NGOItemCard } from './NGOItemCard';
import { MyClaimsList } from './MyClaimsList';
import { ITEM_STATUS } from '../../constants';

export function NGOView({ ngoId }) {
  const { state } = useStore();
  const [tab, setTab] = useState('browse');

  const ngo = state.ngos[ngoId];

  const broadcastItems = Object.values(state.items)
    .filter(
      (item) =>
        [ITEM_STATUS.BROADCAST, ITEM_STATUS.ESCALATED].includes(item.status) &&
        item.broadcastedTo.includes(ngoId) &&
        item.qtyRemaining > 0,
    )
    .sort((a, b) => b.urgencyScore - a.urgencyScore);

  const activeClaimCount = Object.values(state.claims).filter((c) => c.ngoId === ngoId && !c.cancelledAt && !c.pickedUpAt).length;

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
          <HeartHandshake className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{ngo?.name}</span>
          <span className="flex items-center gap-1 font-medium text-amber-600">
            <Star className="h-3.5 w-3.5 fill-current" />
            {ngo?.reliabilityScore}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <XCircle className="h-3.5 w-3.5" />
            {ngo?.cancelledCount} cancelled
          </span>
        </div>
      </div>

      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 text-sm font-medium">
        <button
          onClick={() => setTab('browse')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-colors ${tab === 'browse' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          <Search className="h-4 w-4" strokeWidth={2.25} />
          Browse ({broadcastItems.length})
        </button>
        <button
          onClick={() => setTab('claims')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-colors ${tab === 'claims' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          <ClipboardList className="h-4 w-4" strokeWidth={2.25} />
          My claims {activeClaimCount > 0 ? `(${activeClaimCount})` : ''}
        </button>
      </div>

      {tab === 'browse' ? (
        <div key="browse" className="animate-fade-in space-y-2.5">
          {broadcastItems.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
              <Search className="h-6 w-6 text-slate-300" strokeWidth={2} />
              <p className="text-sm text-slate-500">No items broadcast to you right now.</p>
            </div>
          )}
          {broadcastItems.map((item, index) => (
            <NGOItemCard key={item.id} item={item} ngoId={ngoId} index={index} />
          ))}
        </div>
      ) : (
        <div key="claims" className="animate-fade-in">
          <MyClaimsList ngoId={ngoId} />
        </div>
      )}
    </div>
  );
}
