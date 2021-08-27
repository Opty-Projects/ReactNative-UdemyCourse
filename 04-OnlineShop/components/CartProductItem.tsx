import * as React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import CartProduct from '../models/CartProduct';
import { View } from './UI/Themed';
import { RegularText, SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';
import useColorScheme from '../hooks/useColorScheme';
import useAppDispatch from '../hooks/useAppDispatch';
import { removeFromCart } from '../store/slices/cart';

interface CartProductItemProps {
  productId: string
  cartProduct: CartProduct
  removable: boolean
}

export default function CartProductItem({
  productId,
  cartProduct,
  removable,
}: CartProductItemProps) {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  return (
    <View style={[styles.container, { borderColor: Colors[colorScheme].primary }]}>
      <RegularText style={styles.specifications}>
        {cartProduct.quantity}
        &times;
      </RegularText>
      <SemiBoldText style={styles.specifications}>
        {cartProduct.title}
      </SemiBoldText>
      <RegularText style={styles.specifications}>
        {`${(cartProduct.price * cartProduct.quantity).toFixed(2)} €`}
      </RegularText>
      {removable && (
        <CustomButton
          onPress={() => dispatch(removeFromCart({ productId }))}
          color={Colors[colorScheme].error}
        >
          <MaterialIcons name="remove" size={24} color={Colors[colorScheme].accent} />
        </CustomButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    marginHorizontal: 10,
    marginTop: 5,
    padding: 10,
  },
  specifications: {
    fontSize: 16,
  },
});
