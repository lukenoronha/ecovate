import { useEffect, useState } from 'react';
import { ArrowLeftRight, ChevronLeft, LayoutDashboard, Sprout } from 'lucide-react';
import { useRole } from '../../hooks/useRole';
import { useEscalationEngine } from '../../hooks/useEscalationEngine';
import { useStore } from '../../state/StoreContext';
import { RoleSelect } from './RoleSelect';
import { Button } from './Button';
import { VendorView } from '../vendor/VendorView';
import { NGOView } from '../ngo/NGOView';
import { ImpactDashboard } from '../dashboard/ImpactDashboard';
import { NotificationHost } from './NotificationHost';

export function Shell() {
  useEscalationEngine();
  const { state, hasHydrated } = useStore();
  const [role, setRole] = useRole();
  const [showDashboard, setShowDashboard] = useState(false);

  const vendor = role ? state.vendors[role] : undefined;
  const ngo = role ? state.ngos[role] : undefined;
  const isDedicatedDashboard = role === 'dashboard';

  // If this tab's chosen vendor/NGO no longer exists, bounce back to the
  // picker instead of rendering a blank screen. Must wait for hasHydrated:
  // right after a page reload, a valid role can briefly look "missing"
  // simply because the cross-tab state sync hasn't landed yet.
  useEffect(() => {
    if (hasHydrated && role && role !== 'dashboard' && !vendor && !ngo) setRole(null);
  }, [hasHydrated, role, vendor, ngo, setRole]);

  if (!role) return <RoleSelect onSelect={setRole} />;
  if (!isDedicatedDashboard && !vendor && !ngo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  const displayingDashboard = isDedicatedDashboard || showDashboard;
  const roleLabel = isDedicatedDashboard ? 'Impact Dashboard' : (vendor ?? ngo).name;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NotificationHost vendorId={vendor?.id} />
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 shadow-sm shadow-emerald-600/30">
            <Sprout className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
          </span>
          <div className="min-w-0 leading-tight">
            <h1 className="text-sm font-bold text-slate-900">Ecovate</h1>
            <p className="truncate text-xs text-slate-500">{roleLabel}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isDedicatedDashboard && (
            <Button
              variant="secondary"
              size="sm"
              icon={showDashboard ? ChevronLeft : LayoutDashboard}
              onClick={() => setShowDashboard((v) => !v)}
            >
              {showDashboard ? 'Back' : 'Dashboard'}
            </Button>
          )}
          <Button variant="ghost" size="sm" icon={ArrowLeftRight} onClick={() => setRole(null)}>
            Switch
          </Button>
        </div>
      </header>

      <main>
        {displayingDashboard ? (
          <ImpactDashboard />
        ) : vendor ? (
          <VendorView vendorId={vendor.id} />
        ) : (
          <NGOView ngoId={ngo.id} />
        )}
      </main>
    </div>
  );
}
