import { useState } from 'react';
import { View, Text, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import JournalScreen from './screens/JournalScreen';
import ScannerScreen from './screens/ScannerScreen';

export default function App() {
  const [tab, setTab] = useState('journal');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, tab === 'journal' && styles.tabActive]}
          onPress={() => setTab('journal')}
        >
          <Text style={[styles.tabText, tab === 'journal' && styles.tabTextActive]}>Jurnal</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === 'scanner' && styles.tabActive]}
          onPress={() => setTab('scanner')}
        >
          <Text style={[styles.tabText, tab === 'scanner' && styles.tabTextActive]}>Scanner QR</Text>
        </Pressable>
      </View>

      {/* Randare condiționată: ScannerScreen dispare din arbore când schimbăm tab-ul,
          deci camera este eliberată (o singură previzualizare poate fi activă) */}
      {tab === 'journal' ? <JournalScreen /> : <ScannerScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EAF6FC' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#1C7293' },
  tabText: { color: '#5A6B7B', fontWeight: '600' },
  tabTextActive: { color: '#0B1F3A' },
});
