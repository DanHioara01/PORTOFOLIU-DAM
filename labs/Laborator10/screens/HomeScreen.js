import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { useTheme } from '../context/ThemeContext';

// Nicio proprietate de la părinte, în afară de navigation:
// tot ce are nevoie vine din contexte
export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { notes } = useNotes();
  const { mode, colors, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: user.image }} style={[styles.avatar, { backgroundColor: colors.card }]} />
      <Text style={[styles.name, { color: colors.text }]}>
        {user.firstName} {user.lastName}
      </Text>
      <Text style={{ color: colors.muted }}>@{user.username}</Text>
      <Text style={{ color: colors.muted }}>{user.email}</Text>

      <Pressable
        style={[styles.notesButton, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate('Notes')}
      >
        <Text style={styles.notesButtonText}>Notițele mele ({notes.length})</Text>
      </Pressable>

      <Pressable
        style={[styles.outlineButton, { borderColor: colors.primary }]}
        onPress={toggleTheme}
      >
        <Text style={[styles.outlineText, { color: colors.primary }]}>
          {mode === 'light' ? 'Temă întunecată' : 'Temă luminoasă'}
        </Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={signOut}>
        <Text style={[styles.logoutText, { color: colors.danger }]}>Ieșire din cont</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24, gap: 6 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 8 },
  name: { fontSize: 22, fontWeight: 'bold' },
  notesButton: {
    marginTop: 24, borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 24,
  },
  notesButtonText: { color: '#fff', fontWeight: 'bold' },
  outlineButton: {
    marginTop: 8, borderWidth: 2, borderRadius: 8,
    paddingVertical: 10, paddingHorizontal: 24,
  },
  outlineText: { fontWeight: 'bold' },
  logoutButton: { marginTop: 8, paddingVertical: 8, paddingHorizontal: 24 },
  logoutText: { fontWeight: '600' },
});
