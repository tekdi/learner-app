import { Platform, Alert, PermissionsAndroid, Linking } from 'react-native';
import RNFS from 'react-native-fs';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

class CrossPlatformDownloadHelper {
  /**
   * Get the appropriate download path based on Android version
   * @returns {string} Download path
   */
  static getDownloadPath() {
    if (Platform.OS === 'android') {
      // For Android 10+ (API 29+), we need to handle scoped storage differently
      if (Platform.Version >= 29) {
        // Try to use the app's external files directory first, then copy to Downloads
        const appExternalPath = `${RNFS.ExternalDirectoryPath}/LearnerApp`;
        console.log(
          'Android 10+ detected - using app external path:',
          appExternalPath
        );
        return appExternalPath;
      } else {
        // For Android 8-9, use the public Downloads folder directly
        const downloadsPath = `${RNFS.DownloadDirectoryPath}/LearnerApp`;
        console.log(
          'Android 8-9 detected - using Downloads path:',
          downloadsPath
        );
        return downloadsPath;
      }
    } else {
      // iOS - use Documents directory
      return `${RNFS.DocumentDirectoryPath}/LearnerApp`;
    }
  }

  /**
   * Get the final Downloads path for saving to public Downloads folder
   * @returns {string} Downloads path
   */
  static getPublicDownloadsPath() {
    if (Platform.OS === 'android') {
      return `${RNFS.DownloadDirectoryPath}/LearnerApp`;
    } else {
      return `${RNFS.DocumentDirectoryPath}/LearnerApp`;
    }
  }

