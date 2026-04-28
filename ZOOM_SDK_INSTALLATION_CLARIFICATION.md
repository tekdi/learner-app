# Zoom SDK Installation - Important Clarification

## ✅ NO MANUAL DOWNLOAD REQUIRED!

You **DO NOT** need to manually download Zoom SDK files. The integration uses **Gradle automatic dependency management**.

---

## How It Works

### **Automatic Installation (What We're Using)**

The Zoom SDK is automatically downloaded by Gradle when you build your app:

```gradle
// In android/app/build.gradle
dependencies {
    implementation 'us.zoom.sdk:mobilertc:latest.release'
    implementation 'us.zoom.sdk:commonlib:latest.release'
}
```

**What happens during build:**
1. Gradle connects to Zoom's Maven repository
2. Downloads the SDK libraries (AAR files)
3. Extracts native libraries (.so files for ARM, x86, etc.)
4. Packages everything into your APK automatically

**Advantages:**
- ✅ No manual download needed
- ✅ Always gets the latest version (or specific version if pinned)
- ✅ Gradle handles all dependencies
- ✅ Clean and maintainable
- ✅ Works in CI/CD pipelines

---

## First Build - What to Expect

### **When you run your first build:**

```bash
cd android
./gradlew clean
./gradlew assembleDevDebug
```

**You'll see output like:**
```
> Task :app:checkDebugAarMetadata
> Task :app:downloadMobilertc
Downloading https://github.com/zoom/zoom-sdk-android/.../mobilertc-...aar
> Task :app:downloadCommonlib
Downloading https://github.com/zoom/zoom-sdk-android/.../commonlib-...aar
> Task :app:extractMobilertcAar
> Task :app:extractCommonlibAar
```

**This is normal!** 
- First build will take 2-5 minutes longer
- Downloads ~70-100 MB of SDK files
- Subsequent builds will be faster (cached)

---

## Verification Steps

### **Step 1: Check if SDK is Being Downloaded**

After running your first build, check the Gradle cache:

```bash
# Navigate to Android directory
cd android

# Build the app (this will download SDK)
./gradlew assembleDevDebug --info | grep -i zoom
```

You should see lines about downloading Zoom SDK files.

### **Step 2: Verify SDK is in Your APK**

After a successful build:

```bash
# Check APK size (should be 80-120 MB larger than before)
ls -lh android/app/build/outputs/apk/dev/debug/

# Verify native libraries are included
unzip -l android/app/build/outputs/apk/dev/debug/app-dev-debug.apk | grep libzoom
```

You should see:
```
lib/arm64-v8a/libzoomus.so
lib/armeabi-v7a/libzoomus.so
lib/x86/libzoomus.so
lib/x86_64/libzoomus.so
```

### **Step 3: Test at Runtime**

Run your app and check logs:

```bash
adb logcat | grep -i "zoom\|mobilertc"
```

If SDK is properly included, you'll see:
```
D/ZoomModule: Starting Zoom SDK initialization...
D/ZoomSDK: Zoom SDK version: x.x.x.xxx
```

---

## What's Already Configured

### ✅ **Maven Repository Added**

In `android/build.gradle`:
```gradle
allprojects {
    repositories {
        // ... other repositories
        maven {
            url 'https://github.com/zoom/zoom-sdk-android/raw/master/mobilertc-android-studio/release'
        }
    }
}
```

### ✅ **Dependencies Added**

In `android/app/build.gradle`:
```gradle
dependencies {
    // ... other dependencies
    implementation 'us.zoom.sdk:mobilertc:latest.release'
    implementation 'us.zoom.sdk:commonlib:latest.release'
}
```

### ✅ **Packaging Options Configured**

In `android/app/build.gradle`:
```gradle
android {
    packagingOptions {
        pickFirst 'lib/arm64-v8a/libc++_shared.so'
        pickFirst 'lib/armeabi-v7a/libc++_shared.so'
        pickFirst 'lib/x86/libc++_shared.so'
        pickFirst 'lib/x86_64/libc++_shared.so'
    }
}
```

This prevents conflicts when multiple libraries include the same native files.

---

## Manual Installation (Alternative - NOT RECOMMENDED)

If for some reason you need to manually install the SDK (e.g., offline development, custom SDK version):

