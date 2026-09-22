import { useState } from 'react';
import { ListPlus, Plus } from 'lucide-react';
import { useStore } from '../../state/StoreContext';
import { ACTIONS } from '../../state/actionTypes';
import { ItemDraftRow } from './ItemDraftRow';
import { Button } from '../common/Button';
import { makeId } from '../../utils/id';

function emptyDraft() {
  return {
    key: makeId('draft'),
    foodType: '',
    perishability: 'high',
    qty: '',
    prepTime: '',
    spoilMinutes: '',
    photo: null,
  };
}

function isValidDraft(draft) {
  return (
    draft.foodType.trim().length > 0 &&
    Number(draft.qty) > 0 &&
    Number(draft.prepTime) >= 0 &&
    Number(draft.spoilMinutes) > 0
  );
}

export function MultiItemForm({ vendorId }) {
  const { dispatch } = useStore();
  const [drafts, setDrafts] = useState([emptyDraft()]);

  const updateDraft = (index, next) => {
    setDrafts((prev) => prev.map((d, i) => (i === index ? next : d)));
  };

  const removeDraft = (index) => {
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  };

  const addRow = () => setDrafts((prev) => [...prev, emptyDraft()]);

  const validDrafts = drafts.filter(isValidDraft);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validDrafts.length === 0) return;
    dispatch({
      type: ACTIONS.ADD_ITEMS,
      payload: {
        vendorId,
        items: validDrafts.map((d) => ({
          foodType: d.foodType.trim(),
          perishability: d.perishability,
          qty: Number(d.qty),
          prepTime: Number(d.prepTime),
          spoilMinutes: Number(d.spoilMinutes),
          photo: d.photo,
        })),
      },
    });
    setDrafts([emptyDraft()]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div>
        <h2 className="text-base font-semibold text-slate-900">Add surplus items</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Each item becomes its own listing on submit, sharing your location &amp; pickup time.
        </p>
      </div>

      {drafts.map((draft, i) => (
        <ItemDraftRow
          key={draft.key}
          draft={draft}
          onChange={(next) => updateDraft(i, next)}
          onRemove={() => removeDraft(i)}
          canRemove={drafts.length > 1}
        />
      ))}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button type="button" variant="secondary" icon={Plus} onClick={addRow}>
          Add another item
        </Button>
        <Button type="submit" icon={ListPlus} disabled={validDrafts.length === 0}>
          List {validDrafts.length || ''} item{validDrafts.length === 1 ? '' : 's'}
        </Button>
      </div>
    </form>
  );
}
