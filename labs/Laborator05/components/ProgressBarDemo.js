import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function ProgressBarDemo() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  // cât timp rulează, crește progresul cu 10% la fiecare 400 ms
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 100));
    }, 400);
    return () => clearInterval(id);
  }, [running]);

  // la 100%, oprește simularea
  useEffect(() => {
    if (progress >= 100) setRunning(false);
  }, [progress]);

  const start = () => {
    setProgress(0);
    setRunning(true);
  };

  return (
    <View style={styles.card}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.percent}>{progress}%</Text>
      <Pressable style={styles.buttonPrimary} onPress={start} disabled={running}>
        <Text style={styles.buttonPrimaryText}>
          {running ? 'Se încarcă...' : 'Start'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8 },
  track: { height: 14, backgroundColor: '#EAF6FC', borderRadius: 7, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#1C7293' },
  percent: { textAlign: 'center', fontWeight: 'bold', color: '#0B1F3A' },
  buttonPrimary: { backgroundColor: '#0B1F3A', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  buttonPrimaryText: { color: '#fff', fontWeight: 'bold' },
});
