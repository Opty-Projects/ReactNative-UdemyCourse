import * as React from 'react';
import { useCallback, useLayoutEffect } from 'react';
import {
  StyleSheet, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { openURL } from 'expo-linking';

import Colors from '../constants/Colors';
import { RootStackScreenProps } from '../navigation/types';
import { View } from '../components/UI/Themed';
import { RegularText, SemiBoldText } from '../components/UI/StyledText';
import CustomButton from '../components/UI/CustomButton';
import MapPreview from '../components/MapPreview';
import useColorScheme from '../hooks/useColorScheme';
import useAppSelector from '../hooks/useAppSelector';

export default function PlaceDetailsScreen({ navigation, route }: RootStackScreenProps<'PlaceDetails'>) {
  const colorScheme = useColorScheme();

  const { placeId } = route.params;
  const place = useAppSelector(
    ({ places }) => places.places.find((p) => p.id === placeId),
  );
  if (!place) return null;

  const onGoToMap = useCallback(() => navigation.navigate('Map', {
    initialLocation: place,
    readonly: true,
  }), [navigation, place]);
  const onGetDirections = useCallback(() => openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`,
  ), [place]);
  useLayoutEffect(() => navigation.setOptions({ title: place.title }), [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={[Colors[colorScheme].accent, Colors[colorScheme].primary]}
        style={styles.container}
      >
        <View style={[styles.thumbnailContainer, { borderColor: Colors[colorScheme].primary }]}>
          <Image source={{ uri: place.thumbnailUri }} style={styles.thumbnail} />
        </View>
        <View style={[styles.infoContainer, { borderColor: Colors[colorScheme].primary }]}>
          <SemiBoldText style={[styles.title, { borderColor: Colors[colorScheme].secondary }]}>
            {place.title}
          </SemiBoldText>
          <View style={styles.locationContainer}>
            <RegularText style={styles.address}>{place.address}</RegularText>
            <CustomButton onPress={onGetDirections}>
              <FontAwesome5 name="directions" size={24} color={Colors[colorScheme].accent} />
              <RegularText style={{ color: Colors[colorScheme].background }}>
                Directions
              </RegularText>
            </CustomButton>
          </View>
        </View>
        <TouchableOpacity onPress={onGoToMap}>
          <MapPreview location={place} />
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  thumbnailContainer: {
    borderWidth: 1,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
  },
  infoContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  address: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
