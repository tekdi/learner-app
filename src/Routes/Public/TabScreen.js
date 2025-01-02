import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import DashboardStack from './DashboardStack';
import Contents from '../../screens/Dashboard/Contents';
import Coursesfilled from '../../assets/images/png/Coursesfilled.png';
import profile from '../../assets/images/png/profile.png';
import profile_filled from '../../assets/images/png/profile_filled.png';
import content from '../../assets/images/png/content.png';
import content2 from '../../assets/images/png/content2.png';
import Coursesunfilled from '../../assets/images/png/Coursesunfilled.png';
import ProfileStack from './ProfileStack';
import { getDataFromStorage, getTentantId } from '../../utils/JsHelper/Helper';

const Tab = createBottomTabNavigator();

const TabScreen = () => {
  const { t } = useTranslation();
  const [contentShow, setContentShow] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const tenantId = await getTentantId();
      const tenantDetails = JSON.parse(
        await getDataFromStorage('tenantDetails')
      );

      const youthnetTenantIds = tenantDetails?.filter((item) => {
        if (item?.name === 'YouthNet') {
          return item;
        }
      });
      if (tenantId === youthnetTenantIds?.[0]?.tenantId) {
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
            if (focused) {
              return (
                <Image source={content2} style={{ width: 30, height: 30 }} />
              );
            } else {
              return (
                <Image source={content} style={{ width: 30, height: 30 }} />
              );
            }
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
