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

const Accordion2 = ({ title, children, index, openDropDown }) => {
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
              padding: 10,
              backgroundColor: '#F7ECDF',
            },
          ]}
          onPress={() => setAccordionOpen(!isAccordionOpen)}
        >
          <View style={globalStyles.flexrow}>
            <Icon name="circle" color={'black'} />
            <GlobalText
              style={[globalStyles.text, { color: '#7C766F', marginLeft: 10 }]}
            >
              {t('topic')} {index + 1} - {title}
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
          {children ? (
            children?.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    navigation.navigate('LearningResources', {
                      resources: item?.learningResources,
                    });
                  }}
                  style={styles.box}
                >
                  <View style={globalStyles.flexrow}>
                    <GlobalText style={globalStyles.subHeading}>
                      {item?.name}
                    </GlobalText>
                  </View>
                  {item?.learningResources?.filter((item) => {
                    return;
                  })}
                  <View style={[globalStyles.flexrow]}>
                    <GlobalText
                      style={[
                        globalStyles.text,
                        { color: 'rgb(13, 89, 158)', marginRight: 10 },
                      ]}
                    >
                      {
                        item?.learningResources?.filter(
                          (resource) =>
                            resource?.type !== 'facilitator-requisite'
                        ).length
                      }{' '}
                      {t('resources')}
                    </GlobalText>
                    <Icon name={'arrow-right'} color="#0D599E" size={20} />
                  </View>
                </TouchableOpacity>
              );
            })
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

Accordion2.propTypes = {};

export default Accordion2;
