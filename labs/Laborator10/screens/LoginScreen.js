import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ActivityIndicator,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { colors } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = username.trim() !== '' && password !== '' && !loading;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn(username.trim(), password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Bun venit</Text>
        <Text style={{ color: colors.muted, marginBottom: 12 }}>
          Intră în cont pentru a continua
        </Text>

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Nume de utilizator"
          placeholderTextColor={colors.muted}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Parolă"
          placeholderTextColor={colors.muted}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
          editable={!loading}
          onSubmitEditing={() => canSubmit && handleSubmit()}
        />

        {error && <Text style={{ color: colors.danger }}>{error}</Text>}

        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }, !canSubmit && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Intră în cont</Text>
          )}
        </Pressable>

        <Text style={[styles.hint, { color: colors.muted }]}>
          Cont de test: emilys / emilyspass
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: 'bold' },
  input: {
    borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16,
  },
  button: {
    borderRadius: 8, paddingVertical: 14,
    alignItems: 'center', marginTop: 4,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  hint: { fontSize: 12, textAlign: 'center', marginTop: 8 },
});
