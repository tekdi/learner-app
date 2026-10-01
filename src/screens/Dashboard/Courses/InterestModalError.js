import FastImage from '@changwoolab/react-native-fast-image';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Modal } from 'react-native';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';
import GlobalText from '@components/GlobalText/GlobalText';
import globalStyles from '../../../utils/Helper/Style';
import { useTranslation } from '../../../context/LanguageContext';
import Icon from 'react-native-vector-icons/Ionicons';

const InterestModalError = ({ isModal, setIsModal }) => {
  const { t } = useTranslation();

  return (
    <Modal visible={isModal} transparent={true} animationType="slide">
      <View style={styles.modalContainer} activeOpacity={1}>
        <View style={styles.alertBox}>
          <View
            style={{ width: '100%', alignItems: 'flex-end', paddingRight: 10 }}
          >
            <TouchableOpacity
              onPress={() => {
                setIsModal(false);
              }}
            >
              <Icon name={'close'} color="#000" size={30} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderTopWidth: 1,
              borderColor: '#D0C5B4',
              marginVertical: 20,
              width: '100%',
            }}
          >
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Icon
                name={'close-circle-outline'}
                color="#D32F2F"
                size={50}
              />
            </View>
            <View style={{ paddingVertical: 10 }}>
              <GlobalText
                style={[
                  globalStyles.subHeading,
                  { textAlign: 'center', fontWeight: 'bold' },
                ]}
              >
                {t('something_went_wrong_try_again_later')}
              </GlobalText>
            </View>
          </View>
          <View style={styles.btnbox}>
            <PrimaryButton
              text={t('try_again')}
              onPress={() => {
                setIsModal(false);
              }}
            />
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
  alertBox: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    padding: 10,
  },
  btnbox: {
    width: 200,
  },
});

export default InterestModalError;
