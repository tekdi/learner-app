# Permission Migration Guide

## Overview

This document outlines the changes made to resolve the Google Play Store warning about undeclared photo and video permissions (`READ_MEDIA_IMAGES` and `READ_MEDIA_VIDEO`).

## Problem

The app was requesting broad media permissions that give access to all photos and videos on the device. Google Play Store now requires apps to either:

1. Use the Android Photo Picker for one-time/infrequent access
2. Justify why they need frequent access to all media

## Solution

Since the app uses image picking for assessment uploads (infrequent use), we migrated to the Android Photo Picker approach while maintaining full backward compatibility for API levels 26-35.

## API Level Support

The app supports Android API levels 26-35 (Android 8.0 to Android 15):

- **API 26-28 (Android 8.0-9.0)**: Traditional storage permissions
- **API 29-32 (Android 10-12)**: Traditional storage permissions with `requestLegacyExternalStorage`
- **API 33-35 (Android 13-15)**: Photo Picker approach (no broad media permissions)

## Changes Made

### 1. AndroidManifest.xml

- **Removed**: `android.permission.READ_MEDIA_IMAGES`
- **Removed**: `android.permission.READ_MEDIA_VIDEO`
- **Kept**: `android.permission.CAMERA` (for taking photos)
- **Kept**: `android.permission.READ_EXTERNAL_STORAGE` (for Android 8-12)
- **Kept**: `android.permission.WRITE_EXTERNAL_STORAGE` (for downloads)
- **Kept**: `android:requestLegacyExternalStorage="true"` (for Android 10+ compatibility)

### 2. ImagePermissionHelper.js

- **Updated**: `requestStoragePermission()` - Handles all API levels properly
  - API 33+: Returns `true` (Photo Picker handles permissions)
  - API 29-32: Requests `READ_EXTERNAL_STORAGE` with legacy storage support
  - API 26-28: Requests `READ_EXTERNAL_STORAGE` with traditional permissions
- **Updated**: `checkStoragePermission()` - Returns appropriate status for each API level
- **Updated**: `getPermissionStatus()` - Shows proper status for debugging

### 3. App.js

- **Updated**: `checkAndRequestStoragePermission()` - Handles all API levels
  - API 33+: Returns `true` immediately (Photo Picker handles permissions)
  - API 29-32: Requests storage permissions with legacy support
  - API 26-28: Requests traditional storage permissions

### 4. ImageZoomDialog.js

- **Updated**: `checkAndRequestPermissions()` - Uses appropriate permissions for downloads
  - All API levels: Uses `WRITE_EXTERNAL_STORAGE` for download functionality

### 5. Documentation Updates

- **Updated**: `DOWNLOAD_FUNCTIONALITY.md` - Removed references to `READ_MEDIA_IMAGES` and `READ_MEDIA_VIDEO`
- **Updated**: `src/screens/Assessment/ATM/README.md` - Updated permission requirements

## How It Works Now

### Android 13-15 (API 33-35)

- **Camera**: Requires `CAMERA` permission
- **Gallery Access**: Uses Android Photo Picker (no additional permissions needed)
- **Downloads**: Uses `WRITE_EXTERNAL_STORAGE` permission

### Android 10-12 (API 29-32)

- **Camera**: Requires `CAMERA` permission
- **Gallery Access**: Requires `READ_EXTERNAL_STORAGE` permission (with legacy storage support)
- **Downloads**: Requires `WRITE_EXTERNAL_STORAGE` permission

### Android 8-9 (API 26-28)

- **Camera**: Requires `CAMERA` permission
- **Gallery Access**: Requires `READ_EXTERNAL_STORAGE` permission
- **Downloads**: Requires `WRITE_EXTERNAL_STORAGE` permission

## Benefits

1. **Privacy-Friendly**: Users only grant access to specific images they choose (Android 13+)
2. **Google Play Compliant**: No more warnings about undeclared permissions
3. **Full Backward Compatibility**: Works on all supported API levels (26-35)
4. **Better UX**: Photo Picker provides a more intuitive interface (Android 13+)
5. **Future-Proof**: Aligns with Android's privacy-first approach

## Testing

After implementing these changes, test on devices with different API levels:

1. **API 26-28**: Test traditional permission flow
2. **API 29-32**: Test legacy storage permission flow
3. **API 33-35**: Test Photo Picker flow
4. **Camera functionality**: Test on all API levels
5. **Gallery selection**: Test on all API levels
6. **Download functionality**: Test on all API levels
7. **Verify**: App no longer requests broad media permissions

## Notes

- The `react-native-image-picker` library automatically uses the Photo Picker on Android 13+
- `requestLegacyExternalStorage="true"` ensures compatibility with Android 10-12
- Traditional permissions work normally on Android 8-9
- No changes were needed to the image picker implementation itself
- The app maintains full backward compatibility with older Android versions
