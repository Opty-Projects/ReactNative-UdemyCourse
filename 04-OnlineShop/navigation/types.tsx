/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerScreenProps } from '@react-navigation/drawer';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
    }
  }
}

export type RootStackParamList = {
  Authentication: undefined
  Drawer: NavigatorScreenParams<DrawerParamList>
};

export type DrawerParamList = {
  Shop: NavigatorScreenParams<ShopStackParamList>;
  Orders: NavigatorScreenParams<OrdersStackParamList>;
  ManageProducts: NavigatorScreenParams<ManageProductsStackParamList>;
};

export type ShopStackParamList = {
  ProductsOverview: undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
};

export type OrdersStackParamList = {
  UserOrders: undefined;
};

export type ManageProductsStackParamList = {
  UserProducts: undefined;
  EditProduct: { productId?: string };
};

export type ShopStackScreenProps<Screen extends keyof ShopStackParamList> =
    CompositeScreenProps<NativeStackScreenProps<ShopStackParamList, Screen>,
    DrawerScreenProps<DrawerParamList, 'Shop'>>;

export type OrdersStackScreenProps<Screen extends keyof OrdersStackParamList> =
    CompositeScreenProps<NativeStackScreenProps<OrdersStackParamList, Screen>,
    DrawerScreenProps<DrawerParamList, 'Orders'>>;

export type ManageProductsStackScreenProps<Screen extends keyof ManageProductsStackParamList> =
    CompositeScreenProps<NativeStackScreenProps<ManageProductsStackParamList, Screen>,
    DrawerScreenProps<DrawerParamList, 'ManageProducts'>>;
