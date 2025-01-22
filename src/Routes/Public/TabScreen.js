import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import Config from 'react-native-config';

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const tenantId = await getTentantId();
  //     const tenantDetails = JSON.parse(
  //       await getDataFromStorage('tenantDetails')
  //     );

  //     const youthnetTenantIds = tenantDetails?.filter((item) => {
  //       if (item?.name === 'YouthNet') {
  //         return item;
  //       }
  //     });
  //     if (tenantId === youthnetTenantIds?.[0]?.tenantId) {
  //       setContentShow(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
