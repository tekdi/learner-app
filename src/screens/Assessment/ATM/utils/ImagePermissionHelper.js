import { PermissionsAndroid, Platform, Alert } from 'react-native';

class ImagePermissionHelper {
  /**
   * Request camera permission
   * @returns {Promise<boolean>} - true if permission granted
   */
  static async requestCameraPermission() {
    if (Platform.OS === 'ios') {
      return true; // iOS handles permissions automatically
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  }

  /**
   * Request storage permission for reading images
   * @returns {Promise<boolean>} - true if permission granted
   */
  static async requestStoragePermission() {
    if (Platform.OS === 'ios') {
      return true; // iOS handles permissions automatically
    }

    try {
      // For Android 13+ (API 33+), we don't need to request READ_MEDIA_IMAGES
      // The Photo Picker will handle permissions automatically
      if (Platform.Version >= 33) {
        return true; // Photo Picker handles permissions automatically
      } else if (Platform.Version >= 29) {
        // Android 10-12 (API 29-32) - use READ_EXTERNAL_STORAGE
        // Note: requestLegacyExternalStorage is set to true in AndroidManifest.xml
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to select images.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 8-9 (API 26-28) - use READ_EXTERNAL_STORAGE
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to select images.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Storage permission error:', err);
      return false;
    }
  }

  /**
   * Check if camera permission is granted
   * @returns {Promise<boolean>}
   */
  static async checkCameraPermission() {
    if (Platform.OS === 'ios') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted;
    } catch (err) {
      console.warn('Check camera permission error:', err);
      return false;
    }
  }

  /**
   * Check if storage permission is granted
   * @returns {Promise<boolean>}
   */
  static async checkStoragePermission() {
    if (Platform.OS === 'ios') {
      return true;
    }

    try {
      // For Android 13+ (API 33+), Photo Picker handles permissions automatically
      if (Platform.Version >= 33) {
        return true; // No need to check permissions for Photo Picker
      } else {
        // For older Android versions, check READ_EXTERNAL_STORAGE
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return granted;
      }
    } catch (err) {
      console.warn('Check storage permission error:', err);
      return false;
    }
  }

  /**
   * Request all required permissions
   * @returns {Promise<{camera: boolean, storage: boolean}>}
   */
  static async requestAllPermissions() {
    const [cameraPermission, storagePermission] = await Promise.all([
      this.requestCameraPermission(),
      this.requestStoragePermission(),
    ]);

    return {
      camera: cameraPermission,
      storage: storagePermission,
    };
  }

  /**
   * Show permission denied alert
   * @param {string} permissionType - 'camera' or 'storage'
   */
  static showPermissionDeniedAlert(permissionType) {
    const message =
      permissionType === 'camera'
        ? 'Camera permission is required to take photos. Please enable it in your device settings.'
        : 'Storage permission is required to select images. Please enable it in your device settings.';

    Alert.alert('Permission Required', message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Settings',
        onPress: () => {
          // You can add logic to open device settings here if needed
          console.log('Open device settings');
        },
      },
    ]);
  }

  /**
   * Check if device has camera hardware
   * @returns {boolean}
   */
  static async hasCameraHardware() {
    // This is a basic check - in a real app you might want to use
    // react-native-device-info or similar library for more accurate detection
    return Platform.OS === 'android' || Platform.OS === 'ios';
  }

  /**
   * Get permission status string for debugging
   * @returns {Promise<Object>}
   */
  static async getPermissionStatus() {
    if (Platform.OS === 'ios') {
      return {
        camera: 'iOS - handled automatically',
        storage: 'iOS - handled automatically',
      };
    }

    const cameraStatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );

    let storageStatus;
    if (Platform.Version >= 33) {
      storageStatus = 'Photo Picker - handled automatically';
    } else {
      storageStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      storageStatus = storageStatus ? 'granted' : 'denied';
    }

    return {
      camera: cameraStatus ? 'granted' : 'denied',
      storage: storageStatus,
      androidVersion: Platform.Version,
      apiLevel: Platform.Version,
    };
  }
}

export default ImagePermissionHelper;
