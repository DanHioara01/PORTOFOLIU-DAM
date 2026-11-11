import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'journal:entries';

// Salvăm doar metadatele (nume fișier, legendă, dată). Fotografiile rămân ca fișiere.
export async function loadEntries() {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveEntries(entries) {
  await AsyncStorage.setItem(KEY, JSON.stringify(entries));
}
