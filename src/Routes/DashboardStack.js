import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Content from '../screens/Dashboard/Content';
import Preference from '../screens/Dashboard/Preference/Preference';
import ViewAllContent from '../screens/Dashboard/ViewAllContent';
import ContentList from '../screens/Dashboard/ContentList';

const Stack = createNativeStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Content" component={Content} />
      <Stack.Screen name="ContentList" component={ContentList} />
      <Stack.Screen name="Preference" component={Preference} />
      <Stack.Screen name="ViewAll" component={ViewAllContent} />
    </Stack.Navigator>
  );
};

export default DashboardStack;
