import React, { useEffect, useState } from 'react';
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
import { CommonActions, useNavigation } from '@react-navigation/native';
import Label from '../../components/Label/Label';
import TextField from '../../components/TextField/TextField';
import ActiveLoading from '../../screens/LoadingScreen/ActiveLoading';
import {
  capitalizeFirstLetter,
  deleteSavedItem,
} from '../../utils/JsHelper/Helper';
import globalStyles from '../../utils/Helper/Style';

const Profile = (props) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState();
  const [userDetails, setUserDetails] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const createNewObject = (customFields, labels) => {
    const result = {};
    customFields.forEach((field) => {
      if (labels.includes(field.label)) {
        result[field.label] = field.value;
      }
    });
    setUserDetails(result);
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAccessToken();
      const result = await getProfileDetails({
        userId: data?.result?.userId,
      });
      const requiredLabels = [
        'GENDER',
        'CLASS_OR_LAST_PASSED_GRADE',
        'STATES',
        'DISTRICTS',
        'BLOCKS',
        'AGE',
      ];
      const customFields = result?.getUserDetails?.[0]?.customFields;
      createNewObject(customFields, requiredLabels);
      setUserData(result?.getUserDetails?.[0]);
      setLoading(false);
    };
    fetchData();
  }, []);

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
        <ScrollView style={globalStyles.container}>
          <View style={styles.view}>
            <Text style={globalStyles.heading}>{t('my_profile')}</Text>
            {/* <TouchableOpacity
              onPress={() => {
                navigation.replace('ProfileMenu');
              }}
            >
              <Icon name="menu" color="black" size={30} />
            </TouchableOpacity> */}
          </View>

          <View>
            <View style={styles.viewBox}>
              <View>
                <Label text={`${t('full_name')}`} />
                <TextField text={capitalizeFirstLetter(userData?.name)} />
              </View>
              <View>
                <Label
                  text={`${t('state')}, ${t('district')}, ${t('block')}, ${t('unit')}`}
                />
                <TextField
                  text={`${userDetails?.STATES}, ${userDetails?.DISTRICTS}, ${userDetails?.BLOCKS}`}
                />
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
                <TextField text={userDetails?.CLASS_OR_LAST_PASSED_GRADE} />
              </View>
              <View>
                <Label text={`${t('age')} `} />
                <TextField text={userDetails?.AGE} />
              </View>
              <View>
                <Label text={`${t('gender')} `} />
                <TextField text={userDetails?.GENDER} />
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
                marginBottom: 40,
              }}
            >
              <Text style={[globalStyles.heading2, { padding: 10 }]}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  view: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  viewBox: {
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
    borderColor: '#D0C5B4',
  },
});

export default Profile;
