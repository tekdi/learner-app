# Android Vitals – Pratham myLearning (`com.pratham.learning`)

Source: Play Console › Android vitals › Crashes and ANRs
Filter: app version **148 (0.0.148)**, user-perceived crashes & ANRs, last 28 days (Oct 25 – Nov 22, 2026)
Crashes started spiking on **Nov 13** (version 148 rollout) and reached ~130 affected users/day.

---

## Summary

| # | Issue | Type | Users | Events | Share | Priority |
|---|-------|------|------:|-------:|------:|----------|
| 1 | `com.swmansion.rnscreens.ScreenFragment.<init>` – IllegalStateException | Crash | 1,309 | 5,572 | **99.4%** | **P0** |
| 2 | `ExceptionsManagerModule.reportException` – JavascriptException | Crash | 9 | 10 | 0.2% | P1 |
| 3 | `ReactInstanceManager.onHostPause` – AssertionError | Crash | 1 | 1 | 0.0% | P2 (fixed by #1) |
| 4 | `ScreenFragment.<init>` – Input dispatching timed out (SDK-related) | ANR | 1 | 1 | 0.0% | P2 (fixed by #1) |
| 5 | `MessageQueue.nativePollOnce` – Input dispatching timed out (×2) | ANR | 1 + 1 | 2 + 8 | 0.1% | P3 |
| 6 | `J.N.VJO` / `J.N.VJ` / `J.N.VOO` native – Input dispatching timed out | ANR | 1 each | 1–2 | 0.0% | P3 (WebView/Chromium) |
| 7 | `PhoneWindow.getDecorView`, `Canvas.translate` – Input dispatching timed out | ANR | 1 each | 1 | 0.0% | P3 |
| 8 | `com.miui.misight.MiSight.<clinit>` – ANR | ANR | 1 | 1 | 0.0% | Ignore (Xiaomi system) |
| 9 | `libGLESv2_adreno.so` – SIGSEGV | Crash | 1 | 1 | 0.0% | Ignore (GPU driver) |

**Fixing #1 removes ~99% of all crashes.**

---

## 1. ScreenFragment IllegalStateException (P0 – 99.4%)

### Stack trace (key lines)

```
java.lang.RuntimeException: Unable to start activity
  ComponentInfo{com.pratham.learning/com.pratham.learning.MainActivity}:
  Fragment$InstantiationException: Unable to instantiate fragment
  com.swmansion.rnscreens.ScreenStackFragment
Caused by java.lang.IllegalStateException: Screen fragments should never be restored.
  Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067
  to properly configure your main activity.
  at com.swmansion.rnscreens.ScreenFragment.<init> (ScreenFragment.kt:65)
  at com.swmansion.rnscreens.ScreenStackFragment.<init> (ScreenStackFragment.kt:40)
```

Devices: mostly vivo (V2553, V2446), OPPO, Redmi, Lava. Android 13–16. Foreground.

### Root cause

When Android kills the app in the background (low memory – very common on budget vivo/OPPO/Redmi phones) and the user returns, `MainActivity` is recreated with a `savedInstanceState` bundle. The FragmentManager tries to restore `ScreenStackFragment`, which `react-native-screens` explicitly forbids, so the app crashes at launch.

`react-native-screens` requires `MainActivity.onCreate` to pass **`null`** to `super.onCreate`. Version 148 either lost this override or never had it (check git history of `MainActivity` around the v148 release).

### Fix

File: `android/app/src/main/java/com/pratham/learning/MainActivity.kt` (or `.java`)

**Kotlin**

```kotlin
package com.pratham.learning

import android.os.Bundle
import com.facebook.react.ReactActivity
// ...existing imports

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Required by react-native-screens: never restore screen fragments
        super.onCreate(null)
        // ...any existing code (splash screen, etc.) stays after this line
    }

    // ...existing getMainComponentName(), createReactActivityDelegate()
}
```

**Java**

```java
import android.os.Bundle;

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
}
```

Notes:

- If an `onCreate` already exists, change `super.onCreate(savedInstanceState)` → `super.onCreate(null)` — don't add a second one.
- If you use `react-native-splash-screen` / `expo-splash-screen` / `SplashScreen.show(this)`, keep that call **after** `super.onCreate(null)` (or before, per the library's docs) but always pass `null`.
- If the project uses Expo prebuild, apply this through a config plugin or check that `expo` isn't regenerating `MainActivity` without it.
- Search for any other `ReactActivity` subclasses and apply the same change:
  `grep -rn "ReactActivity()" android/app/src/main`

### How to verify locally

1. Install a release build on a device/emulator.
2. Enable **Developer options › Don't keep activities** (or run `adb shell am kill com.pratham.learning` while the app is in the background).
3. Open the app, navigate a few screens, press Home, then return to the app.
4. Before fix → crash with the trace above. After fix → app reopens normally.

---

## 2. JavascriptException via ExceptionsManagerModule (P1 – 9 users)

### Trace

```
com.facebook.react.common.JavascriptException:
  at ExceptionsManagerModule.reportException (ExceptionsManagerModule.java:65)
```

The message is empty in Play Console, so the actual JS error isn't visible here. This is an **unhandled JS error/promise rejection** that took down the app.

### Steps

1. Get the real JS stack: check Crashlytics/Sentry (if integrated) for the same date range, or add one.
   - Upload source maps for release builds so stacks are readable.
2. Add a global JS error boundary + handler in `index.js` / `App.tsx`:

   ```js
   import { ErrorUtils } from 'react-native';
   const defaultHandler = ErrorUtils.getGlobalHandler();
   ErrorUtils.setGlobalHandler((error, isFatal) => {
     // log to Crashlytics/Sentry with error.message + error.stack
     defaultHandler(error, isFatal);
   });
   ```

3. Wrap the root navigator in a React `ErrorBoundary` that shows a fallback screen instead of crashing.
4. Audit `async` code paths for missing `try/catch` (API calls, AsyncStorage/MMKV reads, `JSON.parse` on server data, `undefined.property` access on optional API fields).
5. Search the codebase for likely culprits:
   `grep -rn "JSON.parse" src/` and check each is guarded.

---

## 3. AssertionError in ReactInstanceManager.onHostPause (P2)

```
java.lang.AssertionError: Pausing an activity that is not the current activity,
this is incorrect! Current activity: MainActivity Paused activity: MainActivity
```

Two `MainActivity` instances existed at once — a side effect of the same recreate/restore problem as #1. Fix #1 first. Additionally:

- In `AndroidManifest.xml`, ensure `MainActivity` has `android:launchMode="singleTask"` (React Native default) so deep links / notifications don't start a second instance.
- Ensure `configChanges` includes the RN default:
  `android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"`

---

## 4–7. ANRs – "Input dispatching timed out" (P2/P3)

Each affects only 1 user, so the ANR rate is low, but they point to main-thread work.

| Stack top | Likely cause | Action |
|---|---|---|
| `ScreenFragment.<init>` | Same restore bug as #1 | Fixed by #1 |
| `MessageQueue.nativePollOnce` | Main thread idle — the real block is elsewhere (often in JS thread or a binder call); low signal | Monitor after #1 ships |
| `J.N.VJO`, `J.N.VJ`, `J.N.VOO` | Chromium/WebView native code | If the app uses `react-native-webview` (e.g. content player/H5P), avoid heavy pages on launch, pause/destroy WebViews when screens blur, keep WebView updated |
| `PhoneWindow.getDecorView`, `Canvas.translate` | Heavy layout/draw on main thread | Profile startup and long lists; use `FlatList` with `getItemLayout`, avoid large images without resizing, enable Hermes if not already |

General ANR hygiene:

- Move file I/O, DB, and large `JSON.parse` work off the UI thread (in native modules use background threads; in JS use `InteractionManager.runAfterInteractions` for non-urgent work).
- Don't do synchronous `SharedPreferences.commit()` / disk reads in `MainApplication.onCreate`.
- Check `android/app/build.gradle` has `hermesEnabled=true` (in `gradle.properties`).

---

## 8–9. Ignore (system / vendor)

- `com.miui.misight.MiSight.<clinit>` — Xiaomi MIUI system diagnostic component, not app code.
- `libGLESv2_adreno.so` SIGSEGV — Qualcomm Adreno GPU driver crash on one device. Only revisit if it grows.

---

## Release checklist

- [ ] Change `MainActivity.onCreate` to call `super.onCreate(null)` (#1)
- [ ] Verify with "Don't keep activities" on a real device
- [ ] Confirm `launchMode="singleTask"` on `MainActivity` (#3)
- [ ] Add global JS error handler + ErrorBoundary, upload source maps (#2)
- [ ] Bump `versionCode` to 149 and release to a **staged rollout** (e.g. 10–20%)
- [ ] Watch Play Console › Crashes and ANRs filtered to 149 for 48–72 h; the ScreenFragment issue should drop to ~0
- [ ] Mark issue #1 as resolved in Play Console after the rollout is confirmed clean
