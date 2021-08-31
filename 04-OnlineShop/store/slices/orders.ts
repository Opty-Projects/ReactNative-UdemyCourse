/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { map } from 'lodash';
import moment from 'moment';
import axios from 'axios';

import { FIREBASE_PROJECT_ID } from '@env';
import { ThunkApiConfig } from '../index';
import CartProduct from '../../models/CartProduct';
import Order from '../../models/Order';
import {
  onPending, onFulfilled, onUpdate, onError,
} from '../../utils/ThunkActions';

export interface AddOrderPayload {
  cartProducts: Record<string, CartProduct>
  price: number
}

interface State {
  previousOrders: Order[]
  isLoading: boolean
}

const initialState: State = {
  previousOrders: [],
  isLoading: false,
};

const notify = (cartProducts: Record<string, CartProduct>) => {
  const notifications: Record<string, string> = {};
  Object.values(cartProducts)
    .forEach(({
      ownerPushToken,
      quantity,
      title,
    }) => {
      if (ownerPushToken) {
        if (!notifications[ownerPushToken]) notifications[ownerPushToken] = 'Ordered now:\n';
        notifications[ownerPushToken] += `- ${quantity} units of your product "${title}";`;
      }
    });
  Object.entries(notifications)
    .forEach(([
      pushToken,
      body,
    ]) => {
      axios.post('https://exp.host/--/api/v2/push/send', {
        to: pushToken,
        title: 'Your products have been ordered!',
        body,
      }, {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
      })
      // eslint-disable-next-line no-console
        .then((value) => console.log(value))
      // eslint-disable-next-line no-console
        .catch((reason) => console.error(reason));
    });
};

export const fetchOrders = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'orders/fetchProducts',
  async (_, { getState }) => {
    const {
      idToken,
      localId,
    } = getState().authentication;
    const response = await axios.get<Record<string, Partial<Order>>>(
      `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/orders/${localId}.json?auth=${idToken}`,
    );
    if (response.status !== 200) throw new Error('Status code not okay!');
    const previousOrders = map(response.data, (v, id) => ({ id, ...v } as Order));
    return { previousOrders };
  },
);

export const addOrder = createAsyncThunk<void, AddOrderPayload, ThunkApiConfig>(
  'orders/addOrder',
  async (payload, { getState }) => {
    const {
      idToken,
      localId,
    } = getState().authentication;
    const response = await axios.post(
      `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/orders/${localId}.json?auth=${idToken}`, {
        timestamp: moment()
          .valueOf(),
        ...payload,
      },
    );
    if (response.status !== 200) throw new Error('Status code not okay!');
    notify(payload.cartProducts);
  },
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.pending, onPending);
    builder.addCase(addOrder.pending, onPending);
    builder.addCase(fetchOrders.fulfilled, onUpdate);
    builder.addCase(addOrder.fulfilled, (state) => onFulfilled(state, 'Successfully ordered!', 'It will now appear in your order history.'));
    builder.addCase(fetchOrders.rejected, (state, action) => onError(state, action, 'Error while fetching for orders!'));
    builder.addCase(addOrder.rejected, (state, action) => onError(state, action, 'Order creation error!'));
  },
});

export default ordersSlice.reducer;
