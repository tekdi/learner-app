import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Modal,
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import Label from '../../components/Label/Label';
import TextField from '../../components/TextField/TextField';
import ActiveLoading from '../../screens/LoadingScreen/ActiveLoading';
import {
  calculateStorageSize,
  calculateTotalStorageSize,
  capitalizeFirstLetter,
  capitalizeName,
  clearDoKeys,
  deleteFilesInDirectory,
  deleteSavedItem,
  getDataFromStorage,
  getTentantId,
  logEventFunction,
} from '../../utils/JsHelper/Helper';
import globalStyles from '../../utils/Helper/Style';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';
import BackButtonHandler from '../../components/BackNavigation/BackButtonHandler';
import cloud_done from '../../assets/images/png/cloud_done.png';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from '@changwoolab/react-native-fast-image';

import GlobalText from '@components/GlobalText/GlobalText';

const Profile = (props) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState();
  const [userDetails, setUserDetails] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [showExitModal, setShowExitModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [conentView, setConentView] = useState(false);
  const [storageData, setStorageData] = useState();
  const [userType, setUserType] = useState();
  const [cohortId, setCohortId] = useState();

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
    // console.log('userType', userTypes);
    // console.log('cohortId', cohortId);
    setCohortId(cohortId);
    setUserType(userTypes);

    const requiredLabels = [
      'WHATS_YOUR_GENDER',
      'GENDER',
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
    const tenantData = await getTentantId();
    // console.log({ tenantData });

    setLoading(false);
  };

  const StorageSize = async () => {
    const data = await calculateTotalStorageSize();
    // console.log('size', data);
    setStorageData(data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      StorageSize();
    }, [navigation])
  );

  console.log(JSON.stringify(userData));

  const handleLogout = () => {
    const fetchData = async () => {
      await deleteSavedItem('refreshToken');
      await deleteSavedItem('Accesstoken');
      await deleteSavedItem('userId');
      await deleteSavedItem('cohortId');
      await deleteSavedItem('cohortData');
      await deleteSavedItem('weightedProgress');
      await deleteSavedItem('courseTrackData');
      await deleteSavedItem('profileData');
      await deleteSavedItem('tenantData');
      await deleteSavedItem('academicYearId');
      logoutEvent();
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

  const logoutEvent = async () => {
    const obj = {
      eventName: 'logout_Event',
      method: 'button-click',
      screenName: 'Profile',
    };
    await logEventFunction(obj);
  };

  const handleCancel = () => {
    setShowExitModal(false); // Close the modal
    setShowContentModal(false); // Close the modal
  };
  const handleContentDelete = async () => {
    await clearDoKeys();
    await deleteFilesInDirectory();
    StorageSize();
    setShowContentModal(false); // Close the modal
  };

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
            {cohortId === '00000000-0000-0000-0000-000000000000' && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ProfileUpdateScreen');
                }}
              >
                <Icon name="edit" size={30} color={'#000'} />
              </TouchableOpacity>
            )}
          </View>
          {/* {storageData !== '0.00 KB' && (
            <View style={[styles.viewBox, { backgroundColor: '#F7ECDF' }]}>
              <View
                style={[globalStyles.flexrow, { justifyContent: 'center' }]}
              >
                <Image
                  style={styles.img}
                  source={cloud_done}
                  resizeMode="contain"
                />

                <GlobalText
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={[globalStyles.heading2, { width: 250 }]}
                >
                  {t('you_have')} {storageData} {t('of_offline_content')}
                </GlobalText>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setShowContentModal(true);
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GlobalText style={[globalStyles.heading2, { padding: 10 }]}>
                    {t('clear_all_offline_content')}
                  </GlobalText>
                  <Octicons
                    name="arrow-right"
                    color="black"
                    size={20}
                    style={styles.icon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )} */}
          <LinearGradient
            colors={['#FFFDF6', '#F8EFDA']} // Gradient colors
            start={{ x: 1, y: 0 }} // Gradient starting point
            end={{ x: 1, y: 1.5 }} // Gradient ending point
            style={styles.gradient}
          >
            <GlobalText style={[globalStyles.subHeading, { fontWeight: 700 }]}>
              {capitalizeName(userData?.name)}
            </GlobalText>
            <TextField text={userData?.username} />
          </LinearGradient>
          <View>
            <View style={styles.viewBox}>
              {/* <View>
                <Label
                  text={`${t('state')}, ${t('district')}, ${t('block')}, ${t('unit')}`}
                />
                <TextField
                  text={`${userDetails?.STATES || '-'}  ${userDetails?.DISTRICTS || ''} ${userDetails?.BLOCKS || ''}`}
                />
              </View> */}
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
                <Label text={`${t('age')} `} />
                <TextField text={userDetails?.AGE} />
              </View>
              <View>
                <Label text={`${t('gender')} `} />
                <TextField
                  text={`${capitalizeFirstLetter(
                    userDetails?.WHATS_YOUR_GENDER || userDetails?.GENDER
                  )}`}
                />
              </View>
            </View>
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <GlobalText
              style={[
                globalStyles.text,
                { color: '#7C766F', marginBottom: 20 },
              ]}
            >
              {t('other_settings')}
            </GlobalText>
            <View style={[globalStyles.flexrow]}>
              <TouchableOpacity
                style={[globalStyles.flexrow, { flexWrap: 'wrap' }]}
                onPress={() => {
                  setShowContentModal(true);
                }}
              >
                <FastImage
                  style={{ width: 25, height: 25, marginRight: 10 }}
                  source={require('../../assets/images/png/cloud_done.png')}
                  resizeMode={FastImage.resizeMode.contain}
                  priority={FastImage.priority.high}
                />
                <View style={{ width: '85%' }}>
                  <GlobalText
                    style={[globalStyles.subHeading]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {t('remove_all_offline_content')}
                  </GlobalText>
                  <GlobalText
                    style={[globalStyles.subHeading]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    ( {storageData})
                  </GlobalText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ top: -2, right: 10 }}
                onPress={() => {
                  setConentView(true);
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={25}
                  color={'#1170DC'}
                />
              </TouchableOpacity>
            </View>
            {cohortId === '00000000-0000-0000-0000-000000000000' && (
              <TouchableOpacity
                style={[globalStyles.flexrow, { marginVertical: 15 }]}
                onPress={() => {
                  navigation.navigate('ResetPassword');
                }}
              >
                <Icon
                  name="lock-reset"
                  color="black"
                  size={25}
                  style={styles.icon}
                />

                <GlobalText
                  style={[globalStyles.subHeading, { marginLeft: 15 }]}
                >
                  {t('reset_password')}
                </GlobalText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                globalStyles.flexrow,
                { marginBottom: 20, marginTop: 15 },
              ]}
              onPress={() => {
                setShowExitModal(true);
              }}
            >
              <Icon name="logout" color="black" size={25} style={styles.icon} />

              <GlobalText style={[globalStyles.subHeading, { marginLeft: 15 }]}>
                {t('logout')}
              </GlobalText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      {showExitModal && (
        <BackButtonHandler
          logout
          exitRoute={true} // You can pass any props needed by the modal here
          onCancel={handleCancel}
          onExit={handleLogout}
        />
      )}
      {showContentModal && (
        <BackButtonHandler
          content_delete
          exitRoute={true} // You can pass any props needed by the modal here
          onCancel={handleCancel}
          onExit={handleContentDelete}
        />
      )}
      <Modal transparent={true} animationType="fade" visible={conentView}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.alertBox}>
              <Ionicons
                name="information-circle-outline"
                size={25}
                color={'#1170DC'}
              />
              <GlobalText
                allowFontScaling={false}
                style={[
                  globalStyles.subHeading,
                  {
                    textAlign: 'center',
                    marginVertical: 20,
                  },
                ]}
              >
                {t('content_delete_desp')}
              </GlobalText>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setConentView(false);
                }}
              >
                <GlobalText
                  allowFontScaling={false}
                  style={[globalStyles.subHeading, { color: '#0D599E' }]}
                >
                  {t('okay')}
                </GlobalText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
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
