import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Layout/Header';
import { useTranslation } from '../../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAccessToken, getProfileDetails } from '../../utils/API/AuthService';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import Label from '../../components/Label/Label';
import TextField from '../../components/TextField/TextField';
import ActiveLoading from '../../screens/LoadingScreen/ActiveLoading';
import { deleteSavedItem } from '../../utils/JsHelper/Helper';
const Profile = (props) => {
  const { t } = useTranslation();

  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        console.log('hi');
        const data = await getAccessToken();
        const result = await getProfileDetails({
          userId: data?.result?.userId,
        });

        setUserData(result?.getUserDetails?.[0]);
        setLoading(false);
      };
      fetchData();
    }, [navigation])
  );

  const handleLogout = () => {
    const fetchData = async () => {
      await deleteSavedItem('refreshToken');
      await deleteSavedItem('token');

      // Reset the navigation stack and navigate to LoginSignUpScreen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      );
    };

    fetchData();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      {loading ? (
        <ActiveLoading />
      ) : (
        <ScrollView>
          <View style={styles.view}>
            <Text style={styles.text}>{t('my_profile')}</Text>
            {/* <TouchableOpacity
              onPress={() => {
                navigation.replace('ProfileMenu');
              }}
            >
              <Icon name="menu" color="black" size={30} />
            </TouchableOpacity> */}
          </View>
          <View style={styles.view2}>
            <TextField text={userData?.name} />
            <TextField
              text={userData?.username}
              style={{ color: '#4A4640', fontSize: 14 }}
            />
          </View>
          <View style={{ padding: 20 }}>
            <TextField
              text={t('second_chance_program')}
              style={{ color: '#4A4640', fontSize: 18 }}
            />
            <View style={styles.viewBox}>
              <View>
                <Label text={`${t('block')}, ${t('unit')}`} />
                <TextField text={userData?.customFields?.[1]?.value} />
              </View>
              <View>
                <Label text={`${t('enrollment_number')}`} />
                <TextField text={userData?.username} />
              </View>
              <View>
                <Label text={`${t('contact_number')}`} />
                <TextField text={userData?.mobile} />
              </View>
              <View>
                <Label text={`${t('class')} (${t('last_passed_grade')})`} />
                <TextField text={''} />
              </View>
              <View>
                <Label text={`${t('age')} `} />
                <TextField text={userData?.customFields?.[3]?.value} />
              </View>
              <View>
                <Label text={`${t('gender')} `} />
                <TextField text={userData?.customFields?.[2]?.value} />
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 20,
                marginBottom: 40,
              }}
            >
              <Text style={{ color: '#000', fontSize: 24, padding: 10 }}>
                {t('logout')}
              </Text>
              <Icon name="logout" color="black" size={30} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

Profile.propTypes = {};

styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  view: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  view2: {
    padding: 20,
    backgroundColor: '#F8EFDA',
  },
  viewBox: {
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 20,
    padding: 20,
  },
  text: {
    fontSize: 30,
    color: '#000',
  },
  icon: {},
});

export default Profile;
