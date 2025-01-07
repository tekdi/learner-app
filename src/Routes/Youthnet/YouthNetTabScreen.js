import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';

import YouthNetStack from './YouthNetStack';
import ExploreStack from './ExploreStack';
import ProfileStack from '../Public/ProfileStack';
import profile from '../../assets/images/png/profile.png';
import profile_filled from '../../assets/images/png/profile_filled.png';
import home from '../../assets/images/png/home.png';
import home_filled from '@src/assets/images/png/home_filled.png';
import explore_FILL from '@src/assets/images/png/explore_FILL.png';
import explore_UNFILLED from '@src/assets/images/png/explore_UNFILLED.png';

const Tab = createBottomTabNavigator();

const YouthNetTabScreen = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="SCPUserStack"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          if (route.name === 'ExploreStack') {
            if (focused) {
              return (
                <Image
                  source={explore_FILL}
                  style={{ width: 30, height: 30 }}
                />
              );
            } else {
              return (
                <Image
                  source={explore_UNFILLED}
                  style={{ width: 30, height: 30 }}
                />
              );
            }
          } else if (route.name === 'YouthNetStack') {
            if (focused) {
              return (
                <Image source={home_filled} style={{ width: 30, height: 30 }} />
              );
            } else {
              return <Image source={home} style={{ width: 30, height: 30 }} />;
            }
          } else if (route.name === 'Profile') {
            if (focused) {
              return (
                <Image
                  source={profile_filled}
                  style={{ width: 30, height: 30 }}
                />
              );
            } else {
              return (
                <Image source={profile} style={{ width: 30, height: 30 }} />
              );
            }
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
        name="YouthNetStack"
        component={YouthNetStack}
        options={{ tabBarLabel: t('l1_courses') }}
      />
      <Tab.Screen
        name="ExploreStack"
        component={ExploreStack}
        options={{ tabBarLabel: t('explore') }}
      />
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

export default YouthNetTabScreen;
