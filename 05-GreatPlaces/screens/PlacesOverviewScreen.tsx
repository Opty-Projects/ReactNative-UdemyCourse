import * as React from 'react';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { Item } from 'react-navigation-header-buttons';

import Colors from '../constants/Colors';
import { RootStackScreenProps } from '../navigation/types';
import Place from '../models/Place';
import MaterialIconsHeaderButtons from '../components/UI/MaterialIconsHeaderButtons';
import Grid, { RenderTileProps } from '../components/UI/Grid';
import Loading from '../components/UI/Loading';
import Fallback from '../components/UI/Fallback';
import PlaceTile from '../components/PlaceTile';
import useColorScheme from '../hooks/useColorScheme';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { loadPlaces } from '../store/slices/places';

export default function PlacesOverviewScreen({ navigation }: RootStackScreenProps<'PlacesOverview'>) {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.places.isLoading);
  const places = useAppSelector((s) => s.places.places);

  useEffect(() => {
    dispatch(loadPlaces());
  }, [dispatch]);

  const onGoToPlaceDetails = useCallback((placeId: string) => navigation.navigate('PlaceDetails', { placeId }), [navigation]);
  const onGoToNewPlaces = useCallback(() => navigation.navigate('NewPlaces'), [navigation]);
  useLayoutEffect(() => navigation.setOptions({
    headerRight: () => (
      <MaterialIconsHeaderButtons>
        <Item
          title="add-location-alt"
          iconName="add-location-alt"
          color={Colors[colorScheme].accent}
          onPress={onGoToNewPlaces}
        />
      </MaterialIconsHeaderButtons>
    ),
  }), [navigation, colorScheme, onGoToNewPlaces]);

  const renderTile = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
    width,
  }: RenderTileProps<Place>) => (
    <PlaceTile
      onPress={() => onGoToPlaceDetails(dataInfo.item.id)}
      place={dataInfo.item}
      containerStyle={{
        marginHorizontal,
        marginVertical,
        width,
        borderWidth: 1,
        borderColor: Colors[colorScheme].primary,
      }}
    />
  );
  return places.length > 0 ? (
    <Grid
      data={places}
      renderTile={renderTile}
      numColumns={1}
      numRows={2}
    />
  ) : isLoading ? (
    <Loading />
  ) : (
    <Fallback message={"You haven't added any places yet."} />
  );
}
