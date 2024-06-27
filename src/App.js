import React from 'react';
import { View } from 'react-native';
import LoadingScreen from './screens/LoadingScreen/LoadingScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LanguageScreen from './screens/LanguageScreen/LanguageScreen';
import { ApplicationProvider } from '@ui-kitten/components';
//importing all designs from eva as eva
import * as eva from '@eva-design/eva';
//importing custom theme for UI Kitten
import theme from './assets/themes/theme.json';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import LoginSignUpScreen from './screens/LoginSignUpScreen/LoginSignUpScreen';

//multiple language
import { LanguageProvider } from './context/LanguageContext'; // Adjust path as needed

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <LanguageProvider>
      {/* // App.js file has to be wrapped with ApplicationProvider for UI Kitten to
      work */}
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="LoadingScreen"
          >
            <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
            <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{
                headerShown: false,
                headerBackground: () => (
                  <View style={{ backgroundColor: 'white', flex: 1 }}></View>
                ),
              }}
            />
            <Stack.Screen
              name="LoginSignUpScreen"
              component={LoginSignUpScreen}
              options={{
                headerShown: false,
                headerBackground: () => (
                  <View style={{ backgroundColor: 'white', flex: 1 }}></View>
                ),
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </LanguageProvider>
  );
};

export default App;
