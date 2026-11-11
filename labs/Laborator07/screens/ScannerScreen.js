import { useState } from 'react';
import {
  View, Text, Pressable, Alert, Linking, Platform, StyleSheet,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(null);

  if (!permission) return <View style={styles.center} />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Scanarea codurilor QR are nevoie de acces la cameră.</Text>
        <Pressable
          style={styles.buttonPrimary}
          onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}
        >
          <Text style={styles.buttonPrimaryText}>
            {permission.canAskAgain ? 'Permite camera' : 'Deschide setările'}
          </Text>
        </Pressable>
      </View>
    );
  }

  const isLink = scanned && /^https?:\/\//i.test(scanned.data);

  const openLink = () => {
    const go = () => Linking.openURL(scanned.data);
    if (Platform.OS === 'web') {
      // Alert cu butoane multiple nu funcționează pe Web: cerem confirmarea browserului
      if (window.confirm(`Deschizi linkul?\n\n${scanned.data}`)) go();
      return;
    }
    Alert.alert('Deschizi linkul?', scanned.data, [
      { text: 'Nu', style: 'cancel' },
      { text: 'Da', onPress: go },
    ]);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        // după prima citire oprim ascultarea: cât timp codul rămâne în cadru, evenimentul s-ar repeta
        onBarcodeScanned={scanned ? undefined : ({ data, type }) => setScanned({ data, type })}
      />

      <View style={styles.panel}>
        {scanned ? (
          <>
            <Text style={styles.label}>Conținut scanat ({scanned.type}):</Text>
            <Text style={styles.data} selectable>{scanned.data}</Text>
            {isLink && (
              <Pressable style={styles.buttonPrimary} onPress={openLink}>
                <Text style={styles.buttonPrimaryText}>Deschide linkul</Text>
              </Pressable>
            )}
            <Pressable style={styles.buttonOutline} onPress={() => setScanned(null)}>
              <Text style={styles.buttonOutlineText}>Scanează din nou</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.message}>Îndreaptă camera spre un cod QR.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  camera: { flex: 1 },
  panel: { padding: 16, gap: 8, backgroundColor: '#fff' },
  label: { color: '#5A6B7B', fontSize: 13 },
  data: { color: '#0B1F3A', fontSize: 16, fontWeight: '600' },
  message: { color: '#5A6B7B', textAlign: 'center' },
  buttonPrimary: {
    backgroundColor: '#0B1F3A', borderRadius: 8,
    paddingVertical: 12, alignItems: 'center', marginTop: 4,
  },
  buttonPrimaryText: { color: '#fff', fontWeight: 'bold' },
  buttonOutline: {
    borderWidth: 2, borderColor: '#0B1F3A', borderRadius: 8,
    paddingVertical: 12, alignItems: 'center',
  },
  buttonOutlineText: { color: '#0B1F3A', fontWeight: 'bold' },
});
