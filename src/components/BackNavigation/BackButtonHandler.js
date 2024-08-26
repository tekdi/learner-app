import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  BackHandler,
  Image,
  TouchableOpacity,
} from 'react-native';
import question from '../../assets/images/png/question.png';
import { useTranslation } from '../../context/LanguageContext';
import globalStyles from '../../utils/Helper/Style';
import { useNavigationState } from '@react-navigation/native';

const BackButtonHandler = ({ exitRoutes }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const routeName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  useEffect(() => {
    const onBackPress = () => {
      if (exitRoutes.includes(routeName)) {
        setModalVisible(true); // Show custom modal
        return true; // Prevent default back action
      }
      return false; // Allow default back action
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [routeName, exitRoutes]);

  const handleExit = () => {
    setModalVisible(false);
    BackHandler.exitApp(); // Exit the app
  };

  const handleCancel = () => {
    setModalVisible(false); // Just close the modal
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.alertBox}>
            <Image source={question} resizeMode="contain" />

            <Text
              style={[
                globalStyles.subHeading,
                { fontWeight: '700', textAlign: 'center', marginVertical: 20 },
              ]}
            >
              {t('are_you_sure_you_want_to_exit_the_app')}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={[globalStyles.subHeading, { color: '#0D599E' }]}>
                {t('no')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleExit}>
              <Text style={[globalStyles.subHeading, { color: '#0D599E' }]}>
                {t('yes')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertBox: {
    padding: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#D0C5B4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackButtonHandler;
