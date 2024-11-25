import React from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import question from '../../assets/images/png/question.png';

import GlobalText from '@components/GlobalText/GlobalText';

import globalStyles from '../../utils/Helper/Style';

const ConfirmationDialog = ({
  message,
  onConfirm,
  onCancel,
  yesText,
  noText,
}) => {
  return (
    <Modal transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.alertBox}>
            <Image source={question} resizeMode="contain" />
            <GlobalText
              style={[
                globalStyles.subHeading,
                { fontWeight: '700', textAlign: 'center', marginVertical: 20 },
              ]}
            >
              {message}
            </GlobalText>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <GlobalText
                style={[globalStyles.subHeading, { color: '#0D599E' }]}
              >
                {yesText}
              </GlobalText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <GlobalText
                style={[globalStyles.subHeading, { color: '#0D599E' }]}
              >
                {noText}
              </GlobalText>
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

export default ConfirmationDialog;
