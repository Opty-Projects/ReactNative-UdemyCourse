import { configureStore } from '@reduxjs/toolkit';

import places from './slices/places';

const store = configureStore({
  reducer: {
    places,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
