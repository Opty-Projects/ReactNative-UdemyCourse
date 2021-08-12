import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Colors from '../constants/Colors';

export default function Input(props) {
  const {
    style
  } = props;

  return (
    <TextInput {...props} style={[styles.container, style]} />
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.secondary,
    borderBottomWidth: 1,
    padding: 10
  }
});
