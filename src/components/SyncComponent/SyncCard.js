import React, { useEffect, useState, useRef } from 'react';
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
  getSyncAsessmentOffline,
} from '../../utils/API/AuthService';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';
import BackgroundFetch from 'react-native-background-fetch';
import NetInfo from '@react-native-community/netinfo';
import { assessmentTracking } from '../../utils/API/ApiCalls';

const SyncCard = ({ doneSync }) => {
  const { t } = useTranslation();
  const { isConnected } = useInternet();
  const [isSyncPending, setIsSyncPending] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Idle');
  const [isOnline, setIsOnline] = useState(false);
  const hasSynced = useRef(false);

  //solved 4 times issue
  const isFirstRender = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      //get sync pending
      const user_id = await getDataFromStorage('userId');
      const result_sync_offline = await getSyncAsessmentOffline(user_id);
      //console.log('result_sync_offline', result_sync_offline);
      if (result_sync_offline) {
        setIsSyncPending(true);
      } else {
        setIsSyncPending(false);
      }
    };
    fetchData();
  }, [isConnected]);

  useEffect(() => {
    // Configure Background Fetch
    const configureBackgroundFetch = async () => {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15,
        },
        async (taskId) => {
          if (isOnline && !hasSynced.current) {
            hasSynced.current = true;
            setSyncStatus('Syncing...');
            if (!isProgress) {
              await performDataSync();
            }
            setSyncStatus('Synced');
          } else {
            setSyncStatus('Waiting for connection...');
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
  }, [isOnline]);

  const performDataSync = async () => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      try {
        // Simulate data sync process
        //get sync pending
        const user_id = await getDataFromStorage('userId');
        const result_sync_offline = await getSyncAsessmentOffline(user_id);
        if (result_sync_offline && !isProgress) {
          console.log('result_sync_offline', result_sync_offline.length);
          setIsSyncPending(true);
          setIsProgress(true);
          //sync data to online
          let isError = false;
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
                payload?.lastAttemptedOn
              );
              if (
                create_assessment &&
                create_assessment?.response?.responseCode == 201
              ) {
                //success
                console.log('create_assessment', create_assessment);
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
              console.log(e);
            }
          }
          setIsSyncPending(false);
          setIsProgress(false);
          if (!isError) {
            doneSync(); //call back function
          }
        } else {
          setIsSyncPending(false);
          setIsProgress(false);
        }
        console.log('Data synced successfully.');
      } catch (error) {
        console.error('Data sync failed:', error);
      }
    }
  };

  const startSync = async () => {
    setSyncStatus('Online - Starting sync...');
    if (!hasSynced.current) {
      if (!isProgress) {
        await performDataSync();
      }
    }
  };

  const stopSync = () => {
    setSyncStatus('Offline - Sync paused');
  };

  return (
    <>
      {isSyncPending && (
        <View style={styles.container}>
          {isConnected ? (
            <>
              <Icon name="cloud-outline" color={'black'} size={22} />
              <Text style={[globalStyles.text, { marginLeft: 10 }]}>
                {syncStatus}
                {t('back_online_syncing')}
              </Text>
              {isProgress && <ActivityIndicator size="small" />}
            </>
          ) : (
            <>
              <Icon name="cloud-offline-outline" color={'#7C766F'} size={22} />
              <Text style={[globalStyles.text, { marginLeft: 10 }]}>
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
