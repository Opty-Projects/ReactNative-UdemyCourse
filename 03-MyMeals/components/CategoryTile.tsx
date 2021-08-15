import React from 'react';
import {
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Category from '../models/Category';
import { View } from './Themed';
import { SemiBoldText } from './StyledText';

interface CategoryTileParams {
  category: Category
  containerStyle: StyleProp<ViewStyle>
  onPress?: (event: GestureResponderEvent) => void
}

CategoryTile.defaultProps = { onPress: null };

export default function CategoryTile({
  category,
  containerStyle,
  onPress,
}: CategoryTileParams) {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress} disabled={onPress === null}>
      <View style={[styles.container, containerStyle]}>
        <SemiBoldText>{category.title}</SemiBoldText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
});
