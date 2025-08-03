# ATM Assessment Image Upload Module

## Overview

This module provides comprehensive image upload functionality for the ATM Assessment screen, including camera capture, gallery selection, AWS S3 upload via middleware API, and **full-screen image preview with delete functionality**.

## Features

### Core Functionality

- **Camera Capture**: Take photos directly from the app
- **Gallery Selection**: Choose images from device gallery
- **Image Management**: Remove images with confirmation dialog
- **Batch Upload**: Upload multiple images to AWS S3 via middleware API
- **Progress Tracking**: Real-time upload progress with percentage display
- **Image Validation**: File type and size validation
- **Permission Handling**: Automatic permission requests for camera and storage
- **Warning System**: Alert users when selecting more than 4 images (but still allow all)

### New Full-Screen Preview

- **Full-Screen Dialog**: Immersive image preview experience
- **Delete Functionality**: Delete images directly from preview
- **Image Information**: Display file name, size, and dimensions
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: Fade-in/fade-out transitions
- **Status Bar Integration**: Proper status bar handling for full-screen experience

## Components

### Main Components

#### `ImageUploadDialog.js`

The main dialog component that handles image upload workflow with integrated preview functionality.

**Props:**

- `visible` (boolean): Controls dialog visibility
- `onClose` (function): Callback for closing dialog
- `onCameraPress` (function): Callback for camera button press
- `onGalleryPress` (function): Callback for gallery button press
- `selectedImages` (array): Array of selected image objects
- `onRemoveImage` (function): Callback for removing an image
- `onImagePress` (function): Callback for image preview (handled internally)
- `onSubmit` (function): Callback for submitting images
- `isUploading` (boolean): Upload state indicator
- `uploadProgress` (number): Upload progress percentage

#### `ImagePreviewDialog.js` ⭐ **NEW**

Full-screen image preview dialog with delete functionality.

**Props:**

- `visible` (boolean): Controls preview dialog visibility
- `onClose` (function): Callback for closing preview
- `image` (object): Image object to preview
- `onDelete` (function): Callback for deleting image
- `showDeleteButton` (boolean): Whether to show delete button (default: true)

**Image Object Structure:**

```javascript
{
  id: 'string',           // Unique identifier
  uri: 'string',          // Image URI
  url: 'string',          // Alternative URL (optional)
  fileName: 'string',     // Display name
  fileSize: 'number',     // File size in bytes
  width: 'number',        // Image width (optional)
  height: 'number'        // Image height (optional)
}
```

#### `ImageUploadSection.js`

Compact upload section for embedding in forms.

#### `ImageViewerScreen.js`

Navigation-based full-screen image viewer (alternative to modal approach).

### Utility Components

#### `ImageUploadHelper.js`

Handles image picker operations, validation, and processing.

#### `ImageAPIService.js`

Manages API calls for image upload to middleware.

#### `ImagePermissionHelper.js`

Handles camera and storage permissions across Android versions.

#### `PermissionTestComponent.js`

Development utility for testing permissions.

## Usage

### Basic Implementation

```javascript
import React, { useState } from 'react';
import ImageUploadDialog from './components/ImageUploadDialog';
import ImageUploadHelper from './utils/ImageUploadHelper';

const YourComponent = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleCameraPress = async () => {
    const result = await ImageUploadHelper.openCamera();
    if (result.success) {
      setSelectedImages((prev) => [...prev, result.image]);
    }
  };

  const handleGalleryPress = async () => {
    const result = await ImageUploadHelper.openGallery();
    if (result.success) {
      setSelectedImages((prev) => [...prev, result.image]);
    }
  };

  const handleRemoveImage = (imageId) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleSubmit = async () => {
    // Handle image upload
    console.log('Uploading images:', selectedImages);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowDialog(true)}>
        <Text>Upload Images</Text>
      </TouchableOpacity>

      <ImageUploadDialog
        visible={showDialog}
        onClose={() => setShowDialog(false)}
        onCameraPress={handleCameraPress}
        onGalleryPress={handleGalleryPress}
        selectedImages={selectedImages}
        onRemoveImage={handleRemoveImage}
        onSubmit={handleSubmit}
      />
    </>
  );
};
```

### Full-Screen Preview Usage

The full-screen preview is automatically integrated into `ImageUploadDialog`. When users tap on selected images, they'll see:

