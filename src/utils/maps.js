// OpenStreetMap needs no API key, unlike Google Maps -- good fit for a
// no-backend hackathon build with a real (not mocked) coordinate.

export function osmViewUrl(lat, lng) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
}

export function osmEmbedUrl(lat, lng, delta = 0.006) {
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${lat},${lng}&layer=mapnik`;
}
