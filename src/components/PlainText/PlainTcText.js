import React, { useState } from 'react';
import {
  Button,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import { CheckBox } from '@ui-kitten/components';
import HorizontalLine from '../HorizontalLine/HorizontalLine';
import PropTypes from 'prop-types';
import globalStyles from '../../utils/Helper/Style';

const PlainTcText = ({ setIsDisable, isDisable }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [isScrollEnd, setIsScrollEnd] = useState(false);
  const [showMore, setShowMore] = useState(false); // State for showing more content

  const handleReadMore = () => {
    setShowMore(true); // Show the additional text when button is clicked
  };

  const openWebsite = () => {
    Linking.openURL('https://www.pratham.org'); // Opens the website in a browser
  };

  // Function to open email client
  const sendEmail = () => {
    Linking.openURL('mailto:dataprotectionofficer@pratham.org'); // Opens the email client
  };

  // Function to make a phone call
  const callPhone = () => {
    Linking.openURL('tel:011-26177200'); // Opens the phone dialer
  };

  return (
    <SafeAreaView style={{ marginTop: 20, height: '100%' }}>
      <Text allowFontScaling={false} style={styles.text1}>
        {t('T&C')}{' '}
        <Text allowFontScaling={false} style={{ fontWeight: 'bold' }}>
          {t('create_account')}
        </Text>{' '}
        {t('button')}
      </Text>

      <View>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('T&C_1')}
        </Text>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('T&C_2')}
        </Text>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('T&C_3')}
        </Text>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('T&C_4')}
        </Text>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('T&C_5')}
        </Text>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('T&C_6')}
        </Text>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('T&C_7')}
        </Text>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('T&C_8')}
        </Text>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('T&C_9')}
        </Text>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('T&C_10')}
        </Text>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('T&C_11')}
        </Text>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('office_adrress')}
        </Text>
        <Text
          allowFontScaling={false}
          style={[styles.text2, { color: '#0563C1' }]}
          onPress={sendEmail}
        >
          {t('office_email')}
        </Text>
        <View style={globalStyles.flexrow}>
          <Text
            allowFontScaling={false}
            style={[styles.text2, { color: '#0563C1' }]}
            onPress={callPhone}
          >
            {t('office_phone')}
          </Text>
          <Text
            allowFontScaling={false}
            style={[styles.text2, { color: '#0563C1' }]}
            onPress={openWebsite}
          >
            {t('office_website')}
          </Text>
        </View>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('office_cin')}
        </Text>

        <HorizontalLine />
      </View>

      {/* Read More Button */}

      {/* Additional text content shown when "Read More" is clicked */}
      {showMore && <></>}

      {/* <View style={styles.view}>
        <CheckBox
          checked={checked}
          onChange={(nextChecked) => {
            setChecked(nextChecked);
            setIsDisable(!isDisable);
          }}
        />
        <Text allowFontScaling={false} style={[styles.text3]}>{t('T&C_12')}</Text>
      </View> */}
    </SafeAreaView>
  );
};

PlainTcText.propTypes = {
  setIsDisable: PropTypes.func,
  isDisable: PropTypes.bool,
};

const styles = StyleSheet.create({
  text1: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 16,
    flexWrap: 'wrap',
    textAlign: 'center',
    top: -10,
  },
  text2: {
    fontFamily: 'Poppins-Medium',
    textAlign: 'justify',
    color: 'black',
    fontSize: 12,
    paddingRight: 10,
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  text3: {
    fontFamily: 'Poppins-Medium',
    textAlign: 'justify',
    color: 'black',
    fontSize: 12,
    flexWrap: 'wrap',
    width: 340,
    marginLeft: 10,
    marginTop: 10,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PlainTcText;
