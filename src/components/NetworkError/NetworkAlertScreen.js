import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import globalStyles from '../../utils/Helper/Style';
import lightning from '../../assets/images/png/lightning.png';
import { Button } from '@ui-kitten/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import GlobalText from "@components/GlobalText/GlobalText";

const NetworkAlertScreen = ({ onTryAgain, routes, currentRoute }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.alertSubBox}>
        <Image style={styles.img} source={lightning} resizeMode="contain" />

        <GlobalText style={[globalStyles.heading2, { fontWeight: '700' }]}>
          {t('no_internet_connection')}
        </GlobalText>
        <GlobalText
          style={[
            globalStyles.subHeading,
            { textAlign: 'center', marginVertical: 10 },
          ]}
        >
          {t('make_sure_wifi_or_mobile_data_is_turned_on_and_try_again')}
        </GlobalText>
      </View>
      <View style={styles.btnbox}>
        <Button status="primary" style={styles.btn} onPress={onTryAgain}>
          {() => (
            <>
              <GlobalText
                style={[globalStyles.subHeading, { marginRight: 10 }]}
              >
                {t('try_again')}
              </GlobalText>
              <MaterialIcons name="replay" size={18} color="black" />
            </>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};

NetworkAlertScreen.propTypes = {
  routes: PropTypes.any,
  onTryAgain: PropTypes.any,
  currentRoute: PropTypes.any,
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  alertSubBox: {
    padding: 20,
    alignItems: 'center',
  },
  img: {
    marginVertical: 10,
    borderWidth: 1,
    height: 200,
    width: 200,
  },

  btn: {
    width: 300,
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  btnbox: {
    position: 'absolute',
    bottom: 0,
  },
});

export default NetworkAlertScreen;
