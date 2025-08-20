import React, { useState } from 'react';
import {
  Button,
  Linking,
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

import GlobalText from '@components/GlobalText/GlobalText';

const ParentText = ({ setIsDisable, isDisable }) => {
  const { t } = useTranslation();

  return (
    <View>
      <GlobalText style={styles.text1}>
        {t('the_following_details_must_be_filled_by_parents_or_guardians')}
      </GlobalText>
    </View>
  );
};

ParentText.propTypes = {
  setIsDisable: PropTypes.func,
  isDisable: PropTypes.bool,
};

const styles = StyleSheet.create({
  text1: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 16,
    marginBottom: 20,
    // textAlign: 'center',
    // borderWidth: 1,
  },
});

export default ParentText;
