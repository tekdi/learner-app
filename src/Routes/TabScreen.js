import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useTranslation } from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { default as SimpleIcon } from 'react-native-vector-icons/SimpleLineIcons';
import { default as MaterialIcons } from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from '../screens/Dashboard/Dashboard';
import Courses from '../screens/Dashboard/Courses';
import Profile from '../screens/Dashboard/Profile';

const TabScreen = () => {
  const { t } = useTranslation();
  const Tab = createBottomTabNavigator();

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

export default TabScreen;
