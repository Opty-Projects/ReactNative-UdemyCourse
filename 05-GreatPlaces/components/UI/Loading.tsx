import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

export default function Loading() {
  const colorScheme = useColorScheme();

  return (
    <LinearGradient
      colors={[Colors[colorScheme].accent, Colors[colorScheme].primary]}
      style={styles.container}
    >
      <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
