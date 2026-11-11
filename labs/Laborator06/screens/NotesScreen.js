import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, FlatList, StyleSheet,
} from 'react-native';

export default function NotesScreen({ notes, loaded, onAdd, onDelete }) {
  const [text, setText] = useState('');

  const add = () => {
    if (text.trim() === '') return; // notiță goală sau doar spații: nu adăugăm
    onAdd(text);
    setText('');
  };

  if (!loaded) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Se încarcă notițele...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Scrie o notiță..."
          value={text}
          onChangeText={setText}
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <Pressable style={styles.addButton} onPress={add}>
          <Text style={styles.addButtonText}>Adaugă</Text>
        </Pressable>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.muted}>Nu ai nicio notiță.</Text>}
        renderItem={({ item }) => (
          <View style={styles.noteRow}>
            <Text style={styles.noteText}>{item.text}</Text>
            <Pressable onPress={() => onDelete(item.id)} hitSlop={8}>
              <Text style={styles.delete}>Șterge</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  muted: { color: '#5A6B7B', textAlign: 'center', padding: 16 },
  composer: {
    flexDirection: 'row', gap: 8, padding: 12,
    borderBottomWidth: 1, borderBottomColor: '#EAF6FC',
  },
  input: {
    flex: 1, borderWidth: 1, borderColor: '#C9D6E0', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, color: '#0B1F3A',
  },
  addButton: {
    backgroundColor: '#0B1F3A', borderRadius: 8,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  list: { padding: 12, gap: 8 },
  noteRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F4FAFD', borderRadius: 8, padding: 12,
  },
  noteText: { flex: 1, color: '#0B1F3A', fontSize: 15 },
  delete: { color: '#B0392F', fontWeight: '600', fontSize: 13 },
});
