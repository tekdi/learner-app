/**
 * ZOOM MEETING QUICK START EXAMPLE
 * 
 * This file shows you how to quickly integrate Zoom Meeting into your app.
 * Copy the relevant parts to your actual screen component.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import ZoomMeeting from './src/components/ZoomMeeting';

/**
 * Example 1: Simple Zoom Meeting Screen with Form
 */
const ZoomMeetingScreen = () => {
  const [meetingNumber, setMeetingNumber] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showZoomComponent, setShowZoomComponent] = useState(false);

  useEffect(() => {
    requestZoomPermissions();
  }, []);

  /**
   * Request necessary permissions for Zoom
   */
  const requestZoomPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        ]);

        const allGranted =
          grants['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_PHONE_STATE'] === PermissionsAndroid.RESULTS.GRANTED;

        setPermissionsGranted(allGranted);

        if (!allGranted) {
          Alert.alert(
            'Permissions Required',
            'Camera, Microphone, and Phone State permissions are required for Zoom meetings.',
            [{ text: 'OK' }]
          );
        }
      } catch (err) {
        console.warn('Permission request error:', err);
      }
    } else {
      setPermissionsGranted(true);
    }
  };

  /**
   * Handle join meeting button press
   */
  const handleJoinPress = () => {
    if (!meetingNumber.trim()) {
      Alert.alert('Error', 'Please enter a meeting number');
      return;
    }

    if (!permissionsGranted) {
      Alert.alert('Error', 'Permissions not granted. Please grant permissions and try again.');
      return;
    }

    setShowZoomComponent(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Zoom Meeting</Text>
        <Text style={styles.headerSubtitle}>Enter meeting details to join</Text>
      </View>

      {!showZoomComponent ? (
        <View style={styles.formContainer}>
          {/* Meeting Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Meeting Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 9-11 digit meeting number"
              value={meetingNumber}
              onChangeText={setMeetingNumber}
              keyboardType="numeric"
              maxLength={11}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Meeting Password (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter meeting password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Display Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your display name"
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>

          {/* Permissions Status */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Permissions Status:</Text>
            <Text style={[styles.statusValue, permissionsGranted ? styles.statusGranted : styles.statusDenied]}>
              {permissionsGranted ? '✓ Granted' : '✗ Not Granted'}
            </Text>
          </View>

          {/* Join Button */}
          <TouchableOpacity 
            style={[styles.joinButton, !permissionsGranted && styles.joinButtonDisabled]} 
            onPress={handleJoinPress}
            disabled={!permissionsGranted}
          >
            <Text style={styles.joinButtonText}>Join Meeting</Text>
          </TouchableOpacity>

          {/* Request Permissions Again Button */}
          {!permissionsGranted && (
            <TouchableOpacity 
              style={styles.permissionButton} 
              onPress={requestZoomPermissions}
            >
              <Text style={styles.permissionButtonText}>Request Permissions</Text>
            </TouchableOpacity>
          )}

          {/* Quick Test Buttons */}
          <View style={styles.testButtonsContainer}>
            <Text style={styles.testLabel}>Quick Test:</Text>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => {
                setMeetingNumber('123456789');
                setPassword('test123');
                setDisplayName('Test User');
              }}
            >
              <Text style={styles.testButtonText}>Fill Test Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.zoomContainer}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowZoomComponent(false)}
          >
            <Text style={styles.backButtonText}>← Back to Form</Text>
          </TouchableOpacity>

          {/* Zoom Component */}
          <ZoomMeeting
            meetingNumber={meetingNumber}
            password={password}
            displayName={displayName || 'Guest User'}
            onMeetingJoined={() => {
              console.log('Meeting joined successfully!');
              Alert.alert('Success', 'Joining meeting...');
            }}
            onMeetingError={(error) => {
              console.error('Meeting error:', error);
              Alert.alert('Error', `Failed to join meeting: ${error}`);
            }}
          />
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>📋 Instructions:</Text>
        <Text style={styles.instructionText}>1. Make sure you have Zoom SDK credentials configured in ZoomModule.java</Text>
        <Text style={styles.instructionText}>2. Grant camera and microphone permissions</Text>
        <Text style={styles.instructionText}>3. Enter a valid Zoom meeting number</Text>
        <Text style={styles.instructionText}>4. Enter password if meeting requires one</Text>
        <Text style={styles.instructionText}>5. Tap "Join Meeting" to start</Text>
      </View>
    </ScrollView>
  );
};

