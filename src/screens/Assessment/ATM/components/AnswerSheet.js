import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../../../context/LanguageContext';

// Utility function to parse response values
const parseResValue = (resValue) => {
  try {
    const parsed = JSON.parse(resValue);

    // Handle array format like: [{"label":"<p>4</p>","value":0,"selected":true,"AI_suggestion":""}]
    if (Array.isArray(parsed)) {
      const selectedItem =
        parsed.find((item) => item.selected === true) || parsed[0];

      if (selectedItem) {
        // Extract response from different possible fields
        let response = '';

        // Always prioritize label over value for display
        if (selectedItem.label) {
          // Remove HTML tags from label
          response = selectedItem.label.replace(/<[^>]*>/g, '').trim();
        } else if (
          selectedItem.value !== undefined &&
          selectedItem.value !== null &&
          selectedItem.value !== ''
        ) {
          response = String(selectedItem.value).trim();
        } else {
          response = 'No response available';
        }

        return {
          response: response || 'No response available',
          aiSuggestion:
            selectedItem.AI_suggestion ||
            selectedItem.aiSuggestion ||
            selectedItem.explanation ||
            'No AI suggestion available',
        };
      }
    }

    // Handle object format (fallback for backward compatibility)
    return {
      response:
        parsed.response ||
        parsed.answer ||
        parsed.label ||
        parsed.value ||
        'No response available',
      aiSuggestion:
        parsed.AI_suggestion ||
        parsed.aiSuggestion ||
        parsed.explanation ||
        'No AI suggestion available',
    };
  } catch (error) {
    // If JSON parsing fails, treat as plain text
    return {
      response: resValue || 'No response available',
      aiSuggestion: 'No AI suggestion available',
    };
  }
};

// Score Badge Component
const ScoreBadge = React.memo(({ score, maxScore, pass, onClick }) => {
  const scoreColor = useMemo(() => {
    if (pass.toLowerCase() === 'yes') {
      return score === maxScore ? '#1A8825' : '#987100';
    }
    return '#BA1A1A';
  }, [pass, score, maxScore]);

  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.scoreBadge, { backgroundColor: scoreColor }]}
      activeOpacity={0.8}
    >
      <Text style={styles.scoreBadgeText}>
        {score}/{maxScore}
      </Text>
      <Icon name="edit" size={15} color="#FFFFFF" />
    </TouchableOpacity>
  );
});

ScoreBadge.displayName = 'ScoreBadge';

