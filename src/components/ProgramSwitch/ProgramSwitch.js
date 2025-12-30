import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import GlobalText from '@components/GlobalText/GlobalText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';

import {
  getCohort,
  getProfileDetails,
  getProgramDetails,
  getUserDetails,
  setAcademicYear,
  notificationSubscribe,
  telemetryTrackingData,
} from '../../utils/API/AuthService';
import {
  deleteSavedItem,
  getActiveCohortData,
  getActiveCohortIds,
  getDataFromStorage,
  getDeviceId,
  getuserDetails,
  logEventFunction,
  saveAccessToken,
  saveRefreshToken,
  setDataInStorage,
  storeUsername,
} from '../../utils/JsHelper/Helper';
import moment from 'moment';
import { TENANT_DATA } from '../../utils/Constants/app-constants';
import { NotificationUnsubscribe } from '../../utils/Helper/JSHelper';
const ProgramSwitch = ({ userId, onSuccess, onError, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [currentUserType, setCurrentUserType] = useState('');
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [tenantData, setTenantData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
      getCurrentUserType();
    }
  }, [userId]);

  // Refetch data when component comes into focus (e.g., after program switch)
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        getCurrentUserType();
        fetchUserDetails();
      }
    }, [userId])
  );

  const getCurrentUserType = async () => {
    try {
      const userType = await getDataFromStorage('userType');
      setCurrentUserType(userType || '');
    } catch (error) {
      console.error('Error getting userType:', error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      // Get current tenant ID to exclude it from the list
      const currentTenantId = await getDataFromStorage('userTenantid');
      console.log('Current tenant ID:', currentTenantId);

      // Call getUserDetails API
      const response = await getUserDetails({ user_id: userId });
      console.log(
        'User details fetched successfully:',
        JSON.stringify(response?.userData?.tenantData)
      );

      if (response?.userData?.tenantData) {
        const allTenantData = response.userData.tenantData;
        setTenantData(allTenantData);

        // Filter tenants where role is "Learner" and status is "active" or "pending"
        // AND exclude the current program
        const filteredPrograms = allTenantData.filter((tenant) => {
          const hasLearnerRole = tenant.roles?.some(
            (role) => role.roleName?.toLowerCase() === 'learner'
          );
          const isActiveOrPending =
            tenant.tenantStatus === 'active' || tenant.tenantStatus === 'pending';
          const isNotCurrentProgram = tenant.tenantId !== currentTenantId;
          
          return hasLearnerRole && isActiveOrPending && isNotCurrentProgram;
        });

        setEnrolledPrograms(filteredPrograms);

        // Store userId in localStorage (AsyncStorage)
        await setDataInStorage('userId', userId);

        console.log('Current program excluded. Other enrolled programs:', filteredPrograms);

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(response.userData);
        }
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Error', 'Failed to fetch user details. Please try again.');

      // Call error callback if provided
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };
   const handleProgramLogin = async(tenant) => {
    try {
      setLoading(true);
      const tenantId = tenant?.tenantId;
      const tenantName = tenant?.tenantName;
      
      console.log('#### Starting program switch for:', tenantName, tenantId);
      
      // Get user_id from storage
      const user_id = await getDataFromStorage('userId');
      
      if (!user_id) {
        Alert.alert('Error', 'User ID not found. Please login again.');
        setLoading(false);
        return;
      }

      // Get user details from storage
      const userDetails = await getuserDetails();
      
      if (!userDetails || !userDetails.tenantData) {
        Alert.alert('Error', 'User details not found. Please login again.');
        setLoading(false);
        return;
      }

      const selectedTenantData = [
        userDetails?.tenantData?.find((t) => t.tenantId === tenantId),
      ];
      console.log('#### loginmultirole selectedTenantData', selectedTenantData);

      if (!selectedTenantData[0]) {
        Alert.alert('Error', 'Program data not found. Please try again.');
        setLoading(false);
        return;
      }

      const enrollmentId = userDetails?.enrollmentId;
      await setDataInStorage('tenantData', JSON.stringify(selectedTenantData || {}));
      await setDataInStorage('userId', user_id || '');
      await setDataInStorage('enrollmentId', enrollmentId || '');

      //store dynamic templateId
      const templateId = selectedTenantData?.[0]?.templateId;
      await setDataInStorage('templateId', templateId || '');

      const academicyear = await setAcademicYear({ tenantid: tenantId });
      const academicYearId = academicyear?.[0]?.id;
      await setDataInStorage('academicYearId', academicYearId || '');
      await setDataInStorage('userTenantid', tenantId || '');
      
      const cohort = await getCohort({
        user_id,
        tenantid: tenantId,
        academicYearId,
      });
      console.log('#### loginmultirole cohort', cohort);
      
      let cohort_id;
      if (cohort.params?.status !== 'failed') {
        const getActiveCohort = await getActiveCohortData(cohort);
        const getActiveCohortId = await getActiveCohortIds(cohort);
        await setDataInStorage(
          'cohortData',
          JSON.stringify(getActiveCohort?.[0]) || ''
        );
        cohort_id = getActiveCohortId?.[0];
      }

      const profileData = await getProfileDetails({
        userId: user_id,
      });
      console.log('#### loginmultirole profileData', profileData);

      await setDataInStorage('profileData', JSON.stringify(profileData));
      await setDataInStorage(
        'Username',
        profileData?.getUserDetails?.[0]?.username || ''
      );
      await storeUsername(profileData?.getUserDetails?.[0]?.username);

      await setDataInStorage(
        'cohortId',
        cohort_id || '00000000-0000-0000-0000-000000000000'
      );
      
      const tenantDetails = (await getProgramDetails()) || [];

      const MatchedTenant = tenantDetails.filter(
        (item) => item?.tenantId === tenantId
      );

      await setDataInStorage(
        'contentFilter',
        JSON.stringify(MatchedTenant?.[0]?.contentFilter || {})
      );

      // Get tenant IDs for each program type
      const youthnetTenantIds = tenantDetails
        ?.filter((item) => item?.name === TENANT_DATA.YOUTHNET)
        ?.map((item) => item?.tenantId);

      const scpTenantIds = tenantDetails
        ?.filter((item) => item?.name === TENANT_DATA.SECOND_CHANCE_PROGRAM)
        ?.map((item) => item?.tenantId);

      const campToClubTenantIds = tenantDetails
        ?.filter((item) => item?.name === TENANT_DATA.CAMP_TO_CLUB)
        ?.map((item) => item?.tenantId);

      console.log('#### All tenant details:', JSON.stringify(tenantDetails));
      console.log('#### Tenant IDs - SCP:', scpTenantIds, 'Youthnet:', youthnetTenantIds, 'Camp to Club:', campToClubTenantIds);
      console.log('#### Selected Tenant Name:', selectedTenantData?.[0]?.tenantName);
      console.log('#### Looking for tenant with ID:', tenantId);
      
      // Also check by tenant name directly from selectedTenantData
      const selectedTenantName = selectedTenantData?.[0]?.tenantName;
      console.log('#### Comparing tenant name:', selectedTenantName, 'with constants');

      // Device notification subscription
      try {
        const deviceId = await getDeviceId();
        const action = 'add';
        await notificationSubscribe({ deviceId, user_id, action });
      } catch (notifError) {
        console.log('#### Notification subscribe error (non-critical):', notifError);
      }
      
      // Telemetry tracking
      try {
        const now = moment();
        const telemetryPayloadData = {
          event: 'login',
          type: 'click',
          ets: now.unix(),
        };
        await telemetryTrackingData({
          telemetryPayloadData,
        });
      } catch (telemetryError) {
        console.log('#### Telemetry tracking error (non-critical):', telemetryError);
      }

      // Close the modal BEFORE navigation
      if (onClose && typeof onClose === 'function') {
        onClose();
      }

      // Small delay to ensure modal closes and storage is written
      await new Promise(resolve => setTimeout(resolve, 200));

      // Navigate based on program type
      setLoading(false);
      
      // Use selectedTenantName already declared above
      if (scpTenantIds?.includes(tenantId)) {
        console.log('#### Navigating to SCP (matched by tenant ID)');
        await setDataInStorage('userType', 'scp');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SCPUserTabScreen' }],
        });
      } else if (selectedTenantName === TENANT_DATA.SECOND_CHANCE_PROGRAM) {
        console.log('#### Navigating to SCP (matched by tenant name)');
        await setDataInStorage('userType', 'scp');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SCPUserTabScreen' }],
        });
      } else if (youthnetTenantIds?.includes(tenantId)) {
        console.log('#### Navigating to Youthnet/Vocational Training (matched by tenant ID)');
        await setDataInStorage('userType', 'youthnet');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } else if (selectedTenantName === TENANT_DATA.YOUTHNET) {
        console.log('#### Navigating to Youthnet/Vocational Training (matched by tenant name)');
        await setDataInStorage('userType', 'youthnet');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } else if (campToClubTenantIds?.includes(tenantId)) {
        console.log('#### Navigating to Camp to Club (matched by tenant ID)');
        await setDataInStorage('userType', TENANT_DATA.CAMP_TO_CLUB);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } else if (selectedTenantName === TENANT_DATA.CAMP_TO_CLUB) {
        console.log('#### Navigating to Camp to Club (matched by tenant name)');
        await setDataInStorage('userType', TENANT_DATA.CAMP_TO_CLUB);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } else {
        // Default: use tenant name as userType
        console.log('#### Navigating to Default Dashboard with userType:', selectedTenantName);
        await setDataInStorage('userType', selectedTenantName || 'default');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      }
      
    } catch (error) {
      console.error('#### Error in handleProgramLogin:', error);
      console.error('#### Error details:', JSON.stringify(error));
      setLoading(false);
      
      // Close modal on error too
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
      
      Alert.alert(
        'Error', 
        `Failed to switch program: ${error.message || 'Please try again.'}`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (onError && typeof onError === 'function') {
                onError(error);
              }
            }
          }
        ]
      );
    }
  };
  // const handleProgramLogin = async(tenant) => {
  //   try {
  //     setLoading(true);
  //     const tenantId = tenant?.tenantId;
      
  //     // Get user details from storage
  //     const userDetails = await getuserDetails();
  //     const roleName = "Learner";

  //     // Get userId properly from storage (await the promise)
  //     const user_id = await getDataFromStorage('userId');
      
  //     if (!user_id) {
  //       Alert.alert('Error', 'User ID not found. Please login again.');
  //       setLoading(false);
  //       return;
  //     }

  //     const selectedTenantData = [
  //       userDetails?.tenantData?.find((t) => t.tenantId === tenantId),
  //     ];
  //     console.log('#### loginmultirole selectedTenantData', selectedTenantData);

  //     if (!selectedTenantData[0]) {
  //       Alert.alert('Error', 'Program data not found. Please try again.');
  //       setLoading(false);
  //       return;
  //     }

  //     const enrollmentId = userDetails?.enrollmentId;
  //     await setDataInStorage('tenantData', JSON.stringify(selectedTenantData || {}));
  //     await setDataInStorage('userId', user_id || '');
  //     await setDataInStorage('enrollmentId', enrollmentId || '');

  //     //store dynamic templateId
  //     const templateId = selectedTenantData?.[0]?.templateId;
  //     await setDataInStorage('templateId', templateId || '');

  //     const academicyear = await setAcademicYear({ tenantid: tenantId });
  //     const academicYearId = academicyear?.[0]?.id;
  //     await setDataInStorage('academicYearId', academicYearId || '');
  //     await setDataInStorage('userTenantid', tenantId || '');
      
  //     const cohort = await getCohort({
  //       user_id,
  //       tenantid: tenantId,
  //       academicYearId,
  //     });
  //     console.log('#### loginmultirole cohort', cohort);
      
  //     let cohort_id;
  //     if (cohort.params?.status !== 'failed') {
  //       const getActiveCohort = await getActiveCohortData(cohort);
  //       const getActiveCohortId = await getActiveCohortIds(cohort);
  //       await setDataInStorage(
  //         'cohortData',
  //         JSON.stringify(getActiveCohort?.[0]) || ''
  //       );
  //       cohort_id = getActiveCohortId?.[0];
  //     }

  //     const profileData = await getProfileDetails({
  //       userId: user_id,
  //     });
  //     console.log('#### loginmultirole profileData', profileData);

  //     await setDataInStorage('profileData', JSON.stringify(profileData));
  //     await setDataInStorage(
  //       'Username',
  //       profileData?.getUserDetails?.[0]?.username || ''
  //     );
  //     await storeUsername(profileData?.getUserDetails?.[0]?.username);

  //     await setDataInStorage(
  //       'cohortId',
  //       cohort_id || '00000000-0000-0000-0000-000000000000'
  //     );
      
  //     const tenantDetails = (await getProgramDetails()) || [];

  //     const MatchedTenant = tenantDetails.filter(
  //       (item) => item?.tenantId === tenantId
  //     );

  //     await setDataInStorage(
  //       'contentFilter',
  //       JSON.stringify(MatchedTenant?.[0]?.contentFilter || {})
  //     );

  //     // Get tenant IDs for each program type
  //     const youthnetTenantIds = tenantDetails
  //       ?.filter((item) => item?.name === TENANT_DATA.YOUTHNET)
  //       ?.map((item) => item?.tenantId);

  //     const scpTenantIds = tenantDetails
  //       ?.filter((item) => item?.name === TENANT_DATA.SECOND_CHANCE_PROGRAM)
  //       ?.map((item) => item?.tenantId);

  //     const campToClubTenantIds = tenantDetails
  //       ?.filter((item) => item?.name === TENANT_DATA.CAMP_TO_CLUB)
  //       ?.map((item) => item?.tenantId);

  //     console.log('#### Tenant IDs - SCP:', scpTenantIds, 'Youthnet:', youthnetTenantIds, 'Camp to Club:', campToClubTenantIds);
  //     console.log('#### Selected Tenant Name:', selectedTenantData?.[0]?.tenantName);

  //     // Navigate based on program type
  //     if (scpTenantIds?.includes(tenantId)) {
  //       console.log('#### Navigating to SCP');
  //       await setDataInStorage('userType', 'scp');
  //       setLoading(false);
  //       navigation.navigate('SCPUserTabScreen');
  //     } else if (youthnetTenantIds?.includes(tenantId)) {
  //       console.log('#### Navigating to Youthnet/Vocational Training');
  //       await setDataInStorage('userType', 'youthnet');
  //       setLoading(false);
  //       navigation.navigate('Dashboard');
  //     } else if (campToClubTenantIds?.includes(tenantId)) {
  //       console.log('#### Navigating to Camp to Club');
  //       await setDataInStorage('userType', TENANT_DATA.CAMP_TO_CLUB);
  //       setLoading(false);
  //       navigation.navigate('Dashboard');
  //     } else {
  //       // Default: use tenant name as userType
  //       console.log('#### Navigating to Default Dashboard with userType:', selectedTenantData?.[0]?.tenantName);
  //       await setDataInStorage('userType', selectedTenantData?.[0]?.tenantName || 'default');
  //       setLoading(false);
  //       navigation.navigate('Dashboard');
  //     }
      
  //     // Close the modal/dialog if onClose is provided
  //     if (onClose) {
  //       onClose();
  //     }
      
  //   } catch (error) {
  //     console.error('Error in handleProgramLogin:', error);
  //     setLoading(false);
  //     Alert.alert(
  //       'Error', 
  //       'Failed to switch program. Please try again.',
  //       [
  //         {
  //           text: 'OK',
  //           onPress: () => {
  //             if (onError) {
  //               onError(error);
  //             }
  //           }
  //         }
  //       ]
  //     );
  //   }
  // };
  const handleProgramSwitch = async (tenant) => {
    try {
      // Store the selected tenant information
      await setDataInStorage('userTenantid', tenant.tenantId);
      await setDataInStorage('userType', tenant.tenantName);
      
      console.log('Switched to program:', tenant.tenantName);
      Alert.alert('Success', `Switched to ${tenant.tenantName}`, [
        {
          text: 'OK',
          onPress: () => {
            if (onSuccess) {
              onSuccess(tenant);
            }
          },
        },
      ]);
    } catch (error) {
      console.error('Error switching program:', error);
      Alert.alert('Error', 'Failed to switch program. Please try again.');
    }
  };

  const handleShowAllPrograms = () => {
    console.log('All tenant data:', tenantData);
    // Navigate to Programs screen
    navigation.navigate('ProgramsScreen');
  };
  const logoutEvent = async () => {
    const obj = {
      eventName: 'logout_Event',
      method: 'button-click',
      screenName: 'ProgramSwitch',
    };
    await logEventFunction(obj);
  };
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async() => {
          const fetchData = async () => {
            await NotificationUnsubscribe();
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
            await deleteSavedItem('userType');
            logoutEvent();
            // Reset the navigation stack and navigate to LoginSignUpScreen
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              })
            );
            const now = moment();
            const telemetryPayloadData = {
              event: 'logout',
              type: 'click',
              ets: now.unix(),
            };
            await telemetryTrackingData({
              telemetryPayloadData,
            });
          };
      
          fetchData();          // Add your logout logic here
        },
      },
    ]);
  };





  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F6931E" />
          <GlobalText style={styles.loadingText}>Loading programs...</GlobalText>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Current Program Header */}
          <View style={styles.headerContainer}>
            <GlobalText style={styles.currentProgramTitle}>
              {currentUserType ==="scp" ? "Second Chance Program" : currentUserType ==="youthnet" ? "Vocational Traning" : currentUserType }
            </GlobalText>
          </View>

          {/* Other Programs Section */}
          <View style={styles.sectionContainer}>
            <GlobalText style={styles.sectionTitle}>
              Other programs you are enrolled in
            </GlobalText>

            {enrolledPrograms.length > 0 ? (
              enrolledPrograms.map((program, index) => (
                <TouchableOpacity
                  key={program.tenantId || index}
                  style={styles.programCard}
                  onPress={() => handleProgramLogin(program)}
                >
                  <GlobalText style={styles.programName}>
                    {program.tenantName}
                  </GlobalText>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#4D4639"
                  />
                </TouchableOpacity>
              ))
            ) : (
              <GlobalText style={styles.emptyText}>
                No other programs available
              </GlobalText>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Ionicons name="home-outline" size={20} color="#000" />
              <GlobalText style={styles.buttonText}>Home</GlobalText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleShowAllPrograms}
            >
              <GlobalText style={styles.buttonText}>
                Show All Programs
              </GlobalText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <GlobalText style={[styles.buttonText, styles.logoutText]}>
                Logout
              </GlobalText>
              <Ionicons name="log-out-outline" size={20} color="#F6931E" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

ProgramSwitch.propTypes = {
  userId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onClose: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4D4639',
    fontFamily: 'Poppins-Regular',
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  currentProgramTitle: {
    fontSize: 22,
    color: '#000',
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
  },
  sectionContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginBottom: 15,
  },
  programCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  programName: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D0C5B4',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutButton: {
    borderColor: '#F6931E',
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins-Medium',
    marginHorizontal: 8,
  },
  logoutText: {
    color: '#F6931E',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default ProgramSwitch;

