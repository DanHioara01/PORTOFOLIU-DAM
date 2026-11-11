const BASE_URL = 'https://dummyjson.com';

// Cerere generică: aruncă o eroare cu mesajul serverului dacă răspunsul nu este 2xx
async function request(path, options) {
  const response = await fetch(BASE_URL + path, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Eroare server: ${response.status}`);
  }
  return data;
}

// POST /auth/login -> { id, username, firstName, ..., accessToken, refreshToken }
export function login(username, password) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
}

// GET /auth/me -> profilul utilizatorului căruia îi aparține tokenul
export function getMe(token) {
  return request('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
