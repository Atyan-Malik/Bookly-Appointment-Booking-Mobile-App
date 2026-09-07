// hooks/useLocation.js
// Wraps expo-location permission request + current position fetch. Used by
// the Discover screen's "nearest" sort and by a professional's map view.
import { useCallback, useState } from 'react';
import * as Location from 'expo-location';

export function useLocation() {
  const [coords, setCoords] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        return null;
      }
      const position = await Location.getCurrentPositionAsync({});
      const result = { lat: position.coords.latitude, lng: position.coords.longitude };
      setCoords(result);
      return result;
    } catch (e) {
      setError(e.message || 'Could not get your location');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { coords, isLoading, error, permissionDenied, requestLocation };
}

export default useLocation;
