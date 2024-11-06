import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../screens/Profile/Profile';
import ProfileUpdateScreen from '../screens/Profile/ProfileUpdateScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MyProfile"
        component={Profile}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
      <Stack.Screen
        name="ProfileUpdateScreen"
        component={ProfileUpdateScreen}
        options={{ lazy: true }} // Lazily load LoadingScreen
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
