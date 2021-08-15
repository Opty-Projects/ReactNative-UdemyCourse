import React from 'react';

import Colors from '../constants/Colors';
import Meal from '../models/Meal';
import List, { RenderTileParams } from './List';
import MealTile from './MealTile';
import useColorScheme from '../hooks/useColorScheme';

interface MealsListParams {
  meals: Meal[]
  onMealPress: (mealId: string) => void
}

export default function MealsList({
  meals,
  onMealPress,
}: MealsListParams) {
  const colorScheme = useColorScheme();

  const renderMealTile = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
    width,
    height,
  }: RenderTileParams<Meal>) => (
    <MealTile
      meal={dataInfo.item}
      containerStyle={{
        marginHorizontal,
        marginVertical,
        width,
        height,
        borderColor: Colors[colorScheme].primary,
      }}
      onPress={() => onMealPress(dataInfo.item.id)}
    />
  );

  return (
    <List data={meals} renderTile={renderMealTile} numColumns={1} numRows={2} />
  );
}
