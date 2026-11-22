# Android Vitals: crash fixes for the Learner App

**Jira:** [PS-7632](https://prathamdigitalteam.atlassian.net/browse/PS-7632)
**Branch:** `release-1.0.1-new-build`
**Target release:** `versionCode` 149 (`0.0.149`). Version 148 is the live build the vitals report covers.

## Background

Google Play sent this warning:

> Your 28-day user-perceived crash rate exceeds the device bad behavior threshold of 8.0% on 4 device models affecting 5.01% of installs.

Until the crash rate falls, the app is less discoverable on those devices and Play may show a warning on the store listing. The warning only clears once the 28-day crash rate on those devices drops below 8%, so fixes need to ship as soon as possible.

Play Console (Android vitals → Crashes and ANRs, version 148, Oct 25 – Nov 22) lists the issues below. Crash 1 alone is 99.4% of all crash events, so fixing it should bring the crash rate well under the 8% threshold.

## Status

| # | Issue | Type | Users / events | Status |
|---|---|---|---|---|
| 1 | `ScreenStackFragment`: "Screen fragments should never be restored" | Crash | 1,309 / 5,572 (99.4%) | Fixed |
| 2 | `JavascriptException` with no error message | Crash | 9 / 10 | Error screen added; root cause unknown (Crashlytics was dropped) |
| 3 | `ReactInstanceManager.onHostPause` AssertionError | Crash | 1 / 1 | Fixed by crash 1; manifest already correct |
| 4 | ANR in `ScreenFragment.<init>` | ANR | 1 / 1 | Fixed by crash 1 |
| 5–7 | ANRs: `nativePollOnce`, WebView (`J.N.*`), `getDecorView` / `Canvas.translate` | ANR | 1 each | No code change; monitor after 149 |
| 8 | `com.miui.misight.MiSight` | ANR | 1 / 1 | Ignore: Xiaomi system code |
| 9 | `libGLESv2_adreno.so` SIGSEGV | Crash | 1 / 1 | Ignore: GPU driver |

---

## Crash 1: app crashes on relaunch after Android kills it in the background

### Stack trace (key lines)

```
java.lang.RuntimeException: Unable to start activity ComponentInfo{com.pratham.learning/com.pratham.learning.MainActivity}:
  androidx.fragment.app.Fragment$InstantiationException: Unable to instantiate fragment
  com.swmansion.rnscreens.ScreenStackFragment: calling Fragment constructor caused an exception
  ...
  at androidx.fragment.app.FragmentManager.restoreSaveStateInternal (FragmentManager.java:2507)
  ...
  at com.facebook.react.ReactActivity.onCreate (ReactActivity.java:46)
Caused by java.lang.IllegalStateException: Screen fragments should never be restored.
  Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067
  to properly configure your main activity.
  at com.swmansion.rnscreens.ScreenFragment.<init> (ScreenFragment.kt:65)
  at com.swmansion.rnscreens.ScreenStackFragment.<init> (ScreenStackFragment.kt:40)
```

### Root cause

When Android needs memory, it kills apps that are in the background and saves the state of their open screens. When the user returns, Android tries to rebuild those screens from the saved state. react-native-screens doesn't allow its screens to be rebuilt this way. It throws `IllegalStateException` and the app crashes while starting.

react-native-screens' setup instructions say `MainActivity` must pass `null` to `super.onCreate`, and this app was missing that step. Low-RAM phones kill background apps more often, which is why the crashes concentrate on a few device models.

### Fix

File: `android/app/src/main/java/com/pratham/learning/MainActivity.kt`

```kotlin
import android.os.Bundle

override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(null)
}
```

Effect: after Android kills the app in the background, it starts fresh on the start screen instead of crashing. The app was never meant to restore those screens anyway.

### How to test

1. On a test phone, turn on **Developer options → Don't keep activities**.
2. Open the app, go to any screen, press Home, then reopen the app.
3. Expected: the app reopens normally. Before the fix, it crashed with the trace above.

Or from a computer: open the app, press Home, run `adb shell am kill com.pratham.learning`, then reopen the app.

### Verified

- `./gradlew :app:compileProdReleaseKotlin` passes.
- Not yet tested on a device.

---

## Crash 2: `JavascriptException` with no error message

### Stack trace

```
Exception com.facebook.react.common.JavascriptException:
  at com.facebook.react.modules.core.ExceptionsManagerModule.reportException (ExceptionsManagerModule.java:65)
  at java.lang.reflect.Method.invoke
  at com.facebook.react.bridge.JavaMethodWrapper.invoke (JavaMethodWrapper.java:372)
  at com.facebook.react.bridge.JavaModuleWrapper.invoke (JavaModuleWrapper.java:146)
  at com.facebook.jni.NativeRunnable.run
  at android.os.Handler.handleCallback (Handler.java:959)
  at android.os.Handler.dispatchMessage (Handler.java:100)
  at com.facebook.react.bridge.queue.MessageQueueThreadHandler.dispatchMessage (MessageQueueThreadHandler.java:27)
  at android.os.Looper.loopOnce (Looper.java:232)
  at android.os.Looper.loop (Looper.java:317)
  at com.facebook.react.bridge.queue.MessageQueueThreadImpl$4.run (MessageQueueThreadImpl.java:233)
  at java.lang.Thread.run (Thread.java:1571)
```

### Root cause

**Not yet known.** A `JavascriptException` means an uncaught error in the app's JavaScript code, and React Native closed the app because of it. The trace above only shows React Native reporting the error. The actual error message and JavaScript stack would normally follow `JavascriptException:` on the first line, but Play Console's report leaves them out.

The app also had nothing that recorded crash details:
- no crash reporting tool (Firebase was set up for analytics and messaging only)
- no React error boundary, so any error while drawing a screen closed the whole app

### Fix: top-level error screen, so render errors don't close the app

| File | Change |
|---|---|
| `src/components/ErrorBoundary/AppErrorBoundary.js` | New error boundary. It catches errors thrown while screens draw and shows a "Something went wrong" screen with **Try again** and **Restart app** buttons. |
| `src/App.js` | Wraps the whole app tree, outside every provider, in `<AppErrorBoundary>` |

Design notes:
- The error screen uses only basic React Native components, not the language, theme or navigation providers, so it still shows if one of those is what broke. That's why its text is English only.
- It catches errors while screens draw, the most common source of these crashes. It can't catch errors in button handlers, timers or async code. Those still close the app.

### Next step for crash 2

Play Console doesn't show the JavaScript error message, so the cause can't be found from vitals alone. If this crash grows after 149, add a crash reporter (for example `@react-native-firebase/crashlytics`) to capture the message and stack.

### Verified

- The `assembleProdRelease` build compiled and bundled all the code. The final signing step failed only because the keystore passwords are now blank in `android/gradle.properties`, which is expected.
- A release JavaScript bundle (`react-native bundle --dev false`) builds and contains `AppErrorBoundary`.
- Not yet tested on a device.

---

### Checked and ruled out

The usual suspects for this crash are all guarded already, so there's no code fix to make without the real message:
- Every WebView `onMessage` handler (`StandAlonePlayer`, `LoginScreen`, `ProgramsScreen`, `PlpWebViewScreen`, `ProfileWebViewScreen`) parses inside `try/catch` in an `async` function.
- The `JSON.parse` calls on AsyncStorage data are inside `async` functions. In React Native 0.74 an error there becomes a promise rejection, which doesn't close the app.

---

## Crash 3: `AssertionError` in `ReactInstanceManager.onHostPause`

```
java.lang.AssertionError: Pausing an activity that is not the current activity, this is incorrect!
Current activity: MainActivity Paused activity: MainActivity
```

### Root cause

Two `MainActivity` instances existed at once. This happens when Android recreates the activity from saved state, the same situation as crash 1.

### Fix

- Crash 1's fix stops the restore.
- `AndroidManifest.xml` already has what React Native needs on `MainActivity`: `launchMode="singleTask"`, `taskAffinity=""` and the default `configChanges`. No change needed.

---

## ANRs 4–9 ("Input dispatching timed out")

Each one affected a single user.

| Stack top | Cause | Action |
|---|---|---|
| `ScreenFragment.<init>` | Same restore bug as crash 1 | Fixed by crash 1 |
| `MessageQueue.nativePollOnce` | Main thread was idle; the real block was elsewhere | Monitor after 149 |
| `J.N.VJO`, `J.N.VJ`, `J.N.VOO` | Inside Chromium (WebView) on the device | Monitor; this depends on the device's WebView version |
| `PhoneWindow.getDecorView`, `Canvas.translate` | Slow drawing on the main thread | Monitor; Hermes is already on (`hermesEnabled=true`) |
| `com.miui.misight.MiSight.<clinit>` | Xiaomi system code | Ignore |
| `libGLESv2_adreno.so` SIGSEGV | Qualcomm GPU driver | Ignore unless it grows |

Revisit these only if they grow after 149 ships.

---

## Before releasing version 149

- [x] **Version:** `android/app/build.gradle` has `versionCode 149` and `versionName "0.0.149"`.
- [ ] **Target SDK 36** (PS-7632): `compileSdkVersion` and `targetSdkVersion` are 36, `buildToolsVersion` is 36.1.0, and `android.suppressUnsupportedCompileSdk=36` is set.
- [ ] **Signing:** provide the keystore passwords through `~/.gradle/gradle.properties` or environment variables. Don't commit them in `android/gradle.properties`.
- [ ] **Test the error screen on a release build:** temporarily add `throw new Error('test')` inside any screen's render. The error screen should show instead of the app closing. Remove the test line afterwards.
- [ ] **Test crash 1:** follow the "Don't keep activities" steps above.
- [ ] **Android 16 QA:** screens drawing under the status and navigation bars, tablet layouts, back-gesture navigation, and a regression pass on the main flows.
- [ ] **Rollout:** release 149 as a staged rollout (10–20%). Watch Play Console → Crashes and ANRs filtered to 149 for 48–72 hours. Crash 1 should drop to about zero; then mark it resolved in Play Console and widen the rollout.
