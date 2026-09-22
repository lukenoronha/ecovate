import { STATUS_META, DEFAULT_STATUS_META } from '../../utils/statusMeta';

export function StatusBadge({ status, className = '' }) {
  const meta = STATUS_META[status] ?? DEFAULT_STATUS_META;
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-300 ${meta.badgeClass} ${className}`}
    >
      {Icon && <Icon className="h-3 w-3" strokeWidth={2.5} />}
      {meta.label || status}
    </span>
  );
}
