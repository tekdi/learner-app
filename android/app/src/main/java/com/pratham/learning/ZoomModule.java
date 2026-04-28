package com.pratham.learning;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.pratham.learning.BuildConfig;

import us.zoom.sdk.JoinMeetingOptions;
import us.zoom.sdk.JoinMeetingParams;
import us.zoom.sdk.MeetingService;
import us.zoom.sdk.MeetingStatus;
import us.zoom.sdk.ZoomError;
import us.zoom.sdk.ZoomSDK;
import us.zoom.sdk.ZoomSDKInitParams;
import us.zoom.sdk.ZoomSDKInitializeListener;

/**
 * ZoomModule - Native module to integrate Zoom Meeting SDK 6.6.0 with React Native
 * 
 * IMPORTANT NOTES FOR ZOOM SDK 6.6.0+:
 * 1. This version uses JWT TOKEN authentication instead of App Key/Secret
 * 2. Generate JWT token from: https://marketplace.zoom.us/ -> Your App -> App Credentials -> Generate Token
 * 3. JWT tokens are temporary and expire (typically after a few hours/days based on your config)
 * 4. For production, you should implement a server-side JWT token generator
 * 
 * How to get JWT Token:
 * - Go to https://marketplace.zoom.us/
 * - Navigate to your Meeting SDK app
 * - Go to "App Credentials" tab
 * - Click "Generate JWT" button
 * - Copy the generated token and replace JWT_TOKEN below
 * 
 * Alternative: Use Server-Side Token Generation (Recommended for Production):
 * - Create an API endpoint on your server that generates JWT tokens
 * - Call that endpoint from your React Native app to get a fresh token
 * - Pass the token to the initialize() method
 * 
 * Minimum Android SDK version required: 28 (Android 9.0)
 * 
 * Required permissions in AndroidManifest.xml:
 * - CAMERA
 * - RECORD_AUDIO  
 * - READ_PHONE_STATE
 * - INTERNET
 * - ACCESS_NETWORK_STATE
 * - ACCESS_WIFI_STATE
 * - BLUETOOTH
 * - BLUETOOTH_CONNECT
 * - MODIFY_AUDIO_SETTINGS
 */
public class ZoomModule extends ReactContextBaseJavaModule {
    private static final String TAG = "ZoomModule";
    private ReactApplicationContext reactContext;
    private boolean isInitialized = false;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    // JWT Token and Domain from environment variables (.env.dev or .env.uat)
    // These are injected at build time by react-native-config
    // To update: 
    //   1. Update ZOOM_JWT_TOKEN in .env.dev or .env.uat
    //   2. Or run: node generate-zoom-jwt.js to generate new token
    //   3. Rebuild the app
    private static final String JWT_TOKEN = BuildConfig.ZOOM_JWT_TOKEN;
    private static final String ZOOM_DOMAIN = BuildConfig.ZOOM_DOMAIN;

