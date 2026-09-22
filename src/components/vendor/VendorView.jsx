import { Clock, ListChecks, MapPin } from 'lucide-react';
import { useStore } from '../../state/StoreContext';
import { MultiItemForm } from './MultiItemForm';
import { VendorItemCard } from './VendorItemCard';
import { MapPreview } from '../common/MapPreview';
import { formatShortAddress } from '../../utils/format';

export function VendorView({ vendorId }) {
  const { state } = useStore();
  const vendor = state.vendors[vendorId];

  if (!vendor) return null; // vendor was somehow removed; Shell will bounce back to RoleSelect

  const items = Object.values(state.items)
    .filter((item) => item.vendorId === vendor.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4">
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 py-1 text-sm text-slate-600">
          <span className="flex items-center gap-1.5" title={vendor.location}>
            <MapPin className="h-4 w-4 text-emerald-600" strokeWidth={2.25} />
            <span className="font-medium text-slate-900">{formatShortAddress(vendor.location)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-emerald-600" strokeWidth={2.25} />
            pickup at {vendor.defaultPickupTime}
          </span>
        </div>
        <MapPreview lat={vendor.lat} lng={vendor.lng} className="mt-2" />
      </div>

      <MultiItemForm vendorId={vendor.id} />

      <div className="space-y-2.5">
        <h2 className="flex items-center gap-1.5 text-base font-semibold text-slate-900">
          <ListChecks className="h-4.5 w-4.5 text-slate-400" strokeWidth={2.25} />
          Your listings
        </h2>
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500">
            No items listed yet.
          </p>
        )}
        {items.map((item, index) => (
          <VendorItemCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
