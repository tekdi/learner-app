# Zoom Meeting SDK Integration Guide for React Native Android

This guide provides step-by-step instructions for integrating Zoom Meeting SDK into your React Native Android application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Getting Zoom SDK Credentials](#getting-zoom-sdk-credentials)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Usage Examples](#usage-examples)
6. [Troubleshooting](#troubleshooting)
7. [Important Notes](#important-notes)

---

## Prerequisites

- **React Native**: Version 0.60 or higher
- **Android Studio**: Latest version recommended
- **Minimum Android SDK**: API Level 21 (Android 5.0 Lollipop)
- **Target Android SDK**: API Level 26 or higher (recommended)
- **Node.js**: Version 14 or higher
- **Java**: JDK 11 or higher

---

## Getting Zoom SDK Credentials

Before you can use the Zoom Meeting SDK, you need to obtain SDK credentials from Zoom:

### Step 1: Create a Zoom Account
1. Go to [https://zoom.us/signup](https://zoom.us/signup)
2. Create a free Zoom account if you don't have one

### Step 2: Create a Zoom App
1. Visit the [Zoom Marketplace](https://marketplace.zoom.us/)
2. Click on **"Develop"** in the top right corner
3. Select **"Build App"**
4. Choose **"Meeting SDK"** as the app type
5. Fill in the required information:
   - App Name: Choose a descriptive name (e.g., "My Learner App Zoom Integration")
   - App Type: Meeting SDK
   - Select whether it's for internal use or public
6. Click **"Create"**

### Step 3: Get Your Credentials
1. Once your app is created, you'll see the **App Credentials** page
2. Copy the following credentials:
   - **SDK Key** (also called App Key or Client ID)
   - **SDK Secret** (also called App Secret or Client Secret)
3. Keep these credentials secure and never commit them to public repositories

### Step 4: Add Credentials to Your App
1. Open the file: `android/app/src/main/java/com/pratham/learning/ZoomModule.java`
2. Find these lines (around line 48-49):
   ```java
   private static final String ZOOM_APP_KEY = "YOUR_ZOOM_APP_KEY";
   private static final String ZOOM_APP_SECRET = "YOUR_ZOOM_APP_SECRET";
   ```
3. Replace `YOUR_ZOOM_APP_KEY` and `YOUR_ZOOM_APP_SECRET` with your actual credentials:
   ```java
   private static final String ZOOM_APP_KEY = "your_actual_app_key_here";
   private static final String ZOOM_APP_SECRET = "your_actual_app_secret_here";
   ```

**Important Security Note:** For production apps, consider using environment variables or a secure key management system instead of hardcoding credentials.

---

## Installation Steps

All the necessary files and configurations have already been set up for you. Here's what was done:

### ✅ Files Created

1. **Native Module** - `android/app/src/main/java/com/pratham/learning/ZoomModule.java`
   - Handles Zoom SDK initialization
   - Provides methods to join/leave meetings
   - Includes error handling to prevent crashes

2. **Package Class** - `android/app/src/main/java/com/pratham/learning/ZoomPackage.java`
   - Registers the native module with React Native

3. **React Component** - `src/components/ZoomMeeting/ZoomMeeting.js`
   - Ready-to-use React Native component
   - Includes UI for joining meetings
   - Handles initialization and error states

### ✅ Files Updated

1. **MainApplication.kt**
   - Extended `MultiDexApplication` for large app support
   - Added `ZoomPackage` to the packages list

2. **build.gradle (project level)**
   - Added Zoom SDK Maven repository

3. **app/build.gradle (app level)**
   - Added Zoom SDK dependencies (`mobilertc` and `commonlib`)
   - Enabled MultiDex support
   - Added packaging options to prevent duplicate library conflicts

4. **AndroidManifest.xml**
   - Added required permissions for Zoom (camera, microphone, etc.)

---

## Configuration

### Required Permissions

The following permissions have been added to `AndroidManifest.xml` and are required for Zoom functionality:

```xml
<!-- Zoom SDK Required Permissions -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### Runtime Permissions

For Android 6.0 (API level 23) and above, you need to request runtime permissions. The critical permissions for Zoom are:

- **CAMERA**: For video in meetings
- **RECORD_AUDIO**: For audio in meetings
- **READ_PHONE_STATE**: Required by Zoom SDK

You can use `react-native-permissions` or `PermissionsAndroid` from React Native to request these permissions before joining a meeting.

Example using React Native's built-in `PermissionsAndroid`:

```javascript
import { PermissionsAndroid, Platform } from 'react-native';

const requestZoomPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);

      if (
        grants['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.READ_PHONE_STATE'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('All permissions granted');
        return true;
      } else {
        console.log('Some permissions denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};
```

---

## Usage Examples

### Basic Usage

```javascript
import React from 'react';
import { View } from 'react-native';
import ZoomMeeting from './src/components/ZoomMeeting';

const MyScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ZoomMeeting 
        meetingNumber="123456789"
        password="myPassword"
        displayName="John Doe"
      />
    </View>
  );
};

export default MyScreen;
```

### Auto-Join Meeting

```javascript
import React from 'react';
import { View } from 'react-native';
import ZoomMeeting from './src/components/ZoomMeeting';

const AutoJoinScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ZoomMeeting 
        meetingNumber="123456789"
        password="myPassword"
        displayName="John Doe"
        autoJoin={true} // Automatically joins meeting on component mount
        onMeetingJoined={() => console.log('Successfully joined meeting')}
        onMeetingError={(error) => console.error('Meeting error:', error)}
      />
    </View>
  );
};

export default AutoJoinScreen;
```

### Using Native Module Directly

If you prefer to use the native module directly without the component:

```javascript
import { NativeModules } from 'react-native';

const { ZoomModule } = NativeModules;

// Initialize Zoom SDK
const initializeZoom = async () => {
  try {
    const result = await ZoomModule.initialize();
    console.log('Zoom initialized:', result);
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
};

// Join a meeting
const joinMeeting = async () => {
  try {
    const result = await ZoomModule.joinMeeting(
      '123456789',      // Meeting number
      'password123',    // Password
      'John Doe'        // Display name
    );
    console.log('Joined meeting:', result);
  } catch (error) {
    console.error('Failed to join:', error);
  }
};

// Leave meeting
const leaveMeeting = async () => {
  try {
    const result = await ZoomModule.leaveMeeting();
    console.log('Left meeting:', result);
  } catch (error) {
    console.error('Failed to leave:', error);
  }
};

// Check if in meeting
const checkStatus = async () => {
  try {
    const inMeeting = await ZoomModule.isInMeeting();
    console.log('In meeting:', inMeeting);
  } catch (error) {
    console.error('Failed to check status:', error);
  }
};
```

### With Permission Handling

```javascript
import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid, Platform, Alert } from 'react-native';
import ZoomMeeting from './src/components/ZoomMeeting';

const ZoomScreen = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        ]);

        const allGranted = Object.values(grants).every(
          grant => grant === PermissionsAndroid.RESULTS.GRANTED
        );

        if (allGranted) {
          setPermissionsGranted(true);
        } else {
          Alert.alert(
            'Permissions Required',
            'Camera and microphone permissions are required for Zoom meetings.',
            [{ text: 'OK' }]
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  if (!permissionsGranted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ZoomMeeting 
        meetingNumber="123456789"
        password="myPassword"
        displayName="John Doe"
        onMeetingJoined={() => console.log('Meeting joined successfully')}
        onMeetingError={(error) => Alert.alert('Error', error)}
      />
    </View>
  );
};

export default ZoomScreen;
```

---

## Building and Running

### Clean Build (Recommended after setup)

```bash
# Navigate to your project root
cd /home/ttpl-rt-132/Tekdi\ projects/Android-learner-app/learner-app

# Clean Android build
cd android
./gradlew clean
cd ..

# Install dependencies
npm install

# For development build
npx react-native run-android --variant=devDebug

# For production build
npx react-native run-android --variant=prodRelease
```

### If You Encounter Build Errors

1. **Clean Gradle cache:**
   ```bash
   cd android
   ./gradlew clean
   ./gradlew cleanBuildCache
   cd ..
   ```

2. **Clear React Native cache:**
   ```bash
   npx react-native start --reset-cache
   ```

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

4. **Clear Android build folders:**
   ```bash
   cd android
   rm -rf app/build
   rm -rf build
   ./gradlew clean
   cd ..
   ```

---

## Troubleshooting

### App Crashes on Startup

**Possible Causes:**
1. **Missing Zoom SDK credentials**: Make sure you've replaced `YOUR_ZOOM_APP_KEY` and `YOUR_ZOOM_APP_SECRET` in `ZoomModule.java`
2. **MultiDex not configured**: This should already be set up, but verify `MainApplication.kt` extends `MultiDexApplication`
3. **Conflicting native libraries**: The packaging options in `app/build.gradle` should handle this

**Solutions:**
- Check LogCat for specific error messages: `adb logcat | grep -i zoom`
- Verify all credentials are correct
- Make sure you did a clean build after adding Zoom SDK

### Meeting Not Joining

**Possible Causes:**
1. Invalid meeting number or password
2. Zoom SDK not initialized
3. Network connectivity issues
4. Missing permissions

**Solutions:**
- Verify the meeting number and password are correct
- Check that `ZoomModule.initialize()` is called before joining
- Ensure device has internet connection
- Grant all required runtime permissions

### "INVALID_CREDENTIALS" Error

**Solution:**
- This means you haven't replaced the placeholder credentials in `ZoomModule.java`
- Open `android/app/src/main/java/com/pratham/learning/ZoomModule.java`
- Replace `YOUR_ZOOM_APP_KEY` and `YOUR_ZOOM_APP_SECRET` with your actual Zoom SDK credentials

### Build Fails with "Duplicate class" Error

**Solution:**
- The packaging options in `app/build.gradle` should prevent this
- If you still see this error, add more exclusions to `packagingOptions`:
  ```gradle
  packagingOptions {
      pickFirst 'lib/arm64-v8a/libc++_shared.so'
      pickFirst 'lib/armeabi-v7a/libc++_shared.so'
      pickFirst 'lib/x86/libc++_shared.so'
      pickFirst 'lib/x86_64/libc++_shared.so'
      exclude 'META-INF/DEPENDENCIES'
      exclude 'META-INF/LICENSE'
      exclude 'META-INF/LICENSE.txt'
      exclude 'META-INF/NOTICE'
      exclude 'META-INF/NOTICE.txt'
  }
  ```

### "MEETING_ERROR_UNKNOWN" When Joining

**Possible Causes:**
1. Meeting doesn't exist
2. Meeting has ended
3. Meeting requires authentication
4. Wrong meeting number format

**Solutions:**
- Verify the meeting exists and hasn't ended
- Make sure meeting number is 9-11 digits with no spaces or hyphens
- For personal meetings, use the personal meeting ID

### App Hangs When Joining Meeting

**Solution:**
- Check if the app has the required permissions
- Make sure the Zoom SDK is properly initialized
- Check LogCat for any error messages: `adb logcat | grep -E "(Zoom|mobilertc)"`

### Cannot Find ZoomModule in JavaScript

**Solution:**
- Verify `ZoomPackage` is added to `MainApplication.kt`
- Clean and rebuild the project
- Make sure the native module is properly linked

---

## Important Notes

### Security Best Practices

1. **Never commit SDK credentials to version control**
   - Add `ZoomModule.java` to `.gitignore` if it contains credentials
   - Use environment variables for production apps
   - Consider using a secure key management service

2. **Validate meeting inputs**
   - Always validate meeting numbers and passwords before passing to SDK
   - Sanitize user inputs to prevent injection attacks

3. **Handle errors gracefully**
   - The module includes comprehensive error handling
   - Always wrap SDK calls in try-catch blocks
   - Provide user-friendly error messages

### Performance Considerations

1. **Initialize once**: The SDK only needs to be initialized once per app session
2. **MultiDex**: Zoom SDK is large and requires MultiDex (already configured)
3. **App size**: Zoom SDK will increase your APK size by approximately 50-80 MB
4. **Memory**: Zoom uses significant memory, especially during video calls

### Limitations

1. **Android only**: This implementation is for Android only. iOS requires separate implementation
2. **No customization of meeting UI**: The Zoom SDK provides its own meeting UI
3. **Meeting features**: Some advanced Zoom features may require additional configuration
4. **SDK updates**: You need to manually update the SDK version in `build.gradle`

### Meeting Number Format

- Meeting numbers should be 9-11 digits
- Remove any spaces, hyphens, or other characters
- Personal Meeting IDs can also be used
- Examples of valid formats:
  - `123456789`
  - `12345678901`
  
### SDK Version

The integration uses `latest.release` for Zoom SDK. For production apps, consider pinning to a specific version:

```gradle
implementation 'us.zoom.sdk:mobilertc:5.17.11.10620'
implementation 'us.zoom.sdk:commonlib:5.17.11.10620'
```

Check [Zoom's release notes](https://github.com/zoom/zoom-sdk-android/releases) for the latest stable version.

---

## Additional Resources

- [Zoom Meeting SDK for Android Documentation](https://developers.zoom.us/docs/meeting-sdk/android/)
- [Zoom Meeting SDK GitHub Repository](https://github.com/zoom/zoom-sdk-android)
- [Zoom Developer Forum](https://devforum.zoom.us/)
- [Zoom Marketplace](https://marketplace.zoom.us/)

---

## Support and Contact

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section above
2. Review Android LogCat for detailed error messages
3. Consult [Zoom's official documentation](https://developers.zoom.us/docs/meeting-sdk/android/)
4. Post questions on [Zoom Developer Forum](https://devforum.zoom.us/)

---

## Files Modified/Created Summary

### Created Files:
1. `android/app/src/main/java/com/pratham/learning/ZoomModule.java`
2. `android/app/src/main/java/com/pratham/learning/ZoomPackage.java`
3. `src/components/ZoomMeeting/ZoomMeeting.js`
4. `src/components/ZoomMeeting/index.js`
5. `ZOOM_SDK_INTEGRATION_GUIDE.md` (this file)

### Modified Files:
1. `android/app/src/main/java/com/pratham/learning/MainApplication.kt`
2. `android/build.gradle`
3. `android/app/build.gradle`
4. `android/app/src/main/AndroidManifest.xml`

---

## Quick Start Checklist

- [ ] Get Zoom SDK credentials from [Zoom Marketplace](https://marketplace.zoom.us/)
- [ ] Replace `YOUR_ZOOM_APP_KEY` and `YOUR_ZOOM_APP_SECRET` in `ZoomModule.java`
- [ ] Run `cd android && ./gradlew clean && cd ..`
- [ ] Run `npx react-native run-android`
- [ ] Test by importing and using the `ZoomMeeting` component
- [ ] Request runtime permissions for Camera, Audio, and Phone State
- [ ] Join a test meeting to verify everything works

---

**Last Updated:** October 8, 2025
**Zoom SDK Version:** latest.release (recommended to pin specific version for production)
**React Native Version:** 0.60+
**Minimum Android SDK:** 21 (Android 5.0)

---

## License

This integration guide is provided as-is for educational purposes. Zoom Meeting SDK usage is subject to Zoom's terms of service and licensing agreements.

