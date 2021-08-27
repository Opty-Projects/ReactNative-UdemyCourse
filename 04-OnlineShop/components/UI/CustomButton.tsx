import React, { ReactNode } from 'react';
import { GestureResponderEvent, StyleSheet, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '../../constants/Colors';
import Card from './Card';
import useColorScheme from '../../hooks/useColorScheme';

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void
  children: ReactNode
  color?: string
}

export default function CustomButton({
  onPress,
  children,
  color,
}: CustomButtonProps) {
  const colorScheme = useColorScheme();

  return (
    <TouchableHighlight activeOpacity={0.6} onPress={onPress}>
      <Card>
        <LinearGradient
          colors={[Colors[colorScheme].primary, color || Colors[colorScheme].info]}
          style={[styles.container, { borderColor: Colors[colorScheme].primary }]}
        >
          {children}
        </LinearGradient>
      </Card>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    padding: 10,
  },
});
