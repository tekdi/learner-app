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

const Assessment = (props) => {
  const { t } = useTranslation();
  const { isConnected } = useInternet();
  const navigation = useNavigation();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [percentage, setPercentage] = useState('');

  // Get the current route name
  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  );

  // console.log({ isConnected });

  useEffect(() => {
    const fetchData = async () => {
      const user_id = await getDataFromStorage('userId');
      const cohortparse = await getDataFromStorage('cohortData');
      const cohort = JSON.parse(cohortparse);
      const cohort_id = await getDataFromStorage('cohortId');
      const board = cohort?.cohortData?.[0]?.customField?.find(
        (field) => field.label === 'STATES'
      );

      if (board) {
        const boardName = board.value;
        const assessmentList = await assessmentListApi({ boardName });
        // Extract pretest or posttest from assessmentList (content)
        if (assessmentList?.QuestionSet) {
          await setDataInStorage(
            'assessmentList',
            JSON.stringify(assessmentList) || ''
          );
        }

        const OfflineAssessmentList = JSON.parse(
          await getDataFromStorage('assessmentList')
        );

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
        console.log({ OfflineAssessmentStatusData });
        setStatus(OfflineAssessmentStatusData?.[0]?.status || 'not_started');
        setPercentage(OfflineAssessmentStatusData?.[0]?.percentage || '');

        await setDataInStorage(
          'QuestionSet',
          JSON.stringify(OfflineAssessmentList?.QuestionSet) || ''
        );
        setAssessments(uniqueAssessments);
      }
      setLoading(false);
    };
    fetchData();
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      const tableName = 'APIResponses';
      const columns = [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'user_id INTEGER',
        'api_url TEXT',
        'api_type TEXT',
        'payload TEXT',
        'response TEXT',
      ];
      const query = await createTable({ tableName, columns });
      const data = await getData({ tableName: 'APIResponses' });
      console.log({ query, data });
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header />
      {loading ? (
        <ActiveLoading />
      ) : (
        <View>
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
          <BackButtonHandler exitRoutes={['Assessment']} />
        </View>
      )}
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
