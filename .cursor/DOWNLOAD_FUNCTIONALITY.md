# Image Download Functionality

## Overview

This implementation adds the ability to download images from the ImageZoomDialog component and save them to the device's storage.

## Features

- Downloads images to device storage (Downloads/LearnerApp folder on Android, Documents/LearnerApp on iOS)
- Handles permissions for different Android versions (API 26-35)
- Shows download progress and status
- Prevents duplicate downloads with unique filenames
- Works with both iOS and Android

## Permissions Required

### Android

- `WRITE_EXTERNAL_STORAGE` (All API levels 26-35 for downloads)
- `READ_EXTERNAL_STORAGE` (API 26-32 for gallery access)
- `CAMERA` (for taking photos)
- Photo Picker (API 33-35 - handles gallery permissions automatically)
- `requestLegacyExternalStorage="true"` (API 29-32 compatibility)

### iOS

- No special permissions required for downloads

## Implementation Details

### Files Modified

1. `src/screens/Assessment/ATM/components/ImageZoomDialog.js` - Main download logic
2. `android/app/src/main/AndroidManifest.xml` - Added permissions and file provider
3. `android/app/src/main/java/com/pratham/learning/MainApplication.kt` - Added permissions initialization
4. `android/app/src/main/res/xml/provider_paths.xml` - File provider configuration

### Dependencies Added

- `react-native-permissions` - For handling runtime permissions
- `react-native-fs` - Already present, used for file operations

### Key Functions

- `checkAndRequestPermissions()` - Handles permission requests for different Android versions
- `downloadImage()` - Downloads the image to device storage
- `getDownloadPath()` - Returns appropriate download path for each platform
- `handleDownload()` - Main download handler with error handling

## Usage

1. Open an image in the ImageZoomDialog
2. Tap the download icon in the header
3. Grant permissions if prompted
4. Wait for download to complete
5. Image will be saved to the appropriate folder on the device

## Error Handling

- Permission denied scenarios
- Network connectivity issues
- File system errors
- Duplicate filename resolution

## Testing

Test on various Android devices with different API levels (26-35) to ensure permission handling works correctly.
