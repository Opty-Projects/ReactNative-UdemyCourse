import * as React from 'react';
import { useCallback, useLayoutEffect } from 'react';
import {
  StyleSheet, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '../constants/Colors';
import { RootStackScreenProps } from '../navigation/types';
import { View } from '../components/UI/Themed';
import { RegularText, SemiBoldText } from '../components/UI/StyledText';
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
          <RegularText style={styles.address}>{place.address}</RegularText>
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
  address: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
});
