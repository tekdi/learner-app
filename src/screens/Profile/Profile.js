import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
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

import GlobalText from "@components/GlobalText/GlobalText";

const Profile = (props) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState();
  const [userDetails, setUserDetails] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [showExitModal, setShowExitModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [storageData, setStorageData] = useState();

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
    // console.log('result', result);

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
    const tenantData = await getTentantId();
    // console.log({ tenantData });

    setLoading(false);
  };

  const StorageSize = async () => {
    const data = await calculateTotalStorageSize();
    console.log('size', data);
    setStorageData(data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      StorageSize();
    }, [navigation])
  );

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
        <ScrollView style={globalStyles.container}>
          <View style={styles.view}>
            <GlobalText style={globalStyles.heading}>
              {t('my_profile')}
            </GlobalText>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProfileUpdateScreen');
              }}
            >
              <Icon name="edit" size={30} color={'#000'} />
            </TouchableOpacity>
          </View>
          {storageData !== '0.00 KB' && (
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
          )}
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
          <TouchableOpacity
            onPress={() => {
              setShowExitModal(true);
            }}
          >
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
              <GlobalText style={[globalStyles.heading2, { padding: 10 }]}>
                {t('logout')}
              </GlobalText>
              <Icon name="logout" color="black" size={20} style={styles.icon} />
            </View>
          </TouchableOpacity>
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
  img: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default Profile;
