import React, { useEffect, useState } from 'react';
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
import { CommonActions, useNavigation } from '@react-navigation/native';
import Label from '../../components/Label/Label';
import TextField from '../../components/TextField/TextField';
import ActiveLoading from '../../screens/LoadingScreen/ActiveLoading';
import {
  capitalizeFirstLetter,
  capitalizeName,
  deleteSavedItem,
  getDataFromStorage,
} from '../../utils/JsHelper/Helper';
import globalStyles from '../../utils/Helper/Style';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';

const Profile = (props) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState();
  const [userDetails, setUserDetails] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const createNewObject = (customFields, labels) => {
    const result = {};
    customFields?.forEach((field) => {
      const cleanedFieldLabel = field?.label?.replace(/[^a-zA-Z0-9_ ]/g, '');

      if (labels.includes(cleanedFieldLabel)) {
        result[cleanedFieldLabel] = field.value || '';
      }
    });

    setUserDetails(result);
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = JSON.parse(await getDataFromStorage('profileData'));

      const requiredLabels = [
        'WHATS_YOUR_GENDER',
        'CLASS_OR_LAST_PASSED_GRADE',
        'STATES',
        'DISTRICTS',
        'BLOCKS',
        'AGE',
        'EMAIL',
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
      await deleteSavedItem('Accesstoken');
      await deleteSavedItem('userId');
      await deleteSavedItem('cohortId');
      await deleteSavedItem('cohortData');

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
      <SecondaryHeader logo />
      {loading ? (
        <ActiveLoading />
      ) : (
        <ScrollView style={globalStyles.container}>
          <View style={styles.view}>
            <Text allowFontScaling={false} style={globalStyles.heading}>
              {t('my_profile')}
            </Text>
          </View>

          <View>
            <View style={styles.viewBox}>
              <View>
                <Label text={`${t('full_name')}`} />
                <TextField text={capitalizeName(userData?.name)} />
              </View>
              {/* <View>
                <Label
                  text={`${t('state')}, ${t('district')}, ${t('block')}, ${t('unit')}`}
                />
                <TextField
                  text={`${userDetails?.STATES || '-'}  ${userDetails?.DISTRICTS || ''} ${userDetails?.BLOCKS || ''}`}
                />
              </View> */}
              <View style={{ marginVertical: 10 }}>
                <Label text={`${t('email')}`} />
                <TextField text={`${userData?.email || '-'}   `} />
              </View>
              <View style={{ marginVertical: 10 }}>
                <Label text={`${t('enrollment_number')}`} />
                <TextField text={userData?.username} />
                {/* <TextField text={userData?.userId} /> */}
              </View>
              <View style={{ marginVertical: 10 }}>
                <Label text={`${t('contact_number')}`} />
                <TextField text={userData?.mobile} />
              </View>
              {/* <View>
                <Label text={`${t('class')} (${t('last_passed_grade')})`} />
                <TextField text={userDetails?.CLASS_OR_LAST_PASSED_GRADE} />
              </View> */}
              <View style={{ marginVertical: 10 }}>
                <Label text={`${t('age')} `} />
                <TextField text={userDetails?.AGE} />
              </View>
              <View style={{ marginVertical: 10 }}>
                <Label text={`${t('gender')} `} />
                <TextField
                  text={`${capitalizeFirstLetter(
                    userDetails?.WHATS_YOUR_GENDER
                  )}`}
                />
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
              <Text
                allowFontScaling={false}
                style={[globalStyles.heading2, { padding: 10 }]}
              >
                {t('logout')}
              </Text>
              <Icon name="logout" color="black" size={20} style={styles.icon} />
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