/**
 * Example 2: Auto-Join Meeting (simpler use case)
 * 
 * Use this when you already have meeting details and want to join automatically
 */
const AutoJoinZoomScreen = ({ route }) => {
  // Get meeting details from navigation params
  const { meetingNumber, password, userName } = route.params;

  return (
    <View style={styles.container}>
      <ZoomMeeting
        meetingNumber={meetingNumber}
        password={password}
        displayName={userName}
        autoJoin={true} // Automatically join when component mounts
        onMeetingJoined={() => {
          console.log('Auto-joined meeting successfully');
        }}
        onMeetingError={(error) => {
          console.error('Auto-join failed:', error);
          Alert.alert('Error', 'Failed to join meeting automatically');
        }}
      />
    </View>
  );
};

/**
 * Example 3: Using Native Module Directly (Advanced)
 * 
 * If you want more control, you can use the native module directly
 */
const DirectNativeModuleExample = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeZoom();
  }, []);

  const initializeZoom = async () => {
    const { ZoomModule } = require('react-native').NativeModules;
    
    try {
      const result = await ZoomModule.initialize();
      console.log('Zoom initialized:', result);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize Zoom:', error);
      Alert.alert('Error', 'Failed to initialize Zoom SDK');
    }
  };

  const joinMeeting = async (meetingNumber, password, displayName) => {
    const { ZoomModule } = require('react-native').NativeModules;

    if (!isInitialized) {
      Alert.alert('Error', 'Zoom SDK not initialized yet');
      return;
    }

    try {
      const result = await ZoomModule.joinMeeting(
        meetingNumber,
        password,
        displayName
      );
      console.log('Joined meeting:', result);
    } catch (error) {
      console.error('Failed to join meeting:', error);
      Alert.alert('Error', `Failed to join: ${error.message}`);
    }
  };

  const leaveMeeting = async () => {
    const { ZoomModule } = require('react-native').NativeModules;

    try {
      const result = await ZoomModule.leaveMeeting();
      console.log('Left meeting:', result);
    } catch (error) {
      console.error('Failed to leave meeting:', error);
    }
  };

  const checkMeetingStatus = async () => {
    const { ZoomModule } = require('react-native').NativeModules;

    try {
      const inMeeting = await ZoomModule.isInMeeting();
      Alert.alert('Status', inMeeting ? 'In a meeting' : 'Not in a meeting');
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Direct Native Module Usage</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => joinMeeting('123456789', 'password', 'John Doe')}
      >
        <Text style={styles.buttonText}>Join Meeting</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={leaveMeeting}>
        <Text style={styles.buttonText}>Leave Meeting</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={checkMeetingStatus}>
        <Text style={styles.buttonText}>Check Status</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D8CFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusGranted: {
    color: '#4CAF50',
  },
  statusDenied: {
    color: '#F44336',
  },
  joinButton: {
    backgroundColor: '#2D8CFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  joinButtonDisabled: {
    backgroundColor: '#ccc',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  permissionButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  testButtonsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  testLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  zoomContainer: {
    flex: 1,
  },
  backButton: {
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 6,
    lineHeight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#2D8CFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

// Export the examples
export { ZoomMeetingScreen, AutoJoinZoomScreen, DirectNativeModuleExample };

// Default export
export default ZoomMeetingScreen;

