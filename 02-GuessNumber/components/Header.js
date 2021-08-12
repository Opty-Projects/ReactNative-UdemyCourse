import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';

export default function Header({
  windowHeight,
  title
}) {
  return (
    <View style={[
      styles.container, {
        paddingTop: windowHeight > 600 ? 30 : 15,
        height: windowHeight > 600 ? 100 : 75
      }
    ]}
    >
      <Text style={[GlobalStyles.titleFont, styles.title]}>{title}</Text>
    </View>
  );
}

Header.propTypes = {
  windowHeight: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingTop: 30
  },
  title: {
    color: Colors.white
  }
});
