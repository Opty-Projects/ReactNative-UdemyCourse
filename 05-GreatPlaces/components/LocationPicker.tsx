import * as React from 'react';
import { MutableRefObject, useState } from 'react';
import {
  StyleSheet, View, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { LatLng } from 'react-native-maps';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  getLastKnownPositionAsync,
  LocationObject,
} from 'expo-location';
import { isEqual } from 'lodash';

import Colors from '../constants/Colors';
import { RegularText, SemiBoldText } from './UI/StyledText';
import Card from './UI/Card';
import CustomButton from './UI/CustomButton';
import MapPreview from './MapPreview';
import useColorScheme from '../hooks/useColorScheme';
import alert from '../utils/alert';

interface LocationPickerProps {
  label: string
  locationRef: MutableRefObject<LatLng | undefined>
  onGoToMap: () => void
}

export default function LocationPicker({
  label,
  locationRef,
  onGoToMap,
}: LocationPickerProps) {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<LatLng | undefined>(locationRef.current);
  if (!isEqual(location, locationRef.current)) setLocation(locationRef.current);

  const onGetLocation = async (openMap: boolean) => {
    if (openMap && locationRef.current) {
      onGoToMap();
      return;
    }
    try {
      setIsLoading(true);
      const { granted } = await requestForegroundPermissionsAsync();
      if (!granted) {
        alert('Insufficient permissions!', 'You must give permissions to access the location to continue.');
        return;
      }
      // getCurrentPositionAsync may fail multiple times
      for (let i = 0; i < 50; i += 1) {
        try {
          // eslint-disable-next-line no-await-in-loop
          onLocationResult(await getCurrentPositionAsync(), openMap);
          return;
          // eslint-disable-next-line no-empty
        } catch (_) {
        }
      }
      alert('Unable to get current location!', 'Trying to get the last known location.');
      const result = await getLastKnownPositionAsync();
      if (result) {
        onLocationResult(result, openMap);
        return;
      }
      alert('Unable to get last known location!', 'Please try again.');
    } catch (e) {
      alert('Error accessing location!', e);
    } finally {
      if (openMap) onGoToMap();
      setIsLoading(false);
    }
  };
  const onLocationResult = ({ coords }: LocationObject, openMap: boolean) => {
    const { latitude, longitude } = coords;
    locationRef.current = { latitude, longitude };
    if (!openMap) setLocation(locationRef.current);
  };

  return (
    <Card style={[styles.container, { borderColor: Colors[colorScheme].primary }]}>
      <SemiBoldText style={[styles.label, { borderColor: Colors[colorScheme].secondary }]}>
        {label}
      </SemiBoldText>
      {isLoading ? (
        <View style={styles.section}>
          <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
        </View>
      ) : (
        <View>
          <View style={styles.section}>
            <CustomButton
              onPress={() => onGetLocation(false)}
              color={Colors[colorScheme].success}
            >
              <MaterialIcons name="location-pin" size={24} color={Colors[colorScheme].accent} />
              <RegularText style={{ color: Colors[colorScheme].background }}>
                Fetch current location
              </RegularText>
            </CustomButton>
          </View>
          <View style={styles.section}>
            <CustomButton
              onPress={() => onGetLocation(true)}
              color={Colors[colorScheme].success}
            >
              <FontAwesome5 name="map-marked-alt" size={24} color={Colors[colorScheme].accent} />
              <RegularText style={{ color: Colors[colorScheme].background }}>
                Mark location on map
              </RegularText>
            </CustomButton>
          </View>
        </View>
      )}
      {location ? (
        <TouchableOpacity onPress={onGoToMap}>
          <MapPreview location={location} />
        </TouchableOpacity>
      ) : (
        <RegularText style={[styles.warning, { color: Colors[colorScheme].info }]}>
          Please select a location.
        </RegularText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  section: {
    marginTop: 10,
  },
  warning: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});
