import * as React from 'react';
import { useEffect } from 'react';
import { ColorSchemeName } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import moment from 'moment';

import Colors from '../constants/Colors';
import { RootStackParamList } from './types';
import DrawerNavigator from './DrawerNavigator';
import AuthenticationScreen from '../screens/AuthenticationScreen';
import useColorScheme from '../hooks/useColorScheme';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { getAuthState } from '../store/slices/authentication';

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
  const dispatch = useAppDispatch();
  const expirationDate = useAppSelector(({ authentication }) => authentication.expirationDate);

  useEffect(() => {
    dispatch(getAuthState());
  }, [dispatch]);

  return (
    <RootStack.Navigator screenOptions={{
      headerTitleStyle: { fontFamily: 'OpenSans-SemiBold' },
      headerTintColor: Colors[colorScheme].accent,
      headerStyle: { backgroundColor: Colors[colorScheme].primary },
    }}
    >
      {expirationDate && moment(expirationDate)
        .isAfter(moment()) ? (
          <RootStack.Screen
            name="Drawer"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <RootStack.Screen
            name="Authentication"
            component={AuthenticationScreen}
            options={{
              title: 'Login',
              headerTitleAlign: 'center',
            }}
          />
        )}
    </RootStack.Navigator>
  );
}
