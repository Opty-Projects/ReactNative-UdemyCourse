import React from 'react';
import {
  StyleSheet, ScrollView, View, Text, Image
} from 'react-native';
import { Orientation } from 'expo-screen-orientation';
import PropTypes from 'prop-types';
import NumberContainer from '../components/NumberContainer';
import CustomButton from '../components/CustomButton';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';
import Guessed from '../assets/Guessed.jpg';

export default function GameOverScreen({
  windowWidth,
  windowHeight,
  screenOrientation,
  chosenNumber,
  guessRounds,
  onRestartGame
}) {
  const isInPortrait = screenOrientation === Orientation.PORTRAIT_UP
    || screenOrientation === Orientation.PORTRAIT_DOWN;

  return (
    <ScrollView>
      <View style={[styles.container, { paddingTop: windowHeight > 600 ? 30 : 15 }]}>
        <Text
          style={[GlobalStyles.titleFont, styles.title, { marginVertical: windowHeight / 100 }]}
        >
          The Game is Over!
        </Text>
        <View style={[
          styles.bodyContainer, {
            flexDirection: isInPortrait ? 'column' : 'row',
            marginVertical: windowHeight / 100
          }
        ]}
        >
          <View style={[
            styles.imageContainer, {
              width: windowHeight > 600 ? 250 : 150,
              height: windowHeight > 600 ? 250 : 150,
              marginVertical: windowHeight / 100
            }
          ]}
          >
            <Image
              source={Guessed}
              style={styles.image}
              resizeMode="stretch"
              fadeDuration={1000}
            />
          </View>
          <View style={styles.summaryContainer}>
            <Text style={[GlobalStyles.bodyFont, styles.summary]}>
              Your opponent took
              <Text style={[GlobalStyles.subtitleFont, styles.highlighted]}>
                {` ${guessRounds} `}
              </Text>
              rounds to guess your number:
            </Text>
            <NumberContainer style={{ marginVertical: windowHeight / 100 }}>
              {chosenNumber}
            </NumberContainer>
          </View>
        </View>
        <CustomButton windowWidth={windowWidth} onPress={onRestartGame}>New Game</CustomButton>
      </View>
    </ScrollView>
  );
}

GameOverScreen.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  screenOrientation: PropTypes.number.isRequired,
  chosenNumber: PropTypes.number.isRequired,
  guessRounds: PropTypes.number.isRequired,
  onRestartGame: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 5
  },
  title: {
    color: Colors.success
  },
  bodyContainer: {
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  imageContainer: {
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 40,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  summaryContainer: {
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summary: {
    textAlign: 'center'
  },
  highlighted: {
    color: Colors.accent
  }
});
