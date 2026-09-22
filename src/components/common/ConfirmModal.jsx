import { TriangleAlert } from 'lucide-react';
import { Button } from './Button';

// Generic confirmation modal used on every destructive action: vendor
// cancelling a listing, an NGO cancelling a claim.
export function ConfirmModal({ open, title, description, confirmLabel = 'Confirm', danger = true, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-[2px] sm:items-center"
      onClick={onCancel}
    >
      <div
        className="animate-scale-in w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex gap-3">
          {danger && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <TriangleAlert className="h-5 w-5" strokeWidth={2.25} />
            </span>
          )}
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {description && <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>}
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Go back
          </Button>
          <Button variant={danger ? 'dangerSolid' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
