const COLOR = {
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
};

/** A small pulsing dot signalling "this is live right now". */
export function LiveDot({ color = 'blue', className = '' }) {
  return (
    <span className={`relative flex h-2 w-2 shrink-0 ${className}`}>
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${COLOR[color]}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${COLOR[color]}`} />
    </span>
  );
}
