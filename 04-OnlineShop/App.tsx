import 'react-native-gesture-handler';
import * as React from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

import Navigation from './navigation';
import store from './store';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';

LogBox.ignoreLogs(['Setting a timer for a long period of time']);
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  return isLoadingComplete && (
    <SafeAreaProvider>
      <Provider store={store}>
        <Navigation colorScheme={colorScheme} />
      </Provider>
      <StatusBar />
    </SafeAreaProvider>
  );
}
