import { useState } from 'react';
import { ArrowRight, Clock, LocateFixed, MapPin, Store } from 'lucide-react';
import { useStore } from '../../state/StoreContext';
import { ACTIONS } from '../../state/actionTypes';
import { useGeolocation } from '../../hooks/useGeolocation';
import { makeId } from '../../utils/id';
import { Button } from './Button';
import { MapPreview } from './MapPreview';

/** Registers a brand-new vendor, then hands its id back so the caller can select it as this tab's role. */
export function AddVendorForm({ onCreated, onCancel }) {
  const { dispatch } = useStore();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [defaultPickupTime, setDefaultPickupTime] = useState('');
  const [coords, setCoords] = useState(null);
  const { locate, loading: locating, error: locateError } = useGeolocation();

  const canSubmit = name.trim().length > 0 && location.trim().length > 0 && defaultPickupTime.trim().length > 0;

  const handleUseLocation = async () => {
    const result = await locate();
    if (!result) return;
    setLocation(result.address);
    setCoords({ lat: result.lat, lng: result.lng });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const id = makeId('vendor');
    dispatch({
      type: ACTIONS.CREATE_VENDOR,
      payload: {
        id,
        name: name.trim(),
        location: location.trim(),
        defaultPickupTime,
        lat: coords?.lat,
        lng: coords?.lng,
      },
    });
    onCreated(id);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-scale-in space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Store className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <h3 className="text-base font-semibold text-slate-900">Register a new vendor</h3>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Vendor / business name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Campus Canteen"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </label>

      <div>
        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          Location
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setCoords(null);
            }}
            placeholder="e.g. Block A, Ground Floor"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <Button type="button" variant="secondary" icon={LocateFixed} onClick={handleUseLocation} disabled={locating} className="shrink-0">
            {locating ? '...' : 'GPS'}
          </Button>
        </div>
        {locateError && <p className="mt-1 text-xs text-red-600">{locateError}</p>}
        {coords && (
          <>
            <p className="mt-1 text-xs text-emerald-600">Live location captured ✓</p>
            <MapPreview lat={coords.lat} lng={coords.lng} className="mt-2" />
          </>
        )}
      </div>

      <label className="block text-sm font-medium text-slate-700">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          Default pickup time
        </span>
        <input
          type="time"
          value={defaultPickupTime}
          onChange={(e) => setDefaultPickupTime(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </label>

      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit} icon={ArrowRight} iconPosition="right" className="flex-1">
          Create &amp; continue
        </Button>
      </div>
    </form>
  );
}
