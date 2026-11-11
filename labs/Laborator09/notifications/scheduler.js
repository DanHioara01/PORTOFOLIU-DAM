import * as Notifications from 'expo-notifications';
import { CHANNEL_ID } from './setup';

const { SchedulableTriggerInputTypes } = Notifications;

// O singură dată, la o dată și oră exacte (Date)
export function scheduleOnce(title, date) {
  return Notifications.scheduleNotificationAsync({
    content: { title: 'Reminder', body: title, data: { title, kind: 'once' } },
    trigger: { type: SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL_ID },
  });
}

// În fiecare zi, la ora și minutul indicate
export function scheduleDaily(title, hour, minute) {
  return Notifications.scheduleNotificationAsync({
    content: { title: 'Reminder', body: title, data: { title, kind: 'daily' } },
    trigger: { type: SchedulableTriggerInputTypes.DAILY, hour, minute, channelId: CHANNEL_ID },
  });
}
