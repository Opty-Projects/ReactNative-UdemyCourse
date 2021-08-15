import React, { useLayoutEffect } from 'react';
import { DrawerActions } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { MealCategoriesParamList } from '../navigation/types';
import DummyCategories from '../data/DummyCategories';
import { HeaderButton } from '../components/Themed';
import CategoriesList from '../components/CategoriesList';

export default function MealCategoriesScreen({
  navigation,
}: StackScreenProps<MealCategoriesParamList, 'MealCategories'>) {
  useLayoutEffect(() => navigation.setOptions({
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="menu"
          color="#fff"
          onPress={() => {
            // eslint-disable-next-line react/prop-types
            navigation.dispatch(DrawerActions.toggleDrawer());
          }}
        />
      </HeaderButtons>
    ),
  }), [navigation]);

  return (
    <CategoriesList
      categories={DummyCategories}
      onCategoryPress={(categoryId) => navigation.navigate('CategoryMeals', { categoryId })}
    />
  );
}
