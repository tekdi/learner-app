import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Layout/Header';
import AssessmentHeader from './AssessmentHeader';
import { useTranslation } from '../../context/LanguageContext';
import {
  getDataFromStorage,
  getLastMatchingData,
} from '../../utils/JsHelper/Helper';
import SubjectBox from '../../components/TestBox.js/SubjectBox.';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import globalStyles from '../../utils/Helper/Style';
import { useFocusEffect } from '@react-navigation/native';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';

import GlobalText from '@components/GlobalText/GlobalText';
import { removeData } from '../../utils/Helper/JSHelper';

const instructions = [
  {
    id: 1,
    title: 'instruction1',
  },
  {
    id: 2,
    title: 'instruction2',
  },
  {
    id: 3,
    title: 'instruction3',
  },
  {
    id: 4,
    title: 'instruction4',
  },
  {
    id: 5,
    title: 'instruction5',
  },
];

function mergeDataWithQuestionSet(questionSet, datatest) {
  datatest.forEach((dataItem) => {
    // Find the matching object in questionSet based on IL_UNIQUE_ID and contentId
    const matchingQuestionSetItem = questionSet.find(
      (question) => question.IL_UNIQUE_ID === dataItem.contentId
    );

    // If a match is found, add the properties from datatest to the questionSet item
    if (matchingQuestionSetItem) {
      matchingQuestionSetItem.totalMaxScore = dataItem.totalMaxScore;
      matchingQuestionSetItem.timeSpent = dataItem.timeSpent;
      matchingQuestionSetItem.totalScore = dataItem.totalScore;
      matchingQuestionSetItem.lastAttemptedOn = dataItem.lastAttemptedOn;
      matchingQuestionSetItem.createdOn = dataItem.createdOn;
    }
  });

  return questionSet;
}

const TestView = ({ route }) => {
  const { title } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [questionsets, setQuestionsets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [percentage, setPercentage] = useState('');
  const [completedCount, setCompletedCount] = useState(0);

  /*useEffect(() => {
    fetchData();
  }, []);*/

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []) // Make sure to include the dependencies
  );

  //fix for assessment back button press
  const loadData = async () => {
    let isFromPlayer = await getDataFromStorage('isFromPlayer');
    if (isFromPlayer == 'yes') {
      await removeData('isFromPlayer');
      navigation.goBack();
    } else {
      fetchData();
    }
  };

  const fetchData = async () => {
    const data = await getDataFromStorage('QuestionSet');

    const tempParseData = JSON.parse(data);

    const parseData = tempParseData[title];
    // Extract DO_id from assessmentList (content)

    const uniqueAssessmentsId = [
      ...new Set(parseData?.map((item) => item.IL_UNIQUE_ID)),
    ];

    // Get data of exam if given

    const tempAssessmentStatusData = JSON.parse(
      await getDataFromStorage('assessmentStatusData')
    );
    const assessmentStatusData = tempAssessmentStatusData[title];

    // console.log(JSON.stringify(assessmentStatusData));
    setStatus(assessmentStatusData?.[0]?.status || 'not_started');
    setPercentage(assessmentStatusData?.[0]?.percentage || '');
    setCompletedCount(assessmentStatusData?.[0]?.assessments.length || 0);
    const datatest = await getLastMatchingData(
      assessmentStatusData,
      uniqueAssessmentsId
    );

    const finalData = mergeDataWithQuestionSet(parseData, datatest);
    setQuestionsets(finalData);
    // console.log(JSON.stringify(finalData));
    setLoading(false);
  };

  return loading ? (
    <ActiveLoading />
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <SecondaryHeader logo />
      <ScrollView style={{ flex: 1 }}>
        <AssessmentHeader
          testText={title}
          status={status}
          percentage={percentage}
          completedCount={completedCount}
          questionsets={questionsets}
        />
        <View style={styles.container}>
          <GlobalText style={globalStyles.text}>
            {t('assessment_instructions')}
          </GlobalText>
          {questionsets?.map((item, index) => {
            return (
              <SubjectBox
                key={item?.subject}
                disabled={!item?.lastAttemptedOn}
                //name={item?.subject?.[0]?.toUpperCase()}
                name={item?.name}
                data={item}
              />
            );
          })}
          <View style={styles.note}>
            <GlobalText style={[globalStyles.text, { fontWeight: '700' }]}>
              {t('assessment_note')}
            </GlobalText>
          </View>
          <GlobalText
            style={[
              globalStyles.subHeading,
              { fontWeight: '700', paddingVertical: 20 },
            ]}
          >
            {t('general_instructions')}
          </GlobalText>
          {instructions?.map((item) => {
            return (
              <View key={item.id.toString()} style={styles.itemContainer}>
                <GlobalText style={styles.bullet}>{'\u2022'}</GlobalText>
                <GlobalText style={[globalStyles.subHeading]}>
                  {t(item.title)}
                </GlobalText>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

TestView.propTypes = {
  route: PropTypes.any,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 5,
    backgroundColor: '#FBF4E4',
  },
  note: {
    padding: 10,
    backgroundColor: '#FFDEA1',
    borderRadius: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20, // match the padding of container
  },
  bullet: {
    fontSize: 32,
    marginRight: 10,
    color: '#000',
    top: -10,
  },
});

export default TestView;
