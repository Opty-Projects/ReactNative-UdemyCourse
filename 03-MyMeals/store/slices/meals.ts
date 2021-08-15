/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import Meal from '../../models/Meal';
import DummyMeals from '../../data/DummyMeals';

interface ToggleFavoritePayload {
  mealId: string
}

interface ApplyFiltersPayload {
  isGlutenFree: boolean
  isLactoseFree: boolean
  isVegan: boolean
  isVegetarian: boolean
}

const mealsSlice = createSlice({
  name: 'meals',
  initialState: {
    allMeals: [...DummyMeals],
    filteredMeals: [...DummyMeals],
    favoriteMeals: [] as Meal[],
  },
  reducers: {
    toggleFavorite(state, action: PayloadAction<ToggleFavoritePayload>) {
      const { mealId } = action.payload;
      const mealIndex = state.favoriteMeals.findIndex((m) => m.id === mealId);
      if (mealIndex < 0) {
        const meal = state.allMeals.find((m) => m.id === mealId);
        if (meal) state.favoriteMeals.push(meal);
      } else {
        state.favoriteMeals.splice(mealIndex, 1);
      }
    },
    applyFilters(state, action: PayloadAction<ApplyFiltersPayload>) {
      const {
        isGlutenFree,
        isLactoseFree,
        isVegan,
        isVegetarian,
      } = action.payload;
      state.filteredMeals = state.allMeals.filter((m) => (!isGlutenFree || m.isGlutenFree)
                && (!isLactoseFree || m.isLactoseFree)
                && (!isVegan || m.isVegan)
                && (!isVegetarian || m.isVegetarian));
    },
  },
});

export const {
  toggleFavorite,
  applyFilters,
} = mealsSlice.actions;
export default mealsSlice.reducer;
