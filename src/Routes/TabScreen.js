import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import { useTranslation } from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardStack from './DashboardStack';
import Contents from '../screens/Dashboard/Contents';
import Profile from '../screens/Profile/Profile';
import AssessmentStack from './AssessmentStack';
import Coursesfilled from '../assets/images/png/Coursesfilled.png';
import Coursesunfilled from '../assets/images/png/Coursesunfilled.png';
import ProfileStack from './ProfileStack';
import { getTentantId } from '../utils/JsHelper/Helper';

const Tab = createBottomTabNavigator();

const TabScreen = () => {
  const { t } = useTranslation();
  const [contentShow, setContentShow] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const tenantId = await getTentantId();
      id = '6c8b810a-66c2-4f0d-8c0c-c025415a4414';
      if (tenantId === id) {
        setContentShow(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="DashboardStack"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          if (route.name === 'content') {
            return (
              <Icon
                name="my-library-books"
                color={focused ? '#987100' : 'black'}
                size={30}
              />
            );
          } else if (route.name === 'DashboardStack') {
            if (focused) {
              return (
                <Image
                  source={Coursesfilled}
                  style={{ width: 30, height: 30 }}
                />
              );
            } else {
              return (
                <Image
                  source={Coursesunfilled}
                  style={{ width: 30, height: 30 }}
                />
              );
            }
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
        name="DashboardStack"
        component={DashboardStack}
        options={{ tabBarLabel: t('courses') }}
      />
      {contentShow && (
        <Tab.Screen
          name="content"
          component={Contents}
          options={{ tabBarLabel: t('content') }}
        />
      )}

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

export default TabScreen;
