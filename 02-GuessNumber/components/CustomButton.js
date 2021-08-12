import React from 'react';
import {
  StyleSheet, Platform, TouchableNativeFeedback, TouchableHighlight, View, Text
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';

export default function CustomButton({
  windowWidth,
  onPress,
  style,
  children
}) {
  const ButtonTouchable = Platform.OS === 'android'
    ? TouchableNativeFeedback
    : TouchableHighlight;

  return (
    <View style={styles.container}>
      <ButtonTouchable onPress={onPress}>
        <View style={[styles.button, { width: windowWidth / 3 }, style]}>
          <Text style={[GlobalStyles.bodyFont, styles.buttonText]}>{children}</Text>
        </View>
      </ButtonTouchable>
    </View>
  );
}

CustomButton.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 10
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center'
  }
});
