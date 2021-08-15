import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import Colors from '../constants/Colors';
import { MealCategoriesParamList } from '../navigation/types';
import DummyCategories from '../data/DummyCategories';
import { View } from '../components/Themed';
import { SemiBoldText } from '../components/StyledText';
import MealsList from '../components/MealsList';
import useColorScheme from '../hooks/useColorScheme';
import useAppSelector from '../hooks/useAppSelector';

export default function CategoryMealsScreen({
  route,
  navigation,
}: StackScreenProps<MealCategoriesParamList, 'CategoryMeals'>) {
  const { categoryId } = route.params;
  const colorScheme = useColorScheme();
  const filteredMeals = useAppSelector((state) => state.meals.filteredMeals);

  const category = DummyCategories.find((c) => c.id === categoryId);
  if (!category) return null;

  const { title } = category;
  useLayoutEffect(() => navigation.setOptions({ title }), [navigation, title]);

  const meals = filteredMeals.filter((m) => m.categoryIds.includes(categoryId));

  return meals && meals.length > 0 ? (
    <MealsList
      meals={meals}
      onMealPress={(mealId) => navigation.navigate('MealDetails', { mealId })}
    />
  ) : (
    <View style={styles.fallbackContainer}>
      <SemiBoldText style={[styles.fallback, { color: Colors[colorScheme].info }]}>
        No meals found, maybe check your filters.
      </SemiBoldText>
    </View>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    fontSize: 20,
    marginHorizontal: 20,
  },
});
