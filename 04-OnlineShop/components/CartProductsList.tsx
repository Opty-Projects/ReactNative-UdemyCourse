import * as React from 'react';
import { StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';

import CartProduct from '../models/CartProduct';
import CartProductItem from './CartProductItem';

interface CartProductsListProps {
  cartProducts: Record<string, CartProduct>
  removable: boolean
}

export default function CartProductsList({
  cartProducts,
  removable,
}: CartProductsListProps) {
  const renderCartProductItem = (cartProductInfo: ListRenderItemInfo<[string, CartProduct]>) => (
    <CartProductItem
      productId={cartProductInfo.item[0]}
      cartProduct={cartProductInfo.item[1]}
      removable={removable}
    />
  );

  return (
    <FlatList
      data={Object.entries(cartProducts)
        .sort((a, b) => (a[0] < b[0] ? 1 : -1))}
      keyExtractor={(item) => item[0]}
      renderItem={renderCartProductItem}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
});
