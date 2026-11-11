const BASE_URL = 'https://dummyjson.com';

async function request(path, options) {
  const response = await fetch(BASE_URL + path, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Eroare server: ${response.status}`);
  }
  return data;
}

export function login(username, password) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
}

export function getMe(token) {
  return request('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
