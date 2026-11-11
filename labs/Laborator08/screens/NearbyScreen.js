import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, FlatList, Pressable, ActivityIndicator, Linking, StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';

import { sortByDistance, formatDistance } from '../utils/distance';
import { generateDemoCafes } from '../data/demoCafes';
import { fetchCafes } from '../api/overpass';
import { useLivePosition } from '../hooks/useLivePosition';
import MapPanel from '../components/MapPanel';

const openDirections = (cafe) =>
  Linking.openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${cafe.latitude},${cafe.longitude}`
  );

export default function NearbyScreen() {
  const [status, setStatus] = useState('idle'); // idle | locating | denied | blocked | error | ready
  const [position, setPosition] = useState(null);
  const [rawCafes, setRawCafes] = useState([]);
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState('list'); // list | map
  const [follow, setFollow] = useState(false);
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  // Distanțele sunt DERIVATE din poziție și lista brută: o distanță salvată ar deveni falsă la prima mișcare
  const cafes = useMemo(
    () => (position ? sortByDistance(position, rawCafes) : []),
    [position, rawCafes]
  );
  const selected = cafes.find((c) => c.id === selectedId) ?? null;

  useLivePosition(follow && status === 'ready', setPosition);

  const search = async (wantedSource) => {
    setStatus('locating');
    setMessage('');
    setNotice(null);
    setSelectedId(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setStatus(permission.canAskAgain ? 'denied' : 'blocked');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const here = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setPosition({ ...here, accuracy: location.coords.accuracy });

      let list;
      let source = wantedSource;

      if (source === 'osm') {
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();
        try {
          list = await fetchCafes(here, 1500, controllerRef.current.signal);
          if (list.length === 0) {
            setNotice('OpenStreetMap nu are cafenele în raza de 1,5 km. Afișăm datele demo.');
            list = generateDemoCafes(here);
            source = 'demo';
          }
        } catch (err) {
          if (err.name === 'AbortError') return;
          setNotice(`Nu am putut interoga OpenStreetMap (${err.message}). Afișăm datele demo.`);
          list = generateDemoCafes(here);
          source = 'demo';
        }
      } else {
        list = generateDemoCafes(here);
      }

      setRawCafes(list);
      setStatus('ready');
      setNotice((prev) =>
        prev ?? (source === 'osm' ? 'Sursa: © contribuitorii OpenStreetMap' : null)
      );
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  if (status !== 'ready') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Cafenele în apropiere</Text>

        {status === 'locating' && <ActivityIndicator size="large" />}
        {status === 'denied' && (
          <Text style={styles.warning}>Fără locație nu putem calcula distanțele.</Text>
        )}
        {status === 'blocked' && (
          <Pressable onPress={() => Linking.openSettings()}>
            <Text style={styles.warning}>Permisiunea este blocată. Atinge aici pentru Setări.</Text>
          </Pressable>
        )}
        {status === 'error' && <Text style={styles.warning}>Eroare: {message}</Text>}

        <Pressable
          style={styles.buttonPrimary}
          onPress={() => search('demo')}
          disabled={status === 'locating'}
        >
          <Text style={styles.buttonPrimaryText}>Găsește cafenele (date demo)</Text>
        </Pressable>
        <Pressable
          style={styles.buttonOutline}
          onPress={() => search('osm')}
          disabled={status === 'locating'}
        >
          <Text style={styles.buttonOutlineText}>Găsește cafenele reale (OpenStreetMap)</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cafenele în apropiere</Text>
        {position?.accuracy != null && (
          <Text style={styles.muted}>Precizie: ±{Math.round(position.accuracy)} m</Text>
        )}
      </View>

      {notice && <Text style={styles.notice}>{notice}</Text>}

      {selected && (
        <View style={styles.selectedBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cafeName}>{selected.name}</Text>
            <Text style={styles.cafeDistance}>{formatDistance(selected.distance)}</Text>
          </View>
          <Pressable style={styles.buttonPrimarySmall} onPress={() => openDirections(selected)}>
            <Text style={styles.buttonPrimaryText}>Navighează</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.toolbar}>
        <Pressable
          style={[styles.chip, view === 'list' && styles.chipActive]}
          onPress={() => setView('list')}
        >
          <Text style={[styles.chipText, view === 'list' && styles.chipTextActive]}>Listă</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, view === 'map' && styles.chipActive]}
          onPress={() => setView('map')}
        >
          <Text style={[styles.chipText, view === 'map' && styles.chipTextActive]}>Hartă</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.chip} onPress={() => search('demo')}>
          <Text style={styles.chipText}>Actualizează</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, follow && styles.chipActive]}
          onPress={() => setFollow((f) => !f)}
        >
          <Text style={[styles.chipText, follow && styles.chipTextActive]}>
            {follow ? 'Urmărire pornită' : 'Urmărește poziția'}
          </Text>
        </Pressable>
      </View>

      {view === 'map' ? (
        <View style={styles.mapWrapper}>
          <MapPanel
            position={position}
            cafes={cafes}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </View>
      ) : (
        <FlatList
          data={cafes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
          renderItem={({ item, index }) => (
            <Pressable
              style={[
                styles.card,
                index === 0 && styles.cardNearest,
                item.id === selectedId && styles.cardSelected,
              ]}
              onPress={() => setSelectedId(item.id)}
            >
              {index === 0 && <Text style={styles.badge}>Cea mai apropiată</Text>}
              <Text style={styles.cafeName}>{item.name}</Text>
              <Text style={styles.cafeDistance}>{formatDistance(item.distance)}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  header: { gap: 2, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0B1F3A' },
  muted: { color: '#5A6B7B', fontSize: 13 },
  notice: { color: '#5A6B7B', fontSize: 13, marginBottom: 8 },
  warning: { color: '#B0392F', textAlign: 'center' },
  toolbar: { flexDirection: 'row', gap: 6, marginBottom: 12, alignItems: 'center' },
  chip: {
    borderWidth: 1, borderColor: '#C9D6E0', borderRadius: 16,
    paddingVertical: 6, paddingHorizontal: 12,
  },
  chipActive: { backgroundColor: '#0B1F3A', borderColor: '#0B1F3A' },
  chipText: { color: '#0B1F3A', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  selectedBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F4FAFD', borderRadius: 8, padding: 12, marginBottom: 8,
  },
  buttonPrimarySmall: {
    backgroundColor: '#1C7293', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12,
  },
  mapWrapper: { flex: 1, borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  card: {
    backgroundColor: '#F4FAFD', borderRadius: 10, padding: 14, gap: 4,
  },
  cardNearest: { borderWidth: 2, borderColor: '#1C7293' },
  cardSelected: { backgroundColor: '#E3F2F7' },
  badge: { color: '#1C7293', fontSize: 12, fontWeight: '700' },
  cafeName: { color: '#0B1F3A', fontSize: 16, fontWeight: '600' },
  cafeDistance: { color: '#5A6B7B' },
  buttonPrimary: {
    backgroundColor: '#0B1F3A', borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center',
  },
  buttonPrimaryText: { color: '#fff', fontWeight: 'bold' },
  buttonOutline: {
    borderWidth: 2, borderColor: '#0B1F3A', borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center',
  },
  buttonOutlineText: { color: '#0B1F3A', fontWeight: 'bold' },
});
