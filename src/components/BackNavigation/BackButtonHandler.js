import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import question from '../../assets/images/png/question.png';
import { useTranslation } from '../../context/LanguageContext';
import globalStyles from '../../utils/Helper/Style';
import PropTypes from 'prop-types';

const BackButtonHandler = ({
  exitRoute,
  onCancel,
  onExit,
  logout,
  content_delete,
}) => {
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
              allowFontScaling={false}
              style={[
                globalStyles.subHeading,
                { fontWeight: '700', textAlign: 'center', marginVertical: 20 },
              ]}
            >
              {logout
                ? t('are_you_sure_you_want_to_logout_the_app')
                : content_delete
                  ? t('content_delete')
                  : t('are_you_sure_you_want_to_exit_the_app')}
            </Text>
            {content_delete && (
              <Text style={[globalStyles.subHeading, { textAlign: 'center' }]}>
                {t('content_delete_desp')}
              </Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text
                allowFontScaling={false}
                style={[globalStyles.subHeading, { color: '#0D599E' }]}
              >
                {t('no')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onExit}>
              <Text
                allowFontScaling={false}
                style={[globalStyles.subHeading, { color: '#0D599E' }]}
              >
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

BackButtonHandler.propTypes = {
  exitRoute: PropTypes.any,
  onCancel: PropTypes.any,
  onExit: PropTypes.any,
};

export default BackButtonHandler;
