import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import globalStyles from '../../utils/Helper/Style';
import { useTranslation } from '../../context/LanguageContext';
import { EventDetails, targetedSolutions } from '../../utils/API/AuthService';
import {
  extractLearningResources,
  separatePrerequisiteAndPostrequisite,
} from '../../utils/JsHelper/Helper';
import ContentCard from '../../screens/Dashboard/ContentCard';

function getFilteredData(data) {
  return data.map((item) => {
    const prerequisites = [];
    const postrequisites = [];

    // Loop through the children array and filter learning resources by type
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
  });
}

const Accordion = ({ item, postrequisites, title }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [trackData, setTrackData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const subjectName = item?.metadata?.subject || '';
      const type = item?.metadata?.courseType || '';
      const data = await targetedSolutions({ subjectName, type });
      const id = data?.data?.[0]?._id;
      const result = await EventDetails({ id });
      // console.log('######', JSON.stringify(result?.tasks));

      const filterData = getFilteredData(result?.tasks || []);
      // console.log(JSON.stringify(filterData));
      setTasks(filterData);
    };
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
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <View
                key={index}
                style={{
                  paddingVertical: 10,
                  width: '100%',
                }}
              >
                <Text style={globalStyles.subHeading}>Topic: {task?.name}</Text>
                {!postrequisites ? (
                  <View
                    style={{
                      justifyContent: 'space-between',
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
                      justifyContent: 'space-between',
                      flexDirection: 'row',
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
