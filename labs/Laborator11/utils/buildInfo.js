// Logică pură, fără React: se poate testa cu `node` după transpilare sau în Snack.

// Ce înseamnă valoarea Constants.executionEnvironment.
export function runtimeLabel(executionEnvironment) {
  switch (executionEnvironment) {
    case 'storeClient':
      return 'Expo Go sau development build';
    case 'standalone':
      return 'Build de release (standalone)';
    case 'bare':
      return 'Proiect nativ (bare)';
    default:
      return `Necunoscut: ${executionEnvironment ?? '—'}`;
  }
}

// „1.0.0 (3)”; dacă lipsește codul de build, doar versiunea.
export function formatVersion(version, buildCode) {
  const v = version ? String(version) : '?';
  const hasCode = buildCode !== null && buildCode !== undefined && String(buildCode) !== '';
  return hasCode ? `${v} (${buildCode})` : v;
}

// Eticheta mediului din variabila EXPO_PUBLIC_APP_ENV; valorile necunoscute sunt semnalate, nu ascunse.
export function envLabel(raw) {
  const v = (raw ?? '').trim().toLowerCase();
  if (v === '') return 'nesetat';
  if (v === 'local' || v === 'preview' || v === 'production') return v;
  return `necunoscut (${raw})`;
}

// Gazda dintr-un URL, fără a depinde de clasa URL.
export function hostOf(url) {
  const m = /^https?:\/\/([^/:?#]+)/i.exec((url ?? '').trim());
  return m ? m[1].toLowerCase() : null;
}
