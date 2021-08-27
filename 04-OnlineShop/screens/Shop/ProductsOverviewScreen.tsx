import * as React from 'react';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { Item } from 'react-navigation-header-buttons';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { isEmpty } from 'lodash';

import Colors from '../../constants/Colors';
import { ShopStackParamList, ShopStackScreenProps } from '../../navigation/types';
import Product from '../../models/Product';
import { RegularText } from '../../components/UI/StyledText';
import MaterialIconsHeaderButtons from '../../components/UI/MaterialIconsHeaderButtons';
import CustomButton from '../../components/UI/CustomButton';
import Grid, { RenderTileProps } from '../../components/UI/Grid';
import Fallback from '../../components/UI/Fallback';
import Loading from '../../components/UI/Loading';
import ProductTile from '../../components/ProductTile';
import useColorScheme from '../../hooks/useColorScheme';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { fetchProducts } from '../../store/slices/products';
import { addToCart } from '../../store/slices/cart';

export default function ProductsOverviewScreen({ navigation }: ShopStackScreenProps<'ProductsOverview'>) {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const availableProducts = useAppSelector(({ products }) => products.availableProducts);
  const isLoading = useAppSelector(({ products }) => products.isLoading);
  const showCart = useAppSelector(({ cart }) => !isEmpty(cart.cartProducts));

  useEffect(() => navigation.addListener('focus', () => dispatch(fetchProducts())),
    [navigation, dispatch]);

  const onToggleDrawer = useCallback(() => navigation.toggleDrawer(), [navigation]);
  const onGoToCart = useCallback(() => navigation.navigate('Cart'), [navigation]);
  useLayoutEffect(() => navigation.setOptions({
    headerLeft: () => (
      <MaterialIconsHeaderButtons>
        <Item
          title="menu"
          iconName="menu"
          color={Colors[colorScheme].accent}
          onPress={onToggleDrawer}
        />
      </MaterialIconsHeaderButtons>
    ),
  }), [navigation, colorScheme, onToggleDrawer]);
  useLayoutEffect(() => navigation.setOptions({
    headerRight: () => (
      showCart && (
      <MaterialIconsHeaderButtons>
        <Item
          title="shopping-cart"
          iconName="shopping-cart"
          color={Colors[colorScheme].accent}
          onPress={onGoToCart}
        />
      </MaterialIconsHeaderButtons>
      )
    ),
  }), [navigation, colorScheme, onGoToCart, showCart]);

  const onGoToProductDetails = ({ productId }: ShopStackParamList['ProductDetails']) => navigation.navigate('ProductDetails', { productId });
  const renderProductTile = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
    width,
    height,
  }: RenderTileProps<Product>) => (
    <ProductTile
      product={dataInfo.item}
      containerStyle={{
        marginHorizontal,
        marginVertical,
        width,
        height,
        borderColor: Colors[colorScheme].primary,
      }}
      onPress={() => onGoToProductDetails({ productId: dataInfo.item.id })}
    >
      <CustomButton onPress={() => onGoToProductDetails({ productId: dataInfo.item.id })}>
        <Entypo name="info-with-circle" size={30} color={Colors[colorScheme].accent} />
        <RegularText style={{ color: Colors[colorScheme].background }}>
          View details
        </RegularText>
      </CustomButton>
      <CustomButton
        onPress={() => dispatch(addToCart({ product: dataInfo.item }))}
        color={Colors[colorScheme].success}
      >
        <MaterialIcons
          name="add-shopping-cart"
          size={30}
          color={Colors[colorScheme].accent}
        />
        <RegularText style={{ color: Colors[colorScheme].background }}>
          Add to cart
        </RegularText>
      </CustomButton>
    </ProductTile>
  );

  return availableProducts.length > 0 ? (
    <Grid
      data={availableProducts}
      renderTile={renderProductTile}
      numColumns={1}
      numRows={2}
      refreshing={isLoading}
      onRefresh={() => dispatch(fetchProducts())}
    />
  ) : isLoading ? (
    <Loading />
  ) : (
    <Fallback
      message="No products were found, maybe add some!"
      onRefresh={() => dispatch(fetchProducts())}
    />
  );
}
