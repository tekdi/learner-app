// syncService.js

import { AppState } from 'react-native';
import { getData } from '../utils/JsHelper/SqliteHelper';
import { getSyncTrackingOfflineOrderById } from '../utils/API/AuthService';

let intervalRef = null;
let isSyncing = false;
let appStateSubscription = null;

const SYNC_INTERVAL = 5000; // 5 sec

// 👉 Your actual sync logic (replace this)
const syncQueue = async () => {
  if (isSyncing) return;

  try {
    isSyncing = true;

    console.log('🔄 Sync started');

    // TODO:
    // 1. Read from AsyncStorage queue
    // 2. Call API
    // 3. Remove successful entries

    // Example:
    // const queue = await getQueue();
    // await sendToServer(queue);

    // step 1 get all offline data from id as ascending order from asessment_offline_2 table
    let result_sync_offline_tracking =
      await getSyncTrackingOfflineOrderById(user_id);

    console.log('result_sync_offline_tracking', result_sync_offline_tracking);

    console.log('✅ Sync completed');
  } catch (err) {
    console.log('❌ Sync failed', err);
  } finally {
    isSyncing = false;
  }
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
