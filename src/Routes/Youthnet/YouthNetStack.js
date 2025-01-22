import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import L1Courses from '@src/screens/YouthNet/L1Courses';
import CourseContentList from '@src/screens/Dashboard/Courses/CourseContentList';
import UnitList from '@src/screens/Dashboard/Courses/UnitList';

const Stack = createNativeStackNavigator();

const YouthNetStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="youthNetHome"
        component={L1Courses}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />

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

export default YouthNetStack;