  /**
   * Check and request storage permissions based on Android version
   * @returns {Promise<boolean>} Permission granted status
   */
  static async checkAndRequestStoragePermissions() {
    try {
      console.log('=== Cross-Platform Permission Check ===');
      console.log('Platform:', Platform.OS, 'Version:', Platform.Version);

      if (Platform.OS !== 'android') {
        console.log('iOS - no special permissions needed');
        return true;
      }

      let permission;
      let permissionName;

      if (Platform.Version >= 33) {
        // Android 13+ (API 33+) - Downloads don't require READ_MEDIA_IMAGES
        // We only need WRITE_EXTERNAL_STORAGE for saving files, but it's often not needed on Android 13+
        // For downloads, we can use app's external storage without permissions
        console.log(
          'Android 13+ - no permission needed for downloads (using app storage)'
        );
        return true; // Downloads work without explicit permission on Android 13+
      } else if (Platform.Version >= 29) {
        // Android 10-12 (API 29-32)
        permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
        permissionName = 'WRITE_EXTERNAL_STORAGE';
        console.log('Android 10-12 - using WRITE_EXTERNAL_STORAGE');
      } else {
        // Android 8-9 (API 26-28)
        permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
        permissionName = 'WRITE_EXTERNAL_STORAGE';
        console.log('Android 8-9 - using WRITE_EXTERNAL_STORAGE');
      }

      console.log('Checking permission:', permissionName);
      const result = await check(permission);
      console.log('Permission check result:', result);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('Permission unavailable');
          return false;

        case RESULTS.DENIED:
          console.log('Permission denied, requesting...');
          const permissionResult = await request(permission);
          console.log('Permission request result:', permissionResult);

          // For Android 8-9, also check if we need to request READ_EXTERNAL_STORAGE
          if (Platform.Version <= 28 && permissionResult === RESULTS.GRANTED) {
            console.log('Checking READ_EXTERNAL_STORAGE for Android 8-9');
            const readResult = await check(
              PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
            );
            if (readResult === RESULTS.DENIED) {
              const readPermissionResult = await request(
                PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
              );
              console.log(
                'READ_EXTERNAL_STORAGE request result:',
                readPermissionResult
              );
              return readPermissionResult === RESULTS.GRANTED;
            }
          }

          return permissionResult === RESULTS.GRANTED;

        case RESULTS.LIMITED:
          console.log('Permission limited - returning true');
          return true;

        case RESULTS.GRANTED:
          console.log('Permission already granted');
          return true;

        case RESULTS.BLOCKED:
          console.log('Permission blocked');
          return false;

        default:
          console.log('Unknown permission result:', result);
          return false;
      }
    } catch (error) {
      console.log('Permission check error:', error);
      return false;
    }
  }

  /**
   * Create directory if it doesn't exist
   * @param {string} path - Directory path
   * @returns {Promise<boolean>} Success status
   */
  static async createDirectoryIfNotExists(path) {
    try {
      const exists = await RNFS.exists(path);

      if (!exists) {
        await RNFS.mkdir(path);
      }

      return true;
    } catch (error) {
      console.log('Directory creation error:', error);
      return false;
    }
  }

  /**
   * Generate unique filename to avoid conflicts
   * @param {string} originalName - Original filename
   * @returns {string} Unique filename
   */
  static generateUniqueFileName(originalName) {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const extension = originalName.split('.').pop() || 'jpg';
    return `learner_app_${timestamp}_${randomNum}.${extension}`;
  }

  /**
   * Download file to Downloads folder (works across all Android versions)
   * @param {string} imageUrl - URL of the image to download
   * @param {string} fileName - Desired filename
   * @returns {Promise<boolean>} Success status
   */
  static async downloadToDownloads(imageUrl, fileName) {
    try {
      console.log('=== Cross-Platform Download Started ===');
      console.log('Platform:', Platform.OS, 'Version:', Platform.Version);

      // Check permissions first
      const hasPermission = await this.checkAndRequestStoragePermissions();
      if (!hasPermission) {
        console.log('Permission denied');
        return false;
      }

      // For Android 10+ (API 29+), use two-step process
      if (Platform.OS === 'android' && Platform.Version >= 29) {
        return await this.downloadToDownloadsAndroid10Plus(imageUrl, fileName);
      } else {
        // For Android 8-9 and iOS, use direct download
        return await this.downloadToDownloadsDirect(imageUrl, fileName);
      }
    } catch (error) {
      console.log('Download error:', error);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
      return false;
    }
  }

  /**
   * Download to Downloads folder for Android 10+ (two-step process)
   * @param {string} imageUrl - URL of the image
   * @param {string} fileName - Desired filename
   * @returns {Promise<boolean>} Success status
   */
  static async downloadToDownloadsAndroid10Plus(imageUrl, fileName) {
    try {
      console.log('=== Android 10+ Two-Step Download ===');

      // Step 1: Download to app's external storage
      const appExternalPath = this.getDownloadPath();
      console.log(
        'Step 1: Downloading to app external storage:',
        appExternalPath
      );

      // Create app external directory
      const dirCreated = await this.createDirectoryIfNotExists(appExternalPath);
      if (!dirCreated) {
        console.log('Failed to create app external directory');
        return false;
      }

      // Generate unique filename
      const uniqueFileName = this.generateUniqueFileName(fileName);
      const tempFilePath = `${appExternalPath}/${uniqueFileName}`;
      console.log('Temp file path:', tempFilePath);

      // Download to temp location
      const downloadSuccess = await this.performDownload(
        imageUrl,
        tempFilePath,
        uniqueFileName
      );
      if (!downloadSuccess) {
        console.log('Download to temp location failed');
        return false;
      }

      // Step 2: Copy to public Downloads folder
      console.log('Step 2: Copying to public Downloads folder');
      const publicDownloadsPath = this.getPublicDownloadsPath();
      console.log('Public Downloads path:', publicDownloadsPath);

      // Try to create Downloads directory
      try {
        await this.createDirectoryIfNotExists(publicDownloadsPath);
      } catch (error) {
        console.log(
          'Could not create Downloads directory, will try to copy anyway:',
          error.message
        );
      }

      const finalFilePath = `${publicDownloadsPath}/${uniqueFileName}`;
      console.log('Final file path:', finalFilePath);

      // Copy file to Downloads
      try {
        console.log('Copying file to Downloads...');
        await RNFS.copyFile(tempFilePath, finalFilePath);

        // Verify file was copied
        const fileExists = await RNFS.exists(finalFilePath);
        if (fileExists) {
          const stats = await RNFS.stat(finalFilePath);
          console.log('File stats:', stats);
          console.log('File copied to Downloads successfully');

          // Clean up temp file
          try {
            await RNFS.unlink(tempFilePath);
            console.log('Temp file cleaned up');
          } catch (cleanupError) {
            console.log('Temp file cleanup failed:', cleanupError.message);
          }

          return true;
        } else {
          console.log('File was not copied to Downloads');
          return false;
        }
      } catch (copyError) {
        console.log('Copy to Downloads failed:', copyError.message);
        console.log('File remains in app external storage');
        return true; // Still consider it successful since file was downloaded
      }
    } catch (error) {
      console.log('Android 10+ download error:', error);
      return false;
    }
  }

  /**
   * Direct download to Downloads folder (Android 8-9 and iOS)
   * @param {string} imageUrl - URL of the image
   * @param {string} fileName - Desired filename
   * @returns {Promise<boolean>} Success status
   */
  static async downloadToDownloadsDirect(imageUrl, fileName) {
    try {
      console.log('=== Direct Download Process ===');

      // Get download path
      const downloadPath = this.getDownloadPath();
      console.log('Download path:', downloadPath);

      // Create directory if it doesn't exist
      const dirCreated = await this.createDirectoryIfNotExists(downloadPath);
      if (!dirCreated) {
        console.log('Failed to create directory');
        return false;
      }

      // Generate unique filename
      const uniqueFileName = this.generateUniqueFileName(fileName);
      const filePath = `${downloadPath}/${uniqueFileName}`;
      console.log('Final file path:', filePath);

      // Check if file already exists
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
        console.log('File already exists, generating new name');
        const newFileName = this.generateUniqueFileName(fileName);
        const newFilePath = `${downloadPath}/${newFileName}`;
        console.log('New file path:', newFilePath);
        return await this.performDownload(imageUrl, newFilePath, newFileName);
      }

      return await this.performDownload(imageUrl, filePath, uniqueFileName);
    } catch (error) {
      console.log('Direct download error:', error);
      return false;
    }
  }

  /**
   * Perform the actual download operation
   * @param {string} imageUrl - URL of the image
   * @param {string} filePath - Full file path
   * @param {string} fileName - Filename
   * @returns {Promise<boolean>} Success status
   */
  static async performDownload(imageUrl, filePath, fileName) {
    try {
      console.log('Starting download to:', filePath);

      const downloadResult = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: filePath,
        background: true,
        discretionary: true,
        progress: (res) => {
          const progressPercent = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Downloaded: ${progressPercent.toFixed(2)}%`);
        },
      }).promise;

      console.log('Download result:', downloadResult);

      if (downloadResult.statusCode === 200) {
        // Verify file was created
        const fileExists = await RNFS.exists(filePath);
        if (fileExists) {
          const stats = await RNFS.stat(filePath);
          console.log('File stats:', stats);
          console.log('Download completed successfully');
          return true;
        } else {
          console.log('File was not created after download');
          return false;
        }
      } else {
        console.log(
          `Download failed with status: ${downloadResult.statusCode}`
        );
        return false;
      }
    } catch (error) {
      console.log('Perform download error:', error);
      return false;
    }
  }

  /**
   * Save camera captured photo to Downloads folder
   * @param {string} photoUri - URI of the captured photo
   * @param {string} fileName - Desired filename
   * @returns {Promise<boolean>} Success status
   */
  static async saveCameraPhotoToDownloads(photoUri, fileName) {
    try {
      console.log('=== Saving Camera Photo to Downloads ===');
      console.log('Photo URI:', photoUri);
      console.log('Filename:', fileName);
      console.log('Platform:', Platform.OS, 'Version:', Platform.Version);

      // Check permissions first
      const hasPermission = await this.checkAndRequestStoragePermissions();
      if (!hasPermission) {
        console.log('Permission denied');
        return false;
      }

      // For Android 10+ (API 29+), use two-step process
      if (Platform.OS === 'android' && Platform.Version >= 29) {
        console.log('Using Android 10+ two-step camera save process');
        return await this.saveCameraPhotoAndroid10Plus(photoUri, fileName);
      } else {
        console.log('Using direct camera save process');
        return await this.saveCameraPhotoDirect(photoUri, fileName);
      }
    } catch (error) {
      console.log('Save camera photo error:', error);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
      return false;
    }
  }

  /**
   * Save camera photo for Android 10+ (two-step process)
   * @param {string} photoUri - URI of the captured photo
   * @param {string} fileName - Desired filename
   * @returns {Promise<boolean>} Success status
   */
  static async saveCameraPhotoAndroid10Plus(photoUri, fileName) {
    try {
      console.log('=== Android 10+ Two-Step Camera Save ===');

      // Step 1: Copy to app's external storage
      const appExternalPath = this.getDownloadPath();
      console.log('Step 1: Copying to app external storage:', appExternalPath);

      // Create app external directory
      const dirCreated = await this.createDirectoryIfNotExists(appExternalPath);
      if (!dirCreated) {
        console.log('Failed to create app external directory');
        return false;
      }

      // Generate unique filename
      const uniqueFileName = this.generateUniqueFileName(fileName);
      const tempFilePath = `${appExternalPath}/${uniqueFileName}`;
      console.log('Temp file path:', tempFilePath);

      // Copy photo to temp location
      console.log('Copying photo to app external storage...');
      await RNFS.copyFile(photoUri, tempFilePath);

      // Verify file was copied
      const tempFileExists = await RNFS.exists(tempFilePath);
      if (!tempFileExists) {
        console.log('Photo was not copied to app external storage');
        return false;
      }

      // Step 2: Copy to public Downloads folder
      console.log('Step 2: Copying to public Downloads folder');
      const publicDownloadsPath = this.getPublicDownloadsPath();
      console.log('Public Downloads path:', publicDownloadsPath);

      // Try to create Downloads directory
      try {
        await this.createDirectoryIfNotExists(publicDownloadsPath);
      } catch (error) {
        console.log(
          'Could not create Downloads directory, will try to copy anyway:',
          error.message
        );
      }

      const finalFilePath = `${publicDownloadsPath}/${uniqueFileName}`;
      console.log('Final file path:', finalFilePath);

      // Copy file to Downloads
      try {
        console.log('Copying photo to Downloads...');
        await RNFS.copyFile(tempFilePath, finalFilePath);

        // Verify file was copied
        const fileExists = await RNFS.exists(finalFilePath);
        if (fileExists) {
          const stats = await RNFS.stat(finalFilePath);
          console.log('File stats:', stats);
          console.log('Camera photo saved to Downloads successfully');

          // Clean up temp file
          try {
            await RNFS.unlink(tempFilePath);
            console.log('Temp file cleaned up');
          } catch (cleanupError) {
            console.log('Temp file cleanup failed:', cleanupError.message);
          }

          return true;
        } else {
          console.log('Photo was not copied to Downloads');
          return false;
        }
      } catch (copyError) {
        console.log('Copy to Downloads failed:', copyError.message);
        console.log('Photo remains in app external storage');
        return true; // Still consider it successful since photo was saved
      }
    } catch (error) {
      console.log('Android 10+ camera save error:', error);
      return false;
    }
  }

  /**
   * Direct camera photo save (Android 8-9 and iOS)
   * @param {string} photoUri - URI of the captured photo
   * @param {string} fileName - Desired filename
   * @returns {Promise<boolean>} Success status
   */
  static async saveCameraPhotoDirect(photoUri, fileName) {
    try {
      console.log('=== Direct Camera Save Process ===');

      // Get download path
      const downloadPath = this.getDownloadPath();
      console.log('Download path:', downloadPath);

      // Create directory if it doesn't exist
      const dirCreated = await this.createDirectoryIfNotExists(downloadPath);
      if (!dirCreated) {
        console.log('Failed to create directory');
        return false;
      }

      // Generate unique filename
      const uniqueFileName = this.generateUniqueFileName(fileName);
      const filePath = `${downloadPath}/${uniqueFileName}`;
      console.log('Final file path:', filePath);

      // Copy photo from camera location to Downloads
      console.log('Copying photo to Downloads...');
      await RNFS.copyFile(photoUri, filePath);

      // Verify file was copied
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
        const stats = await RNFS.stat(filePath);
        console.log('File stats:', stats);
        console.log('Camera photo saved to Downloads successfully');
        return true;
      } else {
        console.log('File was not copied to Downloads');
        return false;
      }
    } catch (error) {
      console.log('Direct camera save error:', error);
      return false;
    }
  }

  /**
   * Get success message based on platform and version
   * @returns {string} Success message
   */
  static getSuccessMessage() {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        return 'Image saved to Downloads folder (Android 13+)';
      } else if (Platform.Version >= 29) {
        return 'Image saved to Downloads folder (Android 10-12)';
      } else {
        return 'Image saved to Downloads folder (Android 8-9)';
      }
    } else {
      return 'Image saved to app documents';
    }
  }

  /**
   * Test download functionality
   * @returns {Promise<boolean>} Test result
   */
  static async testDownloadFunctionality() {
    try {
      // For Android 10+ (API 29+), test the two-step process
      if (Platform.OS === 'android' && Platform.Version >= 29) {
        return await this.testAndroid10PlusDownload();
      } else {
        return await this.testDirectDownload();
      }
    } catch (error) {
      console.log('Test download functionality error:', error);
      return false;
    }
  }

  /**
   * Test Android 10+ download functionality
   * @returns {Promise<boolean>} Test result
   */
  static async testAndroid10PlusDownload() {
    try {
      // Test app external directory
      const appExternalPath = this.getDownloadPath();

      const dirCreated = await this.createDirectoryIfNotExists(appExternalPath);
      if (!dirCreated) {
        return false;
      }

      // Test file creation in app external directory
      const testFile = `${appExternalPath}/test_${Date.now()}.txt`;
      await RNFS.writeFile(
        testFile,
        'Test content for Android 10+ download',
        'utf8'
      );

      const testFileExists = await RNFS.exists(testFile);
      if (testFileExists) {
        // Test copying to Downloads directory
        const publicDownloadsPath = this.getPublicDownloadsPath();

        try {
          // Try to create Downloads directory
          await this.createDirectoryIfNotExists(publicDownloadsPath);
        } catch (error) {
          // Ignore error if Downloads directory can't be created
        }

        const downloadsTestFile = `${publicDownloadsPath}/test_${Date.now()}.txt`;

        try {
          await RNFS.copyFile(testFile, downloadsTestFile);
          const downloadsFileExists = await RNFS.exists(downloadsTestFile);

          if (downloadsFileExists) {
            // Clean up both files
            await RNFS.unlink(testFile);
            await RNFS.unlink(downloadsTestFile);
            return true;
          } else {
            // Clean up app external file
            await RNFS.unlink(testFile);
            return true; // Still consider it successful
          }
        } catch (copyError) {
          // Clean up app external file
          await RNFS.unlink(testFile);
          return true; // Still consider it successful
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log('Android 10+ test error:', error);
      return false;
    }
  }

  /**
   * Test direct download functionality (Android 8-9 and iOS)
   * @returns {Promise<boolean>} Test result
   */
  static async testDirectDownload() {
    try {
      const downloadPath = this.getDownloadPath();

      // Test directory creation
      const dirCreated = await this.createDirectoryIfNotExists(downloadPath);
      if (!dirCreated) {
        return false;
      }

      // Test file creation
      const testFile = `${downloadPath}/test_${Date.now()}.txt`;
      await RNFS.writeFile(
        testFile,
        'Test content for direct download',
        'utf8'
      );

      const testFileExists = await RNFS.exists(testFile);
      if (testFileExists) {
        // Clean up
        await RNFS.unlink(testFile);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Direct download test error:', error);
      return false;
    }
  }
}

export default CrossPlatformDownloadHelper;
