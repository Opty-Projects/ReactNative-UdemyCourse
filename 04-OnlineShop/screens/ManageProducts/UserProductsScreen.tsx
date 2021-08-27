import * as React from 'react';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { Alert } from 'react-native';
import { Item } from 'react-navigation-header-buttons';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import { ManageProductsStackParamList, ManageProductsStackScreenProps } from '../../navigation/types';
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
import { deleteProduct, fetchProducts } from '../../store/slices/products';

export default function UserProductsScreen({ navigation }: ManageProductsStackScreenProps<'UserProducts'>) {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const userProducts = useAppSelector(({ products }) => products.userProducts);
  const isLoading = useAppSelector(({ products }) => products.isLoading);

  useEffect(() => navigation.addListener('focus', () => dispatch(fetchProducts())),
    [navigation, dispatch]);

  const onToggleDrawer = useCallback(() => navigation.toggleDrawer(), [navigation]);
  const onGoToEditProduct = useCallback(({ productId }: ManageProductsStackParamList['EditProduct']) => (
    navigation.navigate('EditProduct', { productId })
  ), [navigation]);
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
      <MaterialIconsHeaderButtons>
        <Item
          title="create"
          iconName="create"
          color={Colors[colorScheme].accent}
          onPress={() => onGoToEditProduct({})}
        />
      </MaterialIconsHeaderButtons>
    ),
  }), [navigation, colorScheme, onGoToEditProduct]);

  const onDeleteProduct = (product: Product) => Alert.alert(
    'Delete product!',
    `Are you sure you want to delete the product "${product.title}"?`, [{
      text: 'Delete',
      onPress: async () => {
        await dispatch(deleteProduct({ productId: product.id }));
        await dispatch(fetchProducts());
      },
      style: 'destructive',
    }, {
      text: 'Cancel',
      style: 'cancel',
    }], {
      cancelable: true,
    },
  );
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
      onPress={() => onGoToEditProduct({ productId: dataInfo.item.id })}
    >
      <CustomButton onPress={() => onGoToEditProduct({ productId: dataInfo.item.id })}>
        <MaterialIcons name="edit" size={30} color={Colors[colorScheme].accent} />
        <RegularText style={{ color: Colors[colorScheme].background }}>Edit</RegularText>
      </CustomButton>
      <CustomButton
        onPress={() => onDeleteProduct(dataInfo.item)}
        color={Colors[colorScheme].error}
      >
        <Ionicons name="trash-sharp" size={30} color={Colors[colorScheme].accent} />
        <RegularText style={{ color: Colors[colorScheme].background }}>Delete</RegularText>
      </CustomButton>
    </ProductTile>
  );

  return userProducts.length > 0 ? (
    <Grid
      data={userProducts}
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
      message="You don't have products, maybe add some!"
      onRefresh={() => dispatch(fetchProducts())}
    />
  );
}
