import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';

export default function NumberContainer({
  children,
  style
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[GlobalStyles.subtitleFont, styles.number]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.info,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10
  },
  number: {
    color: Colors.accent
  }
});
