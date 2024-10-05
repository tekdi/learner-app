import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import globalStyles from '../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/Ionicons';
import { useInternet } from '../../context/NetworkContext';
import {
  deleteAsessmentOffline,
  deleteTelemetryOffline,
  deleteTrackingOffline,
  getSyncAsessmentOffline,
  getSyncTelemetryOffline,
  getSyncTrackingOffline,
} from '../../utils/API/AuthService';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';
import BackgroundFetch from 'react-native-background-fetch';
import NetInfo from '@react-native-community/netinfo';
import {
  assessmentTracking,
  contentTracking,
  telemetryTracking,
} from '../../utils/API/ApiCalls';
import {
  useFocusEffect,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';

const SyncCard = ({ doneSync }) => {
  const { t } = useTranslation();
  const { isConnected } = useInternet();
  const [isSyncPending, setIsSyncPending] = useState(false);
  const [syncCall, setSyncCall] = useState('');
  const [isProgress, setIsProgress] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const hasSynced = useRef(false);

  //solved 4 times issue
  const isFirstRender = useRef(true);

  const [temp, setTemp] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('internet changed ', isConnected);
      await performDataSync();
    };
    fetchData();
  }, [isConnected, temp]);

  useFocusEffect(
    useCallback(() => {
      console.log('Screen is focused');

      const fetchData = async () => {
        console.log('internet changed ', isConnected);
        await performDataSync();
      };
      fetchData();
      // Perform any task when the screen is focused

      return () => {
        console.log('Screen is unfocused');
        // Perform any cleanup or task when screen is unfocused
      };
    }, [])
  );

  /*useEffect(() => {
    // Configure Background Fetch
    const configureBackgroundFetch = async () => {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15,
        },
        async (taskId) => {
          if (isOnline && !hasSynced.current) {
            hasSynced.current = true;
            if (!isProgress) {
              await performDataSync();
            }
          } else {
          }

          BackgroundFetch.finish(taskId);
        },
        (error) => {
          console.error('[BackgroundFetch] configure failed:', error);
        }
      );
    };

    configureBackgroundFetch();

    // Monitor network state
    const unsubscribeNetInfo = NetInfo.addEventListener(async (state) => {
      setIsOnline(state.isConnected);
      if (state.isConnected) {
        await startSync();
      } else {
        stopSync();
      }
    });

    return () => {
      unsubscribeNetInfo(); // Unsubscribe from network listener
      BackgroundFetch.stop(); // Stop background fetch when component is unmounted
    };
  }, [isOnline]);*/

  const performDataSync = async () => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      try {
        // Simulate data sync process
        //get sync pending
        const user_id = await getDataFromStorage('userId');
        let result_sync_offline = await getSyncAsessmentOffline(user_id);
        let result_sync_offline_telemetry = await getSyncTelemetryOffline(
          user_id
        );
        let result_sync_offline_tracking = await getSyncTrackingOffline(
          user_id
        );
        // console.log('result_sync_offline', result_sync_offline);
        // console.log(
        //   'result_sync_offline_telemetry',
        //   result_sync_offline_telemetry
        // );
        // console.log(
        //   'result_sync_offline_tracking',
        //   result_sync_offline_tracking
        // );
        if (
          (result_sync_offline && !isProgress) ||
          (result_sync_offline_telemetry && !isProgress) ||
          (result_sync_offline_tracking && !isProgress)
        ) {
          if (result_sync_offline) {
            setIsSyncPending(true);
            setIsProgress(true);
            setSyncCall('Assessments');
            //sync data to online
            let isError = false;
            //console.log('result_sync_offline', result_sync_offline.length);
            for (let i = 0; i < result_sync_offline.length; i++) {
              let assessment_result = result_sync_offline[i];
              try {
                let payload = JSON.parse(assessment_result?.payload);
                let create_assessment = await assessmentTracking(
                  payload?.scoreDetails,
                  payload?.identifierWithoutImg,
                  payload?.maxScore,
                  payload?.seconds,
                  payload?.userId,
                  payload?.batchId,
                  payload?.lastAttemptedOn,
                  payload?.courseId,
                  payload?.unitId
                );
                if (
                  create_assessment &&
                  create_assessment?.response?.responseCode == 201
                ) {
                  //success
                  //console.log('create_assessment', create_assessment);
                  //delete from storage
                  await deleteAsessmentOffline(
                    assessment_result?.user_id,
                    assessment_result?.batch_id,
                    assessment_result?.content_id
                  );
                } else {
                  isError = true;
                }
              } catch (e) {
                //console.log('error in result_sync_offline ', e);
              }
            }
            //setIsSyncPending(false);
            //setIsProgress(false);
            if (!isError && doneSync) {
              //doneSync(); //call back function
            }
          }
          if (result_sync_offline_telemetry) {
            //telemetry offline data sync
            setIsSyncPending(true);
            setIsProgress(true);
            setSyncCall('Telemetry');
            let isError = false;
            // console.log(
            //   'result_sync_offline_telemetry',
            //   result_sync_offline_telemetry.length
            // );
            for (let i = 0; i < result_sync_offline_telemetry.length; i++) {
              let telemetry_result = result_sync_offline_telemetry[i];
              try {
                let telemetry_object = JSON.parse(
                  telemetry_result?.telemetry_object
                );

                let create_telemetry = await telemetryTracking(
                  telemetry_object
                );
                if (
                  create_telemetry &&
                  create_telemetry?.response?.responseCode == 'SUCCESS'
                ) {
                  //success
                  //console.log('create_telemetry', create_telemetry);
                  //delete from storage
                  await deleteTelemetryOffline(telemetry_result?.id);
                } else {
                  isError = true;
                }
              } catch (e) {
                //console.log('error in result_sync_offline_telemetry ', e);
              }
            }
            //setIsSyncPending(false);
            //setIsProgress(false);
            if (!isError && doneSync) {
              //doneSync(); //call back function
            }
          }
          if (result_sync_offline_tracking) {
            setIsSyncPending(true);
            setIsProgress(true);
            setSyncCall('Tracking');
            //sync data to online
            let isError = false;
            // console.log(
            //   'result_sync_offline_tracking',
            //   result_sync_offline_tracking.length
            // );
            for (let i = 0; i < result_sync_offline_tracking.length; i++) {
              let cntent_tracking = result_sync_offline_tracking[i];
              try {
                let detailsObject = JSON.parse(cntent_tracking?.detailsObject);
                let create_tracking = await contentTracking(
                  cntent_tracking?.user_id,
                  cntent_tracking?.course_id,
                  cntent_tracking?.batch_id,
                  cntent_tracking?.content_id,
                  cntent_tracking?.content_type,
                  cntent_tracking?.content_mime,
                  cntent_tracking?.lastAccessOn,
                  detailsObject,
                  cntent_tracking?.unit_id
                );
                if (
                  create_tracking &&
                  create_tracking?.response?.responseCode == 201
                ) {
                  //success
                  //console.log('create_tracking', create_tracking);
                  //delete from storage
                  await deleteTrackingOffline(cntent_tracking?.id);
                } else {
                  isError = true;
                }
              } catch (e) {
                //console.log('error in result_sync_offline ', e);
              }
            }
            //setIsSyncPending(false);
            //setIsProgress(false);
            if (!isError && doneSync) {
              //doneSync(); //call back function
            }
          }
        } else {
          setIsSyncPending(false);
          setIsProgress(false);
        }

        //check sync all or not
        result_sync_offline = await getSyncAsessmentOffline(user_id);
        result_sync_offline_telemetry = await getSyncTelemetryOffline(user_id);
        result_sync_offline_tracking = await getSyncTrackingOffline(user_id);
        // console.log('result_sync_offline', result_sync_offline);
        // console.log(
        //   'result_sync_offline_telemetry',
        //   result_sync_offline_telemetry
        // );
        // console.log(
        //   'result_sync_offline_tracking',
        //   result_sync_offline_tracking
        // );
        if (
          (result_sync_offline && !isProgress) ||
          (result_sync_offline_telemetry && !isProgress) ||
          (result_sync_offline_tracking && !isProgress)
        ) {
          await performDataSync();
        } else {
          setIsSyncPending(false);
          setIsProgress(false);
        }
        console.log('Data synced successfully.');
      } catch (error) {
        console.error('Data sync failed:', error);
      }
      isFirstRender.current = true;
    }
  };

  const startSync = async () => {
    if (!hasSynced.current) {
      if (!isProgress) {
        await performDataSync();
      }
    }
  };

  const stopSync = () => {};

  return (
    <>
      {isSyncPending && (
        <View style={styles.container}>
          {isConnected ? (
            <>
              <Icon name="cloud-outline" color={'black'} size={22} />
              <Text
                allowFontScaling={false}
                style={[globalStyles.text, { marginLeft: 10 }]}
              >
                {t('back_online_syncing')}
                {'\n'}
                {syncCall}
              </Text>
              {isProgress && <ActivityIndicator size="small" />}
            </>
          ) : (
            <>
              <Icon name="cloud-offline-outline" color={'#7C766F'} size={22} />
              <Text
                allowFontScaling={false}
                style={[globalStyles.text, { marginLeft: 10, fontSize: 12 }]}
              >
                {t('sync_pending_no_internet_available')}
              </Text>
            </>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 30,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#CDE2FF',
    // Shadow for Android
    elevation: 10, // Adjust to control the intensity of the shadow
  },
});

export default SyncCard;
