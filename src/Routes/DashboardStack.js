import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Content from '../screens/Dashboard/Content';
import Preference from '../screens/Dashboard/Preference/Preference';
import ViewAllContent from '../screens/Dashboard/ViewAllContent';
import Assessment from '../screens/Assessment/Assessment';
import InprogressTestView from '../screens/Assessment/InprogressTestView';
import AnswerKeyView from '../screens/Assessment/AnswerKeyView';
import CompleteTestView from '../screens/Assessment/CompleteTestView ';

const Stack = createNativeStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Assessment" component={Assessment} />
      <Stack.Screen name="InprogressTestView" component={InprogressTestView} />
      <Stack.Screen name="CompleteTestView" component={CompleteTestView} />
      <Stack.Screen name="AnswerKeyView" component={AnswerKeyView} />
      <Stack.Screen name="Content" component={Content} />
      <Stack.Screen name="Preference" component={Preference} />
      <Stack.Screen name="ViewAll" component={ViewAllContent} />
    </Stack.Navigator>
  );
};

export default DashboardStack;
