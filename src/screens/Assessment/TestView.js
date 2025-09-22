import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
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
import ATMTabView from './ATM/components/ATMTabView';

import GlobalText from '@components/GlobalText/GlobalText';
import { removeData } from '../../utils/Helper/JSHelper';
import {
  AIAssessmentSearch,
  AIAssessmentStatus,
} from '../../utils/API/ApiCalls';

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

// Helper function to find AI question set status by identifier
function findAiQuestionSetStatus(aiQuestionSetStatus, identifier) {
  if (!aiQuestionSetStatus || !Array.isArray(aiQuestionSetStatus)) {
    return [];
  }

  const foundItem = aiQuestionSetStatus.find(
    (item) => item.do_id === identifier
  );
  return foundItem ? foundItem : {};
}

const TestView = ({ route }) => {
  const { title } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [questionsets, setQuestionsets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiDataLoading, setAiDataLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [percentage, setPercentage] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0); // Add state for active tab
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if data is already loaded

  /*useEffect(() => {
    fetchData();
  }, []);*/

  const [aiQuestionSet, setAiQuestionSet] = useState(null);
  const [aiQuestionSetStatus, setAiQuestionSetStatus] = useState(null);
  const [onlineAssessments, setOnlineAssessments] = useState(null);
  const [offlineAssessments, setOfflineAssessments] = useState(null);
  useEffect(() => {
    fetchAIData();
  }, [questionsets]);

  useEffect(() => {
    console.log('#########atm aiQuestionSet', aiQuestionSet);
    if (aiQuestionSet != null) {
      setAiDataLoading(true);
      // Separate assessments into online and offline
      const onlineAssessments =
        questionsets?.filter((item) => {
          let isAiAssessment = aiQuestionSet?.includes(item?.identifier);
          console.log(
            'Assessment:',
            item?.name,
            'ID:',
            item?.identifier,
            'isAI:',
            isAiAssessment
          );
          return !isAiAssessment;
        }) || [];
      setOnlineAssessments(onlineAssessments);

      const offlineAssessments =
        questionsets?.filter((item) => {
          let isAiAssessment = aiQuestionSet?.includes(item?.identifier);
          return isAiAssessment;
        }) || [];
      setOfflineAssessments(offlineAssessments);
      setAiDataLoading(false);
    }
  }, [aiQuestionSet]);

  //use focus effect to fetch data
  useFocusEffect(
    useCallback(() => {
      console.log('#########atm useFocusEffect');
      fetchDataAIReload();
    }, [])
  );

  const fetchDataAIReload = async () => {
    const isloadassesments = await getDataFromStorage('isloadassesments');
    console.log('#########atm isloadassesments', isloadassesments);
    if (isloadassesments === 'yes') {
      setAiDataLoading(true);
      setAiQuestionSetStatus(null);
      setAiQuestionSet(null);
      setOnlineAssessments(null);
      setOfflineAssessments(null);
      fetchData();
      await removeData('isloadassesments');
    }
  };

  const fetchAIData = async () => {
    console.log('#########atm questionsets');
    if (questionsets && questionsets.length > 0) {
      console.log('#########atm questionsets 1');
      // console.log('########### questionsets', JSON.stringify(questionsets));
      setAiDataLoading(true);
      let do_ids = questionsets?.map((item) => item?.identifier || '');
      // console.log('do_ids', do_ids);
      let response_ai = await AIAssessmentSearch(do_ids);
      // console.log('response_ai', response_ai);
      let temp_ai_do_ids =
        response_ai?.data?.map((item) => item?.question_set_id || '') || [];
      let temp_offline_do_ids = questionsets
        .filter((item) => item?.evaluationType === 'offline')
        .map((item) => item?.identifier);
      let response_ai_ids = [...temp_ai_do_ids, ...temp_offline_do_ids];

      console.log('#########atm response_ai_ids', response_ai_ids);
      setAiQuestionSet(response_ai_ids);
      if (response_ai_ids.length > 0) {
        let aiAssessmentStatusTrack = [];
        for (let i = 0; i < response_ai_ids.length; i++) {
          let response_ai_status = await AIAssessmentStatus(response_ai_ids[i]);
          if (response_ai_status?.result?.length > 0) {
            console.log(
              '#########atm response_ai_status',
              JSON.stringify(response_ai_status)
            );

            // Extract record_file and record_answer from records array
            let record_file = null;
            let record_answer = null;

            if (
              response_ai_status?.result?.[0]?.records &&
              Array.isArray(response_ai_status.result[0].records)
            ) {
              const records = response_ai_status.result[0].records;

              // Find record_file: object with fileUrls or status key
              record_file = records.find(
                (record) => record && (record.fileUrls || record.status)
              );

              // Find record_answer: object with showFlag: true and evaluatedBy: "Manual"
              record_answer = records.find(
                (record) => record && record.evaluatedBy !== 'AI'
              );
            }

            aiAssessmentStatusTrack.push({
              do_id: response_ai_ids[i],
              status: response_ai_status?.result?.[0]?.status,
              fileUrls: response_ai_status?.result?.[0]?.fileUrls,
              uploadedFlag: response_ai_status?.result?.[0]?.uploadedFlag,
              submitedFlag: response_ai_status?.result?.[0]?.submitedFlag,
              createdAt:
                response_ai_status?.result?.[0]?.records?.[0]?.createdAt ||
                response_ai_status?.result?.[0]?.records?.[0]?.createdOn,
              record_answer: record_answer,
            });
          }
        }
        setAiQuestionSetStatus(aiAssessmentStatusTrack);
      }
      setAiDataLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Only reload data if it hasn't been loaded yet or if coming from player
      if (!isDataLoaded) {
        loadData();
      } else {
        // Check if coming from player without reloading data
        checkIfFromPlayer();
      }
    }, [isDataLoaded]) // Add isDataLoaded as dependency
  );

  //fix for assessment back button press
  const checkIfFromPlayer = async () => {
    let isFromPlayer = await getDataFromStorage('isFromPlayer');
    if (isFromPlayer == 'yes') {
      await removeData('isFromPlayer');
      navigation.goBack();
    }
  };

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
    setAiDataLoading(true);
    console.log('#########atm fetchData');

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
    setIsDataLoaded(true); // Mark data as loaded
    setAiDataLoading(false);
  };

  console.log('AI Question Set IDs:', aiQuestionSet);
  console.log('Online Assessments Count:', onlineAssessments?.length);
  console.log('Offline Assessments Count:', offlineAssessments?.length);

  // Create tab content components
  const OnlineAssessmentContent = () => (
    <View style={styles.tabContent}>
      {!onlineAssessments || aiDataLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator
            size="large"
            color="#4D4639"
            style={styles.loadingIndicator}
          />
          {/* <GlobalText style={styles.emptyText}>
            {t('loading_assessments') || 'Loading assessments...'}
          </GlobalText> */}
        </View>
      ) : onlineAssessments && onlineAssessments.length > 0 ? (
        onlineAssessments.map((item, index) => (
          <SubjectBox
            key={item?.subject}
            disabled={!item?.lastAttemptedOn}
            name={item?.name}
            data={item}
            isAiAssessment={false}
            index={index}
            aiQuestionSetStatus={
              aiQuestionSetStatus
                ? findAiQuestionSetStatus(aiQuestionSetStatus, item?.identifier)
                : null
            }
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <GlobalText style={styles.emptyText}>
            {t('no_online_assessments_available')}
          </GlobalText>
        </View>
      )}

      {/* <View style={styles.note}>
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
      })} */}
    </View>
  );

  const OfflineAssessmentContent = () => (
    <View style={styles.tabContent}>
      {!offlineAssessments || aiDataLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator
            size="large"
            color="#4D4639"
            style={styles.loadingIndicator}
          />
          {/* <GlobalText style={styles.emptyText}>
            {t('loading_assessments') || 'Loading assessments...'}
          </GlobalText> */}
        </View>
      ) : offlineAssessments && offlineAssessments.length > 0 ? (
        offlineAssessments.map((item, index) => (
          <SubjectBox
            key={item?.subject}
            disabled={!item?.lastAttemptedOn}
            name={item?.name}
            data={item}
            isAiAssessment={true}
            index={index}
            aiQuestionSetStatus={
              aiQuestionSetStatus
                ? findAiQuestionSetStatus(aiQuestionSetStatus, item?.identifier)
                : null
            }
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <GlobalText style={styles.emptyText}>
            {t('no_offline_assessments_available')}
          </GlobalText>
        </View>
      )}

      {/* <View style={styles.note}>
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
      })} */}
    </View>
  );

  const tabs = [
    ...(onlineAssessments?.length > 0
      ? [
          {
            title: t('online_assessment'),
            content: <OnlineAssessmentContent />,
            count: onlineAssessments?.length || 0,
          },
        ]
      : []),
    ...(offlineAssessments?.length > 0
      ? [
          {
            title: t('offline_assessment'),
            content: <OfflineAssessmentContent />,
            count: offlineAssessments?.length || 0,
          },
        ]
      : []),
  ];

  return loading ? (
    <ActiveLoading />
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <SecondaryHeader logo />
      <View style={{ flex: 1 }}>
        <AssessmentHeader
          testText={title}
          status={status}
          percentage={percentage}
          completedCount={completedCount}
          questionsets={questionsets}
        />
        <View style={styles.container}>
          {/* <GlobalText style={globalStyles.text}>
            {t('assessment_instructions')}
          </GlobalText> */}

          <View style={styles.tabContainer}>
            <ATMTabView
              tabs={tabs}
              activeTabIndex={activeTabIndex}
              onTabChange={setActiveTabIndex}
              activeTabStyle={{ borderBottomWidth: 2, borderColor: '#FDBE16' }}
              inactiveTabStyle={{
                borderBottomWidth: 1,
                borderColor: '#EBE1D4',
              }}
              tabTextStyle={{ color: '#888' }}
              activeTextStyle={{ color: '#000', fontWeight: 'bold' }}
              t={t}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

TestView.propTypes = {
  route: PropTypes.any,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 0,
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  tabContainer: {
    flex: 1,
    marginTop: 0,
  },
  tabContent: {
    paddingTop: 10,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  note: {
    padding: 10,
    backgroundColor: '#FFDEA1',
    borderRadius: 10,
    marginTop: 20,
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
  loadingIndicator: {
    marginBottom: 10,
  },
});

export default TestView;
