import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { loadAsync as loadFontAsync } from 'expo-font';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await preventAutoHideAsync();
        await loadFontAsync({
          ...Ionicons.font,
          'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
          'OpenSans-SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
          'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        await hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
