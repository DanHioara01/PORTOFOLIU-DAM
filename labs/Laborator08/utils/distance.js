const EARTH_RADIUS_M = 6371000; // raza medie a Pământului, în metri

const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Formula Haversine: distanța pe sferă între două puncte { latitude, longitude }
export function distanceMeters(a, b) {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

export function formatDistance(meters) {
  const rounded = Math.round(meters);
  return rounded < 1000 ? `${rounded} m` : `${(rounded / 1000).toFixed(1)} km`;
}

// Adaugă fiecărui loc câmpul distance și sortează crescător
export function sortByDistance(origin, places) {
  return places
    .map((place) => ({ ...place, distance: distanceMeters(origin, place) }))
    .sort((a, b) => a.distance - b.distance);
}
