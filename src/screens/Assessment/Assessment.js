import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
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
  getCohort,
  trackAssessment,
} from '../../utils/API/AuthService';
import { useNavigation } from '@react-navigation/native';
import {
  checkAssessmentStatus,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';

const Assessment = (props) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAccessToken();
      const user_id = data?.result?.userId;
      const cohort = await getCohort({ user_id });
      const board = cohort?.cohortData?.[0]?.customField?.find(
        (field) => field.label === 'State'
      );
      if (board) {
        const boardName = board.value;
        const assessmentList = await assessmentListApi({ boardName });
        const uniqueAssessments = [
          ...new Set(
            assessmentList?.QuestionSet?.map((item) => item.assessment1)
          ),
        ];
        const uniqueAssessmentsId = [
          ...new Set(
            assessmentList?.QuestionSet?.map((item) => item.IL_UNIQUE_ID)
          ),
        ];

        const assessmentData = await trackAssessment({ user_id });
        const getStatus = await checkAssessmentStatus(
          assessmentData,
          uniqueAssessmentsId
        );
        setStatus(getStatus);
        await setDataInStorage(
          'QuestionSet',
          JSON.stringify(assessmentList?.QuestionSet)
        );
        setAssessments(uniqueAssessments);
      }
      setLoading(false);
    };
    fetchData();
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
              paddingVertical: 20,
              paddingHorizontal: 10,
            }}
          >
            {assessments.length > 0 ? (
              assessments?.map((item) => {
                return <TestBox key={item} testText={item} status={status} />;
              })
            ) : (
              <Text style={{ fontSize: 16, color: '#000' }}>
                {t('NO_DATA_FOUND')}
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
    padding: 15,
  },
  text: { fontSize: 26, color: 'black', fontWeight: '500' },
});

export default Assessment;
