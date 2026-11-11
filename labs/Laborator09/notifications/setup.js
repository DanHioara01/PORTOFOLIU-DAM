import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const CHANNEL_ID = 'reminders';

const isWeb = Platform.OS === 'web';

// Handler-ul pentru notificările primite cât timp aplicația este deschisă.
if (!isWeb) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

const isAllowed = (settings) =>
  settings.granted ||
  settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

// Canalul se creează ÎNAINTE de cererea permisiunii:
// pe Android 13+ dialogul apare abia după ce există un canal.
export async function ensureNotificationPermission() {
  if (isWeb) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Remindere',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  let settings = await Notifications.getPermissionsAsync();
  if (!isAllowed(settings)) {
    settings = await Notifications.requestPermissionsAsync();
  }
  return isAllowed(settings);
}
