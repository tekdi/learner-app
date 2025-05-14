import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import globalStyles from '../../utils/Helper/Style';
import { useTranslation } from '../../context/LanguageContext';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

import GlobalText from '@components/GlobalText/GlobalText';

const Accordion3 = ({ title, children, index, openDropDown, description }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(openDropDown || false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View
      style={{
        // backgroundColor: '#F7ECDF',
        // padding: 10,
        marginVertical: 5,
        borderRadius: 10,
      }}
    >
      {title && (
        <TouchableOpacity
          style={[
            globalStyles.flexrow,
            {
              justifyContent: 'space-between',
              padding: 15,
              backgroundColor: '#F7ECDF',
              borderRadius: 10,
            },
          ]}
          onPress={() => setAccordionOpen(!isAccordionOpen)}
        >
          <View style={globalStyles.flexrow}>
            <Icon name="circle" color={'black'} />
            <GlobalText
              numberOfLines={4}
              ellipsizeMode="tail"
              style={[
                globalStyles.text,
                { color: '#7C766F', marginLeft: 10, width: '90%' },
              ]}
            >
              {t('unit')} {index + 1} - {title}
            </GlobalText>
          </View>

          <Icon
            name={isAccordionOpen ? 'angle-up' : 'angle-down'}
            color="#1F1B13"
            size={20}
          />
        </TouchableOpacity>
      )}

      {isAccordionOpen && (
        <View style={styles.accordionContent}>
          {description ? (
            <GlobalText style={globalStyles.text}>{description}</GlobalText>
          ) : (
            <GlobalText style={globalStyles.text}>{t('no_topics')}</GlobalText>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },

  accordionContent: {
    paddingVertical: 10,
    // borderBottomWidth: 1,
    // borderTopWidth: 1,
    borderColor: '#D0C5B4',
  },
  accordionDetails: {
    fontSize: 14,
    color: '#7C766F',
  },
  box: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

Accordion3.propTypes = {};

export default Accordion3;
