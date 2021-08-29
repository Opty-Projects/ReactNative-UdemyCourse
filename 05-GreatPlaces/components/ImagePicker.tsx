import * as React from 'react';
import { MutableRefObject, useState } from 'react';
import {
  StyleSheet, View, Image, ActivityIndicator,
} from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import {
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
  launchCameraAsync,
  launchImageLibraryAsync,
  ImagePickerOptions,
} from 'expo-image-picker';
import { ImagePickerResult } from 'expo-image-picker/src/ImagePicker.types';

import Colors from '../constants/Colors';
import { RegularText, SemiBoldText } from './UI/StyledText';
import Card from './UI/Card';
import CustomButton from './UI/CustomButton';
import useColorScheme from '../hooks/useColorScheme';
import alert from '../utils/alert';

interface ImagePickerProps {
  label: string
  imageUriRef: MutableRefObject<string | undefined>
}

export default function ImagePicker({
  label,
  imageUriRef,
}: ImagePickerProps) {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string>();
  const options: ImagePickerOptions = {
    allowsEditing: true,
    aspect: [1, 1],
  };

  const onGetImageUriFromCamera = async () => {
    try {
      setIsLoading(true);
      const { granted } = await requestCameraPermissionsAsync();
      if (granted) {
        onImageUriResult(await launchCameraAsync(options));
      } else {
        alert('Insufficient permissions!', 'You must give permissions to access the camera to continue.');
      }
    } catch (e) {
      alert('Error launching camera!', e);
    } finally {
      setIsLoading(false);
    }
  };
  const onGetImageUriFromGallery = async () => {
    try {
      setIsLoading(true);
      const { granted } = await requestMediaLibraryPermissionsAsync();
      if (granted) {
        onImageUriResult(await launchImageLibraryAsync(options));
      } else {
        alert('Insufficient permissions!', 'You must give permissions to access the gallery to continue.');
      }
    } catch (e) {
      alert('Error launching gallery!', e);
    } finally {
      setIsLoading(false);
    }
  };
  const onImageUriResult = (result: ImagePickerResult) => {
    if (!result.cancelled) {
      imageUriRef.current = result.uri;
      setImageUri(imageUriRef.current);
    }
  };

  return (
    <Card style={[styles.container, { borderColor: Colors[colorScheme].primary }]}>
      <SemiBoldText style={[styles.label, { borderColor: Colors[colorScheme].secondary }]}>
        {label}
      </SemiBoldText>
      {isLoading ? (
        <View style={styles.section}>
          <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
        </View>
      ) : (
        <View>
          <View style={styles.section}>
            <CustomButton
              onPress={onGetImageUriFromCamera}
              color={Colors[colorScheme].success}
            >
              <FontAwesome5 name="camera" size={24} color={Colors[colorScheme].accent} />
              <RegularText style={{ color: Colors[colorScheme].background }}>
                Take image from camera
              </RegularText>
            </CustomButton>
          </View>
          <View style={styles.section}>
            <CustomButton
              onPress={onGetImageUriFromGallery}
              color={Colors[colorScheme].success}
            >
              <MaterialIcons name="camera-roll" size={24} color={Colors[colorScheme].accent} />
              <RegularText style={{ color: Colors[colorScheme].background }}>
                Choose image from gallery
              </RegularText>
            </CustomButton>
          </View>
        </View>
      )}
      {imageUri ? (
        <View style={[styles.imageContainer, { borderColor: Colors[colorScheme].primary }]}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      ) : (
        <RegularText style={[styles.warning, { color: Colors[colorScheme].info }]}>
          Please select an image.
        </RegularText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  section: {
    marginTop: 10,
  },
  imageContainer: {
    borderWidth: 1,
    marginTop: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  warning: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});
