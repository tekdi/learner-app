import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Layout/Header';
import AssessmentHeader from './AssessmentHeader';
import { useTranslation } from '../../context/LanguageContext';
import {
  getDataFromStorage,
  getLastMatchingData,
  getUserId,
} from '../../utils/JsHelper/Helper';
import SubjectBox from '../../components/TestBox.js/SubjectBox.';
import { getAssessmentStatus } from '../../utils/API/AuthService';
import { QuestionSetData } from './testData';
import ActiveLoading from '../LoadingScreen/ActiveLoading';

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
    }
  });

  return questionSet;
}

const TestView = ({ route }) => {
  const { title } = route.params;
  const { t } = useTranslation();

  const [questionsets, setQuestionsets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [percentage, setPercentage] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDataFromStorage('QuestionSet');
      const cohort = await getDataFromStorage('cohortId');
      const cohort_id = cohort?.data;
      const user_id = await getUserId();
      const parseData = JSON.parse(data?.data);
      // setQuestionsets(parseData);
      // Extract DO_id from assessmentList (content)

      const uniqueAssessmentsId = [
        ...new Set(parseData?.map((item) => item.IL_UNIQUE_ID)),
      ];
      // const uniqueAssessmentsId = [
      //   'do_11388361673153740812077',
      //   'do_11388361673153740812071',
      // ];

      // Get data of exam if given
      const assessmentStatusData =
        (await getAssessmentStatus({
          user_id,
          cohort_id,
          uniqueAssessmentsId,
        })) || [];

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
    fetchData();
  }, []);

  const renderHeader = () => (
    <View>
      <Header />
      <AssessmentHeader
        testText={title}
        status={status}
        percentage={percentage}
        completedCount={completedCount}
        questionsets={questionsets}
      />
      <View style={styles.container}>
        <Text style={styles.text}>{t('assessment_instructions')}</Text>
        {questionsets?.map((item, index) => {
          return (
            <SubjectBox
              key={index}
              disabled={item?.lastAttemptedOn ? false : true}
              name={item?.subject?.[0]?.toUpperCase()}
              data={item}
            />
          );
        })}
        <View style={styles.note}>
          <Text style={styles.text}>{t('assessment_note')}</Text>
        </View>
        <Text
          style={[
            styles.text,
            { fontWeight: '500', paddingVertical: 20, fontSize: 18 },
          ]}
        >
          {t('general_instructions')}
        </Text>
      </View>
    </View>
  );

  return loading ? (
    <ActiveLoading />
  ) : (
    <FlatList
      data={instructions}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <View key={item.id.toString()} style={styles.itemContainer}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.itemText}>{t(item.title)}</Text>
        </View>
      )}
      contentContainerStyle={{ backgroundColor: '#fbf5e6', flexGrow: 1 }}
    />
  );
};

TestView.propTypes = {
  route: PropTypes.any,
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 20 },
  text: { color: '#000', fontSize: 16, paddingVertical: 10 },
  note: {
    padding: 10,
    backgroundColor: '#FFDEA1',
    borderRadius: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20, // match the padding of container
    // borderWidth: 1,
  },
  bullet: {
    fontSize: 20,
    marginRight: 10,
    color: '#000',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
    // textAlign: 'justify',
    margin: 5,
  },
});

export default TestView;
