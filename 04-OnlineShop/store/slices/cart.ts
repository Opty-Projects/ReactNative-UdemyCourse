/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { pick } from 'lodash';

import Product from '../../models/Product';
import CartProduct from '../../models/CartProduct';
import { addOrder } from './orders';
import { deleteProduct } from './products';
import alert from '../../utils/alert';

export interface AddToCartPayload {
  product: Product
}

export interface DeleteFromCartPayload {
  productId: string
}

interface State {
  cartProducts: Record<string, CartProduct>
  price: number
}

const initialState: State = {
  cartProducts: {},
  price: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<AddToCartPayload>) {
      const { product } = action.payload;
      state.cartProducts[product.id] = {
        quantity: (state.cartProducts[product.id]?.quantity || 0) + 1,
        ...pick(product, ['price', 'title']),
      };
      state.price += product.price;
      alert('Successfully added to cart!', 'It will now appear in your cart.');
    },
    removeFromCart(state, action: PayloadAction<DeleteFromCartPayload>) {
      const { productId } = action.payload;
      if (state.cartProducts[productId]) {
        state.price -= state.cartProducts[productId].price;
        if (state.price < 0) state.price = 0;
        if (state.cartProducts[productId].quantity === 1) {
          delete state.cartProducts[productId];
        } else {
          state.cartProducts[productId].quantity -= 1;
        }
      }
      alert('Successfully deleted a product unit from the cart!', 'You can add it again later.');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addOrder.fulfilled, () => initialState);
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      const { productId } = action.payload;
      if (state.cartProducts[productId]) {
        state.price -= state.cartProducts[productId].price * state.cartProducts[productId].quantity;
        if (state.price < 0) state.price = 0;
        delete state.cartProducts[productId];
      }
    });
  },
});

export const {
  addToCart,
  removeFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;
