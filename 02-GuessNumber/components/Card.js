import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

export default function Card(props) {
  const {
    windowHeight,
    style,
    children
  } = props;

  return (
    <View
      {...props}
      style={[
        styles.container, {
          paddingTop: windowHeight / 80 + 5,
          paddingBottom: windowHeight / 80
        }, style
      ]}
    >
      {children}
    </View>
  );
}

Card.propTypes = {
  windowHeight: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
  container: {
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    elevation: 5,
    borderRadius: 10,
    paddingHorizontal: 20
  }
});
