import React from 'react';
import { ListRenderItemInfo, StyleSheet, FlatList } from 'react-native';

import { View } from './Themed';
import useDimensions from '../hooks/useDimensions';

export interface RenderTileParams<T> {
  dataInfo: ListRenderItemInfo<T>
  marginHorizontal: number
  marginVertical: number
  width: number
  height: number
}

interface ListParams<T = any> {
  data: T[]
  renderTile: (info: RenderTileParams<T>) => React.ReactElement
  numColumns: number
  numRows: number
}

export default function List({
  data,
  renderTile,
  numColumns,
  numRows,
}: ListParams) {
  const dimensions = useDimensions();

  const inLandscape = dimensions.width > dimensions.height;
  const numColumnsDynamic = inLandscape ? numRows : numColumns;
  const numRowsDynamic = inLandscape ? numColumns : numRows;

  const marginHorizontal = dimensions.height / 100;
  const marginVertical = dimensions.height / 100;
  const width = dimensions.width / numColumnsDynamic - 2 * marginHorizontal;
  const height = dimensions.height / numRowsDynamic - 2 * marginVertical;

  return (
    <View style={styles.container}>
      <FlatList
        key={numColumnsDynamic}
        data={data}
        renderItem={(dataInfo) => renderTile({
          dataInfo,
          marginHorizontal,
          marginVertical,
          width,
          height,
        })}
        numColumns={numColumnsDynamic}
        style={styles.list}
      />
    </View>
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
