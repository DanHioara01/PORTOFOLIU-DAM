import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'reminders';

// Salvăm lista noastră de remindere (cu identificatorul primit de la sistem).
// Sistemul de operare ține notificările programate; lista noastră ține DETALIILE de afișat.
export async function loadReminders() {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveReminders(reminders) {
  await AsyncStorage.setItem(KEY, JSON.stringify(reminders));
}
