import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Assessment from '../screens/Assessment/Assessment';
import InprogressTestView from '../screens/Assessment/InprogressTestView';
import AnswerKeyView from '../screens/Assessment/AnswerKeyView';
import CompleteTestView from '../screens/Assessment/CompleteTestView ';

const Stack = createNativeStackNavigator();

const AssessmentStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Assessment" component={Assessment} />
      <Stack.Screen name="InprogressTestView" component={InprogressTestView} />
      <Stack.Screen name="CompleteTestView" component={CompleteTestView} />
      <Stack.Screen name="AnswerKeyView" component={AnswerKeyView} />
    </Stack.Navigator>
  );
};

export default AssessmentStack;
