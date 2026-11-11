import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import * as Application from 'expo-application';

import { runtimeLabel, formatVersion, envLabel, hostOf } from './utils/buildInfo';

// Referire statică: EXPO_PUBLIC_* sunt înlocuite la împachetare
const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Referire dinamică: documentația spune că NU este înlocuită. Notați ce afișează.
const name = 'EXPO_PUBLIC_APP_ENV';
const DYNAMIC = process.env[name];

const show = (value) => (value === null || value === undefined ? '—' : String(value));

export default function App() {
  const rows = [
    ['Mediu (APP_ENV)', envLabel(APP_ENV)],
    ['API', API_URL ?? '—'],
    ['Gazda API', hostOf(API_URL) ?? '—'],
    ['Referire dinamică', show(DYNAMIC)],
    ['Mediu de execuție', runtimeLabel(Constants.executionEnvironment)],
    ['Versiune', formatVersion(Application.nativeApplicationVersion, Application.nativeBuildVersion)],
    ['ID aplicație', Application.applicationId],
    ['Platformă', Platform.OS],
    ['__DEV__', show(__DEV__)],
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informații despre build</Text>
      <ScrollView style={styles.table}>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{show(value)}</Text>
          </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 64, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  table: { flexGrow: 0 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e5e5e5',
  },
  label: { fontSize: 15, color: '#555', flex: 1 },
  value: { fontSize: 15, fontWeight: '600', flex: 1, textAlign: 'right' },
});
