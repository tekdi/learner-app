import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MonthlyCalendar from '../screens/Dashboard/Calendar/MonthlyCalendar';
import SCPDashboard from '../screens/Dashboard/Preference/SCPDashboard/SCPDashboard';
import SessionView from '../screens/Dashboard/Preference/SCPDashboard/SessionView';
import PreviousClassMaterial from '../screens/Dashboard/Preference/SCPDashboard/PreviousClassMaterial';
import MyClassDashboard from '../screens/Dashboard/Preference/SCPDashboard/MyClass/MyClassDashboard';
import MaterialCardView from '../screens/Dashboard/Preference/SCPDashboard/MyClass/MaterialCardView';
import LearningResources from '../screens/Dashboard/Preference/SCPDashboard/MyClass/LearningResources';
import Assessment from '../screens/Assessment/Assessment';
import AssessmentStack from './AssessmentStack';
import TestView from '../screens/Assessment/TestView';
import AnswerKeyView from '../screens/Assessment/AnswerKeyView';
import TestDetailView from '../screens/Assessment/TestDetailView';
import CourseContentList from '@src/screens/Dashboard/Courses/CourseContentList';
import UnitList from '@src/screens/Dashboard/Courses/UnitList';

const Stack = createNativeStackNavigator();

const SCPUserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MyClassDashboard"
        component={MyClassDashboard}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      {/* <Stack.Screen
        name="Assessment"
        component={Assessment}
        options={{ lazy: true }} // Lazily load LoadingScreen
      /> */}
      <Stack.Screen name="TestView" component={TestView} />
      <Stack.Screen name="AnswerKeyView" component={AnswerKeyView} />
      <Stack.Screen name="TestDetailView" component={TestDetailView} />
      <Stack.Screen
        name="MaterialCardView"
        component={MaterialCardView}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      <Stack.Screen
        name="LearningResources"
        component={LearningResources}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      {/* <Stack.Screen
        name="PreviousClassMaterial"
        component={PreviousClassMaterial}
        options={{ lazy: true }} // Lazily load LoadingScreen
      /> */}
      <Stack.Screen
        name="CourseContentList"
        component={CourseContentList}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      <Stack.Screen
        name="UnitList"
        component={UnitList}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
    </Stack.Navigator>
  );
};

export default SCPUserStack;
