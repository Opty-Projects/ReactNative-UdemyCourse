import React, { ReactElement } from 'react';
import {
  ListRenderItemInfo, StyleSheet, FlatList, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

export interface RenderTileProps<T> {
  dataInfo: ListRenderItemInfo<T>
  marginHorizontal: number
  marginVertical: number
  width: number
}

interface GridProps<T = any> {
  data: T[]
  renderTile: (info: RenderTileProps<T>) => ReactElement
  numColumns: number
  numRows: number
  refreshing?: boolean | null
  onRefresh?: (() => void) | null
}

export default function Grid({
  data,
  renderTile,
  numColumns,
  numRows,
  refreshing = null,
  onRefresh = null,
}: GridProps) {
  const windowDimensions = useWindowDimensions();
  const colorScheme = useColorScheme();

  const inLandscape = windowDimensions.width > windowDimensions.height;
  const numColumnsDynamic = inLandscape ? numRows : numColumns;

  const marginHorizontal = windowDimensions.height / 100;
  const marginVertical = windowDimensions.height / 100;
  const width = windowDimensions.width / numColumnsDynamic - 2 * marginHorizontal;

  return (
    <LinearGradient
      colors={[Colors[colorScheme].accent, Colors[colorScheme].primary]}
      style={styles.container}
    >
      <FlatList
        key={numColumnsDynamic}
        data={data}
        renderItem={(dataInfo) => renderTile({
          dataInfo,
          marginHorizontal,
          marginVertical,
          width,
        })}
        numColumns={numColumnsDynamic}
        style={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
});
