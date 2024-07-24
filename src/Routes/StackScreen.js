import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabScreen from './TabScreen';
import LoadingScreen from '../screens/LoadingScreen/LoadingScreen';
import LanguageScreen from '../screens/LanguageScreen/LanguageScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import LoginSignUpScreen from '../screens/LoginSignUpScreen/LoginSignUpScreen';
import RegisterStart from '../screens/RegisterStart/RegisterStart';
import ContinueRegisterScreen from '../screens/ContinueRegisterScreen/ContinueRegisterScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import { View } from 'react-native';

const StackScreen = (props) => {
  const Stack = createNativeStackNavigator();

  const headerBackground = () => {
    return <View style={{ backgroundColor: 'white', flex: 1 }}></View>;
  };

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LanguageScreen"
    >
      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          headerShown: false,
          headerBackground: () => headerBackground(),
        }}
      />
      <Stack.Screen
        name="LoginSignUpScreen"
        component={LoginSignUpScreen}
        options={{
          headerShown: false,
          headerBackground: () => headerBackground(),
        }}
      />
      <Stack.Screen name="RegisterStart" component={RegisterStart} />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Dashboard"
        component={TabScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackScreen;
