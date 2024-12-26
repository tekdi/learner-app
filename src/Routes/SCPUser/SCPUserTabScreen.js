import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import SCPUserStack from './SCPUserStack';
import MyClassStack from './MyClassStack';
import ProfileStack from '../Public/ProfileStack';
import profile from '../../assets/images/png/profile.png';
import profile_filled from '../../assets/images/png/profile_filled.png';
import home from '../../assets/images/png/home.png';
import home_filled from '../../assets/images/png/home_filled.png';
import book_filled from '../../assets/images/png/book_filled.png';
import book from '../../assets/images/png/book.png';

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
            if (focused) {
              return (
                <Image source={book_filled} style={{ width: 30, height: 30 }} />
              );
            } else {
              return <Image source={book} style={{ width: 30, height: 30 }} />;
            }
          } else if (route.name === 'SCPUserStack') {
            if (focused) {
              return (
                <Image source={home_filled} style={{ width: 30, height: 30 }} />
              );
            } else {
              return <Image source={home} style={{ width: 30, height: 30 }} />;
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
