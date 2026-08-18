import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalText from '../GlobalText/GlobalText';
import globalStyles from '../../utils/Helper/Style';
import { useTranslation } from '../../context/LanguageContext';
import AttemptAssessmentButton from '../AttemptAssessmentButton/AttemptAssessmentButton';

const TOTAL_ATTEMPTS = 2;

const getAttemptTimestamp = (attempt) => {
  const value =
    attempt?.createdOn || attempt?.lastAttemptedOn || attempt?.updatedOn;
  const time = value ? new Date(value).getTime() : Number.NaN;
  return Number.isNaN(time) ? 0 : time;
};

const getBestAttemptIndex = (attempts) => {
  let bestIndex = -1;
  let bestScore = -Infinity;
  attempts.forEach((attempt, index) => {
    const score = attempt?.totalScore;
    if (typeof score === 'number' && score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  return bestIndex;
};

const AttemptRow = ({ index, attempt, isBest }) => {
  const { t } = useTranslation();
  const hasScore =
    typeof attempt?.totalMaxScore === 'number' && attempt.totalMaxScore > 0;

  let pillStyle = styles.pillNotAttempted;
  let textStyle = styles.textNotAttempted;
  let iconName = 'clipboard-text-outline';
  let statusNode = t('not_attempted');

  if (attempt) {
    pillStyle = styles.pillCompleted;
    textStyle = styles.textCompleted;
    iconName = 'check-circle-outline';
    statusNode = hasScore
      ? `${t('completed')}  ${attempt?.totalScore ?? 0}/${attempt.totalMaxScore}`
      : t('completed');
  }

  return (
    <View style={[styles.pill, pillStyle]}>
      <MaterialCommunityIcons
        name={iconName}
        size={14}
        color={textStyle.color}
        style={styles.pillIcon}
      />
      <GlobalText style={[globalStyles.text, styles.pillLabel, textStyle]}>
        {t('attempt')} {index + 1}
      </GlobalText>
      <GlobalText style={[globalStyles.text, styles.pillSeparator, textStyle]}>
        {' '}
        •{' '}
      </GlobalText>
      <GlobalText style={[globalStyles.text, styles.pillStatus, textStyle]}>
        {statusNode}
      </GlobalText>
      {attempt && isBest && (
        <MaterialCommunityIcons
          name="trophy-outline"
          size={14}
          color={textStyle.color}
          style={styles.trophyIcon}
        />
      )}
    </View>
  );
};

const AssessmentAttemptsSection = () => {
  const { t } = useTranslation();
  const [sectionState, setSectionState] = useState({
    visible: false,
    attempts: [],
  });

  const handleStateChange = useCallback((state) => {
    setSectionState(state);
  }, []);

  const sortedAttempts = [...(sectionState.attempts || [])].sort(
    (a, b) => getAttemptTimestamp(a) - getAttemptTimestamp(b)
  );
  const completedCount = Math.min(sortedAttempts.length, TOTAL_ATTEMPTS);
  const bestAttemptIndex = getBestAttemptIndex(sortedAttempts);

  if (!sectionState.visible) {
    return (
      <View style={{ marginTop: 5 }}>
        <AttemptAssessmentButton onStateChange={handleStateChange} />
      </View>
    );
  }

  return (
    <View style={{ marginTop: 5 }}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <GlobalText style={[globalStyles.h6, styles.title]}>
            {t('assessment_attempts')}
          </GlobalText>
          <GlobalText style={styles.countText}>
            {completedCount} {t('of')} {TOTAL_ATTEMPTS}{' '}
            {t('completed_lowercase')}
          </GlobalText>
        </View>
        {Array.from({ length: TOTAL_ATTEMPTS }, (_, index) => (
          <AttemptRow
            key={index}
            index={index}
            attempt={sortedAttempts[index]}
            isBest={index === bestAttemptIndex}
          />
        ))}
        <View style={sectionState.showButton ? styles.buttonWrapper : null}>
          <AttemptAssessmentButton onStateChange={handleStateChange} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: '#FFFDF6',
    borderWidth: 1,
    borderColor: '#F2EEDF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    color: '#1F1B13',
  },
  countText: {
    fontSize: 12,
    color: '#8A8578',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  pillIcon: {
    marginRight: 4,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  pillSeparator: {
    fontSize: 12,
  },
  pillStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  trophyIcon: {
    marginLeft: 4,
  },
  pillCompleted: {
    backgroundColor: '#DEF7E5',
  },
  textCompleted: {
    color: '#1E8E3E',
  },
  pillNotAttempted: {
    backgroundColor: '#FBF1CF',
  },
  textNotAttempted: {
    color: '#7A6A23',
  },
  buttonWrapper: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

AttemptRow.propTypes = {
  index: PropTypes.number.isRequired,
  attempt: PropTypes.shape({
    totalScore: PropTypes.number,
    totalMaxScore: PropTypes.number,
  }),
  isBest: PropTypes.bool,
};

export default AssessmentAttemptsSection;
