# Download Functionality Troubleshooting Guide

## Issue: Download feature not working in ImageZoomDialog.js

### ✅ **FIXED: Android 13+ Permission Issue**

**Problem:** On Android 13+ (API 33-35), `WRITE_EXTERNAL_STORAGE` permission is deprecated and blocked by default.

**Solution:**

- Android 13+: No storage permission needed, uses app's external files directory
- Android 8-12: Uses `WRITE_EXTERNAL_STORAGE` permission with Downloads directory

**Download Paths:**

- **Android 13+**: `/storage/emulated/0/Android/Data/com.pratham.learning/files/LearnerApp`
- **Android 8-12**: `/storage/emulated/0/Download/LearnerApp`
- **iOS**: App documents directory

## Debugging Steps

### 1. Check Console Logs

The updated code now includes extensive logging. Check the console for these log messages:

```
=== Download Started ===
Testing download path...
=== Testing Download Path ===
Download path: /storage/emulated/0/Download/LearnerApp
Directory exists: true/false
=== Permission Check Started ===
Platform: android Version: 33
Using WRITE_EXTERNAL_STORAGE for Android 13+
Permission check result: granted/denied
Starting download for: https://example.com/image.jpg
Starting RNFS download...
Download result: {statusCode: 200, ...}
```

### 2. Common Issues and Solutions

#### Issue 1: Permission Denied

**Symptoms:**

- Permission check fails
- User sees permission request but denies it

**Solutions:**

- Check if `WRITE_EXTERNAL_STORAGE` is declared in AndroidManifest.xml
- Verify `requestLegacyExternalStorage="true"` is set for Android 10+
- Test on different API levels (26-35)

#### Issue 2: Download Path Issues

**Symptoms:**

- Directory creation fails
- File not found after download

**Solutions:**

- Check if `RNFS.DownloadDirectoryPath` is accessible
- Verify the app has write permissions to Downloads folder
- Test with the debug button (bug icon)

#### Issue 3: Network Issues

**Symptoms:**

- Download fails with network error
- Status code not 200

**Solutions:**

- Check internet connectivity
- Verify image URL is accessible
- Test with a simple image URL

#### Issue 4: File System Issues

**Symptoms:**

- File created but not visible
- File size is 0 bytes

**Solutions:**

- Check available storage space
- Verify file permissions
- Test with different file names

### 3. Testing with Debug Button

The temporary debug button (bug icon) will:

1. Test download path creation
2. Create a test file
3. Verify file operations
4. Clean up test files

**Expected Output:**

```
=== Testing Download Path ===
Download path: /storage/emulated/0/Download/LearnerApp
Directory exists: false
Creating test directory...
Directory created successfully
Test file created: /storage/emulated/0/Download/LearnerApp/test.txt
Test file exists: true
Test file cleaned up
```

### 4. Manual Testing Steps

1. **Open ImageZoomDialog**
2. **Tap the debug button (bug icon)**
3. **Check console logs**
4. **If debug passes, try download button**
5. **Check console logs for download process**

### 5. Platform-Specific Issues

#### Android 13+ (API 33-35)

- **No storage permission needed** for downloads
- Uses app's external files directory (`/storage/emulated/0/Android/Data/com.pratham.learning/files/LearnerApp`)
- Photo Picker handles gallery access
- `WRITE_EXTERNAL_STORAGE` is deprecated and blocked

#### Android 10-12 (API 29-32)

- Uses `WRITE_EXTERNAL_STORAGE` with legacy support
- Downloads to `/storage/emulated/0/Download/LearnerApp`
- Verify `requestLegacyExternalStorage="true"` in manifest
- Check scoped storage behavior

#### Android 8-9 (API 26-28)

- Uses traditional storage permissions
- Downloads to `/storage/emulated/0/Download/LearnerApp`
- Check if permissions are properly requested
- Verify file provider configuration

### 6. File Provider Configuration

Check `android/app/src/main/res/xml/provider_paths.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <external-path name="external_files" path="."/>
    <external-files-path name="external_files" path="."/>
    <cache-path name="cache" path="."/>
    <external-cache-path name="external_cache" path="."/>
    <files-path name="files" path="."/>
</paths>
```

### 7. AndroidManifest.xml Permissions

Verify these permissions are present:

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

And this attribute in the application tag:

```xml
android:requestLegacyExternalStorage="true"
```

### 8. Common Error Messages

#### "Permission denied"

- Check runtime permissions
- Verify manifest permissions
- Test on different API levels

#### "Download failed with status: 403"

- Network permission issue
- URL access denied
- Check image URL validity

#### "File was not created after download"

- Storage space issue
- File system permission problem
- Path creation failed

#### "Invalid image URL"

- URL is null or empty
- Check image object structure
- Verify URL format

### 9. Testing Checklist

- [ ] Debug button works (creates test file)
- [ ] Permission request appears
- [ ] Permission is granted
- [ ] Download starts
- [ ] Progress is logged
- [ ] File is created
- [ ] Success message appears
- [ ] File is visible in Downloads folder

### 10. Removing Debug Code

After fixing the issue, remove:

1. Debug button from header
2. `testDownloadPath` function
3. Debug logging (optional)

### 11. Alternative Solutions

If the issue persists:

1. **Use different download path:**

```javascript
const getDownloadPath = () => {
  if (Platform.OS === 'android') {
    return `${RNFS.ExternalDirectoryPath}/LearnerApp`;
  }
  return `${RNFS.DocumentDirectoryPath}/LearnerApp`;
};
```

2. **Use different download method:**

```javascript
const downloadResult = await RNFS.downloadFile({
  fromUrl: imageUrl,
  toFile: finalFilePath,
  background: false, // Try false instead of true
  discretionary: false, // Try false instead of true
}).promise;
```

3. **Add timeout:**

```javascript
const downloadResult = await Promise.race([
  RNFS.downloadFile({...}).promise,
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Download timeout')), 30000)
  )
]);
```

## Next Steps

1. Test with the debug button
2. Check console logs
3. Identify the specific issue
4. Apply the appropriate fix
5. Test on multiple devices/API levels
6. Remove debug code once working
