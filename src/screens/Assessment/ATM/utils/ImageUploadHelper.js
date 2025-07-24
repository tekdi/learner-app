import { Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePermissionHelper from './ImagePermissionHelper';

class ImageUploadHelper {
  /**
   * Image picker options
   */
  static getImagePickerOptions() {
    return {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1920,
      includeBase64: false,
      selectionLimit: 0, // 0 means no limit
    };
  }

  /**
   * Camera options
   */
  static getCameraOptions() {
    return {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1920,
      includeBase64: false,
      saveToPhotos: true,
    };
  }

  /**
   * Launch camera to capture photo
   * @returns {Promise<Array>} - Array of captured images
   */
  static async capturePhoto() {
    try {
      // Check camera permission
      const hasPermission = await ImagePermissionHelper.checkCameraPermission();
      if (!hasPermission) {
        const granted = await ImagePermissionHelper.requestCameraPermission();
        if (!granted) {
          ImagePermissionHelper.showPermissionDeniedAlert('camera');
          return [];
        }
      }

      return new Promise((resolve) => {
        launchCamera(this.getCameraOptions(), (response) => {
          if (response.didCancel) {
            console.log('User cancelled camera');
            resolve([]);
          } else if (response.errorMessage) {
            console.log('Camera Error: ', response.errorMessage);
            Alert.alert('Error', 'Failed to capture photo. Please try again.');
            resolve([]);
          } else if (response.assets && response.assets.length > 0) {
            const processedImages = this.processImageAssets(response.assets);
            resolve(processedImages);
          } else {
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error('Capture photo error:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
      return [];
    }
  }

  /**
   * Launch image library to select images
   * @returns {Promise<Array>} - Array of selected images
   */
  static async selectImages() {
    try {
      // Check storage permission
      const hasPermission =
        await ImagePermissionHelper.checkStoragePermission();
      if (!hasPermission) {
        const granted = await ImagePermissionHelper.requestStoragePermission();
        if (!granted) {
          ImagePermissionHelper.showPermissionDeniedAlert('storage');
          return [];
        }
      }

      return new Promise((resolve) => {
        launchImageLibrary(this.getImagePickerOptions(), (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
            resolve([]);
          } else if (response.errorMessage) {
            console.log('ImagePicker Error: ', response.errorMessage);
            Alert.alert('Error', 'Failed to select images. Please try again.');
            resolve([]);
          } else if (response.assets && response.assets.length > 0) {
            const processedImages = this.processImageAssets(response.assets);
            resolve(processedImages);
          } else {
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error('Select images error:', error);
      Alert.alert('Error', 'Failed to select images. Please try again.');
      return [];
    }
  }

  /**
   * Process image assets from picker/camera
   * @param {Array} assets - Raw assets from image picker
   * @returns {Array} - Processed image objects
   */
  static processImageAssets(assets) {
    return assets.map((asset, index) => ({
      id: `${Date.now()}_${index}`,
      uri: asset.uri,
      type: asset.type || 'image/jpeg',
      fileName: asset.fileName || `image_${Date.now()}_${index}.jpg`,
      fileSize: asset.fileSize || 0,
      width: asset.width || 0,
      height: asset.height || 0,
      timestamp: Date.now(),
    }));
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted file size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate image file
   * @param {Object} image - Image object
   * @returns {boolean} - true if valid
   */
  static validateImage(image) {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(image.type)) {
      Alert.alert(
        'Invalid File Type',
        'Please select only JPEG images.'
      );
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (image.fileSize > maxSize) {
      Alert.alert('File Too Large', 'Please select images smaller than 10MB.');
      return false;
    }

    return true;
  }

  /**
   * Create FormData for API upload
   * @param {Array} images - Array of image objects
   * @returns {FormData} - FormData object for API
   */
  static createFormData(images) {
    const formData = new FormData();

    images.forEach((image, index) => {
      formData.append('files', {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      });
    });

    return formData;
  }

  /**
   * Show warning for too many images
   * @param {number} count - Number of selected images
   */
  static showImageCountWarning(count) {
    if (count > 4) {
      Alert.alert(
        'Many Images Selected',
        `You have selected ${count} images. For better performance, we recommend uploading up to 4 images at a time.`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  }

  /**
   * Generate unique filename
   * @param {string} originalName - Original filename
   * @returns {string} - Unique filename
   */
  static generateUniqueFileName(originalName) {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const extension = originalName.split('.').pop() || 'jpg';
    return `image_${timestamp}_${randomNum}.${extension}`;
  }
}

export default ImageUploadHelper;