### **Step 1: Download SDK**
1. Go to [Zoom SDK GitHub](https://github.com/zoom/zoom-sdk-android/releases)
2. Download the latest release (e.g., `mobilertc-android-studio-x.x.x.zip`)
3. Extract the zip file

### **Step 2: Copy Files**
```bash
# Create libs directory if it doesn't exist
mkdir -p android/app/libs

# Copy AAR files
cp path/to/extracted/mobilertc.aar android/app/libs/
cp path/to/extracted/commonlib.aar android/app/libs/
```

### **Step 3: Update build.gradle**
Replace the Maven dependencies with local AAR references:

```gradle
dependencies {
    // Remove these:
    // implementation 'us.zoom.sdk:mobilertc:latest.release'
    // implementation 'us.zoom.sdk:commonlib:latest.release'
    
    // Add these instead:
    implementation(name: 'mobilertc', ext: 'aar')
    implementation(name: 'commonlib', ext: 'aar')
}

// Add this block
repositories {
    flatDir {
        dirs 'libs'
    }
}
```

**However, we DON'T recommend this approach because:**
- ❌ Manual updates required
- ❌ Larger Git repository size
- ❌ Version tracking is harder
- ❌ Team synchronization issues

---

## Troubleshooting

### **Problem: "Failed to resolve: us.zoom.sdk:mobilertc"**

**Solution:**
1. Check internet connection
2. Verify Maven repository URL is correct in `build.gradle`
3. Try with VPN if GitHub is blocked
4. Clear Gradle cache:
   ```bash
   cd android
   ./gradlew clean
   rm -rf ~/.gradle/caches/
   ./gradlew build
   ```

### **Problem: "Duplicate class" errors**

**Solution:**
The packaging options should prevent this, but if you still see errors:

```gradle
packagingOptions {
    pickFirst 'lib/arm64-v8a/libc++_shared.so'
    pickFirst 'lib/armeabi-v7a/libc++_shared.so'
    pickFirst 'lib/x86/libc++_shared.so'
    pickFirst 'lib/x86_64/libc++_shared.so'
    exclude 'META-INF/DEPENDENCIES'
    exclude 'META-INF/LICENSE'
    exclude 'META-INF/NOTICE'
}
```

### **Problem: Build takes very long on first attempt**

**This is normal!** The first build downloads ~100 MB of SDK files.

**Solutions:**
- Be patient (2-5 minutes)
- Ensure stable internet connection
- Use a VPN if GitHub is slow in your region
- Subsequent builds will be much faster

### **Problem: APK size increased significantly**

**This is expected!** Zoom SDK adds approximately 70-100 MB to your APK because it includes:
- Native libraries for ARM, ARM64, x86, x86_64
- Resources and UI components
- Video/audio processing libraries

**Solutions:**
- Use Android App Bundles (AAB) for Play Store to reduce download size
- Enable APK splits by architecture:
  ```gradle
  splits {
      abi {
          enable true
          reset()
          include 'armeabi-v7a', 'arm64-v8a'
          universalApk false
      }
  }
  ```

---

## Quick Start Checklist

- [ ] Verify internet connection
- [ ] Ensure `android/build.gradle` has Zoom Maven repository
- [ ] Ensure `android/app/build.gradle` has Zoom dependencies
- [ ] Get Zoom SDK credentials from marketplace.zoom.us
- [ ] Add credentials to `ZoomModule.java`
- [ ] Run: `cd android && ./gradlew clean`
- [ ] Run: `npx react-native run-android`
- [ ] Wait for first build to complete (3-5 minutes)
- [ ] Check logs for successful SDK initialization

---

## Summary

**You DO NOT need to manually download or install Zoom SDK files!**

✅ **What you need to do:**
1. Get Zoom SDK credentials (App Key & Secret)
2. Add credentials to `ZoomModule.java`
3. Run `cd android && ./gradlew clean`
4. Build and run the app

✅ **What happens automatically:**
1. Gradle downloads Zoom SDK from Maven
2. Native libraries are included in APK
3. Everything is packaged correctly

❌ **What you DON'T need to do:**
1. Download SDK zip files
2. Copy .aar files manually
3. Extract native libraries
4. Configure library paths

---

## Version Pinning (Recommended for Production)

For production apps, pin to a specific SDK version:

```gradle
// Instead of 'latest.release'
implementation 'us.zoom.sdk:mobilertc:5.17.11.10620'
implementation 'us.zoom.sdk:commonlib:5.17.11.10620'
```

Check [Zoom's releases](https://github.com/zoom/zoom-sdk-android/releases) for version numbers.

---

**Last Updated:** October 8, 2025  
**Method:** Automatic Gradle dependency management (recommended)  
**Manual Installation:** Not required

