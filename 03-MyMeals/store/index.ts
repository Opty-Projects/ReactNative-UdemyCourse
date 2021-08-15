import { configureStore } from '@reduxjs/toolkit';

import meals from './slices/meals';

const store = configureStore({
  reducer: {
    meals,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
