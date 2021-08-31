/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { requestPermissionsAsync, getExpoPushTokenAsync } from 'expo-notifications';
import { map } from 'lodash';
import axios from 'axios';

import { FIREBASE_PROJECT_ID } from '@env';
import { ThunkApiConfig } from '../index';
import Product from '../../models/Product';
import {
  onPending, onFulfilled, onUpdate, onError,
} from '../../utils/ThunkActions';
import alert from '../../utils/alert';

export interface AddProductPayload {
  description: string
  imageUri: string
  price: number
  title: string
}

export interface EditProductPayload {
  productId: string
  description: string
  imageUri: string
  title: string
}

interface State {
  availableProducts: Product[]
  userProducts: Product[]
  isLoading: boolean
}

const initialState: State = {
  availableProducts: [],
  userProducts: [],
  isLoading: false,
};

let pushToken: string;
const registerForPushNotificationsAsync = async () => {
  const { granted } = await requestPermissionsAsync();
  if (granted) {
    const { data } = await getExpoPushTokenAsync();
    pushToken = data;
  } else {
    alert('Insufficient permissions!', 'You must give permissions to be able to receive notifications.');
  }
};

export const fetchProducts = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'products/fetchProducts',
  async (_, { getState }) => {
    const {
      idToken,
      localId,
    } = getState().authentication;
    const response = await axios.get<Record<string, Partial<Product>>>(
      `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/products.json?auth=${idToken}`,
    );
    if (response.status !== 200) throw new Error('Status code not okay!');
    const availableProducts = map(response.data, (v, id) => ({ id, ...v } as Product));
    const userProducts = availableProducts.filter((p) => p.ownerId === localId);
    return {
      availableProducts,
      userProducts,
    };
  },
);

export const addProduct = createAsyncThunk<void, AddProductPayload, ThunkApiConfig>(
  'products/addProduct',
  async (payload, { getState }) => {
    const {
      idToken,
      localId,
    } = getState().authentication;
    if (!pushToken) await registerForPushNotificationsAsync();
    const response = await axios.post(
      `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/products.json?auth=${idToken}`, {
        ownerId: localId,
        ownerPushToken: pushToken,
        ...payload,
      },
    );
    if (response.status !== 200) throw new Error('Status code not okay!');
  },
);

export const editProduct = createAsyncThunk<void, EditProductPayload, ThunkApiConfig>(
  'products/editProduct',
  async ({
    productId,
    description,
    imageUri,
    title,
  }, { getState }) => {
    const { idToken } = getState().authentication;
    const response = await axios.patch(
      `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/products/${productId}.json?auth=${idToken}`, {
        description,
        imageUri,
        title,
      },
    );
    if (response.status !== 200) throw new Error('Status code not okay!');
  },
);

export const deleteProduct = createAsyncThunk<{ productId: string }, { productId: string },
ThunkApiConfig>(
  'products/deleteProduct',
  async ({ productId }, { getState }) => {
    const { idToken } = getState().authentication;
    const response = await axios.delete(
      `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/products/${productId}.json?auth=${idToken}`,
    );
    if (response.status !== 200) throw new Error('Status code not okay!');
    return { productId };
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, onPending);
    builder.addCase(addProduct.pending, onPending);
    builder.addCase(editProduct.pending, onPending);
    builder.addCase(deleteProduct.pending, onPending);
    builder.addCase(fetchProducts.fulfilled, onUpdate);
    builder.addCase(addProduct.fulfilled, (state) => onFulfilled(state, 'Product created successfully!', 'You can edit it later.'));
    builder.addCase(editProduct.fulfilled, (state) => onFulfilled(state, 'Product edited successfully!', 'You can edit it again later.'));
    builder.addCase(deleteProduct.fulfilled, (state) => onFulfilled(state, 'Product deleted successfully!', 'You can add new ones later.'));
    builder.addCase(fetchProducts.rejected, (state, action) => onError(state, action, 'Error while fetching for products!'));
    builder.addCase(addProduct.rejected, (state, action) => onError(state, action, 'Product creation error!'));
    builder.addCase(editProduct.rejected, (state, action) => onError(state, action, 'Product edition error!'));
    builder.addCase(deleteProduct.rejected, (state, action) => onError(state, action, 'Product deletion error!'));
  },
});

export default productsSlice.reducer;
