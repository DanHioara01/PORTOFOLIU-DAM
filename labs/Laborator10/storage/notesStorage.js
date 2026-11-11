import AsyncStorage from '@react-native-async-storage/async-storage';

const keyFor = (userId) => `notes:${userId}`;

export async function loadNotes(userId) {
  try {
    const json = await AsyncStorage.getItem(keyFor(userId));
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveNotes(userId, notes) {
  await AsyncStorage.setItem(keyFor(userId), JSON.stringify(notes));
}
