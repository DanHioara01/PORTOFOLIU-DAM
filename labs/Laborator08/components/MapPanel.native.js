import { useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { formatDistance } from '../utils/distance';

// Varianta pentru Android/iOS. Pe Web Metro alege MapPanel.web.js (react-native-maps nu rulează pe Web).
export default function MapPanel({ position, cafes, selectedId, onSelect }) {
  const mapRef = useRef(null);

  // când se alege o cafenea (din listă sau de pe hartă), mutăm harta pe ea
  useEffect(() => {
    const cafe = cafes.find((c) => c.id === selectedId);
    if (cafe) {
      mapRef.current?.animateToRegion(
        {
          latitude: cafe.latitude,
          longitude: cafe.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        400
      );
    }
  }, [selectedId]);

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={{
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
      showsUserLocation
    >
      {cafes.map((cafe) => (
        <Marker
          key={cafe.id}
          coordinate={{ latitude: cafe.latitude, longitude: cafe.longitude }}
          title={cafe.name}
          description={formatDistance(cafe.distance)}
          pinColor={cafe.id === selectedId ? '#1C7293' : undefined}
          onPress={() => onSelect(cafe.id)}
        />
      ))}
    </MapView>
  );
}
