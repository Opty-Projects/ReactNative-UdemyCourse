import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, FlatList, Alert
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import Card from '../components/Card';
import NumberContainer from '../components/NumberContainer';
import CustomButton from '../components/CustomButton';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';

const genRandomBetween = (minN, maxN) => Math.floor(Math.random() * (maxN - minN - 1)) + minN + 1;

export default function GameScreen({
  windowWidth,
  windowHeight,
  chosenNumber,
  onGameOver
}) {
  const [guess, setGuess] = useState(genRandomBetween(0, 100));
  const [guessesLog, setGuessesLog] = useState([]);
  const currMinNumber = useRef(0);
  const currMaxNumber = useRef(100);

  useEffect(() => {
    if (guess === chosenNumber) onGameOver(guessesLog.length + 1);
  }, [guess]);

  const guessHandler = (guessHint) => {
    if ((guessHint === '-' && guess <= chosenNumber) || (guessHint === '+' && guess >= chosenNumber)) {
      Alert.alert(
        'Do not cheat!',
        'You know you\'re giving the wrong hint...', [{
          text: 'Sorry!',
          style: 'cancel'
        }]
      );
      return;
    }
    if (guessHint === '-') currMaxNumber.current = guess;
    if (guessHint === '+') currMinNumber.current = guess;
    setGuess(genRandomBetween(currMinNumber.current, currMaxNumber.current));
    setGuessesLog((currGuessesLog) => [guess, ...currGuessesLog]);
  };

  const numberContainers = [null, null];
  numberContainers[windowHeight > 600 ? 0 : 1] = (<NumberContainer>{guess}</NumberContainer>);

  return (
    <View style={[styles.container, { paddingTop: windowHeight > 600 ? 30 : 15 }]}>
      <View
        style={[styles.titleContainer, { flexDirection: windowHeight > 600 ? 'column' : 'row' }]}
      >
        <Text style={GlobalStyles.subtitleFont}>
          Round
          <Text style={styles.highlighted}>{` #${guessesLog.length + 1}`}</Text>
        </Text>
        <Text
          style={[GlobalStyles.titleFont, styles.title, { marginVertical: windowHeight / 80 }]}
        >
          Opponent&apos;s Guess
        </Text>
      </View>
      {numberContainers[0]}
      <Card
        windowHeight={windowHeight}
        style={[styles.buttonsCard, { marginVertical: windowHeight / 80 }]}
      >
        <CustomButton windowWidth={windowWidth} onPress={() => guessHandler('-')}>
          <AntDesign
            name="caretdown"
            size={windowHeight > 600 ? 24 : 12}
            color={Colors.white}
          />
        </CustomButton>
        {numberContainers[1]}
        <CustomButton windowWidth={windowWidth} onPress={() => guessHandler('+')}>
          <AntDesign
            name="caretup"
            size={windowHeight > 600 ? 24 : 12}
            color={Colors.white}
          />
        </CustomButton>
      </Card>
      <FlatList
        ListHeaderComponent={(
          <View style={[styles.logContainer, styles.logHeaderContainer]}>
            <Text style={GlobalStyles.subtitleFont}>Round</Text>
            <Text style={GlobalStyles.subtitleFont}>Guess</Text>
          </View>
        )}
        data={guessesLog}
        keyExtractor={(_, index) => index.toString()}
        renderItem={(guessInfo) => (
          <View style={styles.logContainer}>
            <Text style={GlobalStyles.subtitleFont}>
              #
              {guessesLog.length - guessInfo.index}
            </Text>
            <NumberContainer>{guessInfo.item}</NumberContainer>
          </View>
        )}
        style={[styles.guessesLogList, { marginVertical: windowHeight / 80 }]}
      />
    </View>
  );
}

GameScreen.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  chosenNumber: PropTypes.number.isRequired,
  onGameOver: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 5
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  title: {
    color: Colors.error
  },
  highlighted: {
    color: Colors.accent
  },
  buttonsCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  guessesLogList: {
    width: '90%',
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
    borderTopColor: Colors.primary,
    borderTopWidth: 2
  },
  logHeaderContainer: {
    borderBottomColor: Colors.primary,
    paddingVertical: 10
  },
  logContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.secondary,
    borderBottomWidth: 2,
    paddingHorizontal: 10
  }
});
