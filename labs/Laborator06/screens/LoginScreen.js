import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ActivityIndicator,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = username.trim() !== '' && password !== '' && !loading;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onLogin(username.trim(), password); // dacă reușește, App schimbă ecranul
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
    // la succes nu mai apelăm setLoading: LoginScreen dispare din arbore
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bun venit</Text>
        <Text style={styles.subtitle}>Intră în cont pentru a continua</Text>

        <TextInput
          style={styles.input}
          placeholder="Nume de utilizator"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Parolă"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
          editable={!loading}
          onSubmitEditing={() => canSubmit && handleSubmit()}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Intră în cont</Text>
          )}
        </Pressable>

        <Text style={styles.hint}>Cont de test: emilys / emilyspass</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0B1F3A' },
  subtitle: { color: '#5A6B7B', marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: '#C9D6E0', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#0B1F3A',
  },
  error: { color: '#B0392F' },
  button: {
    backgroundColor: '#0B1F3A', borderRadius: 8, paddingVertical: 14,
    alignItems: 'center', marginTop: 4,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  hint: { color: '#5A6B7B', fontSize: 12, textAlign: 'center', marginTop: 8 },
});
