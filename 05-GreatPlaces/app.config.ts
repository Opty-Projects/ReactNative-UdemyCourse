import { ExpoConfig } from '@expo/config';
import 'dotenv/config';

export interface Extra {
  GOOGLE_API_KEY: string
}

export default <Omit<ExpoConfig, 'extra'> & { extra: Extra }>{
  name: 'Great Places',
  slug: 'GreatPlaces',
  version: '1.1.1',
  orientation: 'default',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: [
    '**/*',
  ],
  ios: {
    bundleIdentifier: 'com.OptyProjects.GreatPlaces',
    buildNumber: '1.1.1',
    supportsTablet: true,
  },
  android: {
    package: 'com.OptyProjects.GreatPlaces',
    versionCode: 3,
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'FOREGROUND_SERVICE',
    ],
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_API_KEY,
      },
    },
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
  description: 'Demo of the 5th application I created in Udemy\'s React Native Course.',
  githubUrl: 'https://github.com/Opty-Projects/ReactNative-UdemyCourse',
};
