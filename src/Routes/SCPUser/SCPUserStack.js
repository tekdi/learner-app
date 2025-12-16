import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SCPDashboard from '../../screens/Dashboard/Preference/SCPDashboard/SCPDashboard';
import SessionView from '../../screens/Dashboard/Preference/SCPDashboard/SessionView';
import PreviousClassMaterial from '../../screens/Dashboard/Preference/SCPDashboard/PreviousClassMaterial';
import DuringSession from '../../screens/Dashboard/Preference/SCPDashboard/DuringSession';
import FullAttendance from '../../screens/Dashboard/Calendar/FullAttendance';
import TimeTable from '../../screens/Dashboard/Calendar/TimeTable';
import PreviousClassMaterialFullView from '../../screens/Dashboard/Preference/SCPDashboard/PreviousClassMaterialFullView';
import SubjectDetails from '../../screens/Dashboard/Preference/SCPDashboard/SubjectDetails';

//for deep link
import CourseContentList from '@src/screens/Dashboard/Courses/CourseContentList';
import UnitList from '@src/screens/Dashboard/Courses/UnitList';

const Stack = createNativeStackNavigator();

const SCPUserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={SCPDashboard}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      <Stack.Screen
        name="TimeTable"
        component={TimeTable}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      <Stack.Screen
        name="FullAttendance"
        component={FullAttendance}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      <Stack.Screen
        name="SessionView"
        component={SessionView}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      <Stack.Screen
        name="PreviousClassMaterial"
        component={PreviousClassMaterial}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      <Stack.Screen
        name="DuringSession"
        component={DuringSession}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      <Stack.Screen
        name="PreviousClassMaterialFullView"
        component={PreviousClassMaterialFullView}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      <Stack.Screen
        name="SubjectDetails"
        component={SubjectDetails}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      {/* //for deep link course */}
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
