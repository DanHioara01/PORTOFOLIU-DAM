import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

export default function HomeScreen({ user, noteCount, onLogout, navigation }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.image }} style={styles.avatar} />
      <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
      <Text style={styles.muted}>@{user.username}</Text>
      <Text style={styles.muted}>{user.email}</Text>

      <Pressable style={styles.notesButton} onPress={() => navigation.navigate('Notes')}>
        <Text style={styles.notesButtonText}>Notițele mele ({noteCount})</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Ieșire din cont</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24, gap: 6 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#EAF6FC', marginBottom: 8 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#0B1F3A' },
  muted: { color: '#5A6B7B' },
  notesButton: {
    marginTop: 24, backgroundColor: '#1C7293', borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 24,
  },
  notesButtonText: { color: '#fff', fontWeight: 'bold' },
  logoutButton: { marginTop: 8, paddingVertical: 8, paddingHorizontal: 24 },
  logoutText: { color: '#B0392F', fontWeight: '600' },
});
