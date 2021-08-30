import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Colors from '../constants/Colors';
import { RootStackParamList } from './types';
import PlacesOverviewScreen from '../screens/PlacesOverviewScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import MapScreen from '../screens/MapScreen';
import NewPlacesScreen from '../screens/NewPlacesScreen';
import useColorScheme from '../hooks/useColorScheme';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const colorScheme = useColorScheme();

  return (
    <RootStack.Navigator screenOptions={{
      headerTitleStyle: { fontFamily: 'OpenSans-SemiBold' },
      headerTintColor: Colors[colorScheme].accent,
      headerStyle: { backgroundColor: Colors[colorScheme].primary },
    }}
    >
      <RootStack.Screen
        name="PlacesOverview"
        component={PlacesOverviewScreen}
        options={{ title: 'Places Overview' }}
      />
      <RootStack.Screen
        name="PlaceDetails"
        component={PlaceDetailsScreen}
        options={{ title: 'Place Details' }}
      />
      <RootStack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Map' }}
      />
      <RootStack.Screen
        name="NewPlaces"
        component={NewPlacesScreen}
        options={{ title: 'Add Place' }}
      />
    </RootStack.Navigator>
  );
}
