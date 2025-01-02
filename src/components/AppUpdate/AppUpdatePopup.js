import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { checkVersion } from 'react-native-check-version';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { useTranslation } from '../../context/LanguageContext';
import GlobalText from '@components/GlobalText/GlobalText';
import globalStyles from '../../utils/Helper/Style';

const AppUpdatePopup = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const version = await checkVersion();
        console.log('hi', version);

        setLatestVersion(version?.version);
        if (version.needsUpdate) {
          setIsUpdateAvailable(true);
        } else {
          console.log('out');
        }
      } catch (error) {
        console.error('Error checking app version: ', error);
      }
    };

    checkForUpdate();
  }, []);

  const handleUpdate = async () => {
    const version = await checkVersion();
    const storeUrl = Platform.OS === 'ios' ? version.url : version.url;

    Linking.openURL(storeUrl).catch((err) =>
      console.error('Failed to open store URL: ', err)
    );
  };

  return (
    <Modal transparent={true} visible={isUpdateAvailable} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <GlobalText style={styles.title}>Update Available</GlobalText>
          <GlobalText
            style={[
              globalStyles.text,
              { textAlign: 'center', marginVertical: 5 },
            ]}
          >
            A new version of the app ({latestVersion}) is available. Please
            update to enjoy the latest features.
          </GlobalText>

          <PrimaryButton onPress={handleUpdate} text={t('update_now')} />

          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsUpdateAvailable(false)}
          >
            <GlobalText style={[styles.buttonText, globalStyles.text]}>
              {t('not_now')}
            </GlobalText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  button: {
    width: '100%',
  },
  buttonText: {
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default AppUpdatePopup;
