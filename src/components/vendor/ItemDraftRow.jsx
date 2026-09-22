import { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '../common/Button';

function readPhoto(file, onLoaded) {
  const reader = new FileReader();
  reader.onload = () => onLoaded(reader.result);
  reader.readAsDataURL(file);
}

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20';

export function ItemDraftRow({ draft, onChange, onRemove, canRemove }) {
  const fileInputRef = useRef(null);
  const set = (field) => (e) => onChange({ ...draft, [field]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readPhoto(file, (dataUrl) => onChange({ ...draft, photo: dataUrl }));
  };

  const removePhoto = () => {
    onChange({ ...draft, photo: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="animate-fade-in space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="grid flex-1 grid-cols-2 gap-2.5">
          <label className="col-span-2 text-xs font-medium text-slate-600">
            Food type
            <input
              type="text"
              value={draft.foodType}
              onChange={set('foodType')}
              placeholder="e.g. Veg Biryani"
              className={inputClass}
            />
          </label>

          <label className="text-xs font-medium text-slate-600">
            Category
            <select value={draft.perishability} onChange={set('perishability')} className={inputClass}>
              <option value="high">Cooked / high-risk</option>
              <option value="low">Packaged / low-risk</option>
            </select>
          </label>

          <label className="text-xs font-medium text-slate-600">
            Quantity (kg)
            <input type="number" min="0" step="0.5" value={draft.qty} onChange={set('qty')} className={inputClass} />
          </label>

          <label className="text-xs font-medium text-slate-600">
            Prep time (min)
            <input type="number" min="0" value={draft.prepTime} onChange={set('prepTime')} className={inputClass} />
          </label>

          <label className="text-xs font-medium text-slate-600">
            Spoil window (min)
            <input
              type="number"
              min="1"
              value={draft.spoilMinutes}
              onChange={set('spoilMinutes')}
              className={inputClass}
            />
          </label>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove item"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" strokeWidth={2.25} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {draft.photo ? (
          <div className="relative">
            <img src={draft.photo} alt="preview" className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200" />
            <button
              type="button"
              onClick={removePhoto}
              aria-label="Remove photo"
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition-colors hover:bg-red-700"
            >
              <X className="h-3 w-3" strokeWidth={3} />
            </button>
          </div>
        ) : (
          <Button type="button" variant="secondary" size="sm" icon={Camera} onClick={() => fileInputRef.current?.click()}>
            Upload photo
          </Button>
        )}
        <span className="text-xs text-slate-400">Optional · kept on this device only</span>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
      </div>
    </div>
  );
}
