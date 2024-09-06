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

const BackButtonHandler = ({ exitRoute, onCancel, onExit }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (exitRoute) {
      setModalVisible(true);
    }
  }, [exitRoute]);

  return (
    <Modal transparent={true} animationType="fade" visible={modalVisible}>
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
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={[globalStyles.subHeading, { color: '#0D599E' }]}>
                {t('no')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onExit}>
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
