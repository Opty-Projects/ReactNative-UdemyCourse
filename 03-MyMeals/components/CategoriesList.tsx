import React from 'react';

import Colors from '../constants/Colors';
import Category from '../models/Category';
import List, { RenderTileParams } from './List';
import CategoryTile from './CategoryTile';
import useColorScheme from '../hooks/useColorScheme';

interface CategoriesListParams {
  categories: Category[]
  onCategoryPress: (categoryId: string) => void
}

export default function CategoriesList({
  categories,
  onCategoryPress,
}: CategoriesListParams) {
  const colorScheme = useColorScheme();

  const renderCategoryTile = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
    width,
    height,
  }: RenderTileParams<Category>) => (
    <CategoryTile
      category={dataInfo.item}
      containerStyle={{
        marginHorizontal,
        marginVertical,
        width,
        height,
        backgroundColor: dataInfo.item.color,
        borderColor: Colors[colorScheme].primary,
      }}
      onPress={() => onCategoryPress(dataInfo.item.id)}
    />
  );

  return (
    <List data={categories} renderTile={renderCategoryTile} numColumns={2} numRows={4} />
  );
}
