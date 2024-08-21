import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useInternet } from '../../context/NetworkContext';
import { useTranslation } from '../../context/LanguageContext';

import globalStyles from '../../utils/Helper/Style';

import lightning from '../../assets/images/png/lightning.png';
import { Button } from '@ui-kitten/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NetworkAlert = ({ onTryAgain }) => {
  const { isConnected } = useInternet();
  const { t } = useTranslation();

  if (isConnected) {
    return null; // Don't show the modal if connected or the route isn't in the list
  }

  return (
    <Modal visible={!isConnected} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.alertBox}>
          <View style={styles.alertSubBox}>
            <Image style={styles.img} source={lightning} resizeMode="contain" />

            <Text style={[globalStyles.subHeading, { fontWeight: '700' }]}>
              {t('no_internet_connection')}
            </Text>
            <Text
              style={[
                globalStyles.text,
                { textAlign: 'center', marginVertical: 10 },
              ]}
            >
              {t('make_sure_wifi_or_mobile_data_is_turned_on_and_try_again')}
            </Text>
          </View>
          <View style={styles.btnbox}>
            <Button status="primary" style={styles.btn} onPress={onTryAgain}>
              {() => (
                <>
                  <Text style={[globalStyles.subHeading, { marginRight: 10 }]}>
                    {t('try_again')}
                  </Text>
                  <MaterialIcons name="replay" size={18} color="black" />
                </>
              )}
            </Button>
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
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertSubBox: {
    padding: 20,
    alignItems: 'center',
  },
  img: {
    marginVertical: 10,
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
});

export default NetworkAlert;
