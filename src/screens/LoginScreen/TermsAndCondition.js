import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import Icon from 'react-native-vector-icons/FontAwesome6';

import { useNavigation } from '@react-navigation/native';

import GlobalText from "@components/GlobalText/GlobalText";

const TermsAndCondition = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.View}>
        <GlobalText style={styles.text}>
          {t('terms_and_conditions2')}
        </GlobalText>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="xmark" color="black" size={30} style={styles.icon} />
        </Pressable>
      </View>
      <ScrollView style={styles.scroll} scrollEventThrottle={16}>
        <GlobalText style={styles.text2}>{t('T&C_1')}</GlobalText>
        <GlobalText style={styles.text2}>{t('T&C_2')}</GlobalText>
        <GlobalText style={styles.text2}>{t('T&C_3')}</GlobalText>
        <GlobalText style={styles.text2}>{t('T&C_4')}</GlobalText>
        <GlobalText style={styles.text2}>{t('T&C_5')}</GlobalText>
        <GlobalText style={styles.text2}>{t('T&C_6')}</GlobalText>
        <GlobalText style={styles.text2}>{t('T&C_7')}</GlobalText>
        <GlobalText style={styles.text2}>{t('T&C_8')}</GlobalText>
        <GlobalText style={styles.text2}>{t('T&C_9')}</GlobalText>
        <GlobalText style={styles.text2}>{t('T&C_10')}</GlobalText>
        <GlobalText style={styles.text2}>{t('T&C_11')}</GlobalText>
        <GlobalText style={styles.text2}>{t('office_adrress')}</GlobalText>
        <GlobalText style={styles.text2}>{t('office_email')}</GlobalText>
        <GlobalText style={styles.text2}>{t('office_phone')}</GlobalText>
      </ScrollView>
    </SafeAreaView>
  );
};

TermsAndCondition.propTypes = {};

const styles = StyleSheet.create({
  text2: {
    fontFamily: 'Poppins-Medium',
    textAlign: 'justify',
    color: 'black',
    fontSize: 14,
    paddingVertical: 10,
    paddingRight: 10,
    flexWrap: 'wrap',
  },

  text: {
    fontSize: 26,
    color: '#000',
    fontWeight: '500',
  },
  View: {
    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    shadowColor: '#00000026', // iOS shadow
    shadowOffset: { width: 0, height: 15 }, // iOS shadow
    shadowOpacity: 1, // iOS shadow
    borderBottomWidth: 1.5,
    borderBottomColor: '#00000026',
  },

  scroll: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
});

export default TermsAndCondition;
