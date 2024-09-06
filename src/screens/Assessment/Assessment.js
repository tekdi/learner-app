import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import { useInternet } from '../../context/NetworkContext';
import Header from '../../components/Layout/Header';
import TestBox from '../../components/TestBox.js/TestBox';
import {
  assessmentListApi,
  getAccessToken,
  getAssessmentStatus,
  getCohort,
} from '../../utils/API/AuthService';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import {
  getDataFromStorage,
  getUserId,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import globalStyles from '../../utils/Helper/Style';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import BackButtonHandler from '../../components/BackNavigation/BackButtonHandler';
import { createTable, getData } from '../../utils/JsHelper/SqliteHelper';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import SyncCard from '../../components/SyncComponent/SyncCard';

const Assessment = (props) => {
  const { t } = useTranslation();
  const { isConnected } = useInternet();
  const navigation = useNavigation();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [percentage, setPercentage] = useState('');
  const [networkstatus, setNetworkstatus] = useState(true);

  // console.log({ isConnected });

  useEffect(() => {
    fetchData();
  }, [navigation]);

  const fetchData = async () => {
    setNetworkstatus(true);
    setLoading(true);
    const user_id = await getDataFromStorage('userId');
    const cohortparse = await getDataFromStorage('cohortData');
    const cohort = JSON.parse(cohortparse);
    const cohort_id = await getDataFromStorage('cohortId');
    const board = cohort?.cohortData?.[0]?.customField?.find(
      (field) => field.label === 'STATES'
    );

    if (board) {
      const boardName = board.value;
      const assessmentList = await assessmentListApi({ boardName, user_id });
      if (assessmentList) {
        // Extract pretest or posttest from assessmentList (content)
        // if (assessmentList?.QuestionSet) {
        //   await setDataInStorage(
        //     'assessmentList',
        //     JSON.stringify(assessmentList) || ''
        //   );
        // }

        // const OfflineAssessmentList = JSON.parse(
        //   await getDataFromStorage('assessmentList')
        // );
        const OfflineAssessmentList = assessmentList;
        // console.log({ OfflineAssessmentList });

        const uniqueAssessments = [
          ...new Set(
            OfflineAssessmentList?.QuestionSet?.map((item) => item.assessment1)
          ),
        ];

        // Extract DO_id from assessmentList (content)
        const uniqueAssessmentsId = [
          ...new Set(
            OfflineAssessmentList?.QuestionSet?.map((item) => item.IL_UNIQUE_ID)
          ),
        ];

        const assessmentStatusData =
          (await getAssessmentStatus({
            user_id,
            cohort_id,
            uniqueAssessmentsId,
          })) || [];

        if (assessmentStatusData?.[0]?.assessments) {
          await setDataInStorage(
            'assessmentStatusData',
            JSON.stringify(assessmentStatusData) || ''
          );
        }
        const OfflineAssessmentStatusData = JSON.parse(
          await getDataFromStorage('assessmentStatusData')
        );
        //console.log({ OfflineAssessmentStatusData });
        setStatus(OfflineAssessmentStatusData?.[0]?.status || 'not_started');
        setPercentage(OfflineAssessmentStatusData?.[0]?.percentage || '');

        await setDataInStorage(
          'QuestionSet',
          JSON.stringify(OfflineAssessmentList?.QuestionSet) || ''
        );
        setAssessments(uniqueAssessments);
      } else {
        setNetworkstatus(false);
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header />
      {loading ? (
        <ActiveLoading />
      ) : (
        <View>
          <SyncCard doneSync={fetchData} />
          <Text style={[globalStyles.heading, { padding: 20 }]}>
            {t('Assessments')}
          </Text>

          <View style={styles.card}>
            {assessments.length > 0 ? (
              assessments?.map((item) => {
                return (
                  <TestBox
                    key={item}
                    testText={item}
                    status={status}
                    percentage={percentage}
                  />
                );
              })
            ) : (
              <Text style={globalStyles.subHeading}>{t('no_data_found')}</Text>
            )}
          </View>
          {/* Use the BackButtonHandler component */}
          {/* <BackButtonHandler exitRoutes={['Assessment']} /> */}
        </View>
      )}
      <NetworkAlert
        onTryAgain={fetchData}
        isConnected={networkstatus}
        closeModal={() => {
          setNetworkstatus(!networkstatus);
        }}
      />
    </SafeAreaView>
  );
};

Assessment.propTypes = {};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'space-between',
    backgroundColor: '#FBF4E4',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
});

export default Assessment;
