import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import { useTranslation } from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardStack from './DashboardStack';
import Contents from '../screens/Dashboard/Contents';
import Profile from '../screens/Profile/Profile';
import AssessmentStack from './AssessmentStack';
import SCPUserStack from './SCPUserStack';
import MyClassStack from './MyClassStack';
import homeoutline from '../assets/images/png/homeoutline.png';
import bookoutline from '../assets/images/png/bookoutline.png';
import homefilled from '../assets/images/png/homefilled.png';
import bookfillednew from '../assets/images/png/bookfillednew.png';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const SCPUserTabScreen = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="SCPUserStack"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          if (route.name === 'MyClass') {
            return (
              // <Icon
              //   name="book-reader"
              //   color={focused ? '#987100' : 'black'}
              //   size={30}
              // />
              focused ? (
                <Image
                  source={bookfillednew}
                  style={{ width: 30, height: 30 }}
                />
              ) : (
                <Image source={bookoutline} style={{ width: 30, height: 30 }} />
              )
            );
          } else if (route.name === 'SCPUserStack') {
            return focused ? (
              <Image source={homefilled} style={{ width: 30, height: 30 }} />
            ) : (
              <Image source={homeoutline} style={{ width: 30, height: 30 }} />
            );
          } else if (route.name === 'AssessmentStack') {
            return (
              <SimpleIcon
                name="note"
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
        },
        tabBarStyle: styles.footer,
        tabBarActiveTintColor: '#987100',
        tabBarInactiveTintColor: 'gray',
        tabBarActiveBackgroundColor: '#F7ECDF',
        tabBarLabelStyle: styles.tabLabel, // Add this for padding below label
      })}
    >
      <Tab.Screen
        name="SCPUserStack"
        component={SCPUserStack}
        options={{ tabBarLabel: t('home') }}
      />
      <Tab.Screen
        name="MyClass"
        component={MyClassStack}
        options={{ tabBarLabel: t('my_class') }}
      />
      {/* <Tab.Screen
        name="AssessmentStack"
        component={AssessmentStack}
        options={{ tabBarLabel: t('assessment') }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ tabBarLabel: t('profile') }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    paddingBottom: 10, // Add 10px padding below the label
  },
});

export default SCPUserTabScreen;
