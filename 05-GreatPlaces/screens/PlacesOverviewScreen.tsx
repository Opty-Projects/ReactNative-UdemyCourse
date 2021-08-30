import * as React from 'react';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { Alert } from 'react-native';
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
import { loadPlaces, removePlace } from '../store/slices/places';

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

  const onRemove = useCallback((place: Place) => Alert.alert(
    'Delete place!',
    `Are you sure you want to delete the place "${place.title}"?`, [{
      text: 'Delete',
      onPress: async () => {
        await dispatch(removePlace({ placeId: place.id }));
      },
      style: 'destructive',
    }, {
      text: 'Cancel',
      style: 'cancel',
    }], {
      cancelable: true,
    },
  ), [dispatch]);
  const renderTile = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
    width,
  }: RenderTileProps<Place>) => (
    <PlaceTile
      place={dataInfo.item}
      onPress={() => onGoToPlaceDetails(dataInfo.item.id)}
      onRemove={() => onRemove(dataInfo.item)}
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
