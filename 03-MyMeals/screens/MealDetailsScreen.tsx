import React, { useLayoutEffect, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigationState, useNavigationState } from '@react-navigation/native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import Colors from '../constants/Colors';
import { MealCategoriesParamList, FavoriteMealsParamList } from '../navigation/types';
import { View, HeaderButton } from '../components/Themed';
import { SemiBoldText, RegularText } from '../components/StyledText';
import MealTile from '../components/MealTile';
import useDimensions from '../hooks/useDimensions';
import useColorScheme from '../hooks/useColorScheme';
import useAppSelector from '../hooks/useAppSelector';
import useAppDispatch from '../hooks/useAppDispatch';
import { toggleFavorite } from '../store/slices/meals';

export default function MealDetailsScreen({
  route,
  navigation,
}: StackScreenProps<MealCategoriesParamList | FavoriteMealsParamList, 'MealDetails'>) {
  const { mealId } = route.params;
  const colorScheme = useColorScheme();
  const routeNames = useNavigationState((state: NavigationState) => state.routeNames);
  const dimensions = useDimensions();
  const dispatch = useAppDispatch();
  const allMeals = useAppSelector((state) => state.meals.allMeals);
  const isFavorite = useAppSelector((state) => (
    state.meals.favoriteMeals.some((m) => m.id === mealId)
  ));
  const onToggleFavorite = useCallback(() => {
    dispatch(toggleFavorite({ mealId }));
  }, [dispatch, toggleFavorite, mealId]);

  const meal = allMeals.find((m) => m.id === mealId);
  if (!meal) return null;

  const unmarkedColor = routeNames[0] === 'FavoriteMeals' ? '#000' : '#fff';
  const markedColor = Colors[colorScheme][routeNames[0] === 'FavoriteMeals' ? 'primary' : 'accent'];

  const {
    title,
    ingredients,
    steps,
  } = meal;
  useLayoutEffect(() => navigation.setOptions({ title }), [navigation, title]);
  useLayoutEffect(() => navigation.setOptions({
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Favorite"
          iconName="star"
          color={isFavorite ? markedColor : unmarkedColor}
          onPress={onToggleFavorite}
        />
      </HeaderButtons>
    ),
  }), [navigation, isFavorite, markedColor, unmarkedColor, onToggleFavorite]);

  const Content = ({
    content,
    index,
  }: { content: string, index: number }) => (
    <View style={[styles.contentContainer, { borderColor: Colors[colorScheme].primary }]}>
      <SemiBoldText style={styles.numbering}>
        #
        {index + 1}
      </SemiBoldText>
      <RegularText style={styles.content}>{content}</RegularText>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <MealTile
          meal={meal}
          containerStyle={[styles.mealTileContainer, {
            height: dimensions.height / 2,
            borderColor: Colors[colorScheme].primary,
          }]}
        />
        <SemiBoldText style={styles.label}>Ingredients</SemiBoldText>
        {ingredients.map((content, index) => (
          <Content
            key={index.toString()}
            content={content}
            index={index}
          />
        ))}
        <SemiBoldText style={styles.label}>Steps</SemiBoldText>
        {steps.map((content, index) => (
          <Content
            key={index.toString()}
            content={content}
            index={index}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealTileContainer: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderWidth: 1,
  },
  numbering: {
    width: 30,
  },
  content: {
    flex: 1,
  },
});
