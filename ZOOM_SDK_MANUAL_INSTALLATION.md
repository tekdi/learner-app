# Zoom SDK Manual Installation Guide

Since the Maven repository is not accessible, we'll install the Zoom SDK manually by downloading the AAR files.

## Step 1: Download Zoom SDK

### Option A: Direct Download (Recommended)

Download these two files:

1. **mobilertc-5.17.11.10620.aar** 
   - Direct link: https://github.com/zoom/zoom-sdk-android/releases/download/v5.17.11.10620/mobilertc-5.17.11.10620.aar

2. **commonlib-5.17.11.10620.aar**
   - Direct link: https://github.com/zoom/zoom-sdk-android/releases/download/v5.17.11.10620/commonlib-5.17.11.10620.aar

### Option B: Download from Zoom GitHub Releases

1. Go to: https://github.com/zoom/zoom-sdk-android/releases
2. Find release `v5.17.11.10620` (or latest stable)
3. Download the `mobilertc-android-studio-5.17.11.10620.zip`
4. Extract and find the AAR files inside

## Step 2: Create libs Directory

Run this command from your project root:

```bash
mkdir -p android/app/libs
```

## Step 3: Place AAR Files

Copy the downloaded AAR files to:
```
android/app/libs/mobilertc.aar
android/app/libs/commonlib.aar
```

**Important:** Rename the files to remove version numbers:
- `mobilertc-5.17.11.10620.aar` → `mobilertc.aar`
- `commonlib-5.17.11.10620.aar` → `commonlib.aar`

## Step 4: Update build.gradle

This has already been done for you, but verify these changes:

### In `android/app/build.gradle`:

The dependencies should look like this:
```gradle
dependencies {
    // ... other dependencies
    
    // Zoom SDK - Local AAR files
    implementation(name: 'mobilertc', ext: 'aar')
    implementation(name: 'commonlib', ext: 'aar')
    
    // Multidex support
    implementation 'androidx.multidex:multidex:2.0.1'
}

// Add this at the bottom of android block
repositories {
    flatDir {
        dirs 'libs'
    }
}
```

## Step 5: Verify Installation

After placing the files, your directory should look like:
```
android/app/libs/
├── mobilertc.aar
└── commonlib.aar
```

## Step 6: Build Your App

```bash
cd android
./gradlew clean
cd ..
npm run android:uat
```

---

## Alternative: Use wget/curl to Download

If you want to automate the download:

```bash
# Navigate to libs directory
mkdir -p android/app/libs
cd android/app/libs

# Download mobilertc (adjust version as needed)
wget https://github.com/zoom/zoom-sdk-android/releases/download/v5.17.11.10620/mobilertc-5.17.11.10620.aar -O mobilertc.aar

# Download commonlib
wget https://github.com/zoom/zoom-sdk-android/releases/download/v5.17.11.10620/commonlib-5.17.11.10620.aar -O commonlib.aar

# Go back to project root
cd ../../..
```

Or using curl:

```bash
mkdir -p android/app/libs
cd android/app/libs

curl -L "https://github.com/zoom/zoom-sdk-android/releases/download/v5.17.11.10620/mobilertc-5.17.11.10620.aar" -o mobilertc.aar
curl -L "https://github.com/zoom/zoom-sdk-android/releases/download/v5.17.11.10620/commonlib-5.17.11.10620.aar" -o commonlib.aar

cd ../../..
```

---

## Troubleshooting

**If download links don't work:**
1. Visit https://github.com/zoom/zoom-sdk-android/releases
2. Look for the latest release
3. Download the AAR files manually
4. Place them in `android/app/libs/`

**If build still fails:**
Check that:
- Files are named exactly `mobilertc.aar` and `commonlib.aar`
- Files are in `android/app/libs/` directory
- The `repositories { flatDir { dirs 'libs' } }` block is in build.gradle

---

## File Size Reference

- mobilertc.aar: ~70-90 MB
- commonlib.aar: ~15-20 MB

If your downloaded files are much smaller, they might be corrupted or incomplete. Re-download them.

