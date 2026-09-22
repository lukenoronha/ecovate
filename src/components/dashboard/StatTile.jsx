const ACCENT = {
  emerald: { icon: 'bg-emerald-100 text-emerald-600' },
  red: { icon: 'bg-red-100 text-red-600' },
};

export function StatTile({ label, value, caption, accent = 'emerald', icon: Icon }) {
  const colors = ACCENT[accent];
  return (
    <div className="animate-slide-up rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {Icon && (
          <span className={`flex h-7 w-7 items-center justify-center rounded-full ${colors.icon}`}>
            <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
          </span>
        )}
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{value}</div>
      {caption && <div className="mt-0.5 text-xs text-slate-400">{caption}</div>}
    </div>
  );
}
