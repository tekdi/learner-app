import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../utils/Helper/Style';

import GlobalText from '@components/GlobalText/GlobalText';

const BackHeader = ({ title }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.view}>
      <View style={globalStyles.flexrow}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon
            name="arrow-left"
            style={{ marginHorizontal: 10 }}
            color={'#4D4639'}
            size={30}
          />
          {/* <GlobalText >Back</GlobalText> */}
        </TouchableOpacity>
        <GlobalText style={styles.text}>{t(title)}</GlobalText>
      </View>
      {/* <GlobalText style={styles.text2}>{t('save')}</GlobalText> */}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    color: 'black',
    marginLeft: 10,
    // fontWeight: '500',
  },
  text2: {
    fontSize: 25,
    color: '#0D599E',
    marginLeft: 10,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingBottom: 20,
  },
});

export default BackHeader;
