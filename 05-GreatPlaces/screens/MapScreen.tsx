import * as React from 'react';
import { useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Item } from 'react-navigation-header-buttons';
import MapView, {
  Marker, Region, MapEvent, LatLng,
} from 'react-native-maps';

import Colors from '../constants/Colors';
import { RootStackScreenProps } from '../navigation/types';
import MaterialIconsHeaderButtons from '../components/UI/MaterialIconsHeaderButtons';
import useColorScheme from '../hooks/useColorScheme';
import alert from '../utils/alert';

export default function MapScreen({ navigation, route }: RootStackScreenProps<'Map'>) {
  const colorScheme = useColorScheme();

  const { initialLocation, readonly } = route.params;
  const [location, setLocation] = useState<LatLng | undefined>(initialLocation);

  const onSave = useCallback(() => {
    if (location) {
      navigation.navigate('NewPlaces', { location });
    } else {
      alert('Invalid location!', 'You haven\'t marked any location yet.');
    }
  }, [navigation, location]);
  useLayoutEffect(() => navigation.setOptions({
    headerRight: () => !readonly && (
    <MaterialIconsHeaderButtons>
      <Item
        title="check-circle"
        iconName="check-circle"
        color={Colors[colorScheme].accent}
        onPress={onSave}
      />
    </MaterialIconsHeaderButtons>
    ),
  }), [navigation, colorScheme, onSave]);

  const initialRegion: Region = {
    latitude: initialLocation ? initialLocation.latitude : 37.78825,
    longitude: initialLocation ? initialLocation.longitude : -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const onPress = (event: MapEvent) => {
    if (!readonly) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setLocation({ latitude, longitude });
    }
  };
  return (
    <MapView initialRegion={initialRegion} onPress={onPress} style={styles.container}>
      {location && (
        <Marker coordinate={location} />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
