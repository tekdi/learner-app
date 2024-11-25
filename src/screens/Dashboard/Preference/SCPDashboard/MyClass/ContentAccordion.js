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

import GlobalText from "@components/GlobalText/GlobalText";

const ContentAccordion = ({ title, resourceData }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [trackData, setTrackData] = useState();
  const { t } = useTranslation();
  const navigation = useNavigation();

  console.log('resourceData', JSON.stringify(resourceData));

  useEffect(() => {
    const trackingData = async () => {
      let contentIdList = [];

      if (resourceData) {
        // Push IDs from prerequisites
        resourceData?.prerequisites?.forEach((prerequisite) => {
          contentIdList.push(prerequisite.id);
        });

        // Push IDs from postrequisites
        resourceData?.postrequisites?.forEach((postrequisite) => {
          contentIdList?.push(postrequisite.id);
        });

        let userId = await getDataFromStorage('userId');
        let course_track_data = await courseTrackingStatus(
          userId,
          contentIdList
        );

        let courseTrackData = [];
        if (course_track_data?.data) {
          courseTrackData =
            course_track_data?.data?.find((course) => course.userId === userId)
              ?.course || [];
        }
        console.log('sssss', JSON.stringify(course_track_data));

        setTrackData(courseTrackData || []);
      }
    };
    trackingData();
  }, [resourceData]);

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
          {t(title)}
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
            <>
              {resourceData?.prerequisites.length > 0 ? (
                resourceData?.prerequisites?.map((data, index) => {
                  return (
                    <ContentCard
                      key={index}
                      item={data}
                      index={index}
                      course_id={data?.id}
                      unit_id={data?.id}
                      TrackData={trackData}
                    />
                  );
                })
              ) : (
                <GlobalText style={globalStyles.text}>
                  {t('no_topics')}
                </GlobalText>
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
                      course_id={data?.id}
                      unit_id={data?.id}
                      TrackData={trackData}
                    />
                  );
                })
              ) : (
                <GlobalText style={globalStyles.text}>
                  {t('no_topics')}
                </GlobalText>
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
