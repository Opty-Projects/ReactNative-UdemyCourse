import React, { useState } from 'react';
import {
  StyleSheet,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  Text,
  Alert
} from 'react-native';
import PropTypes from 'prop-types';
import Card from '../components/Card';
import Input from '../components/Input';
import NumberContainer from '../components/NumberContainer';
import CustomButton from '../components/CustomButton';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';

export default function StartGameScreen({
  windowWidth,
  windowHeight,
  onStartGame
}) {
  const [value, setValue] = useState('');
  const [selectedNumber, setSelectedNumber] = useState();

  const selectNumberHandler = () => {
    const parsedValue = parseInt(value, 10);
    if (Number.isNaN(parsedValue) || parsedValue <= 0 || parsedValue >= 100) {
      Alert.alert(
        'Invalid Number!',
        'Number must be between 1 and 99.', [{
          text: 'Okay',
          style: 'destructive',
          onPress: () => setValue('')
        }]
      );
      return;
    }
    Keyboard.dismiss();
    setValue('');
    setSelectedNumber(parsedValue);
  };

  let summary;
  if (selectedNumber) {
    summary = (
      <Card
        windowHeight={windowHeight}
        style={[
          styles.summaryCard, {
            paddingTop: (windowHeight > 600 ? 25 : 20) + 5,
            paddingBottom: (windowHeight > 600 ? 25 : 20) - 10,
            paddingHorizontal: windowHeight > 600 ? 25 : 20,
            marginVertical: windowHeight / 80
          }
        ]}
      >
        <Text style={GlobalStyles.bodyFont}>You selected</Text>
        <NumberContainer>{selectedNumber}</NumberContainer>
        <CustomButton windowWidth={windowWidth} onPress={() => onStartGame(selectedNumber)}>
          Start Game
        </CustomButton>
      </Card>
    );
  }

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container, { paddingTop: windowHeight > 600 ? 30 : 15 }]}>
          <Text
            style={[GlobalStyles.titleFont, styles.title, { marginVertical: windowHeight / 80 }]}
          >
            Start a New Game!
          </Text>
          <Card windowHeight={windowHeight} style={styles.inputCard}>
            <Input
              placeholder="Select a Number"
              onChangeText={(changedValue) => setValue(changedValue.replace(/[^0-9]/g, ''))}
              value={value}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={2}
              blurOnSubmit
              style={[GlobalStyles.bodyFont, styles.input, { marginVertical: windowHeight / 80 }]}
            />
            <View style={[styles.buttonsContainer, { marginVertical: windowHeight / 80 }]}>
              <CustomButton
                windowWidth={windowWidth}
                onPress={() => {
                  setValue('');
                  setSelectedNumber(null);
                }}
                style={styles.accentButton}
              >
                Reset
              </CustomButton>
              <CustomButton
                windowWidth={windowWidth}
                onPress={selectNumberHandler}
              >
                Confirm
              </CustomButton>
            </View>
          </Card>
          {summary}
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

StartGameScreen.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  onStartGame: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 5
  },
  title: {
    color: Colors.accent
  },
  inputCard: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  input: {
    width: 150,
    textAlign: 'center'
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  accentButton: {
    backgroundColor: Colors.accent
  },
  summaryCard: {
    alignItems: 'center'
  }
});
