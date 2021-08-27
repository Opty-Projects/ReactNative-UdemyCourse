import * as React from 'react';
import {
  useCallback, useEffect, useLayoutEffect, useState,
} from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native';
import { Item } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';

import Colors from '../../constants/Colors';
import { OrdersStackScreenProps } from '../../navigation/types';
import Order from '../../models/Order';
import { View } from '../../components/UI/Themed';
import { RegularText } from '../../components/UI/StyledText';
import MaterialIconsHeaderButtons from '../../components/UI/MaterialIconsHeaderButtons';
import CustomButton from '../../components/UI/CustomButton';
import Fallback from '../../components/UI/Fallback';
import Loading from '../../components/UI/Loading';
import CartProductsList from '../../components/CartProductsList';
import useColorScheme from '../../hooks/useColorScheme';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { fetchOrders } from '../../store/slices/orders';

export default function UserOrdersScreen({ navigation }: OrdersStackScreenProps<'UserOrders'>) {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const [showCartProducts, setShowCartProducts] = useState<Record<string, boolean>>({});
  const previousOrders = useAppSelector(({ orders }) => orders.previousOrders);
  const isLoading = useAppSelector(({ orders }) => orders.isLoading);

  useEffect(() => navigation.addListener('focus', () => dispatch(fetchOrders())),
    [navigation, dispatch]);

  const onToggleDrawer = useCallback(() => navigation.toggleDrawer(), [navigation]);
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

  const renderOrder = (orderInfo: ListRenderItemInfo<Order>) => (
    <View style={styles.orderContainer}>
      <View
        style={[styles.specificationsContainer, { borderColor: Colors[colorScheme].primary }]}
      >
        <RegularText style={styles.specifications}>
          {moment(orderInfo.item.timestamp)
            .format('Do MMM YYYY, hh:mm')}
        </RegularText>
        <RegularText style={styles.specifications}>
          {`${orderInfo.item.price.toFixed(2)}€`}
        </RegularText>
        <CustomButton onPress={() => setShowCartProducts((currShowCartProducts) => ({
          ...currShowCartProducts,
          [orderInfo.item.id]: !currShowCartProducts[orderInfo.item.id],
        }))}
        >
          <MaterialIcons
            name={showCartProducts[orderInfo.item.id] ? 'expand-less' : 'expand-more'}
            size={24}
            color={Colors[colorScheme].accent}
          />
        </CustomButton>
      </View>
      {showCartProducts[orderInfo.item.id] && (
        <CartProductsList cartProducts={orderInfo.item.cartProducts} removable={false} />
      )}
    </View>
  );

  return previousOrders.length > 0 ? (
    <LinearGradient
      colors={[Colors[colorScheme].accent, Colors[colorScheme].primary]}
      style={styles.container}
    >
      <FlatList
        data={previousOrders.slice()
          .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))}
        renderItem={renderOrder}
        style={styles.list}
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchOrders())}
      />
    </LinearGradient>
  ) : isLoading ? (
    <Loading />
  ) : (
    <Fallback
      message="You don't have orders, maybe order some products!"
      onRefresh={() => dispatch(fetchOrders())}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
  orderContainer: {
    backgroundColor: '#0000',
    paddingVertical: 10,
  },
  specificationsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 10,
  },
  specifications: {
    fontSize: 16,
  },
});
