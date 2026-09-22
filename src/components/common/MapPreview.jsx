import { osmEmbedUrl, osmViewUrl } from '../../utils/maps';

/** A small live (real, un-mocked) OpenStreetMap embed pinned at lat/lng. No API key needed. */
export function MapPreview({ lat, lng, className = '' }) {
  if (lat == null || lng == null) return null;

  return (
    <a
      href={osmViewUrl(lat, lng)}
      target="_blank"
      rel="noreferrer"
      className={`block overflow-hidden rounded-lg border border-slate-200 ${className}`}
      title="Open in OpenStreetMap"
    >
      <iframe
        title="Location map"
        src={osmEmbedUrl(lat, lng)}
        className="h-32 w-full"
        style={{ border: 0, pointerEvents: 'none' }}
        loading="lazy"
      />
    </a>
  );
}
