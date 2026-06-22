import React, { useCallback, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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

const AttemptAssessmentButton = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
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

    const cohortAssignedId = await getDataFromStorage('cohortAssignedToAnyAcademicYearId');
    console.log('AttemptAssessmentButton: cohortAssignedId from storage:', cohortAssignedId);
    if (cohortAssignedId) {
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

      if (Array.isArray(result) && result.length === 0) {
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
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <GlobalText style={styles.buttonText}>
          {t('attempt_assessment')}
        </GlobalText>
      </TouchableOpacity>

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
              style={styles.modalButton}
              onPress={() => setShowUnavailableModal(false)}
            >
              <GlobalText style={styles.modalButtonText}>
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
    backgroundColor: '#0D599E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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
    color: '#1a1a1a',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#0D599E',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default AttemptAssessmentButton;
