import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MonthlyCalendar from '../screens/Dashboard/Calendar/MonthlyCalendar';
import SCPDashboard from '../screens/Dashboard/Preference/SCPDashboard/SCPDashboard';
import SessionView from '../screens/Dashboard/Preference/SCPDashboard/SessionView';
import PreviousClassMaterial from '../screens/Dashboard/Preference/SCPDashboard/PreviousClassMaterial';
import FullAttendance from '../screens/Dashboard/Calendar/FullAttendance';
import TimeTable from '../screens/Dashboard/Calendar/TimeTable';
import PreviousClassMaterialFullView from '../screens/Dashboard/Preference/SCPDashboard/PreviousClassMaterialFullView';

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
        name="PreviousClassMaterialFullView"
        component={PreviousClassMaterialFullView}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
    </Stack.Navigator>
  );
};

export default SCPUserStack;
