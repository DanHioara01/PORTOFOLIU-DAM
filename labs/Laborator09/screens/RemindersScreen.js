import { useCallback, useEffect, useState } from 'react';
import {
  View, Text, TextInput, Pressable, FlatList, Alert, Platform, StyleSheet,
} from 'react-native';
import * as Notifications from 'expo-notifications';

import { ensureNotificationPermission } from '../notifications/setup';
import { scheduleOnce, scheduleDaily } from '../notifications/scheduler';
import { loadReminders, saveReminders } from '../storage/remindersStorage';

const isWeb = Platform.OS === 'web';

const formatReminder = (r) => {
  if (r.kind === 'daily') {
    return `zilnic la ${String(r.hour).padStart(2, '0')}:${String(r.minute).padStart(2, '0')}`;
  }
  return `o dată, ${new Date(r.fireAt).toLocaleString('ro-RO')}`;
};

export default function RemindersScreen() {
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState('once'); // once | daily
  const [minutes, setMinutes] = useState('1');
  const [hour, setHour] = useState('9');
  const [minute, setMinute] = useState('0');

  const [reminders, setReminders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [opened, setOpened] = useState(null);

  const reconcile = useCallback(async (saved) => {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const ids = new Set(scheduled.map((n) => n.identifier));
    return saved.filter((r) => ids.has(r.id));
  }, []);

  useEffect(() => {
    if (isWeb) {
      setLoaded(true);
      return;
    }

    let active = true;

    loadReminders().then(async (saved) => {
      const kept = await reconcile(saved);
      if (active) {
        setReminders(kept);
        setLoaded(true);
      }
    });

    // notificare primită cât timp aplicația este deschisă: scoatem reminderul "o dată" tocmai declanșat
    const received = Notifications.addNotificationReceivedListener((n) => {
      if (n.request.content.data?.kind === 'once') {
        setReminders((prev) => prev.filter((r) => r.id !== n.request.identifier));
      }
    });

    // utilizatorul a atins notificarea
    const response = Notifications.addNotificationResponseReceivedListener((r) => {
      setOpened(r.notification.request.content.data?.title ?? null);
    });

    return () => {
      active = false;
      received.remove();
      response.remove();
    };
  }, [reconcile]);

  // Salvare după fiecare modificare, doar după citire
  useEffect(() => {
    if (!isWeb && loaded) saveReminders(reminders);
  }, [reminders, loaded]);

  const handleAdd = async () => {
    const text = title.trim();
    if (text === '') return;

    // validare: nu programăm cu valori fără sens
    const h = Number(hour);
    const m = Number(minute);
    const mins = Number(minutes);

    if (kind === 'daily' && !(Number.isInteger(h) && h >= 0 && h <= 23 && Number.isInteger(m) && m >= 0 && m <= 59)) {
      Alert.alert('Oră invalidă', 'Ora trebuie să fie între 0 și 23, iar minutul între 0 și 59.');
      return;
    }
    if (kind === 'once' && !(Number.isFinite(mins) && mins >= 1)) {
      Alert.alert('Valoare invalidă', 'Introdu un număr de minute mai mare sau egal cu 1.');
      return;
    }

    if (!(await ensureNotificationPermission())) {
      Alert.alert(
        'Permisiune necesară',
        'Fără permisiunea pentru notificări, reminderele nu pot fi afișate.'
      );
      return;
    }

    let reminder;
    if (kind === 'daily') {
      const id = await scheduleDaily(text, h, m);
      reminder = { id, title: text, kind, hour: h, minute: m };
    } else {
      const fireAt = Date.now() + mins * 60 * 1000;
      const id = await scheduleOnce(text, new Date(fireAt));
      reminder = { id, title: text, kind, fireAt };
    }

    setReminders((prev) => [reminder, ...prev]);
    setTitle('');
  };

  const handleRemove = async (reminder) => {
    await Notifications.cancelScheduledNotificationAsync(reminder.id);
    setReminders((prev) => prev.filter((r) => r.id !== reminder.id));
  };

  if (isWeb) {
    return (
      <View style={styles.center}>
        <Text style={styles.webMessage}>
          Notificările locale se testează doar pe telefon, cu Expo Go. În browser nu se programează nimic.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Remindere</Text>

      {opened && <Text style={styles.opened}>Ai deschis reminderul: {opened}</Text>}
      {!loaded && <Text style={styles.muted}>Se încarcă reminderele...</Text>}

      <TextInput
        style={styles.input}
        placeholder="Ce să îți reamintesc?"
        value={title}
        onChangeText={setTitle}
      />

      <View style={styles.kindRow}>
        <Pressable
          style={[styles.chip, kind === 'once' && styles.chipActive]}
          onPress={() => setKind('once')}
        >
          <Text style={[styles.chipText, kind === 'once' && styles.chipTextActive]}>O dată</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, kind === 'daily' && styles.chipActive]}
          onPress={() => setKind('daily')}
        >
          <Text style={[styles.chipText, kind === 'daily' && styles.chipTextActive]}>Zilnic</Text>
        </Pressable>
      </View>

      {kind === 'once' ? (
        <View style={styles.row}>
          <Text style={styles.label}>Peste (minute)</Text>
          <TextInput
            style={[styles.input, styles.smallInput]}
            keyboardType="number-pad"
            value={minutes}
            onChangeText={setMinutes}
          />
        </View>
      ) : (
        <View style={styles.row}>
          <Text style={styles.label}>Ora</Text>
          <TextInput
            style={[styles.input, styles.smallInput]}
            keyboardType="number-pad"
            value={hour}
            onChangeText={setHour}
          />
          <Text style={styles.label}>:</Text>
          <TextInput
            style={[styles.input, styles.smallInput]}
            keyboardType="number-pad"
            value={minute}
            onChangeText={setMinute}
          />
        </View>
      )}

      <Pressable style={styles.buttonPrimary} onPress={handleAdd}>
        <Text style={styles.buttonPrimaryText}>Programează</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Programate ({reminders.length})</Text>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
        ListEmptyComponent={
          loaded ? <Text style={styles.muted}>Nimic programat.</Text> : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.muted}>{formatReminder(item)}</Text>
            </View>
            <Pressable onPress={() => handleRemove(item)} hitSlop={8}>
              <Text style={styles.danger}>Șterge</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  webMessage: { color: '#5A6B7B', textAlign: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0B1F3A', marginBottom: 12 },
  opened: { color: '#1C7293', fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#C9D6E0', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, color: '#0B1F3A',
  },
  kindRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  chip: {
    borderWidth: 1, borderColor: '#C9D6E0', borderRadius: 16,
    paddingVertical: 6, paddingHorizontal: 14,
  },
  chipActive: { backgroundColor: '#0B1F3A', borderColor: '#0B1F3A' },
  chipText: { color: '#0B1F3A', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  label: { color: '#5A6B7B' },
  smallInput: { width: 72 },
  buttonPrimary: {
    backgroundColor: '#0B1F3A', borderRadius: 8,
    paddingVertical: 12, alignItems: 'center', marginTop: 12,
  },
  buttonPrimaryText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { color: '#0B1F3A', fontWeight: '600', marginTop: 20, marginBottom: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F4FAFD', borderRadius: 8, padding: 12,
  },
  cardTitle: { color: '#0B1F3A', fontWeight: '600' },
  muted: { color: '#5A6B7B', fontSize: 13 },
  danger: { color: '#B0392F', fontWeight: '600', fontSize: 13 },
});
