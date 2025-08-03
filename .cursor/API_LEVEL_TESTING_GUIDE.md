# API Level Testing Guide

## Overview

This guide provides comprehensive testing instructions for the permission migration changes across all supported API levels (26-35).

## Supported API Levels

- **API 26-28**: Android 8.0-9.0 (Oreo)
- **API 29-32**: Android 10-12 (Android 10, 11, 12)
- **API 33-35**: Android 13-15 (Android 13, 14, 15)

## Testing Checklist

### 1. Camera Functionality

**Test on all API levels (26-35):**

- [ ] Open camera from app
- [ ] Take a photo
- [ ] Verify photo is captured and displayed
- [ ] Check camera permission is requested (if not granted)
- [ ] Verify permission denial handling

**Expected Behavior:**

- Camera permission should be requested on first use
- Photo capture should work normally
- Permission denial should show appropriate message

### 2. Gallery Selection

**API 26-32 (Traditional Permissions):**

- [ ] Open gallery picker
- [ ] Select an image
- [ ] Verify `READ_EXTERNAL_STORAGE` permission is requested
- [ ] Check permission denial handling
- [ ] Verify image is selected and displayed

**API 33-35 (Photo Picker):**

- [ ] Open gallery picker
- [ ] Select an image
- [ ] Verify NO `READ_MEDIA_IMAGES` permission is requested
- [ ] Verify Photo Picker opens automatically
- [ ] Verify image is selected and displayed

**Expected Behavior:**

- API 26-32: Traditional permission flow
- API 33-35: Photo Picker opens without additional permissions

### 3. Download Functionality

**Test on all API levels (26-35):**

- [ ] Open image in full-screen view
- [ ] Tap download button
- [ ] Verify `WRITE_EXTERNAL_STORAGE` permission is requested (if not granted)
- [ ] Check download completes successfully
- [ ] Verify file is saved to Downloads/LearnerApp folder
- [ ] Check permission denial handling

**Expected Behavior:**

- Download permission should be requested on first use
- File should be saved to correct location
- Permission denial should show appropriate message

### 4. Permission Status Checking

**Test on all API levels (26-35):**

- [ ] Check permission status using `ImagePermissionHelper.getPermissionStatus()`
- [ ] Verify correct status is returned for each API level

**Expected Results:**

- API 26-32: `storage: 'granted'` or `'denied'`
- API 33-35: `storage: 'Photo Picker - handled automatically'`

### 5. App Launch and Permission Requests

**API 26-32:**

- [ ] Launch app
- [ ] Verify storage permissions are requested if needed
- [ ] Check permission denial handling

**API 33-35:**

- [ ] Launch app
- [ ] Verify NO broad media permissions are requested
- [ ] Verify app launches normally

**Expected Behavior:**

- API 26-32: Traditional permission requests
- API 33-35: No broad media permission requests

## Test Devices/Emulators

### Recommended Test Setup

1. **Physical Devices (if available):**

   - Android 8.0 device (API 26)
   - Android 9.0 device (API 28)
   - Android 10 device (API 29)
   - Android 11 device (API 30)
   - Android 12 device (API 31)
   - Android 13 device (API 33)
   - Android 14 device (API 34)
   - Android 15 device (API 35)

2. **Emulators (alternative):**
   - Create AVDs for each API level
   - Test with different screen sizes and configurations

## Test Scenarios

### Scenario 1: First-Time User

1. Install app on fresh device
2. Navigate to image upload feature
3. Test camera and gallery access
4. Verify appropriate permissions are requested

### Scenario 2: Permission Denied

1. Deny camera permission
2. Try to use camera
3. Verify appropriate error message
4. Test permission re-request flow

### Scenario 3: Permission Granted

1. Grant all permissions
2. Test all image-related features
3. Verify everything works normally

### Scenario 4: App Update

1. Install old version with broad permissions
2. Update to new version
3. Test that existing functionality still works
4. Verify no new permission requests for API 33+

## Debug Information

### Permission Status Logging

Add this to your test component to verify permissions:

```javascript
import ImagePermissionHelper from './utils/ImagePermissionHelper';

const checkPermissions = async () => {
  const status = await ImagePermissionHelper.getPermissionStatus();
  console.log('Permission Status:', status);
};
```

### Expected Console Output

**API 26-32:**

```
Permission Status: {
  camera: 'granted',
  storage: 'granted',
  androidVersion: 30,
  apiLevel: 30
}
```

**API 33-35:**

```
Permission Status: {
  camera: 'granted',
  storage: 'Photo Picker - handled automatically',
  androidVersion: 33,
  apiLevel: 33
}
```

## Common Issues and Solutions

### Issue 1: Permission Not Requested on API 33+

**Solution:** Verify that `react-native-image-picker` is using the latest version that supports Photo Picker

### Issue 2: Gallery Not Working on API 29-32

**Solution:** Check that `requestLegacyExternalStorage="true"` is set in AndroidManifest.xml

### Issue 3: Download Not Working

**Solution:** Verify `WRITE_EXTERNAL_STORAGE` permission is properly requested

### Issue 4: Camera Not Working

**Solution:** Check that `CAMERA` permission is declared in AndroidManifest.xml

## Verification Checklist

After testing, verify:

- [ ] No `READ_MEDIA_IMAGES` permission is requested on any API level
- [ ] No `READ_MEDIA_VIDEO` permission is requested on any API level
- [ ] Camera functionality works on all API levels
- [ ] Gallery selection works on all API levels
- [ ] Download functionality works on all API levels
- [ ] App passes Google Play Store permission requirements
- [ ] No regression in existing functionality

## Reporting Issues

When reporting issues, include:

1. **API Level**: Exact Android version and API level
2. **Device/Emulator**: Device model or emulator configuration
3. **Steps to Reproduce**: Detailed steps
4. **Expected vs Actual Behavior**: Clear description
5. **Logs**: Relevant console logs and error messages
6. **Screenshots**: If applicable

## Notes

- The `react-native-image-picker` library automatically handles Photo Picker on API 33+
- `requestLegacyExternalStorage="true"` is crucial for API 29-32 compatibility
- Traditional permissions work normally on API 26-28
- All changes maintain backward compatibility
