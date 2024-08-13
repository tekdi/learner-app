import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import Header from '../../components/Layout/Header';
import TestBox from '../../components/TestBox.js/TestBox';
import {
  assessmentListApi,
  getAccessToken,
  getAssessmentStatus,
  getCohort,
  trackAssessment,
} from '../../utils/API/AuthService';
import {
  useNavigation,
  useFocusEffect,
  useNavigationState,
} from '@react-navigation/native';
import { getUserId, setDataInStorage } from '../../utils/JsHelper/Helper';

const Assessment = (props) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [percentage, setPercentage] = useState('');
  const routeName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (routeName === 'Content') {
          BackHandler.exitApp();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [routeName])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        const data = await getAccessToken();
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
          setPercentage(assessmentStatusData?.[0]?.percentageString || '');

          await setDataInStorage(
            'QuestionSet',
            JSON.stringify(assessmentList?.QuestionSet) || ''
          );
          setAssessments(uniqueAssessments);
        }
        setLoading(false);
      };
      fetchData();
    }, [navigation])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>{t('Assessments')}</Text>

          <View
            style={{
              marginVertical: 20,
              justifyContent: 'space-between',
              backgroundColor: '#FBF4E4',
              paddingVertical: 30,
              paddingHorizontal: 10,
            }}
          >
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
              <Text style={{ fontSize: 16, color: '#000' }}>
                {t('no_data_found')}
              </Text>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

Assessment.propTypes = {};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
  },
  text: { fontSize: 26, color: 'black', fontWeight: '500', marginLeft: 20 },
});

export default Assessment;
