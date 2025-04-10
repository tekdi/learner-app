import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import Header from '../../components/Layout/Header';
import TestBox from '../../components/TestBox.js/TestBox';
import {
  assessmentListApi,
  getAssessmentStatus,
} from '../../utils/API/AuthService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  getDataFromStorage,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import globalStyles from '../../utils/Helper/Style';
import ActiveLoading from '../LoadingScreen/ActiveLoading';

import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import SyncCard from '../../components/SyncComponent/SyncCard';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';

import GlobalText from '@components/GlobalText/GlobalText';

const Assessment = ({ header, background }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [networkstatus, setNetworkstatus] = useState(true);

  /*useEffect(() => {
    fetchData();
  }, [navigation]);*/

  useFocusEffect(
    useCallback(() => {
      // console.log('########## in focus assessments');

      fetchData();
    }, []) // Make sure to include the dependencies
  );

  const fetchData = async () => {
    setNetworkstatus(true);
    setLoading(true);
    const user_id = await getDataFromStorage('userId');
    const cohortparse = await getDataFromStorage('cohortData');
    const cohort = JSON.parse(cohortparse);
    const cohort_id = await getDataFromStorage('cohortId');
    //console.log('########### cohort', cohort);
    let board = null;
    // let state = null;
    console.log('cohort==>', JSON.stringify(cohort));

    try {
      board = cohort?.customField?.find((field) => field.label === 'BOARD');
      // state = cohort?.customField?.find((field) => field.label === 'STATES');
    } catch (e) {
      console.log('e', e);
    }

    //fix for public user get maharashtra board assessments
    /*if (!board?.value) {
      board = { value: 'maharashtra' };
    }*/

    console.log('########### board', board);

    if (board) {
      const boardName = board?.selectedValues?.[0];
      // const stateName = state.value;

      const assessmentList = await assessmentListApi({
        boardName,
        // stateName,
        user_id,
      });
      if (assessmentList) {
        const OfflineAssessmentList = assessmentList;
        const uniqueAssessments = [
          ...new Set(
            OfflineAssessmentList?.QuestionSet?.map(
              (item) => item.assessmentType
            )
          ),
        ];
        //extract all question list with assessment type
        let questionSetData = {};
        let assessmentStatusData = {};
        if (uniqueAssessments) {
          for (let i = 0; i < uniqueAssessments.length; i++) {
            let key = uniqueAssessments[i];
            let questionSetDataId = [];
            let uniqueAssessmentsId = [];
            if (OfflineAssessmentList?.QuestionSet) {
              for (
                let j = 0;
                j < OfflineAssessmentList?.QuestionSet.length;
                j++
              ) {
                let question_set = OfflineAssessmentList.QuestionSet[j];
                if (question_set?.assessmentType == key) {
                  // Extract DO_id from assessmentList (content)
                  questionSetDataId.push(question_set);
                  uniqueAssessmentsId.push(question_set?.IL_UNIQUE_ID);
                }
              }
            }
            const assessmentStatusDataResponse =
              (await getAssessmentStatus({
                user_id,
                cohort_id,
                uniqueAssessmentsId,
              })) || [];
            assessmentStatusData[key] = assessmentStatusDataResponse;
            questionSetData[key] = questionSetDataId;
          }
        }

        if (assessmentStatusData) {
          await setDataInStorage(
            'assessmentStatusData',
            JSON.stringify(assessmentStatusData) || ''
          );
        }

        //set question set
        await setDataInStorage(
          'QuestionSet',
          JSON.stringify(questionSetData) || ''
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
      {!header && <SecondaryHeader logo />}
      {loading ? (
        <ActiveLoading />
      ) : (
        <View>
          <SyncCard doneSync={fetchData} />
          {!header && (
            <GlobalText style={[globalStyles.heading, { padding: 20 }]}>
              {t('Assessments')}
            </GlobalText>
          )}

          <View
            style={[styles.card, { backgroundColor: !background && '#FBF4E4' }]}
          >
            {assessments.length > 0 ? (
              assessments?.map((item) => {
                return <TestBox key={item} testText={item} />;
              })
            ) : (
              <GlobalText style={globalStyles.subHeading}>
                {t('no_data_found')}
              </GlobalText>
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
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
});

export default Assessment;
