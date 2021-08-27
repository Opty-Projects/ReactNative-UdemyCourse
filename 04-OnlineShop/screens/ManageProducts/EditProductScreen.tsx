import * as React from 'react';
import {
  useLayoutEffect, useCallback, useRef, RefObject,
} from 'react';
import { StyleSheet, ScrollView, TextInput } from 'react-native';
import { Item } from 'react-navigation-header-buttons';
import { LinearGradient } from 'expo-linear-gradient';
import { mapValues, pick } from 'lodash';

import Colors from '../../constants/Colors';
import { ManageProductsStackScreenProps } from '../../navigation/types';
import MaterialIconsHeaderButtons from '../../components/UI/MaterialIconsHeaderButtons';
import Input from '../../components/UI/Input';
import Loading from '../../components/UI/Loading';
import useColorScheme from '../../hooks/useColorScheme';
import useFormReducer, { FormActionType } from '../../hooks/useFormReducer';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { addProduct, editProduct } from '../../store/slices/products';
import alert from '../../utils/alert';

type Label = 'description' | 'imageUri' | 'price' | 'title';

export default function EditProductScreen({
  navigation,
  route,
}: ManageProductsStackScreenProps<'EditProduct'>) {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(({ products }) => products.isLoading);
  const refs: Record<Label, RefObject<TextInput>> = {
    title: useRef<TextInput>(null),
    imageUri: useRef<TextInput>(null),
    price: useRef<TextInput>(null),
    description: useRef<TextInput>(null),
  };

  const { productId } = route.params;
  const product = productId === undefined ? undefined
    : useAppSelector(({ products }) => products.userProducts.find((p) => p.id === productId));
  const [{
    values,
    isValid,
  }, formDispatch] = useFormReducer<Label>({
    values: {
      title: {
        value: product?.title || '',
        validity: !!productId,
      },
      imageUri: {
        value: product?.imageUri || '',
        validity: !!productId,
      },
      price: {
        value: product?.price.toFixed(2) || '',
        validity: !!productId,
      },
      description: {
        value: product?.description || '',
        validity: !!productId,
      },
    },
    isValid: !!productId,
  });

  const onSave = useCallback(async () => {
    if (isValid) {
      const payload = mapValues(pick(values, ['description', 'imageUri', 'title']), (o) => o.value);
      if (productId) {
        await dispatch(editProduct({
          productId,
          ...payload,
        }));
      } else {
        await dispatch(addProduct({
          price: +values.price.value,
          ...payload,
        }));
      }
      navigation.goBack();
    } else {
      alert('The form is invalid!', 'Please fix them with the help of the error messages.');
    }
  }, [navigation, dispatch, isValid, values, productId]);
  useLayoutEffect(() => navigation.setOptions({
    title: productId ? 'Edit Product' : 'Add Product',
  }), [navigation, productId]);
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
  return isLoading ? (
    <Loading />
  ) : (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={[Colors[colorScheme].accent, Colors[colorScheme].primary]}
        style={styles.container}
      >
        <Input
          ownRef={refs.title}
          nextRef={refs.imageUri}
          label="Title"
          initialValue={values.title.value}
          onChangeValue={(value, validity) => onInputUpdate('title', value, validity)}
          isRequired
          minLength={5}
          maxLength={20}
          autoCapitalize="words"
        />
        <Input
          ownRef={refs.imageUri}
          nextRef={productId ? refs.description : refs.price}
          label="Image URL"
          initialValue={values.imageUri.value}
          onChangeValue={(value, validity) => onInputUpdate('imageUri', value, validity)}
          isRequired
          isURL
          textContentType="URL"
          multiline
        />
        <Input
          ownRef={refs.price}
          nextRef={refs.description}
          label="Price"
          initialValue={values.price.value}
          onChangeValue={(value, validity) => onInputUpdate('price', value, validity)}
          isRequired
          min={0}
          max={1000000}
          keyboardType="decimal-pad"
          editable={!productId}
        />
        <Input
          ownRef={refs.description}
          label="Description"
          initialValue={values.description.value}
          onChangeValue={(value, validity) => onInputUpdate('description', value, validity)}
          isRequired
          minLength={25}
          maxLength={100}
          multiline
        />
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
});
