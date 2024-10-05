import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';

import globalStyles from '../../utils/Helper/Style';
import { Button } from '@ui-kitten/components';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MimeAlertModal = ({ textTitle }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const closeModal = () => {
    navigation.goBack();
  };

  return (
    <Modal transparent={true} animationType="slide">
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={closeModal} // Close the modal when pressing outside the alert box
      >
        <View style={styles.alertBox}>
          <TouchableOpacity
            activeOpacity={1} // Prevent closing the modal when clicking inside the alert box
            style={styles.alertSubBox}
          >
            <MaterialIcons name="close" size={48} color="red" />
            <Text
              allowFontScaling={false}
              style={[globalStyles.heading2, { marginVertical: 10 }]}
            >
              {t(textTitle)}
            </Text>
          </TouchableOpacity>
          <View style={styles.btnbox}>
            <Button status="primary" style={styles.btn} onPress={closeModal}>
              {() => (
                <Text
                  allowFontScaling={false}
                  style={[globalStyles.subHeading, { marginRight: 10 }]}
                >
                  {t('okay')}
                </Text>
              )}
            </Button>
          </View>
        </View>
      </TouchableOpacity>
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
  alertBox: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertSubBox: {
    padding: 20,
    alignItems: 'center',
  },

  btnbox: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#D0C5B4',
    padding: 20,
  },
  btn: {
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  View: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#D0C5B4',
    padding: 20,
  },
});

export default MimeAlertModal;
