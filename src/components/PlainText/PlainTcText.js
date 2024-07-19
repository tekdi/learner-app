import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import { CheckBox } from '@ui-kitten/components';

const PlainTcText = ({ setIsDisable, isDisable }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const paddingToBottom = 20; // You can adjust this value as needed

    const isEnd =
      contentOffset.y + layoutMeasurement.height >=
      contentSize.height - paddingToBottom;

    setIsScrollEnd(isEnd);
  };

  return (
    <SafeAreaView>
      <Text style={styles.text1}>{t('T&C')}</Text>
      <ScrollView
        style={styles.scroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
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
      <View style={styles.view}>
        <CheckBox
          disabled={!isScrollEnd}
          checked={checked}
          onChange={(nextChecked) => {
            setChecked(nextChecked);
            setIsDisable(!isDisable); // Enable or perform additional action
          }}
        />
        <Text style={[styles.text3]}>{t('T&C_12')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text1: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 16,
    flexWrap: 'wrap',
  },
  text2: {
    fontFamily: 'Poppins-Medium',
    textAlign: 'justify',
    color: 'black',
    fontSize: 14,
    paddingVertical: 10,
    paddingRight: 10,
    flexWrap: 'wrap',
  },
  text3: {
    fontFamily: 'Poppins-Medium',
    textAlign: 'justify',
    color: 'black',
    fontSize: 14,
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
    borderWidth: 1,
    height: 310,
  },
});

export default PlainTcText;
