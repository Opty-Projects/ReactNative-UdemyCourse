import { StackNavigationOptions } from '@react-navigation/stack';

export type DrawerParamList = {
  Root: undefined;
  Filters: undefined;
};

export type BottomTabParamList = {
  MealCategories: StackNavigationOptions;
  FavoriteMeals: StackNavigationOptions;
};

export type MealCategoriesParamList = {
  MealCategories: undefined;
  CategoryMeals: { categoryId: string };
  MealDetails: { mealId: string };
};

export type FavoriteMealsParamList = {
  FavoriteMeals: undefined;
  MealDetails: { mealId: string };
};

export type FiltersStackParamList = {
  MealFilters: undefined
};
