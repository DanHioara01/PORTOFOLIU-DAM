const ENDPOINT = 'https://overpass-api.de/api/interpreter';

// Caută în OpenStreetMap nodurile cu amenity=cafe într-o rază (în metri) în jurul poziției
export async function fetchCafes({ latitude, longitude }, radius = 1500, signal) {
  const query =
    `[out:json][timeout:15];` +
    `node["amenity"="cafe"](around:${radius},${latitude},${longitude});` +
    `out;`;

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'DAM-curs-laborator-8/1.0',
    },
    body: 'data=' + encodeURIComponent(query),
    signal,
  });
  if (!response.ok) throw new Error(`Serviciul OpenStreetMap a răspuns cu ${response.status}`);

  const data = await response.json();
  return data.elements.map((el) => ({
    id: String(el.id),
    name: el.tags?.name ?? 'Cafenea fără nume',
    latitude: el.lat,
    longitude: el.lon,
  }));
}
