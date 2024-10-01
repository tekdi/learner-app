import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const paddingToBottom = 20; // You can adjust this value as needed

    const isEnd =
      contentOffset.y + layoutMeasurement.height >=
      contentSize.height - paddingToBottom;

    setIsScrollEnd(isEnd);
  };

  const handleReadMore = () => {
    setShowMore(true); // Show the additional text when button is clicked
  };

  return (
    <SafeAreaView>
      <Text style={styles.text1}>
        {t('T&C')}{' '}
        <Text style={{ fontWeight: 'bold' }}>{t('create_account')}</Text>{' '}
        {t('button')}
      </Text>

      <ScrollView
        style={styles.scroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
      >
        <Text style={styles.text2}>{t('T&C_1')}</Text>
        <Text style={styles.text2}>{t('T&C_2')}</Text>

        {/* Read More Button */}
        {!showMore && (
          <Text
            style={[
              globalStyles.subHeading,
              { color: '#0563C1', textAlign: 'center', top: -10 },
            ]}
            onPress={handleReadMore}
          >
            {t('read_more')}
          </Text>
        )}

        {/* Additional text content shown when "Read More" is clicked */}
        {showMore && (
          <>
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
          </>
        )}

        <HorizontalLine />
      </ScrollView>
      <View style={styles.view}>
        <CheckBox
          checked={checked}
          onChange={(nextChecked) => {
            setChecked(nextChecked);
            setIsDisable(!isDisable);
          }}
        />
        <Text style={[styles.text3]}>{t('T&C_12')}</Text>
      </View>
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
  },
  text2: {
    fontFamily: 'Poppins-Medium',
    textAlign: 'justify',
    color: 'black',
    fontSize: 12,
    paddingVertical: 10,
    paddingRight: 10,
    flexWrap: 'wrap',
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
  scroll: {
    marginTop: 10,
    height: 280,
  },
});

export default PlainTcText;
