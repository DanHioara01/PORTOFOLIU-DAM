import { Platform } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';

// Pe Web nu există sistem de fișiere în sensul acesta: păstrăm URI-ul primit (valabil doar în sesiune).
const isWeb = Platform.OS === 'web';

// Folderul permanent al aplicației. Paths.document nu este golit de sistem (spre deosebire de Paths.cache).
function photosDirectory() {
  const dir = new Directory(Paths.document, 'photos');
  dir.create({ idempotent: true, intermediates: true });
  return dir;
}

function extensionOf(uri) {
  const match = /\.([a-zA-Z0-9]+)(?:\?.*)?$/.exec(uri);
  return match ? match[1] : 'jpg';
}

// Copiază fotografia din locul temporar în folderul permanent.
// Întoarce NUMELE fișierului (nu calea completă): calea absolută poate să se schimbe între versiuni ale aplicației.
export function persistPhoto(tempUri) {
  if (isWeb) return tempUri;
  const fileName = `${Date.now()}.${extensionOf(tempUri)}`;
  new File(tempUri).copy(new File(photosDirectory(), fileName));
  return fileName;
}

// Reconstruiește URI-ul de afișare din numele salvat
export function resolvePhotoUri(stored) {
  if (isWeb) return stored;
  return new File(photosDirectory(), stored).uri;
}

export function removePhoto(stored) {
  if (isWeb) return;
  try {
    const file = new File(photosDirectory(), stored);
    if (file.exists) file.delete();
  } catch {
    // fișierul lipsește deja: nu avem ce șterge
  }
}
