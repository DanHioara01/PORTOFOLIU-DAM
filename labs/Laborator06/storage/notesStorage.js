import AsyncStorage from '@react-native-async-storage/async-storage';

// Fiecare utilizator are cheia lui: notițele lui emilys nu se amestecă cu ale altcuiva
const keyFor = (userId) => `notes:${userId}`;

export async function loadNotes(userId) {
  try {
    const json = await AsyncStorage.getItem(keyFor(userId));
    return json ? JSON.parse(json) : [];
  } catch {
    return []; // date lipsă sau corupte: pornim cu listă goală
  }
}

export async function saveNotes(userId, notes) {
  await AsyncStorage.setItem(keyFor(userId), JSON.stringify(notes));
}
