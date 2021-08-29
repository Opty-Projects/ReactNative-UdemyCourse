import * as React from 'react';
import {
  HeaderButton,
  HeaderButtons,
  HeaderButtonProps,
  HeaderButtonsProps,
} from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';

const MaterialIconsHeaderButtonComponent = (props: HeaderButtonProps) => (
  <HeaderButton IconComponent={MaterialIcons} iconSize={24} {...props} />
);

export default function MaterialIconsHeaderButtons({
  children,
  ...otherProps
}: HeaderButtonsProps) {
  return (
    <HeaderButtons HeaderButtonComponent={MaterialIconsHeaderButtonComponent} {...otherProps}>
      {children}
    </HeaderButtons>
  );
}
