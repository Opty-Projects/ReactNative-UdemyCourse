/* eslint-disable no-param-reassign */

import { WritableDraft } from 'immer/dist/types/types-external';
import { SerializedError } from '@reduxjs/toolkit';

import alert from './alert';

export const onPending = (
  state: WritableDraft<{ isLoading: boolean }>,
) => {
  state.isLoading = true;
};

export const onFulfilled = (
  state: WritableDraft<{ isLoading: boolean }>,
  title: string,
  message: string,
) => {
  alert(title, message);
  state.isLoading = false;
};

export const onUpdate = <S extends { isLoading: boolean }>(
  state: WritableDraft<S>,
  { payload }: { payload: Partial<S> },
) => ({
    ...state,
    ...payload,
    isLoading: false,
  });

export const onError = (
  state: WritableDraft<{ isLoading: boolean }>,
  { error }: { error: SerializedError },
  title: string,
) => {
  alert(title, error.message || 'Unknown!');
  state.isLoading = false;
};
