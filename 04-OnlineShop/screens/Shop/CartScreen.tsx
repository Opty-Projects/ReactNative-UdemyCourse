import * as React from 'react';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { isEmpty } from 'lodash';

import Colors from '../../constants/Colors';
import { ShopStackScreenProps } from '../../navigation/types';
import { View } from '../../components/UI/Themed';
import { RegularText, SemiBoldText } from '../../components/UI/StyledText';
import CustomButton from '../../components/UI/CustomButton';
import Loading from '../../components/UI/Loading';
import CartProductsList from '../../components/CartProductsList';
import useColorScheme from '../../hooks/useColorScheme';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { addOrder } from '../../store/slices/orders';

export default function CartScreen({ navigation }: ShopStackScreenProps<'Cart'>) {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(({ orders }) => orders.isLoading);
  const {
    cartProducts,
    price,
  } = useAppSelector(({ cart }) => cart);

  useEffect(() => {
    if (isEmpty(cartProducts)) navigation.goBack();
  }, [navigation, cartProducts]);

  const onOrder = () => dispatch(addOrder({
    cartProducts,
    price,
  }));
  return isLoading ? (
    <Loading />
  ) : (
    <LinearGradient
      colors={[Colors[colorScheme].accent, Colors[colorScheme].primary]}
      style={styles.container}
    >
      <View style={styles.header}>
        <RegularText style={styles.summary}>
          <SemiBoldText>Total: </SemiBoldText>
          {`${price.toFixed(2)}€`}
        </RegularText>
        <CustomButton onPress={onOrder} color={Colors[colorScheme].success}>
          <Octicons name="checklist" size={30} color={Colors[colorScheme].accent} />
          <RegularText style={{ color: Colors[colorScheme].background }}>Order</RegularText>
        </CustomButton>
      </View>
      <CartProductsList cartProducts={cartProducts} removable />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#0000',
    marginVertical: 20,
  },
  summary: {
    fontSize: 16,
  },
});
