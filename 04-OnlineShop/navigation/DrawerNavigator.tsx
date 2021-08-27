import * as React from 'react';
import { ComponentProps } from 'react';
import {
  createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome5 } from '@expo/vector-icons';

import { DrawerContentComponentProps } from '@react-navigation/drawer/src/types';
import {
  DrawerParamList,
  ShopStackParamList,
  OrdersStackParamList,
  ManageProductsStackParamList,
} from './types';
import Colors from '../constants/Colors';
import ProductsOverviewScreen from '../screens/Shop/ProductsOverviewScreen';
import ProductDetailsScreen from '../screens/Shop/ProductDetailsScreen';
import CartScreen from '../screens/Shop/CartScreen';
import UserOrdersScreen from '../screens/Orders/UserOrdersScreen';
import UserProductsScreen from '../screens/ManageProducts/UserProductsScreen';
import EditProductScreen from '../screens/ManageProducts/EditProductScreen';
import useColorScheme from '../hooks/useColorScheme';
import useAppDispatch from '../hooks/useAppDispatch';
import { logout } from '../store/slices/authentication';

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Drawer.Navigator
      initialRouteName="Shop"
      screenOptions={{
        drawerStyle: { backgroundColor: Colors[colorScheme].primary },
        drawerLabelStyle: { fontFamily: 'OpenSans-SemiBold' },
        drawerActiveTintColor: Colors[colorScheme].accent,
        drawerInactiveTintColor: Colors[colorScheme].background,
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Shop"
        component={ShopNavigator}
        options={{
          title: 'Shop',
          drawerIcon: drawerIcon('shopping-basket'),
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          title: 'Orders',
          drawerIcon: drawerIcon('list'),
        }}
      />
      <Drawer.Screen
        name="ManageProducts"
        component={ManageProductsNavigator}
        options={{
          title: 'Manage Products',
          drawerIcon: drawerIcon('user-cog'),
        }}
      />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={() => dispatch(logout())}
        icon={drawerIcon('sign-out-alt')}
        inactiveTintColor={Colors[colorScheme].background}
        inactiveBackgroundColor={Colors[colorScheme].error}
        labelStyle={{ fontFamily: 'OpenSans-SemiBold' }}
      />
    </DrawerContentScrollView>
  );
}

const drawerIcon = (name: ComponentProps<typeof FontAwesome5>['name']) => ({ color }: { color: string }) => (
  <FontAwesome5 name={name} color={color} size={24} />
);

const ShopStack = createNativeStackNavigator<ShopStackParamList>();
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();
const ManageProductsStack = createNativeStackNavigator<ManageProductsStackParamList>();

function ShopNavigator() {
  const colorScheme = useColorScheme();

  return (
    <ShopStack.Navigator screenOptions={{
      headerTitleStyle: { fontFamily: 'OpenSans-SemiBold' },
      headerTintColor: Colors[colorScheme].accent,
      headerStyle: { backgroundColor: Colors[colorScheme].primary },
    }}
    >
      <ShopStack.Screen
        name="ProductsOverview"
        component={ProductsOverviewScreen}
        options={{ title: 'All Products' }}
      />
      <ShopStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product Details' }}
      />
      <ShopStack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
    </ShopStack.Navigator>
  );
}

function OrdersNavigator() {
  const colorScheme = useColorScheme();

  return (
    <OrdersStack.Navigator screenOptions={{
      headerTitleStyle: { fontFamily: 'OpenSans-SemiBold' },
      headerTintColor: Colors[colorScheme].accent,
      headerStyle: { backgroundColor: Colors[colorScheme].primary },
    }}
    >
      <OrdersStack.Screen
        name="UserOrders"
        component={UserOrdersScreen}
        options={{ title: 'Your Orders' }}
      />
    </OrdersStack.Navigator>
  );
}

function ManageProductsNavigator() {
  const colorScheme = useColorScheme();

  return (
    <ManageProductsStack.Navigator screenOptions={{
      headerTitleStyle: { fontFamily: 'OpenSans-SemiBold' },
      headerTintColor: Colors[colorScheme].accent,
      headerStyle: { backgroundColor: Colors[colorScheme].primary },
    }}
    >
      <ManageProductsStack.Screen
        name="UserProducts"
        component={UserProductsScreen}
        options={{ title: 'Your Products' }}
      />
      <ManageProductsStack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{ title: 'Edit Product' }}
      />
    </ManageProductsStack.Navigator>
  );
}
