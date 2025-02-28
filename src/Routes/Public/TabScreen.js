import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import DashboardStack from './DashboardStack';
import ExploreStack from '../Youthnet/ExploreStack';
import Contents from '../../screens/Dashboard/Contents';
import Coursesfilled from '../../assets/images/png/Coursesfilled.png';
import profile from '../../assets/images/png/profile.png';
import profile_filled from '../../assets/images/png/profile_filled.png';

import Coursesunfilled from '../../assets/images/png/Coursesunfilled.png';
import ProfileStack from './ProfileStack';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import explore_FILL from '@src/assets/images/png/explore_FILL.png';
import explore_UNFILLED from '@src/assets/images/png/explore_UNFILLED.png';

const Tab = createBottomTabNavigator();
const WalkthroughableView = walkthroughable(View); // Wrap Image component

const TabScreen = () => {
  const { t } = useTranslation();
  const [contentShow, setContentShow] = useState(true);
  const [CopilotStarted, setCopilotStarted] = useState(false);
  const [CopilotStopped, setCopilotStopped] = useState(false);
  const { start, goToNth, unregisterStep, copilotEvents } = useCopilot();

  // useEffect(() => {
  //   const COPILOT_ENABLE = Config.COPILOT_ENABLE;

  //   if (!CopilotStarted && COPILOT_ENABLE) {
  //     unregisterStep('login'); // Unregister step 1
  //     unregisterStep('create_account'); // Unregister step 2
  //     start();
  //     copilotEvents.on('start', () => setCopilotStarted(true));
  //   }
  //   copilotEvents.on('stop', () => setCopilotStopped(true));
  // }, [start, copilotEvents]);

  useEffect(() => {
    const fetchData = async () => {
      let userType = await getDataFromStorage('userType');
      console.log('userType', userType);
      if (userType === 'youthnet') {
        setContentShow(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="DashboardStack"
      screenOptions={() => ({
        headerShown: false,
        tabBarStyle: styles.footer,
        tabBarActiveTintColor: '#987100',
        tabBarInactiveTintColor: 'gray',
        tabBarActiveBackgroundColor: '#F7ECDF',
        tabBarLabelStyle: styles.tabLabel, // Add this for padding below label
      })}
    >
      <Tab.Screen
        name="DashboardStack"
        options={{
          tabBarLabel: t('courses'),
          tabBarButton: (props) => (
            <CopilotStep
              text="This is the courses tab. Tap here to explore courses!"
              order={3}
              name="coursesTab"
            >
              <WalkthroughableView style={{ flex: 1 }}>
                <TouchableOpacity {...props} />
              </WalkthroughableView>
            </CopilotStep>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? Coursesfilled : Coursesunfilled}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      >
        {(props) => (
          <DashboardStack {...props} CopilotStopped={CopilotStopped} />
        )}
      </Tab.Screen>

      {contentShow && (
        <Tab.Screen
          name="content"
          component={Contents}
          options={{
            tabBarLabel: t('content'),
            tabBarButton: (props) => (
              <CopilotStep
                text="This is the Content tab. Tap here to explore Content!"
                order={4}
                name="cotentTab"
              >
                <WalkthroughableView style={{ flex: 1 }}>
                  <TouchableOpacity {...props} />
                </WalkthroughableView>
              </CopilotStep>
            ),
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? profile_filled : profile}
                style={{ width: 30, height: 30 }}
              />
            ),
          }}
        />
      )}
      {!contentShow && (
        <Tab.Screen
          name="explore"
          component={ExploreStack}
          options={{
            tabBarLabel: t('explore'),
            tabBarButton: (props) => (
              <CopilotStep
                text="This is the Content tab. Tap here to explore Content!"
                order={4}
                name="explore"
              >
                <WalkthroughableView style={{ flex: 1 }}>
                  <TouchableOpacity {...props} />
                </WalkthroughableView>
              </CopilotStep>
            ),
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? explore_FILL : explore_UNFILLED}
                style={{ width: 30, height: 30 }}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: t('profile'),
          tabBarButton: (props) => (
            <CopilotStep
              text="This is the Profile tab. Tap here to explore Profile!"
              order={5}
              name="Profile"
            >
              <WalkthroughableView style={{ flex: 1 }}>
                <TouchableOpacity {...props} />
              </WalkthroughableView>
            </CopilotStep>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? profile_filled : profile}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
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
