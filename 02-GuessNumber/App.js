import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import AppLoading from 'expo-app-loading';
import { loadAsync } from 'expo-font';
import {
  getOrientationAsync,
  addOrientationChangeListener,
  removeOrientationChangeListener
} from 'expo-screen-orientation';
import OpenSansBold from './assets/fonts/OpenSans-Bold.ttf';
import OpenSansSemiBold from './assets/fonts/OpenSans-SemiBold.ttf';
import OpenSansRegular from './assets/fonts/OpenSans-Regular.ttf';
import Header from './components/Header';
import StartGameScreen from './screens/StartGameScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';

const loadFontsAsync = () => loadAsync({
  'OpenSans-Bold': OpenSansBold,
  'OpenSans-SemiBold': OpenSansSemiBold,
  'OpenSans-Regular': OpenSansRegular
});

export default function App() {
  const [chosenNumber, setChosenNumber] = useState();
  const [guessRounds, setGuessRounds] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  const [screenOrientation, setScreenOrientation] = useState();

  const setScreenOrientationAsync = async () => setScreenOrientation(await getOrientationAsync());

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get('window').width);
      setWindowHeight(Dimensions.get('window').height);
    };
    Dimensions.addEventListener('change', updateDimensions);

    const orientationChangeSubscription = addOrientationChangeListener((event) => {
      setScreenOrientation(event.orientationInfo.orientation);
    });

    return () => {
      Dimensions.removeEventListener('change', updateDimensions);
      removeOrientationChangeListener(orientationChangeSubscription);
    };
  }, []);

  if (!isDataLoaded) {
    return (
      <AppLoading
        startAsync={() => Promise.all([loadFontsAsync(), setScreenOrientationAsync()])}
        onFinish={() => {
          setIsDataLoaded(true);
        }}
        onError={(err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        }}
      />
    );
  }

  let screen;
  if (chosenNumber && guessRounds === 0) {
    screen = (
      <GameScreen
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        chosenNumber={chosenNumber}
        onGameOver={(nRounds) => setGuessRounds(nRounds)}
      />
    );
  } else if (guessRounds > 0) {
    screen = (
      <GameOverScreen
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        screenOrientation={screenOrientation}
        chosenNumber={chosenNumber}
        guessRounds={guessRounds}
        onRestartGame={() => {
          setGuessRounds(0);
          setChosenNumber(null);
        }}
      />
    );
  } else {
    screen = (
      <StartGameScreen
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        onStartGame={(selectedNumber) => {
          setGuessRounds(0);
          setChosenNumber(selectedNumber);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header windowHeight={windowHeight} title="Guess the Number" />
      {screen}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
