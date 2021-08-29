import { useState, useEffect } from 'react';
import { loadAsync as loadFontAsync } from 'expo-font';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';

import { init } from '../db';
import alert from '../utils/alert';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await preventAutoHideAsync();
        await init();
        await loadFontAsync({
          'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
          'OpenSans-SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
          'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
        });
      } catch (e) {
        alert('App initialization error!', e);
      } finally {
        setLoadingComplete(true);
        await hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
