import React, { ReactNode } from 'react';
import {
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import Product from '../models/Product';
import { View } from './UI/Themed';
import { BoldText, RegularText } from './UI/StyledText';
import Card from './UI/Card';

interface ProductTileProps {
  product: Product
  containerStyle: StyleProp<ViewStyle>
  onPress: (event: GestureResponderEvent) => void
  children: ReactNode
}

export default function ProductTile({
  product,
  containerStyle,
  onPress,
  children,
}: ProductTileProps) {
  return (
    <Card style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
          <View style={styles.header}>
            <ImageBackground
              source={{ uri: product.imageUri }}
              style={styles.backgroundImage}
            >
              <View style={styles.titleContainer}>
                <BoldText numberOfLines={1} style={styles.title}>
                  {product.title}
                </BoldText>
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      </View>
      <RegularText style={styles.price}>{`${product.price.toFixed(2)} €`}</RegularText>
      <View style={styles.actions}>{children}</View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 30,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  titleContainer: {
    backgroundColor: '#fff8',
    padding: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  price: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 5,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
