// Cafenele FICTIVE, plasate la distanțe cunoscute (în metri, spre nord/est) față de poziția utilizatorului.

const OFFSETS = [
  { id: 'demo-1', name: 'Cafeneaua Demo Nord', north: 250, east: 100 },
  { id: 'demo-2', name: 'Espresso Demo', north: -400, east: 150 },
  { id: 'demo-3', name: 'Ceainăria Demo', north: 120, east: -700 },
  { id: 'demo-4', name: 'Bistro Demo', north: 900, east: 300 },
  { id: 'demo-5', name: 'Patiseria Demo', north: -150, east: -250 },
  { id: 'demo-6', name: 'Cafe Demo Sud', north: -1300, east: -200 },
];

const METERS_PER_DEGREE_LAT = 111320; // aproximativ, constant

export function generateDemoCafes({ latitude, longitude }) {
  const metersPerDegreeLon = METERS_PER_DEGREE_LAT * Math.cos((latitude * Math.PI) / 180);
  return OFFSETS.map((o) => ({
    id: o.id,
    name: o.name,
    latitude: latitude + o.north / METERS_PER_DEGREE_LAT,
    longitude: longitude + o.east / metersPerDegreeLon,
  }));
}
