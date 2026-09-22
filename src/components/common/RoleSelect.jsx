import { useState } from 'react';
import { ChevronRight, HeartHandshake, LayoutDashboard, Plus, Sprout, Store, Star } from 'lucide-react';
import { useStore } from '../../state/StoreContext';
import { AddVendorForm } from './AddVendorForm';
import { AddNgoForm } from './AddNgoForm';

// Flavor hints for the original 3 seed NGOs (from CLAUDE.md); custom NGOs
// fall back to a generic capacity-based hint.
const SEED_HINTS = {
  'ngo-a': 'High capacity, high reliability',
  'ngo-b': 'Medium capacity, medium reliability',
  'ngo-c': 'Low capacity, high reliability, closest',
};

function capacityHint(capacity) {
  return `${capacity[0].toUpperCase()}${capacity.slice(1)} capacity`;
}

function RoleCard({ icon: Icon, iconClass, title, hint, extra, onClick, index = 0 }) {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'backwards' }}
      className="animate-slide-up group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/5"
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
        <Icon className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-slate-900">{title}</span>
        <span className="block truncate text-sm text-slate-500">{hint}</span>
        {extra}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-500" />
    </button>
  );
}

function AddCard({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-3.5 text-sm font-medium text-slate-500 transition-colors hover:border-emerald-400 hover:bg-white hover:text-emerald-700"
    >
      <Plus className="h-4 w-4" strokeWidth={2.25} />
      {label}
    </button>
  );
}

export function RoleSelect({ onSelect }) {
  const { state } = useStore();
  const [addingVendor, setAddingVendor] = useState(false);
  const [addingNgo, setAddingNgo] = useState(false);

  const vendors = Object.values(state.vendors).sort((a, b) => a.name.localeCompare(b.name));
  const ngos = Object.values(state.ngos).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-linear-to-b from-emerald-100/70 via-emerald-50/40 to-transparent"
        aria-hidden="true"
      />
      <div className="animate-fade-in relative mx-auto flex min-h-screen max-w-md flex-col justify-center gap-7 p-6">
        <div className="text-center">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-600/30">
            <Sprout className="h-7 w-7 text-white" strokeWidth={2.25} />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Eco<span className="text-gradient">vate</span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">Choose which side of the app this tab represents.</p>
        </div>

        {addingVendor ? (
          <AddVendorForm onCreated={onSelect} onCancel={() => setAddingVendor(false)} />
        ) : (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Vendors</div>
            <div className="space-y-2.5">
              {vendors.map((vendor, index) => (
                <RoleCard
                  key={vendor.id}
                  index={index}
                  icon={Store}
                  iconClass="bg-emerald-100 text-emerald-700"
                  title={vendor.name}
                  hint={vendor.location}
                  onClick={() => onSelect(vendor.id)}
                />
              ))}
              <AddCard label="Add new vendor" onClick={() => setAddingVendor(true)} />
            </div>
          </div>
        )}

        {addingNgo ? (
          <AddNgoForm onCreated={onSelect} onCancel={() => setAddingNgo(false)} />
        ) : (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">NGOs</div>
            <div className="space-y-2.5">
              {ngos.map((ngo, index) => (
                <RoleCard
                  key={ngo.id}
                  index={index}
                  icon={HeartHandshake}
                  iconClass="bg-purple-100 text-purple-700"
                  title={ngo.name}
                  hint={SEED_HINTS[ngo.id] ?? capacityHint(ngo.capacity)}
                  onClick={() => onSelect(ngo.id)}
                  extra={
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                      <Star className="h-3 w-3 fill-current" />
                      {ngo.reliabilityScore} reliability
                    </span>
                  }
                />
              ))}
              <AddCard label="Add new NGO" onClick={() => setAddingNgo(true)} />
            </div>
          </div>
        )}

        <button
          onClick={() => onSelect('dashboard')}
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-3 text-sm font-medium text-slate-500 transition-colors hover:border-slate-400 hover:bg-white hover:text-slate-700"
        >
          <LayoutDashboard className="h-4 w-4" strokeWidth={2.25} />
          Impact Dashboard
        </button>
      </div>
    </div>
  );
}