1. **Full-screen modal** with dark background
2. **Header** with close button, file name, and delete button
3. **Image display** optimized for the screen size
4. **Footer** with file size and dimensions (if available)
5. **Delete confirmation** with alert dialog

### Testing Preview Functionality

Use the `ImagePreviewTest.js` component for isolated testing:

```javascript
import ImagePreviewTest from './components/ImagePreviewTest';

// In your navigation or test screen
<ImagePreviewTest />;
```

## Styling

### Design System

- **Background**: Dark overlay (rgba(0, 0, 0, 0.95))
- **Header/Footer**: Semi-transparent black (rgba(0, 0, 0, 0.8))
- **Buttons**: Subtle white overlay with proper contrast
- **Typography**: Poppins font family with appropriate weights
- **Colors**: Consistent with app theme (#4D4639, #FFFFFF, #FF6B6B)

### Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Screen adaptation**: Uses device dimensions for optimal display
- **Safe areas**: Proper SafeAreaView integration
- **Status bar**: Handles status bar transparency and content

## API Integration

### Middleware Endpoint

Configure the upload endpoint in your environment:

```javascript
// In your API service
const UPLOAD_ENDPOINT = 'https://your-api.com/upload';

// Expected response format
{
  success: true,
  data: {
    url: 'https://s3-bucket-url/image.jpg',
    fileName: 'image.jpg',
    fileSize: 1024000
  }
}
```

## Permissions

### Android Manifest

Required permissions are automatically added:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
```

### Runtime Permissions

- **Camera**: Requested when taking photos
- **Storage**: Requested when accessing gallery
- **Android 13+**: Handles granular media permissions

## File Structure

```
src/screens/Assessment/ATM/
├── components/
│   ├── ImageUploadDialog.js          # Main upload dialog
│   ├── ImagePreviewDialog.js         # ⭐ Full-screen preview
│   ├── ImageUploadSection.js         # Compact upload section
│   ├── ImageViewerScreen.js          # Navigation-based viewer
│   ├── ImagePreviewTest.js           # Test component
│   └── PermissionTestComponent.js    # Permission testing
├── utils/
│   ├── ImageUploadHelper.js          # Image picker utilities
│   ├── ImageAPIService.js            # API service
│   └── ImagePermissionHelper.js      # Permission handling
├── styles/
│   └── ATMAssessmentStyles.js        # Centralized styles
└── README.md                         # This documentation
```

## Troubleshooting

### Common Issues

1. **Images not displaying in preview**

   - Ensure image URI is valid
   - Check network connectivity for remote images
   - Verify image object structure

2. **Delete button not working**

   - Ensure `onDelete` callback is properly implemented
   - Check that image has valid `id` property
   - Verify `showDeleteButton` prop is true

3. **Preview not opening**

   - Check that `visible` prop is correctly managed
   - Ensure image object is not null/undefined
   - Verify component is properly imported

4. **Status bar issues**
   - Ensure `statusBarTranslucent={true}` is set
   - Check StatusBar component configuration
   - Verify SafeAreaView usage

### Performance Optimization

- **Image caching**: Use React Native's built-in image caching
- **Memory management**: Dispose of large images when not needed
- **Lazy loading**: Load images only when needed
- **Compression**: Compress images before upload

## Dependencies

### Required packages:

- `react-native-image-picker`: Image selection
- `react-native-vector-icons`: Icon components
- `react-native-permissions`: Permission handling

### Optional enhancements:

- `react-native-gesture-handler`: For pinch-to-zoom functionality
- `react-native-fast-image`: Better image performance
- `react-native-image-crop-picker`: Advanced image editing

## Future Enhancements

### Planned Features

- **Pinch-to-zoom**: Gesture-based image zooming
- **Image rotation**: Rotate images in preview
- **Batch selection**: Select multiple images for batch operations
- **Image editing**: Basic crop and filter functionality
- **Cloud sync**: Sync with cloud storage services

### Performance Improvements

- **Virtual scrolling**: For large image lists
- **Progressive loading**: Load images progressively
- **Background processing**: Process images in background
- **Cache optimization**: Intelligent image caching

## Contributing

When contributing to this module:

1. **Test thoroughly** on different devices and Android versions
2. **Follow design patterns** established in existing components
3. **Update documentation** for any new features
4. **Consider accessibility** for users with disabilities
5. **Performance test** with large images and slow networks

## License

This module is part of the Learner App project and follows the same licensing terms.
