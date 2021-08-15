/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import React from 'react';
import { Text as DefaultText, View as DefaultView } from 'react-native';
import { HeaderButton as DefaultHeaderButton } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[theme][colorName];
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type HeaderButtonProps = ThemeProps & DefaultHeaderButton['props'];

export function Text(props: TextProps) {
  const {
    style,
    lightColor,
    darkColor,
    ...otherProps
  } = props;
  const color = useThemeColor({
    light: lightColor,
    dark: darkColor,
  }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const {
    style,
    lightColor,
    darkColor,
    ...otherProps
  } = props;
  const backgroundColor = useThemeColor({
    light: lightColor,
    dark: darkColor,
  }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function HeaderButton(props: HeaderButtonProps) {
  const {
    lightColor,
    darkColor,
    ...otherProps
  } = props;
  const color = useThemeColor({
    light: lightColor,
    dark: darkColor,
  }, 'background');

  return (
    <DefaultHeaderButton
      IconComponent={MaterialIcons}
      iconSize={24}
      color={color}
      {...otherProps}
    />
  );
}
