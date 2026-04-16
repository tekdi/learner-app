// syncService.js

import { AppState } from 'react-native';
import {
  deleteTrackingOffline,
  getSyncTrackingOfflineOrderById,
} from '../utils/API/AuthService';
import { getDataFromStorage } from '../utils/JsHelper/Helper';
import { contentTracking, contentTrackingSync } from '../utils/API/ApiCalls';

let intervalRef = null;
let appStateSubscription = null;

// Serializes sync runs: interval / resume triggers queue here; each run waits for the previous to finish.
let syncRunChain = Promise.resolve();

const SYNC_INTERVAL = 10000; // 10 sec

const runSync = async () => {
  console.log('🔄 Sync started');

  try {
    // TODO:
    // 1. Read from AsyncStorage queue
    // 2. Call API
    // 3. Remove successful entries

    const token = await getDataFromStorage('Accesstoken');
    const userId = await getDataFromStorage('userId');
    if (token && userId) {
      const result_sync_offline_tracking =
        await getSyncTrackingOfflineOrderById(userId);
      if (result_sync_offline_tracking != null) {
        console.log(
          'result_sync_offline_tracking',
          result_sync_offline_tracking
        );
        //create content
        for (let i = 0; i < result_sync_offline_tracking.length; i++) {
          let cntent_tracking = result_sync_offline_tracking[i];
          try {
            let detailsObject = JSON.parse(cntent_tracking?.detailsObject);
            let create_tracking = await contentTrackingSync(
              cntent_tracking?.user_id,
              cntent_tracking?.course_id,
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
              console.log('create_tracking', create_tracking);
              let isGenerateCertificate = true;
              //check is course or not
              if (
                cntent_tracking?.course_id != cntent_tracking?.content_id &&
                isGenerateCertificate == true
              ) {
                //check certififcate issue or not
                console.log('check certififcate issue or not');
                
              }

              //delete from storage
              // await deleteTrackingOffline(cntent_tracking?.id);
            }
          } catch (e) {
            //console.log('error in result_sync_offline ', e);
          }
        }
        // Wait for 20 seconds before proceeding further
        // await new Promise((resolve) => setTimeout(resolve, 20000));
        // console.log('20 seconds passed');
      }
    }
    console.log('✅ Sync completed');
  } catch (err) {
    console.log('❌ Sync failed', err);
  }
};

const syncQueue = () => {
  syncRunChain = syncRunChain
    .then(() => runSync())
    .catch((err) => {
      // Keep the chain alive if runSync throws outside its try/catch
      console.log('❌ Sync failed', err);
    });
};

// ▶ Start interval
const startInterval = () => {
  if (!intervalRef) {
    intervalRef = setInterval(() => {
      syncQueue();
    }, SYNC_INTERVAL);
    console.log('🚀 Sync interval started');
  }
};

// ⏹ Stop interval
const stopInterval = () => {
  if (intervalRef) {
    clearInterval(intervalRef);
    intervalRef = null;
    console.log('⛔ Sync interval stopped');
  }
};

// 🌍 Public function to start global sync
export const startGlobalSync = () => {
  // Start immediately
  startInterval();

  // Listen to app state
  appStateSubscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      console.log('📱 App active → start sync');
      startInterval();
      syncQueue(); // immediate sync on resume
    } else {
      console.log('📱 App inactive → stop sync');
      stopInterval();
    }
  });
};

// 🌍 Public function to stop everything
export const stopGlobalSync = () => {
  stopInterval();

  if (appStateSubscription) {
    appStateSubscription.remove();
    appStateSubscription = null;
  }
};
