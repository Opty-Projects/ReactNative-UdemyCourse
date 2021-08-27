import * as React from 'react';

import { Text, TextProps } from './Themed';

export function RegularText(props: TextProps) {
  const { style } = props;
  return <Text {...props} style={[style, { fontFamily: 'OpenSans-Regular' }]} />;
}

export function SemiBoldText(props: TextProps) {
  const { style } = props;
  return <Text {...props} style={[style, { fontFamily: 'OpenSans-SemiBold' }]} />;
}

export function BoldText(props: TextProps) {
  const { style } = props;
  return <Text {...props} style={[style, { fontFamily: 'OpenSans-Bold' }]} />;
}
