import React, { ComponentType, useState } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Animated,
  View,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import Place from '../models/Place';
import { RegularText, SemiBoldText } from './UI/StyledText';
import Card from './UI/Card';
import useColorScheme from '../hooks/useColorScheme';

interface PlaceTileProps {
  place: Place
  onPress: (event: GestureResponderEvent) => void
  onRemove: () => void
  containerStyle: StyleProp<ViewStyle>
}

export default function PlaceTile({
  place,
  onPress,
  onRemove,
  containerStyle,
}: PlaceTileProps) {
  const colorScheme = useColorScheme();
  const TouchableComponent: ComponentType<TouchableOpacityProps | TouchableNativeFeedbackProps> = Platform.OS === 'android'
    ? TouchableNativeFeedback
    : TouchableOpacity;

  const [iconSize, setIconSize] = useState<number>(50);
  const renderRightActions = (
    progressAnimatedValue: Animated.AnimatedInterpolation,
    dragAnimatedValue: Animated.AnimatedInterpolation,
  ) => {
    const scale = dragAnimatedValue.interpolate({
      inputRange: [-400, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <View
        onLayout={({ nativeEvent }) => setIconSize(nativeEvent.layout.height)}
        style={[containerStyle, styles.rightActionsContainer, {
          backgroundColor: Colors[colorScheme].error,
        }]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash" size={iconSize} color={Colors[colorScheme].accent} />
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      onSwipeableRightWillOpen={onRemove}
      renderRightActions={renderRightActions}
    >
      <View style={containerStyle}>
        <TouchableComponent onPress={onPress}>
          <Card style={styles.innerContainer}>
            <View style={[styles.thumbnailContainer, { borderColor: Colors[colorScheme].primary }]}>
              <Image source={{ uri: place.thumbnailUri }} style={styles.thumbnail} />
            </View>
            <View style={styles.infoContainer}>
              <SemiBoldText style={styles.title}>{place.title}</SemiBoldText>
              <RegularText style={styles.address}>{place.address}</RegularText>
            </View>
          </Card>
        </TouchableComponent>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  thumbnailContainer: {
    flex: 2,
    borderWidth: 1,
    borderRadius: 100,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
  },
  infoContainer: {
    flex: 3,
    marginLeft: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  address: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  rightActionsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 10,
  },
});
