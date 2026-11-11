import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const format = (total) => {
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
};

export default function StopwatchDemo() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const reset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.clock}>{format(seconds)}</Text>
      <View style={styles.buttonsRow}>
        <Pressable style={styles.buttonPrimary} onPress={() => setIsRunning(true)}>
          <Text style={styles.buttonPrimaryText}>Start</Text>
        </Pressable>
        <Pressable style={styles.buttonOutline} onPress={() => setIsRunning(false)}>
          <Text style={styles.buttonOutlineText}>Stop</Text>
        </Pressable>
        <Pressable style={styles.buttonOutline} onPress={reset}>
          <Text style={styles.buttonOutlineText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  clock: { fontSize: 48, fontWeight: 'bold', textAlign: 'center', color: '#0B1F3A' },
  buttonsRow: { flexDirection: 'row', gap: 10 },
  buttonPrimary: { flex: 1, backgroundColor: '#0B1F3A', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  buttonPrimaryText: { color: '#fff', fontWeight: 'bold' },
  buttonOutline: { flex: 1, borderWidth: 2, borderColor: '#0B1F3A', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  buttonOutlineText: { color: '#0B1F3A', fontWeight: 'bold' },
});
