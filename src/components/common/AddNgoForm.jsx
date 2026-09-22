import { useState } from 'react';
import { ArrowRight, HeartHandshake } from 'lucide-react';
import { useStore } from '../../state/StoreContext';
import { ACTIONS } from '../../state/actionTypes';
import { makeId } from '../../utils/id';
import { Button } from './Button';

/** Registers a brand-new NGO alongside the seeded demo NGOs, then selects it. */
export function AddNgoForm({ onCreated, onCancel }) {
  const { dispatch } = useStore();
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('medium');
  const [reliabilityScore, setReliabilityScore] = useState(75);

  const canSubmit = name.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const id = makeId('ngo');
    dispatch({
      type: ACTIONS.CREATE_NGO,
      payload: { id, name: name.trim(), capacity, reliabilityScore: Number(reliabilityScore) },
    });
    onCreated(id);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-scale-in space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
          <HeartHandshake className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <h3 className="text-base font-semibold text-slate-900">Register a new NGO</h3>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        NGO name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Hope Foundation"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Capacity
        <select
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Starting reliability score ({reliabilityScore})
        <input
          type="range"
          min="0"
          max="100"
          value={reliabilityScore}
          onChange={(e) => setReliabilityScore(e.target.value)}
          className="mt-2 w-full accent-emerald-600"
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
