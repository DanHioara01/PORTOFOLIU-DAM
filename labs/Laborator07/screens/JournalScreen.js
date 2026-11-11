import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Pressable, Image, FlatList, Alert,
  Platform, Linking, Modal, useWindowDimensions, ActivityIndicator, StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { loadEntries, saveEntries } from '../storage/entriesStorage';
import { persistPhoto, resolvePhotoUri, removePhoto } from '../storage/photoStore';

const COLUMNS = 3;
const GAP = 8;

export default function JournalScreen() {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [caption, setCaption] = useState('');
  const [selected, setSelected] = useState(null);
  const { width } = useWindowDimensions();

  const tileSize = Math.floor((width - 32 - GAP * (COLUMNS - 1)) / COLUMNS);

  // Citire la pornire
  useEffect(() => {
    loadEntries().then((list) => {
      setEntries(list);
      setLoaded(true);
    });
  }, []);

  // Salvare la fiecare modificare, dar numai după citire (altfel am suprascrie datele cu o listă goală)
  useEffect(() => {
    if (loaded) saveEntries(entries);
  }, [entries, loaded]);

  const addEntry = (result) => {
    if (result.canceled) return;
    let file;
    try {
      file = persistPhoto(result.assets[0].uri); // temporar -> permanent
    } catch (err) {
      Alert.alert('Nu am putut salva fotografia', err.message);
      return;
    }
    setEntries((prev) => [
      {
        id: String(Date.now()),
        file,
        caption: caption.trim() || 'Fără legendă',
        createdAt: new Date().toLocaleString('ro-RO'),
      },
      ...prev,
    ]);
    setCaption('');
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    addEntry(result);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permisiune necesară',
        'Aplicația are nevoie de cameră pentru a face fotografii.',
        permission.canAskAgain
          ? [{ text: 'Am înțeles' }]
          : [
              { text: 'Anulează', style: 'cancel' },
              { text: 'Deschide setările', onPress: () => Linking.openSettings() },
            ]
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    addEntry(result);
  };

  const confirmDelete = (entry) => {
    const remove = () => {
      removePhoto(entry.file);
      setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    };
    if (Platform.OS === 'web') {
      remove();
      return;
    }
    Alert.alert('Ștergi fotografia?', entry.caption, [
      { text: 'Nu', style: 'cancel' },
      { text: 'Da', style: 'destructive', onPress: remove },
    ]);
  };

  if (!loaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jurnal foto</Text>

      <TextInput
        style={styles.input}
        placeholder="Legenda următoarei fotografii"
        value={caption}
        onChangeText={setCaption}
      />

      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.buttonPrimary]} onPress={pickFromLibrary}>
          <Text style={styles.buttonPrimaryText}>Din galerie</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.buttonOutline]} onPress={takePhoto}>
          <Text style={styles.buttonOutlineText}>Cu camera</Text>
        </Pressable>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        numColumns={COLUMNS}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{ gap: GAP, paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles.muted}>Nicio fotografie încă. Adaugă prima!</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelected(item)}
            onLongPress={() => confirmDelete(item)}
          >
            <Image
              source={{ uri: resolvePhotoUri(item.file) }}
              style={{ width: tileSize, height: tileSize, borderRadius: 6 }}
            />
          </Pressable>
        )}
      />

      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setSelected(null)}>
          {selected && (
            <>
              <Image
                source={{ uri: resolvePhotoUri(selected.file) }}
                style={styles.modalImage}
                resizeMode="contain"
              />
              <Text style={styles.modalCaption}>{selected.caption}</Text>
              <Text style={styles.modalDate}>{selected.createdAt}</Text>
            </>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0B1F3A', marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: '#C9D6E0', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, color: '#0B1F3A',
  },
  actions: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  button: { flex: 1, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#0B1F3A' },
  buttonPrimaryText: { color: '#fff', fontWeight: 'bold' },
  buttonOutline: { borderWidth: 2, borderColor: '#0B1F3A' },
  buttonOutlineText: { color: '#0B1F3A', fontWeight: 'bold' },
  muted: { color: '#5A6B7B', textAlign: 'center', paddingVertical: 24 },
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center', padding: 16,
  },
  modalImage: { width: '100%', height: '70%' },
  modalCaption: { color: '#fff', fontSize: 17, fontWeight: '600', textAlign: 'center', marginTop: 12 },
  modalDate: { color: '#C9D6E0', textAlign: 'center', marginTop: 4 },
});
