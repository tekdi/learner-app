import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, NativeModules, Platform } from 'react-native';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

// Import the native Zoom module
const { ZoomModule } = NativeModules;

/**
 * ZoomMeeting Component
 * 
 * A React Native component to integrate Zoom Meeting SDK
 * 
 * Props:
 * @param {string} meetingNumber - The Zoom meeting number (required)
 * @param {string} password - The meeting password (optional)
 * @param {string} displayName - Name to display in the meeting (optional, defaults to "Guest User")
 * @param {boolean} autoJoin - If true, automatically joins meeting on mount (default: false)
 * @param {function} onMeetingJoined - Callback when meeting is successfully joined
 * @param {function} onMeetingError - Callback when there's an error
 * 
 * Example Usage:
 * 
 * <ZoomMeeting 
 *   meetingNumber="123456789" 
 *   password="myPassword123"
 *   displayName="John Doe"
 *   autoJoin={false}
 *   onMeetingJoined={() => console.log('Meeting joined!')}
 *   onMeetingError={(error) => console.log('Error:', error)}
 * />
 */
const ZoomMeeting = ({
  meetingNumber,
  password = '',
  displayName = 'Guest User',
  autoJoin = false,
  onMeetingJoined,
  onMeetingError,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Initialize Zoom SDK when component mounts
    initializeZoomSDK();
  }, []);

  useEffect(() => {
    // Auto-join meeting if enabled and SDK is initialized
    if (autoJoin && isInitialized && meetingNumber) {
      handleJoinMeeting();
    }
  }, [autoJoin, isInitialized, meetingNumber]);

  /**
   * Initialize the Zoom SDK
   */
  const initializeZoomSDK = async () => {
    try {
      if (Platform.OS !== 'android') {
        const error = 'Zoom SDK is currently only supported on Android in this implementation';
        setErrorMessage(error);
        if (onMeetingError) onMeetingError(error);
        return;
      }

      if (!ZoomModule) {
        const error = 'Zoom Module is not available. Make sure native module is properly linked.';
        setErrorMessage(error);
        if (onMeetingError) onMeetingError(error);
        return;
      }

      setIsLoading(true);
      console.log('Initializing Zoom SDK...');
      
      const result = await ZoomModule.initialize();
      console.log('Zoom SDK initialized:', result);
      
      setIsInitialized(true);
      setErrorMessage('');
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize Zoom SDK:', error);
      const errorMsg = error.message || 'Failed to initialize Zoom SDK';
      setErrorMessage(errorMsg);
      setIsInitialized(false);
      setIsLoading(false);
      
      if (onMeetingError) onMeetingError(errorMsg);
      
      // Show user-friendly error
      Alert.alert(
        'Initialization Error',
        'Failed to initialize Zoom SDK. Please check your configuration and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  /**
   * Join a Zoom meeting
   */
  const handleJoinMeeting = async () => {
    try {
      if (!isInitialized) {
        Alert.alert(
          'Not Ready',
          'Zoom SDK is still initializing. Please wait...',
          [{ text: 'OK' }]
        );
        return;
      }

      if (!meetingNumber || meetingNumber.trim() === '') {
        Alert.alert(
          'Invalid Meeting Number',
          'Please provide a valid meeting number',
          [{ text: 'OK' }]
        );
        return;
      }

      setIsLoading(true);
      console.log(`Joining meeting: ${meetingNumber}`);
      
      const result = await ZoomModule.joinMeeting(
        meetingNumber.trim(),
        password.trim(),
        displayName.trim()
      );
      
      console.log('Meeting join result:', result);
      setIsLoading(false);
      
      if (onMeetingJoined) {
        onMeetingJoined();
      }
      
      // Optionally show success message
      // Alert.alert('Success', 'Joining meeting...', [{ text: 'OK' }]);
    } catch (error) {
      console.error('Failed to join meeting:', error);
      const errorMsg = error.message || 'Failed to join meeting';
      setErrorMessage(errorMsg);
      setIsLoading(false);
      
      if (onMeetingError) onMeetingError(errorMsg);
      
      // Show user-friendly error
      Alert.alert(
        'Meeting Error',
        `Unable to join the meeting. ${errorMsg}`,
        [
          {
            text: 'Retry',
            onPress: () => handleJoinMeeting(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  /**
   * Leave the current meeting
   */
  const handleLeaveMeeting = async () => {
    try {
      if (!ZoomModule) {
        console.warn('Zoom Module not available');
        return;
      }

      const result = await ZoomModule.leaveMeeting();
      console.log('Left meeting:', result);
      
      Alert.alert('Left Meeting', 'You have left the meeting successfully.', [
        { text: 'OK' },
      ]);
    } catch (error) {
      console.error('Failed to leave meeting:', error);
      Alert.alert(
        'Error',
        'Failed to leave meeting',
        [{ text: 'OK' }]
      );
    }
  };

  /**
   * Check if currently in a meeting
   */
  const checkMeetingStatus = async () => {
    try {
      if (!ZoomModule) return;

      const inMeeting = await ZoomModule.isInMeeting();
      Alert.alert(
        'Meeting Status',
        inMeeting ? 'You are currently in a meeting' : 'You are not in a meeting',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to check meeting status:', error);
    }
  };

  // Don't render anything if autoJoin is true (meeting will open automatically)
  if (autoJoin && isInitialized) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Zoom Meeting</Text>
      
      {/* Meeting Info */}
      {meetingNumber && (
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Meeting Number:</Text>
          <Text style={styles.value}>{meetingNumber}</Text>
          
          {password && (
            <>
              <Text style={styles.label}>Password:</Text>
              <Text style={styles.value}>{password}</Text>
            </>
          )}
          
          <Text style={styles.label}>Display Name:</Text>
          <Text style={styles.value}>{displayName}</Text>
        </View>
      )}

      {/* Error Message */}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Status */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingText}>
            {isInitialized ? 'Joining meeting...' : 'Initializing Zoom SDK...'}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      {!isLoading && (
        <View style={styles.buttonContainer}>
          {!isInitialized ? (
            <PrimaryButton
              title="Initialize Zoom"
              onPress={initializeZoomSDK}
              disabled={isLoading}
            />
          ) : (
            <>
              <PrimaryButton
                title="Join Meeting"
                onPress={handleJoinMeeting}
                disabled={isLoading || !meetingNumber}
              />
              
              <View style={styles.buttonSpacer} />
              
              <PrimaryButton
                title="Leave Meeting"
                onPress={handleLeaveMeeting}
                disabled={isLoading}
              />
              
              <View style={styles.buttonSpacer} />
              
              <PrimaryButton
                title="Check Status"
                onPress={checkMeetingStatus}
                disabled={isLoading}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
    marginBottom: 5,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 10,
  },
  buttonSpacer: {
    height: 12,
  },
});

export default ZoomMeeting;

