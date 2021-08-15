import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import Colors from '../constants/Colors';
import { FavoriteMealsParamList } from '../navigation/types';
import { HeaderButton, View } from '../components/Themed';
import { SemiBoldText } from '../components/StyledText';
import MealsList from '../components/MealsList';
import useColorScheme from '../hooks/useColorScheme';
import useAppSelector from '../hooks/useAppSelector';

export default function FavoriteMealsScreen({
  navigation,
}: StackScreenProps<FavoriteMealsParamList, 'FavoriteMeals'>) {
  const colorScheme = useColorScheme();
  const favoriteMeals = useAppSelector((state) => state.meals.favoriteMeals);

  useLayoutEffect(() => navigation.setOptions({
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="menu"
          color="#000"
          onPress={() => {
            // eslint-disable-next-line react/prop-types
            navigation.dispatch(DrawerActions.toggleDrawer());
          }}
        />
      </HeaderButtons>
    ),
  }), [navigation]);

  return favoriteMeals && favoriteMeals.length > 0 ? (
    <MealsList
      meals={favoriteMeals}
      onMealPress={(mealId) => navigation.navigate('MealDetails', { mealId })}
    />
  ) : (
    <View style={styles.fallbackContainer}>
      <SemiBoldText style={[styles.fallback, { color: Colors[colorScheme].info }]}>
        You haven't marked any meal as your favorite yet.
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
