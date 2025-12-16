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

import GlobalText from '@components/GlobalText/GlobalText';
import CourseCard from '@components/CourseCard/CourseCard';

const ContentAccordion = ({ title, resourceData, trackData, openDropDown }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(openDropDown || false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handlePress = (item) => {
    // console.log('Card pressed!', item);
    // console.log('identifier', item?.identifier);
    // console.log('item', item?.leafNodes);
    navigation.navigate('CourseContentList', {
      do_id: item?.identifier,
      course_id: item?.identifier,
      content_list_node: item?.leafNodes,
    });
  };

  // console.log('resourceData===>', JSON.stringify(resourceData));

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
        <GlobalText style={[globalStyles.text, { color: '#7C766F' }]}>
          { title === 'during' ? 'Learn' : t(title)}
          {title === 'pre_requisites_2'
            ? `(${resourceData?.prerequisites?.length})`
            : title === 'during'
            ? `(${resourceData?.during?.length})`
            : `(${resourceData?.postrequisites?.length})`}
        </GlobalText>
        <Icon
          name={isAccordionOpen ? 'angle-up' : 'angle-down'}
          color="#0D599E"
          size={20}
        />
      </TouchableOpacity>

      {isAccordionOpen && (
        <View style={styles.accordionContent}>
          {title === 'pre_requisites_2' && (
            <View
              style={{
                padding: 10,
                // backgroundColor: '#F7ECDF',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}
            >
              {resourceData?.prerequisites?.length > 0 ? (
                resourceData?.prerequisites?.map((data, index) => {
                  return data?.mimeType ===
                    'application/vnd.ekstep.content-collection' ? (
                    <CourseCard
                      onPress={() => handlePress(data)}
                      appIcon={data?.appIcon}
                      index={index}
                      cardWidth={'44%'}
                      item={data}
                      TrackData={trackData}
                      navigation={navigation}
                    />
                  ) : (
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
                <GlobalText style={globalStyles.text}>
                  {t('no_topics')}
                </GlobalText>
              )}
            </View>
          )}
          {title === 'post_requisites_2' && (
            <View
              style={{
                padding: 10,
                // backgroundColor: '#F7ECDF',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}
            >
              {resourceData?.postrequisites?.length > 0 ? (
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
                <GlobalText style={globalStyles.text}>
                  {t('no_topics')}
                </GlobalText>
              )}
            </View>
          )}
          {title === 'during' && (
            <View
              style={{
                padding: 10,
                // backgroundColor: '#F7ECDF',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}
            >
              {resourceData?.during?.length > 0 ? (
                resourceData?.during?.map((data, index) => {
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
                <GlobalText style={globalStyles.text}>
                  {t('no_topics')}
                </GlobalText>
              )}
            </View>
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
