import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Colors from '../constants/Colors';
import { DrawerParamList, FiltersStackParamList } from './types';
import BottomTabNavigator from './BottomTabNavigator';
import MealFiltersScreen from '../screens/MealFiltersScreen';
import useColorScheme from '../hooks/useColorScheme';

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerStyle={{ backgroundColor: Colors[colorScheme].primary }}
      drawerContentOptions={{
        labelStyle: { fontFamily: 'OpenSans-SemiBold' },
        activeTintColor: Colors[colorScheme].accent,
        inactiveTintColor: '#fff',
      }}
    >
      <Drawer.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ title: 'Meals' }}
      />
      <Drawer.Screen name="Filters" component={FiltersNavigator} />
    </Drawer.Navigator>
  );
}

const FiltersStack = createStackNavigator<FiltersStackParamList>();

function FiltersNavigator() {
  const colorScheme = useColorScheme();

  return (
    <FiltersStack.Navigator screenOptions={{
      headerTitleStyle: { fontFamily: 'OpenSans-SemiBold' },
      headerTintColor: Colors[colorScheme].accent,
      headerStyle: { backgroundColor: Colors[colorScheme].primary },
    }}
    >
      <FiltersStack.Screen
        name="MealFilters"
        component={MealFiltersScreen}
        options={{ title: 'Meal Filters' }}
      />
    </FiltersStack.Navigator>
  );
}
