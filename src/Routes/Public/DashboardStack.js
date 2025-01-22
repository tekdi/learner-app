import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Courses from '../../screens/Dashboard/Courses/Courses';
import ViewAllContent from '../../screens/Dashboard/ViewAllContent';
import CourseContentList from '../../screens/Dashboard/Courses/CourseContentList';
import UnitList from '../../screens/Dashboard/Courses/UnitList';

const Stack = createNativeStackNavigator();

const DashboardStack = ({ CopilotStopped }) => {
  console.log('CopilotSopped', CopilotStopped);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Courses" options={{ lazy: true }}>
        {(props) => <Courses {...props} CopilotStopped={CopilotStopped} />}
      </Stack.Screen>
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
      <Stack.Screen
        name="ViewAll"
        component={ViewAllContent}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
    </Stack.Navigator>
  );
};

export default DashboardStack;
