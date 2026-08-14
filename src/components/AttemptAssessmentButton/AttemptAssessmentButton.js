import React, { useCallback, useEffect, useState } from 'react';
import { AppState, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { Button, useTheme } from '@ui-kitten/components';
import { useTranslation } from '../../context/LanguageContext';
import {
  getDataFromStorage,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import { TENANT_DATA } from '../../utils/Constants/app-constants';
import {
  ContentSearch,
  getRegistrationAssessmentStatus,
} from '../../utils/API/AuthService';
import GlobalText from '../GlobalText/GlobalText';
import globalStyles from '../../utils/Helper/Style';

// Mirrors the batch eligibility check used by SCPUserTabScreen to show the
// Home/My Class tabs, so the button disappears as soon as those tabs appear.
const hasActiveBatchAssigned = async () => {
  const cohortAssignedId = await getDataFromStorage(
    'cohortAssignedToAnyAcademicYearId'
  );
  if (cohortAssignedId) {
    return true;
  }

  try {
    const cohortparse = await getDataFromStorage('cohortData');
    if (!cohortparse) {
      return false;
    }
    const cohortData = JSON.parse(cohortparse);
    return (
      cohortData?.type === 'BATCH' &&
      cohortData?.cohortMemberStatus === 'active' &&
      cohortData?.cohortStatus === 'active'
    );
  } catch (error) {
    console.error('AttemptAssessmentButton: cohortData parse failed', error);
    return false;
  }
};

const AttemptAssessmentButton = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [showButton, setShowButton] = useState(false);
  const [questionSetIdentifier, setQuestionSetIdentifier] = useState(null);
  const [questionSetMimeType, setQuestionSetMimeType] = useState(null);
  const [isContentAvailable, setIsContentAvailable] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);

  const checkPendingAssessment = useCallback(async () => {
    try {
    const userType = await getDataFromStorage('userType');
    console.log('AttemptAssessmentButton: userType from storage:', userType);
    if (userType !== 'scp') {
      console.log('AttemptAssessmentButton: userType is not scp, hiding button');
      setShowButton(false);
      return;
    }

    let uiConfig = {};
    try {
      const uiConfigRaw = await getDataFromStorage('uiConfig');
      uiConfig = JSON.parse(uiConfigRaw || '{}');
      console.log('AttemptAssessmentButton: uiConfig from storage:', uiConfig);
    } catch (_) {}
    const isRegistrationTestEnabled =
      uiConfig?.RegisterationTest === true ||
      uiConfig?.RegisterationTest === 'true';

    if (!isRegistrationTestEnabled) {
      setShowButton(false);
      return;
    }

    const userId = await getDataFromStorage('userId');
    if (!userId) {
      setShowButton(false);
      return;
    }

    const batchAssigned = await hasActiveBatchAssigned();
    console.log('AttemptAssessmentButton: batchAssigned:', batchAssigned);
    if (batchAssigned) {
      setShowButton(false);
      return;
    }

    const preferredLanguage = await getDataFromStorage('preferred_language');

    try {
      const response = await ContentSearch({
        query: '',
        filters: {
          status: ['Live'],
          primaryCategory: ['Practice Question Set'],
          assessmentType: 'Eligibility Test',
          program: [TENANT_DATA.SECOND_CHANCE_PROGRAM, 'Second Chance'],
          ...(preferredLanguage ? { contentLanguage: [preferredLanguage] } : {}),
        },
        sort_by: { lastUpdatedOn: 'desc' },
        limit: 1,
        offset: 0,
      });

      const item = response?.result?.QuestionSet?.[0];
      const identifier = item?.identifier;

      if (!identifier) {
        setIsContentAvailable(false);
        setQuestionSetIdentifier(null);
        setShowButton(true);
        return;
      }

      const result = await getRegistrationAssessmentStatus({
        userId,
        courseId: identifier,
        unitId: identifier,
        contentId: identifier,
      });

      const registrationTestReattempt = Number(
        uiConfig?.registrationTestReattempt ?? 0
      );
      console.log(
        'AttemptAssessmentButton: registrationTestReattempt from uiConfig:',
        registrationTestReattempt
      );
      const attemptsUsed = Array.isArray(result) ? result.length : 0;
      console.log(
        'AttemptAssessmentButton: remaining attempts:',
        registrationTestReattempt - attemptsUsed
      );

      if (Array.isArray(result) && result.length < registrationTestReattempt) {
        await setDataInStorage('registerationTestQuestionSetIdentifier', identifier);
        setQuestionSetIdentifier(identifier);
        setQuestionSetMimeType(
          item?.mimeType || 'application/vnd.sunbird.questionset'
        );
        setIsContentAvailable(true);
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    } catch (error) {
      console.error('AttemptAssessmentButton: status check failed', error);
      setIsContentAvailable(false);
      setShowButton(true);
    }
  } catch (error) {
    console.error('AttemptAssessmentButton: check failed', error);
  }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkPendingAssessment();
    }, [checkPendingAssessment])
  );

  // SCPUserTabScreen keeps `cohortData` fresh while the tabs are mounted, so a
  // cheap storage-only poll is enough to drop the button the moment a batch is
  // assigned — no need to repeat the ContentSearch/assessment-status calls.
  useEffect(() => {
    if (!isFocused || !showButton) {
      return;
    }

    let cancelled = false;
    const checkBatch = async () => {
      if (AppState.currentState !== 'active') {
        return;
      }
      const batchAssigned = await hasActiveBatchAssigned();
      if (!cancelled && batchAssigned) {
        setShowButton(false);
      }
    };

    const intervalId = setInterval(checkBatch, 3000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [isFocused, showButton]);

  const handlePress = () => {
    if (isContentAvailable && questionSetIdentifier) {
      navigation.navigate('StandAlonePlayer', {
        content_do_id: questionSetIdentifier,
        content_mime_type: questionSetMimeType,
        isOffline: false,
        title: t('attempt_assessment'),
        isRegistrationTest: true,
      });
    } else {
      setShowUnavailableModal(true);
    }
  };

  if (!showButton) {
    return null;
  }

  return (
    <>
      <Button
        status="primary"
        onPress={handlePress}
        style={styles.button}
      >
        {(props) => (
          <GlobalText {...props} style={[globalStyles.h6, styles.buttonText]}>
            {t('attempt_assessment')}
          </GlobalText>
        )}
      </Button>

      <Modal
        visible={showUnavailableModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUnavailableModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <GlobalText style={styles.modalTitle}>
              {t('come_back_later')}
            </GlobalText>
            <GlobalText style={styles.modalBody}>
              {t('assessment_unavailable_message')}
            </GlobalText>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme['color-primary-500'] }]}
              onPress={() => setShowUnavailableModal(false)}
            >
              <GlobalText style={[globalStyles.h6, styles.modalButtonText]}>
                {t('ok')}
              </GlobalText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    height: 36,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '700',
    fontFamily: 'Roboto-Black',
    fontSize: 13,
    lineHeight: 13,
    includeFontPadding: false,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1B13',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 14,
    color: '#3B383E',
    marginBottom: 20,
  },
  modalButton: {
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#1F1B13',
    fontWeight: '700',
    fontFamily: 'Roboto-Black',
  },
});

export default AttemptAssessmentButton;
