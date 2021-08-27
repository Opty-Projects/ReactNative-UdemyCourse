/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';
import axios from 'axios';
import moment from 'moment';

import { FIREBASE_WEB_API_KEY } from '@env';
import { AppDispatch, ThunkApiConfig } from '../index';
import { onPending, onUpdate, onError } from '../../utils/ThunkActions';

export type LoginAction = typeof signIn | typeof signUp;

export interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  idToken: string
  refreshToken: string
  expiresIn: string
  localId: string
}

interface RefreshTokenResponse {
  id_token: string
  refresh_token: string
  expires_in: string
  user_id: string
}

interface ErrorResponse {
  error: {
    errors: [{
      domain: string
      reason: string
      message: string
    }]
    code: number
    message: string
  }
}

interface State {
  idToken: string | null
  refreshToken: string | null
  localId: string | null
  expirationDate: string | null
  isLoading: boolean
}

const initialState: State = {
  idToken: null,
  refreshToken: null,
  localId: null,
  expirationDate: null,
  isLoading: false,
};

const setAuthState = async (payload: LoginResponse): Promise<Partial<State>> => {
  const {
    idToken,
    refreshToken,
    localId,
    expiresIn,
  } = payload;
  const expirationDate = moment()
    .add(expiresIn, 's')
    .toISOString();
  await setItemAsync('idToken', idToken);
  await setItemAsync('refreshToken', refreshToken);
  await setItemAsync('localId', localId);
  await setItemAsync('expirationDate', expirationDate);
  return {
    idToken,
    refreshToken,
    localId,
    expirationDate,
  };
};

const newAuthState = async (refreshToken?: string | null): Promise<Partial<State>> => {
  if (!refreshToken) return {};
  let response;
  try {
    response = await axios.post<RefreshTokenResponse>(
      `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_WEB_API_KEY}`, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
    );
  } catch (e) {
    const { error }: ErrorResponse = e.response.data;
    throw new Error(error.message);
  }
  if (response.status !== 200) throw new Error('Status code not okay!');
  return setAuthState({
    idToken: response.data.id_token,
    refreshToken: response.data.refresh_token,
    expiresIn: response.data.expires_in,
    localId: response.data.user_id,
  });
};

let refreshAuthStateTimeout: NodeJS.Timeout;
const setRefreshAuthStateTimeout = (dispatch: AppDispatch, expirationDate?: string | null) => {
  if (!expirationDate) return;
  if (refreshAuthStateTimeout) clearTimeout(refreshAuthStateTimeout);
  refreshAuthStateTimeout = setTimeout(() => dispatch(refreshAuthState()),
    moment(expirationDate)
      .subtract(1, 'm')
      .diff(moment(), 'ms'));
};

export const getAuthState = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'authentication/getAuthState',
  async (_, { dispatch }) => {
    let authState: Partial<State> = { expirationDate: await getItemAsync('expirationDate') };
    if (!authState.expirationDate) return {};
    if (moment(authState.expirationDate)
      .subtract(1, 'm')
      .isAfter(moment())) {
      authState.idToken = await getItemAsync('idToken');
      authState.refreshToken = await getItemAsync('refreshToken');
      authState.localId = await getItemAsync('localId');
    } else {
      authState = await newAuthState(await getItemAsync('refreshToken'));
    }
    setRefreshAuthStateTimeout(dispatch, authState.expirationDate);
    return authState;
  },
);

export const refreshAuthState = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'authentication/refreshAuthState',
  async (_, {
    getState,
    dispatch,
  }) => {
    const { refreshToken } = getState().authentication;
    try {
      const authState = await newAuthState(refreshToken);
      setRefreshAuthStateTimeout(dispatch, authState.expirationDate);
      return authState;
    } catch (e) {
      dispatch(logout);
      throw e;
    }
  },
);

export const signUp = createAsyncThunk<Partial<State>, LoginPayload, ThunkApiConfig>(
  'authentication/signUp',
  async (payload, { dispatch }) => {
    let response;
    try {
      response = await axios.post<LoginResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_WEB_API_KEY}`, {
          ...payload,
          returnSecureToken: true,
        },
      );
    } catch (e) {
      const { error }: ErrorResponse = e.response.data;
      switch (error.message) {
        case 'EMAIL_EXISTS':
          throw new Error('This email address is already in use by another account.');
        case 'OPERATION_NOT_ALLOWED':
          throw new Error('Password login is disabled.');
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          throw new Error('We have blocked all requests for this device due to unusual activity. Please try again later.');
        default:
          throw new Error(error.message);
      }
    }
    if (response.status !== 200) throw new Error('Status code not okay!');
    const authState = await setAuthState(response.data);
    setRefreshAuthStateTimeout(dispatch, authState.expirationDate);
    return authState;
  },
);

export const signIn = createAsyncThunk<Partial<State>, LoginPayload, ThunkApiConfig>(
  'authentication/signIn',
  async (payload, { dispatch }) => {
    let response;
    try {
      response = await axios.post<LoginResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`, {
          ...payload,
          returnSecureToken: true,
        },
      );
    } catch (e) {
      const { error }: ErrorResponse = e.response.data;
      switch (error.message) {
        case 'EMAIL_NOT_FOUND':
          throw new Error('There is no user record corresponding to this email. The user may have been deleted.');
        case 'INVALID_PASSWORD':
          throw new Error('The password is invalid or the user does not have a password.');
        case 'USER_DISABLED':
          throw new Error('This user account has been disabled by an administrator.');
        default:
          throw new Error(error.message);
      }
    }
    if (response.status !== 200) throw new Error('Status code not okay!');
    const authState = await setAuthState(response.data);
    setRefreshAuthStateTimeout(dispatch, authState.expirationDate);
    return authState;
  },
);

export const logout = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'authentication/logout',
  async () => {
    if (refreshAuthStateTimeout) clearTimeout(refreshAuthStateTimeout);
    await deleteItemAsync('idToken');
    await deleteItemAsync('refreshToken');
    await deleteItemAsync('localId');
    await deleteItemAsync('expirationDate');
    return {
      idToken: null,
      refreshToken: null,
      localId: null,
      expirationDate: null,
    };
  },
);

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAuthState.pending, onPending);
    builder.addCase(refreshAuthState.pending, onPending);
    builder.addCase(signUp.pending, onPending);
    builder.addCase(signIn.pending, onPending);
    builder.addCase(logout.pending, onPending);
    builder.addCase(getAuthState.fulfilled, onUpdate);
    builder.addCase(refreshAuthState.fulfilled, onUpdate);
    builder.addCase(signUp.fulfilled, onUpdate);
    builder.addCase(signIn.fulfilled, onUpdate);
    builder.addCase(logout.fulfilled, onUpdate);
    builder.addCase(getAuthState.rejected, (state, action) => onError(state, action, 'Error getting authentication state!'));
    builder.addCase(refreshAuthState.rejected, (state, action) => onError(state, action, 'Error refreshing authentication state!'));
    builder.addCase(signUp.rejected, (state, action) => onError(state, action, 'Error signing up!'));
    builder.addCase(signIn.rejected, (state, action) => onError(state, action, 'Error signing in!'));
    builder.addCase(logout.rejected, (state, action) => onError(state, action, 'Error signing out!'));
  },
});

export default authenticationSlice.reducer;
