import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, FlatList, StyleSheet,
} from 'react-native';
import { useNotes, useNotesActions } from '../context/NotesContext';
import { useTheme } from '../context/ThemeContext';

export default function NotesScreen() {
  const { notes, loaded } = useNotes();
  const { addNote, deleteNote } = useNotesActions();
  const { colors } = useTheme();
  const [text, setText] = useState('');

  const add = () => {
    if (text.trim() === '') return;
    addNote(text.trim());
    setText('');
  };

  if (!loaded) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.muted }}>Se încarcă notițele...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.composer, { borderBottomColor: colors.card }]}>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Scrie o notiță..."
          placeholderTextColor={colors.muted}
          value={text}
          onChangeText={setText}
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <Pressable style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={add}>
          <Text style={styles.addButtonText}>Adaugă</Text>
        </Pressable>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.muted, { color: colors.muted }]}>Nu ai nicio notiță.</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.noteRow, { backgroundColor: colors.card }]}>
            <Text style={[styles.noteText, { color: colors.text }]}>{item.text}</Text>
            <Pressable onPress={() => deleteNote(item.id)} hitSlop={8}>
              <Text style={[styles.delete, { color: colors.danger }]}>Șterge</Text>
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
  muted: { textAlign: 'center', padding: 16 },
  composer: {
    flexDirection: 'row', gap: 8, padding: 12,
    borderBottomWidth: 1,
  },
  input: {
    flex: 1, borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, fontSize: 15,
  },
  addButton: { borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  list: { padding: 12, gap: 8 },
  noteRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 8, padding: 12,
  },
  noteText: { flex: 1, fontSize: 15 },
  delete: { fontWeight: '600', fontSize: 13 },
});
