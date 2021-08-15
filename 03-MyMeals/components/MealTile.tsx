import React from 'react';
import {
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import Meal from '../models/Meal';
import { View } from './Themed';
import { BoldText, RegularText } from './StyledText';

interface MealTileParams {
  meal: Meal
  containerStyle: StyleProp<ViewStyle>
  onPress?: (event: GestureResponderEvent) => void
}

MealTile.defaultProps = { onPress: null };

export default function MealTile({
  meal,
  containerStyle,
  onPress,
}: MealTileParams) {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress} disabled={onPress === null}>
      <View style={[styles.container, containerStyle]}>
        <View style={styles.header}>
          <ImageBackground source={{ uri: meal.imageUri }} style={styles.backgroundImage}>
            <View style={styles.titleContainer}>
              <BoldText numberOfLines={1} style={styles.title}>{meal.title}</BoldText>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.details}>
          <RegularText>
            {meal.duration}
            min
          </RegularText>
          <RegularText>{meal.complexity.toUpperCase()}</RegularText>
          <RegularText>{meal.affordability.toUpperCase()}</RegularText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    flex: 1,
  },
  details: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  // eslint-disable-next-line react-native/no-color-literals
  titleContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
});
