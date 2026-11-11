import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';
const isWeb = Platform.OS === 'web';

export async function saveToken(token) {
  if (isWeb) return AsyncStorage.setItem(TOKEN_KEY, token);
  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function loadToken() {
  if (isWeb) return AsyncStorage.getItem(TOKEN_KEY);
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  if (isWeb) return AsyncStorage.removeItem(TOKEN_KEY);
  return SecureStore.deleteItemAsync(TOKEN_KEY);
}
