import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import Header from '../../components/Layout/Header';
import TestBox from '../../components/TestBox.js/TestBox';
import {
  assessmentListApi,
  getAccessToken,
  getAssessmentStatus,
  getCohort,
} from '../../utils/API/AuthService';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { getUserId, setDataInStorage } from '../../utils/JsHelper/Helper';
import globalStyles from '../../utils/Helper/Style';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import BackButtonHandler from '../../components/BackNavigation/BackButtonHandler';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';

const Assessment = (props) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [percentage, setPercentage] = useState('');

  // Get the current route name
  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user_id = await getUserId();
      const cohort = await getCohort({ user_id });
      const cohort_id = cohort?.cohortData?.[0]?.cohortId;

      await setDataInStorage('cohortId', cohort_id);
      await setDataInStorage('userId', user_id);
      const board = cohort?.cohortData?.[0]?.customField?.find(
        (field) => field.label === 'STATES'
      );
      if (board) {
        const boardName = board.value;
        const assessmentList = await assessmentListApi({ boardName });

        // Extract pretest or posttest from assessmentList (content)
        const uniqueAssessments = [
          ...new Set(
            assessmentList?.QuestionSet?.map((item) => item.assessment1)
          ),
        ];

        // Extract DO_id from assessmentList (content)
        const uniqueAssessmentsId = [
          ...new Set(
            assessmentList?.QuestionSet?.map((item) => item.IL_UNIQUE_ID)
          ),
        ];
        // console.log({ uniqueAssessmentsId });

        // const uniqueAssessmentsId = [
        //   'do_11388361673153740812077',
        //   'do_11388361673153740812071',
        // ];
        const assessmentStatusData =
          (await getAssessmentStatus({
            user_id,
            cohort_id,
            uniqueAssessmentsId,
          })) || [];
        // console.log({ assessmentStatusData });
        // console.log('sss', assessmentStatusData?.[0]?.percentageString);

        setStatus(assessmentStatusData?.[0]?.status || 'not_started');
        setPercentage(assessmentStatusData?.[0]?.percentage || '');

        await setDataInStorage(
          'QuestionSet',
          JSON.stringify(assessmentList?.QuestionSet) || ''
        );
        setAssessments(uniqueAssessments);
      }
      setLoading(false);
    };
    fetchData();
  }, [navigation]);

  const tryagain = () => {
    console.log('tryagain');
  };

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
          {/* Display the NoInternetPopup when there's no connection */}
          <NetworkAlert
            onTryAgain={tryagain}
            routes={['Assessment']}
            currentRoute={routeName}
          />
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
