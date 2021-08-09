import React, { useState } from 'react';
import {
  StyleSheet, View, FlatList, Button
} from 'react-native';
import CourseGoalInput from './components/CourseGoalInput';
import CourseGoalItem from './components/CourseGoalItem';
import Theme from './Theme';

export default function App() {
  const [courseGoals, setCourseGoals] = useState([]);
  const [isInputtingNewGoal, setIsInputtingNewGoal] = useState(false);
  return (
    <View style={styles.container}>
      <Button
        title="New Course Goal"
        onPress={() => setIsInputtingNewGoal(true)}
        color={Theme.primary}
      />
      <CourseGoalInput
        visible={isInputtingNewGoal}
        onAddCourseGoal={(cGoal) => {
          setCourseGoals((currCourseGoals) => [...currCourseGoals, cGoal]);
          setIsInputtingNewGoal(false);
        }}
        onCancel={() => setIsInputtingNewGoal(false)}
      />
      <FlatList
        data={courseGoals}
        keyExtractor={(_, index) => index.toString()}
        renderItem={(cGoalData) => (
          <CourseGoalItem
            cGoal={cGoalData.item}
            onDelete={() => {
              setCourseGoals((currCourseGoals) => ([
                ...currCourseGoals.slice(0, cGoalData.index),
                ...currCourseGoals.slice(cGoalData.index + 1)
              ]));
            }}
          />
        )}
        style={styles.courseGoalsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse',
    flex: 1,
    padding: 30,
    backgroundColor: Theme.backgroundColor
  },
  courseGoalsList: {
    marginBottom: 30
  }
});
