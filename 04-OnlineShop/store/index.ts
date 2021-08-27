import { configureStore } from '@reduxjs/toolkit';

import products from './slices/products';
import cart from './slices/cart';
import orders from './slices/orders';
import authentication from './slices/authentication';

const store = configureStore({
  reducer: {
    products,
    cart,
    orders,
    authentication,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface ThunkApiConfig {
  state: RootState,
  dispatch: AppDispatch
}

export default store;
