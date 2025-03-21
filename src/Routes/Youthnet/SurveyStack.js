import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SurveyForm from '../../screens/YouthNet/SurveyForm';

const Stack = createNativeStackNavigator();

const SurveyStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="surveys"
        component={SurveyForm}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />

      {/* <Stack.Screen
        name="SkillCenter"
        component={SkillCenter}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      <Stack.Screen
        name="UnitList"
        component={UnitList}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      <Stack.Screen
        name="CourseContentList"
        component={CourseContentList}
        options={{ lazy: true }} // Lazily load LoadingScreen
      /> */}
    </Stack.Navigator>
  );
};

export default SurveyStack;
