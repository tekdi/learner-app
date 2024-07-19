import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LoadingScreen from './screens/LoadingScreen/LoadingScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import LanguageScreen from './screens/LanguageScreen/LanguageScreen';
import { ApplicationProvider } from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { default as SimpleIcon } from 'react-native-vector-icons/SimpleLineIcons';
import { default as MaterialIcons } from 'react-native-vector-icons/MaterialCommunityIcons';
//importing all designs from eva as eva
import * as eva from '@eva-design/eva';
//importing custom theme for UI Kitten
import theme from './assets/themes/theme.json';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import LoginSignUpScreen from './screens/LoginSignUpScreen/LoginSignUpScreen';
import RegisterStart from './screens/RegisterStart/RegisterStart';

//multiple language
import { LanguageProvider, useTranslation } from './context/LanguageContext'; // Adjust path as needed
import LoginScreen from './screens/LoginScreen/LoginScreen';
import ContinueRegisterScreen from './screens/ContinueRegisterScreen/ContinueRegisterScreen';
import {
  changeNavigationBarColor,
  hideNavigationBar,
} from 'react-native-navigation-bar-color';
import Dashboard from './screens/Dashboard/Dashboard';
import Profile from './screens/Dashboard/Profile';
import Courses from './screens/Dashboard/Courses';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen() {
  const { t, setLanguage, language } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          // Set icon based on route name
          if (route.name === 'Content') {
            return (
              <Icon
                name="my-library-books"
                color={focused ? '#987100' : 'black'}
                size={30}
              />
            );
          } else if (route.name === 'Courses') {
            return (
              <SimpleIcon
                name="graduation"
                color={focused ? '#987100' : 'black'}
                size={30}
              />
            );
          } else if (route.name === 'Profile') {
            return (
              <MaterialIcons
                name="account-circle-outline"
                color={focused ? '#987100' : 'black'}
                size={30}
              />
            );
          }
          // Return the icon component
        },
        tabBarStyle: styles.footer,
        tabBarActiveTintColor: '#987100', // Color for active tab
        tabBarInactiveTintColor: 'gray', // Color for inactive tab
      })}
    >
      <Tab.Screen
        name="Content"
        component={Dashboard}
        options={{ tabBarLabel: t('content') }}
      />
      <Tab.Screen
        name={t('Courses')}
        component={Courses}
        options={{ tabBarLabel: t('courses') }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: t('profile') }}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  useEffect(() => {
    // changeNavigationBarColor('white', { barStyle: 'light-content' });
    hideNavigationBar();
  }, []);

  return (
    <LanguageProvider>
      {/* // App.js file has to be wrapped with ApplicationProvider for UI Kitten to
      work */}
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <NavigationContainer>
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
            <Stack.Screen name="RegisterStart" component={RegisterStart} />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ContinueRegisterScreen"
              component={ContinueRegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Dashboard"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginBottom: 5,
  },
  footer: {
    height: 70, // Set the height of the tab bar
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
