import { useEffect } from 'react';
import * as Location from 'expo-location';

// Cât timp enabled este true, apelează onPosition la fiecare mișcare de ~25 m.
// Abonamentul se închide la cleanup: fără el, locația ar continua să fie cerută (baterie!).
export function useLivePosition(enabled, onPosition) {
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let subscription = null;

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, distanceInterval: 25 },
      (location) =>
        onPosition({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        })
    ).then((sub) => {
      // dacă efectul a fost deja curățat cât timp așteptam abonamentul, îl închidem imediat
      if (cancelled) sub.remove();
      else subscription = sub;
    });

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [enabled]);
}
