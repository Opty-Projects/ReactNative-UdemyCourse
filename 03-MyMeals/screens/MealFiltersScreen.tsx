import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, Switch } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import Colors from '../constants/Colors';
import { DrawerParamList } from '../navigation/types';
import { HeaderButton, View } from '../components/Themed';
import { RegularText, SemiBoldText } from '../components/StyledText';
import useColorScheme from '../hooks/useColorScheme';
import useAppDispatch from '../hooks/useAppDispatch';
import { applyFilters } from '../store/slices/meals';

const FILTERS = [
  'Gluten-Free',
  'Lactose-Free',
  'Vegan',
  'Vegetarian',
];

export default function MealFiltersScreen({
  navigation,
}: StackScreenProps<DrawerParamList, 'Filters'>) {
  const colorScheme = useColorScheme();
  const [isActive, setIsActive] = useState(Array(FILTERS.length)
    .fill(false));
  const dispatch = useAppDispatch();

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
  useLayoutEffect(() => navigation.setOptions({
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName="save"
          color="#fff"
          onPress={() => {
            dispatch(applyFilters({
              isGlutenFree: isActive[0],
              isLactoseFree: isActive[1],
              isVegan: isActive[2],
              isVegetarian: isActive[3],
            }));
          }}
        />
      </HeaderButtons>
    ),
  }), [navigation, dispatch, applyFilters, isActive]);

  const Filter = ({
    filter,
    index,
  }: { filter: string, index: number }) => (
    <View style={styles.filterContainer}>
      <RegularText>{filter}</RegularText>
      <Switch
        trackColor={{
          false: Colors[colorScheme].secondary,
          true: Colors[colorScheme].primary,
        }}
        thumbColor={Colors[colorScheme].accent}
        value={isActive[index]}
        onValueChange={(newIsActiveValue) => setIsActive((currIsActive) => {
          const newIsActive = [...currIsActive];
          newIsActive[index] = newIsActiveValue;
          return newIsActive;
        })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <SemiBoldText style={styles.title}>Available Filters</SemiBoldText>
      {FILTERS.map((filter, index) => (
        <Filter
          key={index.toString()}
          filter={filter}
          index={index}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    marginVertical: 20,
  },
  filterContainer: {
    width: '100%',
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
