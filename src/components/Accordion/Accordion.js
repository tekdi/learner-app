import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import globalStyles from '../../utils/Helper/Style';
import { useTranslation } from '../../context/LanguageContext';
import {
  EventDetails,
  SolutionEvent,
  SolutionEventDetails,
  targetedSolutions,
} from '../../utils/API/AuthService';
import {
  extractLearningResources,
  getDataFromStorage,
  separatePrerequisiteAndPostrequisite,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import ContentCard from '../../screens/Dashboard/ContentCard';
import { courseTrackingStatus } from '../../utils/API/ApiCalls';

function getFilteredData(data, topic) {
  return data
    .map((item) => {
      const prerequisites = [];
      const postrequisites = [];

      if (item?.name === topic) {
        item?.children?.forEach((child) => {
          const learningResources = child?.learningResources || [];

          prerequisites.push(
            ...learningResources
              .filter((resource) => resource.type === 'prerequisite')
              .map((resource) => resource)
          );

          postrequisites.push(
            ...learningResources
              .filter((resource) => resource.type === 'postrequisite')
              .map((resource) => resource)
          );
        });

        return {
          name: item.name,
          prerequisites: prerequisites,
          postrequisites: postrequisites,
        };
      }
      // Return null if the item name doesn't match the topic
      return null;
    })
    .filter((result) => result !== null); // Filter out null values
}

const Accordion = ({ item, postrequisites, title, setTrack, topic }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [trackData, setTrackData] = useState([]);
  const { t } = useTranslation();

  const callProgramIfempty = async ({ solutionId, id }) => {
    const data = await SolutionEvent({ solutionId });
    const templateId = data?.externalId;

    const result = await SolutionEventDetails({ templateId, solutionId });
    console.log({ id, solutionId, templateId });

    if (!id) {
      fetchData();
    } else {
      console.log('error_API_Success');
    }
  };

  const fetchData = async () => {
    let result;
    const subjectName = item?.metadata?.subject || '';
    const type = item?.metadata?.courseType || '';
    const data = await targetedSolutions({ subjectName, type });

    const id = data?.data?.[0]?._id;
    const solutionId = data?.data?.[0]?.solutionId;

    if (id == '') {
      callProgramIfempty({ solutionId, id });
    } else {
      result = await EventDetails({ id });
      const filterData = getFilteredData(result?.tasks || [], topic);
      setTasks(filterData);
      console.log(JSON.stringify(filterData));

      let contentIdList = [];

      if (filterData) {
        for (let item of filterData) {
          // Push IDs from prerequisites
          item?.prerequisites?.forEach((prerequisite) => {
            contentIdList.push(prerequisite.id);
          });

          if (postrequisites) {
            // Push IDs from postrequisites
            item?.postrequisites?.forEach((postrequisite) => {
              contentIdList?.push(postrequisite.id);
            });
          }
        }
      }
      let userId = await getDataFromStorage('userId');
      let course_track_data = await courseTrackingStatus(userId, contentIdList);

      let courseTrackData = [];
      if (course_track_data?.data) {
        courseTrackData =
          course_track_data?.data?.find((course) => course.userId === userId)
            ?.course || [];
      }
      console.log('sssss', JSON.stringify(course_track_data));

      setTrackData(courseTrackData || []);
      setTrack(courseTrackData || []);
      if (!postrequisites) {
        setDataInStorage(
          'courseTrackData',
          JSON.stringify(courseTrackData || {})
        );
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View
      style={{
        backgroundColor: '#F7ECDF',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
      }}
    >
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
        {title ? (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[globalStyles.text]}
          >
            {t(title)}
          </Text>
        ) : (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[globalStyles.text]}
          >
            {item?.metadata?.subject || ''}{' '}
            {item?.shortDescription && `- ${item?.shortDescription}`}
          </Text>
        )}
        <Icon
          name={isAccordionOpen ? 'angle-up' : 'angle-down'}
          color="#0D599E"
          size={20}
        />
      </TouchableOpacity>

      {isAccordionOpen && (
        <View style={styles.accordionDetails}>
          <ScrollView style={{ height: '80%' }}>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <View
                  key={index}
                  style={{
                    width: '100%',
                  }}
                >
                  {!postrequisites ? (
                    <View
                      style={{
                        padding: 10,
                        // backgroundColor: '#F7ECDF',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                      }}
                    >
                      {task?.prerequisites?.map((data, index) => {
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
                      })}
                    </View>
                  ) : (
                    <View
                      style={{
                        // backgroundColor: '#F7ECDF',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        paddingBottom: 50,
                      }}
                    >
                      {task?.postrequisites?.map((data, index) => {
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
                      })}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={[globalStyles.text, { marginLeft: 10 }]}>
                {t('no_topics')}
              </Text>
            )}
          </ScrollView>
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
    borderTopWidth: 1,
    borderColor: '#D0C5B4',
  },
  accordionDetails: {
    fontSize: 14,
    color: '#7C766F',
  },
});

Accordion.propTypes = {};

export default Accordion;