// AI Suggestion Component with See More/Less functionality
const AISuggestion = React.memo(({ aiSuggestion }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  if (
    !aiSuggestion ||
    aiSuggestion === 'No AI suggestion available' ||
    aiSuggestion.trim() === ''
  ) {
    return null;
  }

  // Function to truncate text to 25 words with better handling for Hindi text
  const truncateText = (text, maxWords = 25) => {
    if (!text || text.trim() === '') {
      return text;
    }

    // Split by whitespace to handle both Hindi and English text properly
    const words = text.trim().split(/\s+/);

    if (words.length <= maxWords) {
      return text;
    }

    // Take first maxWords and join them back
    const truncatedWords = words.slice(0, maxWords);
    return truncatedWords.join(' ') + '...';
  };

  const truncatedText = truncateText(aiSuggestion);
  const wordCount = aiSuggestion.trim().split(/\s+/).length;
  const shouldShowToggle = wordCount > 25;
  const displayText = isExpanded ? aiSuggestion : truncatedText;

  return (
    <View style={styles.aiSuggestionContainer}>
      <Text style={styles.aiSuggestionTitle}>{t('Explanation')}:</Text>
      <Text style={styles.aiSuggestionText}>{displayText}</Text>
      {shouldShowToggle && (
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.seeMoreButton}
        >
          <Text style={styles.seeMoreText}>
            {isExpanded ? t('See less') : t('See more')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

AISuggestion.displayName = 'AISuggestion';

// Question Item Component
const QuestionItem = React.memo(
  ({
    question,
    index,
    onScoreClick,
    isApproved,
    questionNumberingMap = {},
  }) => {
    const parsedResponse = useMemo(() => {
      const result = parseResValue(question.resValue);
      console.log('Parsed response for question:', question.questionId, result);
      return result;
    }, [question.resValue, question.questionId]);

    // Response box styling based on score
    const responseBoxStyle = useMemo(() => {
      if (question.pass.toLowerCase() === 'yes') {
        if (question.score === question.maxScore) {
          // Full marks - green
          return {
            backgroundColor: '#D2E3D6',
            color: '#1A8825',
          };
        } else {
          // Partial marks - yellow
          return {
            backgroundColor: '#EFE3C0',
            color: '#987100',
          };
        }
      } else {
        // No marks - red
        return {
          backgroundColor: '#E8D2D2',
          color: '#BA1A1A',
        };
      }
    }, [question.pass, question.score, question.maxScore]);

    const isReadOnly = isApproved || !onScoreClick;

    return (
      <View style={styles.questionItem}>
        {/* Question and Score Row */}
        <View style={styles.questionHeader}>
          <View style={styles.questionTextContainer}>
            <Text style={styles.questionText}>
              {question.questionId && questionNumberingMap[question.questionId]
                ? `${questionNumberingMap[question.questionId]}. ${
                    question.queTitle
                  }`
                : `Q${index + 1}. ${question.queTitle}`}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.scoreContainer,
              { backgroundColor: responseBoxStyle.color },
              isReadOnly && styles.scoreContainerDisabled,
            ]}
            onPress={onScoreClick}
            disabled={isReadOnly}
            activeOpacity={isReadOnly ? 1 : 0.8}
          >
            <Text style={styles.scoreText}>
              {question.score}/{question.maxScore}
            </Text>
            {!isReadOnly && <Icon name="edit" size={15} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>

        {/* Response Box */}
        <View
          style={[
            styles.responseBox,
            { backgroundColor: responseBoxStyle.backgroundColor },
          ]}
        >
          <Text
            style={[styles.responseText, { color: responseBoxStyle.color }]}
          >
            {parsedResponse.response}
          </Text>
        </View>

        {/* AI Suggestion */}
        <AISuggestion aiSuggestion={parsedResponse.aiSuggestion} />
      </View>
    );
  }
);

QuestionItem.displayName = 'QuestionItem';

// Score Summary Component
const ScoreSummary = React.memo(({ totalScore, totalMaxScore }) => {
  const { t } = useTranslation();
  const percentage = useMemo(() => {
    return totalMaxScore > 0
      ? Math.min(Math.round((totalScore / totalMaxScore) * 100), 100)
      : 0;
  }, [totalScore, totalMaxScore]);

  return (
    <Text style={styles.scoreSummary}>
      {t('Marks')}:{' '}
      <Text style={styles.scoreSummaryHighlight}>
        {totalScore || 0}/{totalMaxScore || 0} ({percentage}%)
      </Text>
    </Text>
  );
});

ScoreSummary.displayName = 'ScoreSummary';

// Approve Button Component
const ApproveButton = React.memo(({ onApprove, isApproved }) => {
  const { t } = useTranslation();
  if (isApproved || !onApprove) return null;

  return (
    <View style={styles.approveButtonContainer}>
      <TouchableOpacity
        style={styles.approveButton}
        onPress={onApprove}
        activeOpacity={0.8}
      >
        <Text style={styles.approveButtonText}>
          {t('Approve Marks & Notify Learner')}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

ApproveButton.displayName = 'ApproveButton';

// Questions List Component
const QuestionsList = React.memo(
  ({
    scoreDetails,
    onScoreEdit,
    isApproved,
    questionNumberingMap = {},
    sectionMapping = {},
  }) => {
    const { t } = useTranslation();
    const handleScoreClick = useCallback(
      (question) => {
        if (!isApproved && onScoreEdit) {
          onScoreEdit(question);
        }
      },
      [onScoreEdit, isApproved]
    );

    // Function to format section names
    const formatSectionName = (name) => {
      // Handle common patterns
      const nameMap = {
        fill_in_the_blanks: t('Fill in the Blanks'),
        mcq: t('Multiple Choice Questions'),
        short: t('Short Answer Questions'),
        long: t('Long Answer Questions'),
      };

      const lowerName = name.toLowerCase();
      const mappedName = nameMap[lowerName];
      if (mappedName) {
        return mappedName;
      }

      // Default formatting: replace underscores and capitalize
      return name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    // Group questions by section
    const groupedQuestions = useMemo(() => {
      const groups = {};

      scoreDetails.forEach((question) => {
        const sectionName = question.questionId
          ? sectionMapping[question.questionId] || t('Unknown Section')
          : t('Unknown Section');

        if (!groups[sectionName]) {
          groups[sectionName] = [];
        }

        groups[sectionName].push(question);
      });

      return groups;
    }, [scoreDetails, sectionMapping, t]);

    return (
      <View style={styles.questionsListContainer}>
        <View style={styles.questionsListBox}>
          {Object.entries(groupedQuestions).map(([sectionName, questions]) => (
            <View key={sectionName} style={styles.sectionContainer}>
              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {formatSectionName(sectionName)}
                </Text>
              </View>

              {/* Questions in this section */}
              {questions.map((question, index) => (
                <QuestionItem
                  key={`${question.questionId}-${index}`}
                  question={question}
                  index={index}
                  onScoreClick={() => handleScoreClick(question)}
                  isApproved={isApproved}
                  questionNumberingMap={questionNumberingMap}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }
);

QuestionsList.displayName = 'QuestionsList';

// Empty State Component
const EmptyState = React.memo(() => {
  const { t } = useTranslation();
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>
        {t('No assessment data available')}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {t('Please check if the assessment has been completed and try again')}.
      </Text>
    </View>
  );
});

EmptyState.displayName = 'EmptyState';

// Main AnswerSheet Component
const AnswerSheet = ({
  assessmentTrackingData,
  onApprove = () => {},
  onScoreEdit = () => {},
  isApproved = false,
  questionNumberingMap = {},
  sectionMapping = {},
}) => {
  const { t } = useTranslation();
  // Debug logging
  console.log('#########atm AnswerSheet component rendered');
  console.log('#########atm AnswerSheet props:', {
    assessmentTrackingData: !!assessmentTrackingData,
    assessmentTrackingDataLength: assessmentTrackingData?.score_details?.length,
    isApproved,
    questionNumberingMap: Object.keys(questionNumberingMap).length,
    sectionMapping: Object.keys(sectionMapping).length,
  });

  // Early return for empty state
  if (
    !assessmentTrackingData ||
    !assessmentTrackingData.score_details?.length
  ) {
    console.log('#########atm AnswerSheet showing EmptyState');
    return (
      <View style={styles.container}>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#666', fontSize: 16, fontWeight: 'bold' }}>
            {t('AnswerSheet Component is Rendering')}!
          </Text>
          <Text style={{ color: '#999', fontSize: 14, marginTop: 10 }}>
            {t('But no assessment data available')}
          </Text>
          <Text style={{ color: '#999', fontSize: 12, marginTop: 5 }}>
            assessmentTrackingData: {assessmentTrackingData ? 'EXISTS' : 'NULL'}
          </Text>
          <Text style={{ color: '#999', fontSize: 12 }}>
            score_details length:{' '}
            {assessmentTrackingData?.score_details?.length || 0}
          </Text>
        </View>
      </View>
    );
  }

  console.log('#########atm AnswerSheet showing full content');

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Score Summary */}
      {/* <ScoreSummary
        totalScore={assessmentTrackingData.totalScore}
        totalMaxScore={assessmentTrackingData.totalMaxScore}
      /> */}

      {/* Approve Button */}
      <ApproveButton onApprove={onApprove} isApproved={isApproved} />

      {/* Questions List */}
      <QuestionsList
        scoreDetails={assessmentTrackingData.score_details}
        onScoreEdit={onScoreEdit}
        isApproved={isApproved}
        questionNumberingMap={questionNumberingMap}
        sectionMapping={sectionMapping}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scoreSummary: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#1F1B13',
    marginBottom: 16,
    marginHorizontal: 4,
  },
  scoreSummaryHighlight: {
    color: '#1A8825',
  },
  approveButtonContainer: {
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  approveButton: {
    backgroundColor: '#FDBE16',
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4D4639',
    lineHeight: 20,
  },
  questionsListContainer: {
    paddingHorizontal: 4,
  },
  questionsListBox: {
    backgroundColor: '#F8EFE7',
    borderWidth: 1,
    borderColor: '#D0C5B4',
    borderRadius: 16,
    width: '100%',
    padding: 8,
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    color: '#1F1B13',
    textTransform: 'capitalize',
  },
  questionItem: {
    width: '100%',
    marginTop: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  questionTextContainer: {
    flex: 1,
  },
  questionText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#1F1B13',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  scoreContainerDisabled: {
    opacity: 0.7,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
  },
  responseBox: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  responseText: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
  },
  aiSuggestionContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0C5B4',
    padding: 8,
  },
  aiSuggestionTitle: {
    color: '#7C766F',
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  aiSuggestionText: {
    color: '#1F1B13',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 8,
  },
  seeMoreButton: {
    alignSelf: 'flex-start',
  },
  seeMoreText: {
    color: '#1A8825',
    fontSize: 14,
    fontWeight: '500',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 8,
  },
  scoreBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    paddingHorizontal: 16,
  },
  emptyStateTitle: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    color: '#999999',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default AnswerSheet;
