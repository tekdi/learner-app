# Android 15 SafeArea Fix Guide

## Problem

Android 15 introduced edge-to-edge display by default, causing:

- Headers to go into the status bar area
- Footer navigation buttons to overlay into the app bottom
- Content to be cut off by system UI elements

## Solution

This project now includes a comprehensive fix using `react-native-safe-area-context` with a reusable `SafeAreaWrapper` component.

## Quick Fix for All Screens

### 1. Import the SafeAreaWrapper

Replace existing SafeAreaView imports with:

```javascript
import SafeAreaWrapper from '../../components/SafeAreaWrapper/SafeAreaWrapper';
```

### 2. Replace SafeAreaView usage

Replace:

```javascript
<SafeAreaView style={{ flex: 1, padding: 10 }}>{/* content */}</SafeAreaView>
```

With:

```javascript
<SafeAreaWrapper style={{ padding: 10 }}>{/* content */}</SafeAreaWrapper>
```

### 3. For screens with custom headers/footers

Use the exclude props:

```javascript
// For screens with custom headers (exclude top safe area)
<SafeAreaWrapper excludeTop style={{ padding: 10 }}>
  {/* content */}
</SafeAreaWrapper>

// For screens with custom footers (exclude bottom safe area)
<SafeAreaWrapper excludeBottom style={{ padding: 10 }}>
  {/* content */}
</SafeAreaWrapper>
```

## Files Already Updated

- ✅ `src/screens/RegisterScreen/RegistrationForm.js`
- ✅ `src/screens/LoginScreen/LoginScreen.js`

## Files That Need Updates

Based on the grep search, these files still need to be updated:

1. `src/screens/PlayerScreen/StandAlonePlayer/StandAlonePlayer.js`
2. `src/screens/Assessment/TestView.js`
3. `src/screens/Dashboard/Courses/Courses.js`
4. `src/screens/Assessment/ATM/ATMAssessment.js`
5. `src/screens/Assessment/Assessment.js`
6. `src/screens/Dashboard/Preference/SCPDashboard/SCPDashboard.js`
7. `src/screens/LanguageScreen/LanguageScreen.js`
8. `src/screens/Profile/NoCertificateBox.js`

## SafeAreaWrapper Component Features

- Handles Android 15 edge-to-edge display properly
- Configurable edges (top, left, right, bottom)
- Exclude options for custom headers/footers
- Consistent behavior across all Android versions
- Backward compatible with older Android versions

## Testing

After applying the fix:

1. Test on Android 15 device/emulator
2. Verify headers don't go into status bar
3. Verify footer navigation doesn't overlay content
4. Test on different screen sizes and orientations
5. Verify backward compatibility with older Android versions

## Benefits

- ✅ Fixes Android 15 edge-to-edge display issues
- ✅ Consistent behavior across all screens
- ✅ Reusable component reduces code duplication
- ✅ Backward compatible with older Android versions
- ✅ Easy to maintain and update
