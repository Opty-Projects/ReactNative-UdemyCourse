import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '../../constants/Colors';
import { RegularText } from './StyledText';
import CustomButton from './CustomButton';
import useColorScheme from '../../hooks/useColorScheme';

interface FallbackProps {
  message: string
  onRefresh: () => void
}

export default function Fallback({
  message,
  onRefresh,
}: FallbackProps) {
  const colorScheme = useColorScheme();

  return (
    <LinearGradient
      colors={[Colors[colorScheme].accent, Colors[colorScheme].primary]}
      style={styles.container}
    >
      <MaterialCommunityIcons
        name="database-remove"
        size={100}
        color={Colors[colorScheme].warning}
      />
      <RegularText style={[styles.fallback, { color: Colors[colorScheme].background }]}>
        {message}
      </RegularText>
      <CustomButton onPress={onRefresh}>
        <MaterialCommunityIcons
          name="database-sync"
          size={50}
          color={Colors[colorScheme].accent}
        />
        <RegularText style={{ color: Colors[colorScheme].background }}>Sync</RegularText>
      </CustomButton>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  fallback: {
    fontSize: 20,
    marginTop: 10,
  },
});
