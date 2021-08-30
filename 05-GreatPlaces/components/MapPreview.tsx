import * as React from 'react';
import { useState } from 'react';
import {
  StyleSheet, View, Image, ActivityIndicator,
} from 'react-native';

import { GOOGLE_API_KEY } from '../extra';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

interface MapPreviewProps {
  location: { latitude: number, longitude: number } | undefined
}

export default function MapPreview({
  location,
}: MapPreviewProps) {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  if (!location) return null;

  const previewUri = 'https://maps.googleapis.com/maps/api/staticmap'
        + `?key=${GOOGLE_API_KEY}`
        + `&center=${location.latitude},${location.longitude}`
        + `&markers=color:red%7Clabel:A%7C${location.latitude},${location.longitude}`
        + '&zoom=14'
        + '&maptype=roadmap'
        + '&size=480x360';

  return (
    <View style={[styles.container, { borderColor: Colors[colorScheme].primary }]}>
      {isLoading && (
        <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
      )}
      <Image
        source={{ uri: previewUri }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        style={!isLoading && styles.preview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    marginTop: 10,
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
});
