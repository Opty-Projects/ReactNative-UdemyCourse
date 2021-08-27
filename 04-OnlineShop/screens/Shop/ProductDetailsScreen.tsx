import * as React from 'react';
import { useCallback, useLayoutEffect } from 'react';
import {
  StyleSheet, ScrollView, ImageBackground, useWindowDimensions,
} from 'react-native';
import { Item } from 'react-navigation-header-buttons';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '../../constants/Colors';
import { ShopStackScreenProps } from '../../navigation/types';
import { View } from '../../components/UI/Themed';
import { RegularText, SemiBoldText, BoldText } from '../../components/UI/StyledText';
import MaterialIconsHeaderButtons from '../../components/UI/MaterialIconsHeaderButtons';
import useColorScheme from '../../hooks/useColorScheme';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { addToCart } from '../../store/slices/cart';

export default function ProductDetailsScreen({
  navigation,
  route,
}: ShopStackScreenProps<'ProductDetails'>) {
  const windowDimensions = useWindowDimensions();
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  const { productId } = route.params;
  const product = useAppSelector(
    ({ products }) => products.availableProducts.find((p) => p.id === productId),
  );
  if (!product) return null;

  const onAddToCart = useCallback(() => dispatch(addToCart({ product })), [dispatch, product]);
  useLayoutEffect(() => navigation.setOptions({ title: product.title }), [navigation, product]);
  useLayoutEffect(() => navigation.setOptions({
    title: product.title,
    headerRight: () => (
      <MaterialIconsHeaderButtons>
        <Item
          title="add-shopping-cart"
          iconName="add-shopping-cart"
          color={Colors[colorScheme].accent}
          onPress={onAddToCart}
        />
      </MaterialIconsHeaderButtons>
    ),
  }), [navigation, colorScheme, onAddToCart]);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <View style={[styles.header, {
          height: windowDimensions.height / 2,
          borderBottomColor: Colors[colorScheme].primary,
        }]}
        >
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
        <LinearGradient
          colors={[Colors[colorScheme].accent, Colors[colorScheme].primary]}
          style={styles.bodyContainer}
        >
          <SemiBoldText style={styles.title}>Price</SemiBoldText>
          <View
            style={[styles.specificationsContainer, { borderColor: Colors[colorScheme].primary }]}
          >
            <RegularText style={styles.specifications}>
              {`${product.price.toFixed(2)} €`}
            </RegularText>
          </View>
          <SemiBoldText style={styles.title}>Description</SemiBoldText>
          <View
            style={[styles.specificationsContainer, { borderColor: Colors[colorScheme].primary }]}
          >
            <RegularText style={styles.specifications}>
              {product.description}
            </RegularText>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
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
  bodyContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#0000',
    padding: 15,
  },
  specificationsContainer: {
    padding: 10,
    marginVertical: 15,
    borderWidth: 1,
  },
  specifications: {
    fontSize: 16,
    textAlign: 'center',
  },
});
