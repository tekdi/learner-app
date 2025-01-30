import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Label from '../../components/Label/Label';
import TextField from '../../components/TextField/TextField';
import ActiveLoading from '../../screens/LoadingScreen/ActiveLoading';
import {
  capitalizeFirstLetter,
  capitalizeName,
  getDataFromStorage,
  getTentantId,
  logEventFunction,
} from '../../utils/JsHelper/Helper';
import globalStyles from '../../utils/Helper/Style';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';

import LinearGradient from 'react-native-linear-gradient';
import NoCertificateBox from './NoCertificateBox';
import GlobalText from '@components/GlobalText/GlobalText';
import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';

const Profile = () => {
  const { t, language } = useTranslation();
  const [userData, setUserData] = useState();
  const [userDetails, setUserDetails] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const [userType, setUserType] = useState();
  const [cohortId, setCohortId] = useState();
  const version = DeviceInfo.getVersion(); // e.g., "1.0.1"
  const buildNumber = DeviceInfo.getBuildNumber(); // e.g., "2"

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

  const fetchData = async () => {
    const result = JSON.parse(await getDataFromStorage('profileData'));

    const userTypes = await getDataFromStorage('userType');
    const cohortId = await getDataFromStorage('cohortId');
    setCohortId(cohortId);
    setUserType(userTypes);

    const requiredLabels = [
      'gender',
      'HIGHEST_EDCATIONAL_QUALIFICATION_OR_LAST_PASSED_GRADE',
      'STATE',
      'DISTRICT',
      'BLOCK',
      'email',
    ];
    const customFields = result?.getUserDetails?.[0]?.customFields;
    createNewObject(customFields, requiredLabels);
    setUserData(result?.getUserDetails?.[0]);
    const tenantData = await getTentantId();

    setLoading(false);
  };

  console.log('useeee', userData);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [navigation])
  );

  useEffect(() => {
    const logEvent = async () => {
      const obj = {
        eventName: 'profile_page_view',
        method: 'on-view',
        screenName: 'Profile',
      };
      await logEventFunction(obj);
    };
    logEvent();
  }, []);

  const getDate = () => {
    const date = new Date(userData?.createdAt);
    const day = date?.toLocaleDateString(language, {
      day: 'numeric',
    });
    const month = date?.toLocaleDateString(language, {
      month: 'long',
    });
    const year = date?.toLocaleDateString(language, {
      year: 'numeric',
    });

    return ` ${month} ${day}, ${year}`; // Format as "26 October 2024"
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SecondaryHeader logo />
      {loading ? (
        <ActiveLoading />
      ) : (
        <ScrollView style={[globalStyles.container, { padding: 0 }]}>
          <View style={styles.view}>
            <GlobalText style={globalStyles.heading}>
              {t('my_profile')}
            </GlobalText>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('OtherSettings', {
                  age: userDetails?.AGE,
                });
              }}
            >
              <Ionicons name="settings-outline" size={30} color={'#000'} />
            </TouchableOpacity>
          </View>
          <LinearGradient
            colors={['#FFFDF6', '#F8EFDA']} // Gradient colors
            start={{ x: 1, y: 0 }} // Gradient starting point
            end={{ x: 1, y: 1.5 }} // Gradient ending point
            style={styles.gradient}
          >
            <GlobalText style={[globalStyles.subHeading, { fontWeight: 700 }]}>
              {capitalizeName(`${userData?.firstName} ${userData?.lastName}`)}
            </GlobalText>
            <View
              style={[
                globalStyles.flexrow,
                { justifyContent: 'space-between' },
              ]}
            >
              <GlobalText style={globalStyles.text}>
                {userData?.username}
              </GlobalText>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 20,
                  backgroundColor: '#CDC5BD',
                }}
              />
              <View style={[globalStyles.flexrow]}>
                <GlobalText style={globalStyles.text}>
                  {t('joined_on')}
                </GlobalText>
                <GlobalText style={globalStyles.text}> {getDate()}</GlobalText>
              </View>
            </View>
          </LinearGradient>
          {/* <NoCertificateBox userType={userType} /> */}
          <View style={{ backgroundColor: '#FFF8F2', paddingVertical: 20 }}>
            <View style={styles.viewBox}>
              <View>
                <Label text={`${t('contact_number')}`} />
                <TextField text={userData?.mobile} />
              </View>
              <View>
                <Label text={`${t('email')}`} />
                <TextField text={`${userData?.email || '-'}   `} />
              </View>

              {/* <View>
                <Label text={`${t('class')} (${t('last_passed_grade')})`} />
                <TextField text={userDetails?.CLASS_OR_LAST_PASSED_GRADE} />
              </View> */}
              <View>
                <Label text={`${t('dob')} `} />
                {console.log('userDetails?.dob', userDetails)}

                <TextField text={userData?.dob} />
              </View>
              <View>
                <Label text={`${t('gender')} `} />
                <TextField
                  text={`${capitalizeFirstLetter(userData?.gender)}`}
                />
              </View>
              <View>
                <Label text={`${t('location')}`} />
                {userDetails?.STATE ? (
                  <TextField
                    text={`${userDetails?.STATE || '-'},  ${userDetails?.DISTRICT || ''}, ${userDetails?.BLOCK || ''}`}
                  />
                ) : (
                  <TextField text={'-'} />
                )}
              </View>
            </View>
          </View>

          <GlobalText
            style={[
              globalStyles.text,
              { textAlign: 'center', paddingVertical: 10 },
            ]}
          >
            Version {version} (Build {buildNumber})
            {/* {Config.ENV != 'PROD' ? Config.ENV : ''} */}
          </GlobalText>
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
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  viewBox: {
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    padding: 20,
    borderColor: '#D0C5B4',
  },
  img: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  gradient: {
    padding: 20,
    // marginBottom: 20,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertBox: {
    padding: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#D0C5B4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
