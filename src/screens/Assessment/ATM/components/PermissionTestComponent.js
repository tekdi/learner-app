import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '../../../../context/LanguageContext';
import ImagePermissionHelper from '../utils/ImagePermissionHelper';
import ATMAssessmentStyles from '../styles/ATMAssessmentStyles';

const PermissionTestComponent = () => {
  const { t } = useTranslation();
  const [permissionStatus, setPermissionStatus] = useState(null);

  const testPermissions = async () => {
    try {
      const status = await ImagePermissionHelper.getPermissionStatus();
      setPermissionStatus(status);

      Alert.alert(
        t('Permission Status'),
        `Camera: ${status.camera}\nStorage: ${
          status.storage
        }\nAndroid Version: ${status.androidVersion || 'iOS'}`,
        [{ text: t('OK') }]
      );
    } catch (error) {
      console.error('Permission test error:', error);
      Alert.alert(t('Error'), t('Failed to check permissions'));
    }
  };

  const requestPermissions = async () => {
    try {
      const result = await ImagePermissionHelper.requestAllPermissions();

      Alert.alert(
        t('Permission Request Result'),
        `Camera: ${result.camera ? t('Granted') : t('Denied')}\nStorage: ${
          result.storage ? t('Granted') : t('Denied')
        }`,
        [{ text: t('OK') }]
      );

      // Refresh status after request
      const status = await ImagePermissionHelper.getPermissionStatus();
      setPermissionStatus(status);
    } catch (error) {
      console.error('Permission request error:', error);
      Alert.alert(t('Error'), t('Failed to request permissions'));
    }
  };

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: '#F0F0F0',
        margin: 10,
        borderRadius: 8,
      }}
    >
      <GlobalText
        style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}
      >
        {t('Permission Test Component')}
      </GlobalText>

      <TouchableOpacity
        style={[ATMAssessmentStyles.uploadButton, { marginBottom: 10 }]}
        onPress={testPermissions}
      >
        <GlobalText style={ATMAssessmentStyles.uploadButtonText}>
          {t('Check Permissions')}
        </GlobalText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          ATMAssessmentStyles.uploadButton,
          { backgroundColor: '#6B7280' },
        ]}
        onPress={requestPermissions}
      >
        <GlobalText style={ATMAssessmentStyles.uploadButtonText}>
          {t('Request Permissions')}
        </GlobalText>
      </TouchableOpacity>

      {permissionStatus && (
        <View
          style={{
            marginTop: 10,
            padding: 10,
            backgroundColor: '#FFFFFF',
            borderRadius: 4,
          }}
        >
          <GlobalText style={{ fontSize: 12 }}>
            Camera: {permissionStatus.camera}
          </GlobalText>
          <GlobalText style={{ fontSize: 12 }}>
            Storage: {permissionStatus.storage}
          </GlobalText>
          {permissionStatus.androidVersion && (
            <GlobalText style={{ fontSize: 12 }}>
              Android Version: {permissionStatus.androidVersion}
            </GlobalText>
          )}
        </View>
      )}
    </View>
  );
};

export default PermissionTestComponent;
