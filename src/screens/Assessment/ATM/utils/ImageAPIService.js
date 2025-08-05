import Config from 'react-native-config';
import { getDataFromStorage } from '../../../../utils/JsHelper/Helper';

class ImageAPIService {
  /**
   * Get API base URL from config
   */
  static getBaseURL() {
    return Config.API_BASE_URL || 'https://your-api-endpoint.com';
  }

  /**
   * Get upload endpoint
   */
  static getUploadEndpoint() {
    return `${this.getBaseURL()}/api/upload/images`;
  }

  /**
   * Get authentication headers
   */
  static async getAuthHeaders() {
    try {
      const token = await getDataFromStorage('authToken');
      const userId = await getDataFromStorage('userId');

      return {
        Authorization: token ? `Bearer ${token}` : '',
        'X-User-ID': userId || '',
      };
    } catch (error) {
      console.warn('Error getting auth headers:', error);
      return {};
    }
  }

  /**
   * Upload images to API
   * @param {Array} images - Array of image objects
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise<Object>} - API response
   */
  static async uploadImages(images, onProgress = null) {
    try {
      if (!images || images.length === 0) {
        throw new Error('No images provided for upload');
      }

      // Create FormData
      const formData = new FormData();

      images.forEach((image, index) => {
        formData.append('files', {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        });
      });

      // Add metadata if needed
      formData.append(
        'metadata',
        JSON.stringify({
          uploadTimestamp: Date.now(),
          totalFiles: images.length,
        })
      );

      // Get auth headers
      const authHeaders = await this.getAuthHeaders();

      // Create XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        if (onProgress) {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              onProgress(percentComplete);
            }
          });
        }

        // Handle response
        xhr.addEventListener('load', () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } else {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
          reject(new Error('Network error occurred'));
        });

        xhr.addEventListener('timeout', () => {
          reject(new Error('Request timeout'));
        });

        // Configure request
        xhr.open('POST', this.getUploadEndpoint());
        xhr.timeout = 60000; // 60 seconds timeout

        // Set headers
        Object.keys(authHeaders).forEach((key) => {
          if (authHeaders[key]) {
            xhr.setRequestHeader(key, authHeaders[key]);
          }
        });

        // Send request
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Upload images error:', error);
      throw error;
    }
  }

  /**
   * Upload single image
   * @param {Object} image - Image object
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} - API response
   */
  static async uploadSingleImage(image, onProgress = null) {
    return this.uploadImages([image], onProgress);
  }

  /**
   * Delete uploaded image
   * @param {string} imageUrl - URL of the image to delete
   * @returns {Promise<Object>} - API response
   */
  static async deleteImage(imageUrl) {
    try {
      const authHeaders = await this.getAuthHeaders();

      const response = await fetch(
        `${this.getBaseURL()}/api/upload/images/delete`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          body: JSON.stringify({
            imageUrl: imageUrl,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete image error:', error);
      throw error;
    }
  }

  /**
   * Get upload status
   * @param {string} uploadId - Upload ID from initial response
   * @returns {Promise<Object>} - Upload status
   */
  static async getUploadStatus(uploadId) {
    try {
      const authHeaders = await this.getAuthHeaders();

      const response = await fetch(
        `${this.getBaseURL()}/api/upload/status/${uploadId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get upload status error:', error);
      throw error;
    }
  }

  /**
   * Retry failed upload
   * @param {Array} images - Images to retry
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} - API response
   */
  static async retryUpload(images, onProgress = null) {
    console.log('Retrying upload for', images.length, 'images');
    return this.uploadImages(images, onProgress);
  }

  /**
   * Validate API response
   * @param {Object} response - API response
   * @returns {boolean} - true if valid
   */
  static validateResponse(response) {
    return (
      response &&
      typeof response === 'object' &&
      (response.success === true || response.status === 'success') &&
      Array.isArray(response.data)
    );
  }

  /**
   * Parse uploaded image URLs from response
   * @param {Object} response - API response
   * @returns {Array} - Array of image URLs
   */
  static parseUploadedImages(response) {
    try {
      if (!this.validateResponse(response)) {
        throw new Error('Invalid API response format');
      }

      return response.data.map((item) => ({
        id: item.id || Date.now(),
        url: item.url || item.imageUrl,
        fileName: item.fileName || item.name,
        fileSize: item.fileSize || 0,
        uploadedAt: item.uploadedAt || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Parse uploaded images error:', error);
      return [];
    }
  }
}

export default ImageAPIService;