    public ZoomModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "ZoomModule";
    }

    /**
     * Initialize the Zoom SDK with JWT token
     * This method must be called before joining any meeting
     * IMPORTANT: All Zoom SDK operations must run on the main UI thread
     * 
     * @param promise Promise to resolve/reject based on initialization result
     */
    @ReactMethod
    public void initialize(final Promise promise) {
        // Run on main thread using Handler - Zoom SDK MUST be initialized on main thread
        mainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    Log.d(TAG, "Starting Zoom SDK 6.6.0 initialization on main thread...");
                    Log.d(TAG, "Current thread: " + Thread.currentThread().getName());

                    // Check if SDK is already initialized
                    ZoomSDK sdk = ZoomSDK.getInstance();
                    if (sdk.isInitialized()) {
                        Log.d(TAG, "Zoom SDK already initialized");
                        isInitialized = true;
                        promise.resolve("Zoom SDK already initialized");
                        return;
                    }

                    // Validate JWT token
                    if (JWT_TOKEN == null || JWT_TOKEN.equals("YOUR_JWT_TOKEN_HERE") || JWT_TOKEN.trim().isEmpty()) {
                        String error = "Invalid JWT token. Please replace YOUR_JWT_TOKEN_HERE in ZoomModule.java with your actual JWT token from https://marketplace.zoom.us/";
                        Log.e(TAG, error);
                        promise.reject("INVALID_JWT_TOKEN", error);
                        return;
                    }

                    // Initialize SDK parameters for version 6.6.0+
                    ZoomSDKInitParams initParams = new ZoomSDKInitParams();
                    initParams.jwtToken = JWT_TOKEN;
                    initParams.domain = ZOOM_DOMAIN;
                    initParams.enableLog = true; // Enable logging for debugging
                    initParams.logSize = 5; // Log file size in MB
                    initParams.enableGenerateDump = true;

                    // Initialize the SDK
                    sdk.initialize(reactContext, new ZoomSDKInitializeListener() {
                        @Override
                        public void onZoomSDKInitializeResult(int errorCode, int internalErrorCode) {
                            // ZoomError.ZOOM_ERROR_SUCCESS is the new success constant
                            if (errorCode == ZoomError.ZOOM_ERROR_SUCCESS) {
                                Log.d(TAG, "Zoom SDK initialized successfully");
                                isInitialized = true;
                                promise.resolve("Zoom SDK initialized successfully");
                            } else {
                                String error = "Failed to initialize Zoom SDK. Error code: " + errorCode + ", Internal error: " + internalErrorCode;
                                Log.e(TAG, error);
                                isInitialized = false;
                                promise.reject("INITIALIZATION_FAILED", error);
                            }
                        }

                        @Override
                        public void onZoomAuthIdentityExpired() {
                            Log.w(TAG, "Zoom auth identity expired - JWT token needs refresh");
                            isInitialized = false;
                        }
                    }, initParams);

                } catch (Exception e) {
                    Log.e(TAG, "Exception during Zoom SDK initialization: " + e.getMessage(), e);
                    promise.reject("INITIALIZATION_ERROR", "Exception: " + e.getMessage(), e);
                }
            }
        });
    }

    /**
     * Join a Zoom meeting with the given meeting number and password
     * 
     * @param meetingNumber The Zoom meeting number (9-11 digits)
     * @param password The meeting password (if required)
     * @param displayName The name to display in the meeting
     * @param promise Promise to resolve/reject based on join result
     */
    @ReactMethod
    public void joinMeeting(final String meetingNumber, final String password, final String displayName, final Promise promise) {
        // Validate parameters first (can be done on any thread)
        if (meetingNumber == null || meetingNumber.trim().isEmpty()) {
            promise.reject("INVALID_MEETING_NUMBER", "Meeting number cannot be empty");
            return;
        }

        // Check our local initialization flag
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "Zoom SDK is not initialized. Call initialize() first.");
            return;
        }

        // ALL ZOOM SDK CALLS MUST BE ON MAIN THREAD
        mainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    Log.d(TAG, "Attempting to join meeting on main thread: " + meetingNumber);
                    Log.d(TAG, "Current thread: " + Thread.currentThread().getName());

                    // Get the Zoom SDK instance (must be on main thread)
                    ZoomSDK zoomSDK = ZoomSDK.getInstance();
                    if (!zoomSDK.isInitialized()) {
                        promise.reject("NOT_INITIALIZED", "Zoom SDK is not initialized properly");
                        return;
                    }

                    // Get meeting service (must be on main thread)
                    MeetingService meetingService = zoomSDK.getMeetingService();
                    if (meetingService == null) {
                        promise.reject("SERVICE_ERROR", "Failed to get Zoom meeting service");
                        return;
                    }

                    // Check if already in a meeting (must be on main thread)
                    MeetingStatus meetingStatus = meetingService.getMeetingStatus();
                    if (meetingStatus != MeetingStatus.MEETING_STATUS_IDLE) {
                        Log.w(TAG, "Already in a meeting or connecting. Status: " + meetingStatus);
                        promise.reject("ALREADY_IN_MEETING", "Already in a meeting or connecting");
                        return;
                    }

                    // Set up meeting options
                    JoinMeetingOptions options = new JoinMeetingOptions();
                    options.no_driving_mode = true;
                    options.no_invite = true;
                    options.no_meeting_end_message = true;
                    options.no_titlebar = false;
                    options.no_bottom_toolbar = false;
                    options.no_dial_in_via_phone = true;
                    options.no_dial_out_to_phone = true;
                    options.no_disconnect_audio = true;
                    options.no_share = true;
                    options.invite_options = 0; // Changed from boolean to int
                    options.no_audio = false;
                    options.no_video = false;
                    options.meeting_views_options = 0;
                    options.no_meeting_error_message = false;

                    // Set up meeting parameters
                    JoinMeetingParams params = new JoinMeetingParams();
                    params.meetingNo = meetingNumber.trim();
                    params.password = (password != null && !password.trim().isEmpty()) ? password.trim() : "";
                    params.displayName = (displayName != null && !displayName.trim().isEmpty()) ? displayName.trim() : "Guest User";

                    // Join the meeting
                    int result = meetingService.joinMeetingWithParams(reactContext, params, options);

                    // In SDK 6.6.0+, success code might be different
                    // Check for ZOOM_ERROR_SUCCESS (0) or specific meeting error codes
                    if (result == ZoomError.ZOOM_ERROR_SUCCESS) {
                        Log.d(TAG, "Successfully initiated join meeting request");
                        promise.resolve("Meeting join initiated successfully");
                    } else {
                        String error = "Failed to join meeting. Error code: " + result;
                        Log.e(TAG, error);
                        promise.reject("JOIN_FAILED", error);
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Exception while joining meeting: " + e.getMessage(), e);
                    promise.reject("JOIN_ERROR", "Exception: " + e.getMessage(), e);
                }
            }
        });
    }

    /**
     * Leave the current meeting
     * 
     * @param promise Promise to resolve/reject based on leave result
     */
    @ReactMethod
    public void leaveMeeting(final Promise promise) {
        // Run on main thread using Handler
        mainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    Log.d(TAG, "Attempting to leave meeting");

                    ZoomSDK zoomSDK = ZoomSDK.getInstance();
                    if (!zoomSDK.isInitialized()) {
                        promise.reject("NOT_INITIALIZED", "Zoom SDK is not initialized");
                        return;
                    }

                    MeetingService meetingService = zoomSDK.getMeetingService();
                    if (meetingService == null) {
                        promise.reject("SERVICE_ERROR", "Failed to get meeting service");
                        return;
                    }

                    MeetingStatus meetingStatus = meetingService.getMeetingStatus();
                    if (meetingStatus == MeetingStatus.MEETING_STATUS_IDLE) {
                        promise.resolve("Not in a meeting");
                        return;
                    }

                    meetingService.leaveCurrentMeeting(false);
                    Log.d(TAG, "Left meeting successfully");
                    promise.resolve("Left meeting successfully");

                } catch (Exception e) {
                    Log.e(TAG, "Exception while leaving meeting: " + e.getMessage(), e);
                    promise.reject("LEAVE_ERROR", "Exception: " + e.getMessage(), e);
                }
            }
        });
    }

    /**
     * Check if currently in a meeting
     * 
     * @param promise Promise that resolves with boolean indicating meeting status
     */
    @ReactMethod
    public void isInMeeting(final Promise promise) {
        // Run on main thread using Handler
        mainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    ZoomSDK zoomSDK = ZoomSDK.getInstance();
                    if (!zoomSDK.isInitialized()) {
                        promise.resolve(false);
                        return;
                    }

                    MeetingService meetingService = zoomSDK.getMeetingService();
                    if (meetingService == null) {
                        promise.resolve(false);
                        return;
                    }

                    MeetingStatus meetingStatus = meetingService.getMeetingStatus();
                    boolean inMeeting = meetingStatus != MeetingStatus.MEETING_STATUS_IDLE;
                    promise.resolve(inMeeting);

                } catch (Exception e) {
                    Log.e(TAG, "Exception in isInMeeting: " + e.getMessage(), e);
                    promise.resolve(false);
                }
            }
        });
    }
}
