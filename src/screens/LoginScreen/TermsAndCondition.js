import React, { useState } from 'react';
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
import { CheckBox } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import HorizontalLine from '../../components/HorizontalLine/HorizontalLine';
import { useNavigation } from '@react-navigation/native';

const TermsAndCondition = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.View}>
        <Text style={styles.text}>{t('terms_and_conditions2')}</Text>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="xmark" color="black" size={30} style={styles.icon} />
        </Pressable>
      </View>
      <ScrollView style={styles.scroll} scrollEventThrottle={16}>
        <Text style={styles.text2}>{t('T&C_1')}</Text>
        <Text style={styles.text2}>{t('T&C_2')}</Text>
        <Text style={styles.text2}>{t('T&C_3')}</Text>
        <Text style={styles.text2}>{t('T&C_4')}</Text>
        <Text style={styles.text2}>{t('T&C_5')}</Text>
        <Text style={styles.text2}>{t('T&C_6')}</Text>
        <Text style={styles.text2}>{t('T&C_7')}</Text>
        <Text style={styles.text2}>{t('T&C_8')}</Text>
        <Text style={styles.text2}>{t('T&C_9')}</Text>
        <Text style={styles.text2}>{t('T&C_10')}</Text>
        <Text style={styles.text2}>{t('T&C_11')}</Text>
        <Text style={styles.text2}>{t('office_adrress')}</Text>
        <Text style={styles.text2}>{t('office_email')}</Text>
        <Text style={styles.text2}>{t('office_phone')}</Text>
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
