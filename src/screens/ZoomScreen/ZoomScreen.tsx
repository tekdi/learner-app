import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Linking,
} from 'react-native';
import { request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';
import ZoomWebView from '../../components/ZoomWebView/ZoomWebView';

interface ZoomScreenProps {
  navigation?: any;
  route?: any;
}

const ZoomScreen: React.FC<ZoomScreenProps> = ({ navigation, route }) => {
  const [meetingUrl, setMeetingUrl] = useState<string>(
    route?.params?.meetingUrl || 'https://zoom.us/test'
  );
  const [isInMeeting, setIsInMeeting] = useState<boolean>(false);
  const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);
  const [useDesktopUA, setUseDesktopUA] = useState<boolean>(true);

  // Sample Zoom URLs for testing
  const sampleUrls = {
    test: 'https://zoom.us/test',
    webSDK: 'https://zoom.us/wc/join/YOUR_MEETING_ID',
    direct: 'https://zoom.us/j/1234567890?pwd=sample',
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  // Check and request permissions for camera and microphone
  const checkPermissions = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        await checkAndroidPermissions();
      } else if (Platform.OS === 'ios') {
        await checkiOSPermissions();
      }
    } catch (error) {
      console.error('Permission check error:', error);
      Alert.alert('Permission Error', 'Failed to check permissions. Some features may not work.');
    }
  }, []);

  // Check Android permissions
  const checkAndroidPermissions = async () => {
    try {
      // Check current permissions
      const cameraPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      const microphonePermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );

      if (cameraPermission && microphonePermission) {
        setPermissionsGranted(true);
        return;
      }

      // Request permissions
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      const cameraGranted = results[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
      const micGranted = results[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
      const cameraDenied = results[PermissionsAndroid.PERMISSIONS.CAMERA] === 'never_ask_again';
      const micDenied = results[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'never_ask_again';

      if (cameraGranted && micGranted) {
        setPermissionsGranted(true);
        Alert.alert('Permissions Granted', 'Camera and microphone permissions granted successfully!');
      } else {
        // Check if permissions were permanently denied
        if (cameraDenied || micDenied) {
          Alert.alert(
            'Permissions Required',
            'Camera and microphone permissions are required for Zoom meetings. Please enable them in your device Settings > Apps > Learner App > Permissions.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Open Settings', 
                onPress: () => {
                  if (Platform.OS === 'android') {
                    Linking.openSettings();
                  }
                }
              },
            ]
          );
        } else {
          Alert.alert(
            'Permissions Required',
            'Camera and microphone permissions are required for Zoom meetings. Please grant them when prompted.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Retry', onPress: checkAndroidPermissions },
            ]
          );
        }
      }
    } catch (error) {
      console.error('Android permission error:', error);
      Alert.alert('Permission Error', 'Failed to request permissions. Please try again or enable them manually in Settings.');
    }
  };

  // Check iOS permissions
  const checkiOSPermissions = async () => {
    try {
      const cameraResult = await request(PERMISSIONS.IOS.CAMERA);
      const microphoneResult = await request(PERMISSIONS.IOS.MICROPHONE);

      if (cameraResult === RESULTS.GRANTED && microphoneResult === RESULTS.GRANTED) {
        setPermissionsGranted(true);
        Alert.alert('Permissions Granted', 'Camera and microphone permissions granted successfully!');
      } else if (cameraResult === RESULTS.DENIED || microphoneResult === RESULTS.DENIED) {
        Alert.alert(
          'Permissions Required',
          'Camera and microphone permissions are required for Zoom meetings. Please grant them when prompted.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Retry', onPress: checkiOSPermissions },
          ]
        );
      } else if (cameraResult === RESULTS.BLOCKED || microphoneResult === RESULTS.BLOCKED) {
        Alert.alert(
          'Permissions Blocked',
          'Camera and microphone permissions are blocked. Please enable them in Settings > Privacy > Camera/Microphone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openSettings();
                }
              }
            },
          ]
        );
      }
    } catch (error) {
      console.error('iOS permission error:', error);
      Alert.alert('Permission Error', 'Failed to request permissions. Please try again or enable them manually in Settings.');
    }
  };

  // Start Zoom meeting
  const startMeeting = useCallback(() => {
    if (!meetingUrl.trim()) {
      Alert.alert('Invalid URL', 'Please enter a valid Zoom meeting URL.');
      return;
    }

    if (!permissionsGranted) {
      Alert.alert(
        'Permissions Required',
        'Please grant camera and microphone permissions before joining the meeting.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permissions', onPress: checkPermissions },
        ]
      );
      return;
    }

    setIsInMeeting(true);
  }, [meetingUrl, permissionsGranted, checkPermissions]);

  // Leave meeting
  const leaveMeeting = useCallback(() => {
    Alert.alert(
      'Leave Meeting',
      'Are you sure you want to leave the Zoom meeting?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', onPress: () => setIsInMeeting(false), style: 'destructive' },
      ]
    );
  }, []);

  // Handle WebView errors
  const handleWebViewError = useCallback((error: any) => {
    console.error('Zoom WebView error:', error);
    Alert.alert(
      'Meeting Error',
      'Failed to load the Zoom meeting. Please check your internet connection and try again.',
      [
        { text: 'OK' },
        { text: 'Retry', onPress: () => setIsInMeeting(false) },
      ]
    );
  }, []);

  // Set sample URL
  const setSampleUrl = useCallback((key: keyof typeof sampleUrls) => {
    setMeetingUrl(sampleUrls[key]);
  }, []);

  // If in meeting, show WebView
  if (isInMeeting) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1f1f1f" />
        
        {/* Meeting Header */}
        <View style={styles.meetingHeader}>
          <Text style={styles.meetingHeaderText} numberOfLines={1}>
            Zoom Meeting
          </Text>
          <TouchableOpacity style={styles.leaveButton} onPress={leaveMeeting}>
            <Text style={styles.leaveButtonText}>Leave</Text>
          </TouchableOpacity>
        </View>

        {/* Zoom WebView */}
        <ZoomWebView
          uri={meetingUrl}
          useDesktopUserAgent={useDesktopUA}
          onError={handleWebViewError}
          onLoadStart={() => console.log('Zoom WebView loading started')}
          onLoadEnd={() => console.log('Zoom WebView loading completed')}
          style={styles.webView}
        />
      </SafeAreaView>
    );
  }

  // Show meeting setup screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Join Zoom Meeting</Text>
          <Text style={styles.subtitle}>
            Enter a Zoom meeting URL to join via WebView
          </Text>
        </View>

        {/* Permissions Status */}
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Permissions Status</Text>
          <View style={styles.permissionRow}>
            <Text style={styles.permissionLabel}>Camera & Microphone:</Text>
            <Text style={[
              styles.permissionStatus,
              { color: permissionsGranted ? '#4CAF50' : '#F44336' }
            ]}>
              {permissionsGranted ? 'Granted' : 'Not Granted'}
            </Text>
          </View>
          {!permissionsGranted && (
            <TouchableOpacity style={styles.permissionButton} onPress={checkPermissions}>
              <Text style={styles.permissionButtonText}>Request Permissions</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sample URLs */}
        <View style={styles.sampleContainer}>
          <Text style={styles.sampleTitle}>Sample URLs</Text>
          {Object.entries(sampleUrls).map(([key, url]) => (
            <TouchableOpacity
              key={key}
              style={styles.sampleButton}
              onPress={() => setSampleUrl(key as keyof typeof sampleUrls)}
            >
              <Text style={styles.sampleButtonText}>
                {key === 'test' && 'Zoom Test Page'}
                {key === 'webSDK' && 'Web SDK Join (Template)'}
                {key === 'direct' && 'Direct Join (Sample)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meeting URL Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Meeting URL</Text>
          <TextInput
            style={styles.textInput}
            value={meetingUrl}
            onChangeText={setMeetingUrl}
            placeholder="https://zoom.us/j/MEETING_ID?pwd=..."
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            multiline
          />
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Settings</Text>
          
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setUseDesktopUA(!useDesktopUA)}
          >
            <Text style={styles.settingLabel}>Use Desktop User Agent</Text>
            <View style={[
              styles.checkbox,
              { backgroundColor: useDesktopUA ? '#0066CC' : '#E0E0E0' }
            ]}>
              {useDesktopUA && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
          
          <Text style={styles.settingDescription}>
            Recommended: Uses desktop browser identification to avoid mobile app redirects
          </Text>
        </View>

        {/* Join Button */}
        <TouchableOpacity
          style={[styles.joinButton, { opacity: meetingUrl.trim() ? 1 : 0.5 }]}
          onPress={startMeeting}
          disabled={!meetingUrl.trim()}
        >
          <Text style={styles.joinButtonText}>Join Meeting</Text>
        </TouchableOpacity>

        {/* Important Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Important Notes</Text>
          <Text style={styles.noteText}>
            • Camera and microphone permissions are required for full meeting functionality
          </Text>
          <Text style={styles.noteText}>
            • External Zoom app redirects will be blocked to keep you in the web version
          </Text>
          <Text style={styles.noteText}>
            • Some advanced Zoom features may not be available in the web version
          </Text>
          <Text style={styles.noteText}>
            • Test on real devices for best camera/microphone experience
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  permissionLabel: {
    fontSize: 16,
    color: '#333',
  },
  permissionStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionButton: {
    backgroundColor: '#0066CC',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sampleContainer: {
    marginBottom: 20,
  },
  sampleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sampleButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  sampleButtonText: {
    color: '#0066CC',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FAFAFA',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  settingsContainer: {
    marginBottom: 30,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  joinButton: {
    backgroundColor: '#0066CC',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 30,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notesContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 12,
  },
  noteText: {
    fontSize: 14,
    color: '#BF360C',
    marginBottom: 8,
    lineHeight: 20,
  },
  // Meeting view styles
  meetingHeader: {
    backgroundColor: '#1f1f1f',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  meetingHeaderText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  leaveButton: {
    backgroundColor: '#F44336',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  leaveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  webView: {
    flex: 1,
  },
});

export default ZoomScreen;
