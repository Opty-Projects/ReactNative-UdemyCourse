import * as React from 'react';
import {
  StyleSheet, ScrollView, View, TextInput,
} from 'react-native';
import {
  RefObject, useCallback, useLayoutEffect, useRef,
} from 'react';
import { LatLng } from 'react-native-maps';
import { Item } from 'react-navigation-header-buttons';
import { LinearGradient } from 'expo-linear-gradient';
import { mapValues, pick } from 'lodash';

import Colors from '../constants/Colors';
import { RootStackScreenProps } from '../navigation/types';
import MaterialIconsHeaderButtons from '../components/UI/MaterialIconsHeaderButtons';
import useColorScheme from '../hooks/useColorScheme';
import useFormReducer, { FormActionType } from '../hooks/useFormReducer';
import Input from '../components/UI/Input';
import ImagePicker from '../components/ImagePicker';
import LocationPicker from '../components/LocationPicker';
import useAppDispatch from '../hooks/useAppDispatch';
import { addPlace } from '../store/slices/places';
import alert from '../utils/alert';

type Label = 'title';

export default function NewPlacesScreen({ navigation, route }: RootStackScreenProps<'NewPlaces'>) {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const refs: Record<Label, RefObject<TextInput>> = {
    title: useRef<TextInput>(null),
  };
  const thumbnailUriRef = useRef<string>();
  const locationRef = useRef<LatLng>();
  if (route.params) locationRef.current = route.params.location;
  const [{
    values,
    isValid,
  }, formDispatch] = useFormReducer<Label>({
    values: {
      title: {
        value: '',
        validity: false,
      },
    },
    isValid: false,
  });

  const onGoToMap = useCallback(() => navigation.navigate('Map', {
    initialLocation: locationRef.current,
    readonly: false,
  }), [navigation, locationRef.current]);
  const onSave = useCallback(async () => {
    if (isValid && thumbnailUriRef.current && locationRef.current) {
      dispatch(addPlace({
        ...mapValues(pick(values, ['title'] as Label[]), (o) => o.value),
        thumbnailUri: thumbnailUriRef.current,
        ...locationRef.current,
      }));
      navigation.goBack();
    } else {
      alert('The form is invalid!', 'Please fix them with the help of the error messages.');
    }
  }, [navigation, isValid, values]);
  useLayoutEffect(() => navigation.setOptions({
    headerRight: () => (
      <MaterialIconsHeaderButtons>
        <Item
          title="save"
          iconName="save"
          color={Colors[colorScheme].accent}
          onPress={onSave}
        />
      </MaterialIconsHeaderButtons>
    ),
  }), [navigation, colorScheme, onSave]);

  const onInputUpdate = useCallback((label: Label, value: string, validity: boolean) => {
    formDispatch({
      type: FormActionType.InputUpdate,
      payload: {
        label,
        value: {
          value,
          validity,
        },
      },
    });
  }, [formDispatch]);
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={[Colors[colorScheme].accent, Colors[colorScheme].primary]}
        style={styles.container}
      >
        <Input
          ownRef={refs.title}
          label="Title"
          initialValue={values.title.value}
          onChangeValue={(value, validity) => onInputUpdate('title', value, validity)}
          isRequired
          minLength={5}
          maxLength={20}
          autoCapitalize="words"
        />
        <View style={styles.section}>
          <ImagePicker label="Thumbnail" imageUriRef={thumbnailUriRef} />
        </View>
        <View style={styles.section}>
          <LocationPicker label="Location" locationRef={locationRef} onGoToMap={onGoToMap} />
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    width: '100%',
  },
});
