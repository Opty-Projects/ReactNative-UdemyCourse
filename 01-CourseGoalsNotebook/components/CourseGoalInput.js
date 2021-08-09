import React, { useState } from 'react';
import {
  StyleSheet, Modal, View, TextInput, Button
} from 'react-native';
import PropTypes from 'prop-types';
import Theme from '../Theme';

export default function CourseGoalInput({
  visible,
  onAddCourseGoal,
  onCancel
}) {
  const [courseGoal, setCourseGoal] = useState('');
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TextInput
          placeholder="Course Goal"
          value={courseGoal}
          onChangeText={setCourseGoal}
          style={styles.courseGoalInput}
          placeholderTextColor={Theme.placeholderTextColor}
        />
        <View style={styles.buttonsContainer}>
          <View style={styles.button}>
            <Button
              title="Add"
              onPress={() => {
                onAddCourseGoal(courseGoal);
                setCourseGoal('');
              }}
              color={Theme.primary}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="Cancel"
              onPress={() => {
                onCancel();
                setCourseGoal('');
              }}
              color={Theme.error}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

CourseGoalInput.propTypes = {
  visible: PropTypes.bool.isRequired,
  onAddCourseGoal: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.backgroundColor
  },
  courseGoalInput: {
    width: '90%',
    margin: 20,
    padding: 10,
    color: Theme.textColor,
    borderColor: Theme.primary,
    borderWidth: 1
  },
  buttonsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-evenly',
    width: '90%'
  },
  button: {
    width: '33%'
  }
});
