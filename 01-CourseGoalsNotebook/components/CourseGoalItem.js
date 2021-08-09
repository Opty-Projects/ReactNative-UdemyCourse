import React from 'react';
import {
  StyleSheet, TouchableOpacity, View, Text
} from 'react-native';
import PropTypes from 'prop-types';
import Theme from '../Theme';

export default function CourseGoalItem({
  cGoal,
  onDelete
}) {
  return (
    <TouchableOpacity onPress={() => onDelete()}>
      <View style={styles.container}>
        <Text style={styles.courseGoalText}>{cGoal}</Text>
      </View>
    </TouchableOpacity>
  );
}

CourseGoalItem.propTypes = {
  cGoal: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    backgroundColor: Theme.secondary,
    borderColor: Theme.primary,
    borderWidth: 1
  },
  courseGoalText: {
    color: Theme.textColor
  }
});
