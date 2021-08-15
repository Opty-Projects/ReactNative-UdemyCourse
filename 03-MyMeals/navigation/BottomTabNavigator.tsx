import React, { ComponentProps, useState } from 'react';
import { Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Colors from '../constants/Colors';
import { BottomTabParamList, MealCategoriesParamList, FavoriteMealsParamList } from './types';
import MealCategoriesScreen from '../screens/MealCategoriesScreen';
import CategoryMealsScreen from '../screens/CategoryMealsScreen';
import MealDetailsScreen from '../screens/MealDetailsScreen';
import FavoriteMealsScreen from '../screens/FavoriteMealsScreen';
import useColorScheme from '../hooks/useColorScheme';

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const [inactiveColor, setInactiveColor] = useState('#fff');
  const [activeColor, setActiveColor] = useState(Colors[colorScheme].accent);

  return (
    <BottomTab.Navigator
      inactiveColor={inactiveColor}
      activeColor={activeColor}
      shifting
    >
      <BottomTab.Screen
        name="MealCategories"
        component={MealCategoriesNavigator}
        options={{
          // @ts-ignore
          title: tabBarLabel('Meal Categories'),
          tabBarIcon: tabBarIcon('category'),
          tabBarColor: Colors[colorScheme].primary,
        }}
        listeners={{
          tabPress: () => {
            setInactiveColor('#fff');
            setActiveColor(Colors[colorScheme].accent);
          },
        }}
      />
      <BottomTab.Screen
        name="FavoriteMeals"
        component={FavoriteMealsNavigator}
        options={{
          // @ts-ignore
          title: tabBarLabel('Favorite Meals'),
          tabBarIcon: tabBarIcon('star'),
          tabBarColor: Colors[colorScheme].accent,
        }}
        listeners={{
          tabPress: () => {
            setInactiveColor('#000');
            setActiveColor(Colors[colorScheme].primary);
          },
        }}
      />
    </BottomTab.Navigator>
  );
}

const tabBarLabel = (label: string) => (
  <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>{label}</Text>
);

const tabBarIcon = (name: ComponentProps<typeof MaterialIcons>['name']) => ({ color }: { color: string }) => (
  <MaterialIcons
    name={name}
    color={color}
    size={26}
    style={{ marginBottom: -3 }}
  />
);

const MealCategoriesStack = createStackNavigator<MealCategoriesParamList>();
const FavoriteMealsStack = createStackNavigator<FavoriteMealsParamList>();

function MealCategoriesNavigator() {
  const colorScheme = useColorScheme();

  return (
    <MealCategoriesStack.Navigator screenOptions={{
      headerTitleStyle: { fontFamily: 'OpenSans-SemiBold' },
      headerTintColor: Colors[colorScheme].accent,
      headerStyle: { backgroundColor: Colors[colorScheme].primary },
    }}
    >
      <MealCategoriesStack.Screen
        name="MealCategories"
        component={MealCategoriesScreen}
        options={{ title: 'Meal Categories' }}
      />
      <MealCategoriesStack.Screen
        name="CategoryMeals"
        component={CategoryMealsScreen}
        options={{ title: 'Category Meals' }}
      />
      <MealCategoriesStack.Screen
        name="MealDetails"
        component={MealDetailsScreen}
        options={{ title: 'Meal Details' }}
      />
    </MealCategoriesStack.Navigator>
  );
}

function FavoriteMealsNavigator() {
  const colorScheme = useColorScheme();

  return (
    <FavoriteMealsStack.Navigator screenOptions={{
      headerTitleStyle: { fontFamily: 'OpenSans-SemiBold' },
      headerTintColor: Colors[colorScheme].primary,
      headerStyle: { backgroundColor: Colors[colorScheme].accent },
    }}
    >
      <FavoriteMealsStack.Screen
        name="FavoriteMeals"
        component={FavoriteMealsScreen}
        options={{ title: 'Favorite Meals' }}
      />
      <FavoriteMealsStack.Screen
        name="MealDetails"
        component={MealDetailsScreen}
        options={{ title: 'Meal Details' }}
      />
    </FavoriteMealsStack.Navigator>
  );
}
