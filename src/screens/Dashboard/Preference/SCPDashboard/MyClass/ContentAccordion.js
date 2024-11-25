import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import globalStyles from '../../../../../utils/Helper/Style';
import { useTranslation } from '../../../../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import ContentCard from '../../../ContentCard';
import { getDataFromStorage } from '../../../../../utils/JsHelper/Helper';
import { courseTrackingStatus } from '../../../../../utils/API/ApiCalls';
import { getDoits } from '../../../../../utils/API/AuthService';

const ContentAccordion = ({ title, resourceData, trackData }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  // console.log('resourceData', JSON.stringify(resourceData));

  return (
    <>
      <TouchableOpacity
        style={[
          globalStyles.flexrow,
          {
            justifyContent: 'space-between',
            padding: 10,
          },
        ]}
        onPress={() => setAccordionOpen(!isAccordionOpen)}
      >
        <Text style={[globalStyles.text, { color: '#7C766F' }]}>
          {t(title)}
        </Text>
        <Icon
          name={isAccordionOpen ? 'angle-up' : 'angle-down'}
          color="#0D599E"
          size={20}
        />
      </TouchableOpacity>

      {isAccordionOpen && (
        <View style={styles.accordionContent}>
          {title === 'pre_requisites_2' && (
            <>
              {resourceData?.prerequisites.length > 0 ? (
                resourceData?.prerequisites?.map((data, index) => {
                  return (
                    <ContentCard
                      key={index}
                      item={data}
                      index={index}
                      course_id={data?.identifier}
                      unit_id={data?.identifier}
                      TrackData={trackData}
                    />
                  );
                })
              ) : (
                <Text style={globalStyles.text}>{t('no_topics')}</Text>
              )}
            </>
          )}
          {title === 'post_requisites_2' && (
            <>
              {resourceData?.postrequisites.length > 0 ? (
                resourceData?.postrequisites?.map((data, index) => {
                  return (
                    <ContentCard
                      key={index}
                      item={data}
                      index={index}
                      course_id={data?.identifier}
                      unit_id={data?.identifier}
                      TrackData={trackData}
                    />
                  );
                })
              ) : (
                <Text style={globalStyles.text}>{t('no_topics')}</Text>
              )}
            </>
          )}
        </View>
      )}
    </>
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
    borderTopWidth: 1,
    borderColor: '#D0C5B4',
    padding: 10,
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

ContentAccordion.propTypes = {};

export default ContentAccordion;
