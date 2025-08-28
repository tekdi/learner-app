import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import Header from '../../components/Layout/Header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../context/LanguageContext';
import moment from 'moment';
import { getAssessmentAnswerKey } from '../../utils/API/AuthService';
import {
  capitalizeFirstLetter,
  findObjectByIdentifier,
  getDataFromStorage,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import RenderHtml from 'react-native-render-html';
import globalStyles from '../../utils/Helper/Style';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import { useInternet } from '../../context/NetworkContext';
import Config from 'react-native-config';

import GlobalText from '@components/GlobalText/GlobalText';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';
import { hierarchyContent, listQuestion, questionsetRead } from '../../utils/API/ApiCalls';

const ITEMS_PER_PAGE = 10;

const AnswerKeyView = ({ route }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const { isConnected } = useInternet();
  const { title, contentId } = route.params;
  const { height } = Dimensions.get('window');
  const questionListUrl = Config.QUESTION_LIST_URL;

  const [scoreData, setScoreData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const flatListRef = useRef(null);
  const [networkstatus, setNetworkstatus] = useState(true);
  const [questionSolutions, setQuestionSolutions] = useState({});


  const countEmptyResValues = (data) => {
    return data?.reduce((count, item) => {
      return item.resValue === '[]' ? count + 1 : count;
    }, 0);
  };

  const getLastIndexData = (dataArray) => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return null; // or you can return an empty object or any other default value
    }

    return dataArray[dataArray.length - 1];
  };

  // Function to find solutions for questions
  const findQuestionSolutions = (questions, currentQuestions) => {
    const solutions = {};
    
    console.log('Finding solutions for questions:', {
      questionsCount: questions?.length,
      currentQuestionsCount: currentQuestions?.length
    });
    
    currentQuestions.forEach(currentQuestion => {
      const matchingQuestion = questions.find(q => q.identifier === currentQuestion.questionId);
      console.log('Matching question:', {
        questionId: currentQuestion.questionId,
        found: !!matchingQuestion,
        hasSolutions: !!(matchingQuestion?.editorState?.solutions)
      });
      
      if (matchingQuestion && matchingQuestion.editorState?.solutions) {
        solutions[currentQuestion.questionId] = matchingQuestion.editorState.solutions;
        console.log('Solution found for question:', currentQuestion.questionId, matchingQuestion.editorState.solutions);
      }
    });
    
    console.log('Final solutions object:', solutions);
    return solutions;
  };

  useFocusEffect(
    useCallback(() => {

      fetchData();
    }, [navigation])
  );
  const downloadContentQuML = async (content_do_id) => {
    console.log('downloadContentQuML', content_do_id);
    setLoading(true);
    
    try {
      // Get data online
      let content_response = await hierarchyContent(content_do_id);
      if (content_response == null) {
        console.log('No content response received');
        return null;
      }
      
      let contentObj = content_response?.result?.questionSet;
      // Fix for response with questionset
      if (!contentObj) {
        contentObj = content_response?.result?.questionset;
      }
      
      if (contentObj?.mimeType == 'application/vnd.sunbird.questionset') {
        // Find outcomeDeclaration
        let questionsetRead_response = await questionsetRead(content_do_id);
        
        if (
          questionsetRead_response != null &&
          questionsetRead_response?.result?.questionset
        ) {
          contentObj.outcomeDeclaration =
            questionsetRead_response?.result?.questionset?.outcomeDeclaration;
        }
      }
      
      // Get child nodes and questions
      let childNodes = contentObj?.childNodes;
      let removeNodes = [];
      
      if (contentObj?.children) {
        for (let i = 0; i < contentObj.children.length; i++) {
          if (contentObj.children[i]?.identifier) {
            removeNodes.push(contentObj.children[i].identifier);
          }
        }
      }
      
      let identifiers = childNodes.filter(
        (item) => !removeNodes.includes(item)
      );
      
      let questions = [];
      const chunks = [];
      let chunkSize = 10;
      
      for (let i = 0; i < identifiers.length; i += chunkSize) {
        chunks.push(identifiers.slice(i, i + chunkSize));
      }
      
      console.log('chunks', chunks);
      
      for (const chunk of chunks) {
        let response_question = await listQuestion(
          questionListUrl,
          chunk
        );
        if (response_question?.result?.questions) {
          for (
            let i = 0;
            i < response_question.result.questions.length;
            i++
          ) {
            questions.push(response_question.result.questions[i]);
          }
        }
      }
      
      console.log('questions----------', questions.length);
      console.log('identifiers', identifiers.length);
      
      if (questions.length == identifiers.length) {
        // Add questions in contentObj for offline use
        let temp_contentObj = contentObj;
        if (contentObj?.children) {
          for (let i = 0; i < contentObj.children.length; i++) {
            if (contentObj.children[i]?.children) {
              for (
                let j = 0;
                j < contentObj.children[i]?.children.length;
                j++
              ) {
                let temp_obj = contentObj.children[i].children[j];
                if (temp_obj?.identifier) {
                  const identifierToFind = temp_obj.identifier;
                  const result_question = findObjectByIdentifier(
                    questions,
                    identifierToFind
                  );
                  // Replace with question
                  temp_contentObj.children[i].children[j] = result_question;
                }
              }
            }
          }
        }
        
        contentObj = temp_contentObj;
        
        // Return question_result
        let question_result = {
          questions: questions,
          count: questions.length,
        };
        
        console.log('question_result:', question_result?.questions?.[0]?.identifier);
        return question_result;
      } else {
        console.log('Questions count mismatch');
        return null;
      }
    } catch (error) {
      console.error('Error in downloadContentQuML:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const cohort_id = await getDataFromStorage('cohortId');
      const user_id = await getDataFromStorage('userId');
      const data = await getAssessmentAnswerKey({
        user_id,
        cohort_id,
        contentId,
      });
      handleDownload(data);
      
      const OfflineassessmentAnswerKey = JSON.parse(
        await getDataFromStorage(`assessmentAnswerKey${contentId}`)
      );
      
      if (OfflineassessmentAnswerKey) {
        const finalData = getLastIndexData(OfflineassessmentAnswerKey);
        const unanswered = countEmptyResValues(finalData?.score_details);
        setUnansweredCount(unanswered);
        setScoreData(finalData);
        setNetworkstatus(true);
        
        // Get question solutions AFTER setting scoreData
        try {
          const result = await downloadContentQuML(contentId);
          if (result && result.questions) {
            const solutions = findQuestionSolutions(result.questions, finalData?.score_details || []);
            setQuestionSolutions(solutions);
            console.log('Solutions set successfully:', solutions);
          }
        } catch (error) {
          console.error('Error getting question solutions:', error);
        }
      } else {
        setNetworkstatus(false);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error in fetchData:', err);
      setLoading(false);
    }
  };

  const handleDownload = async (data) => {
    if (data?.[0]?.assessmentTrackingId) {
      await setDataInStorage(
        `assessmentAnswerKey${contentId}`,
        JSON.stringify(data) || ''
      );
    }
  };

  const passedItems = scoreData?.score_details?.filter(
    (item) => item.pass === 'Yes'
  );

  const totalPages = Math.ceil(
    scoreData?.score_details?.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    scoreData?.score_details?.length
  );
  const currentQuestions = scoreData?.score_details?.slice(
    startIndex,
    endIndex
  );
  console.log("currentQuestions", currentQuestions);
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SecondaryHeader logo />
      {loading ? (
        <ActiveLoading />
      ) : (
        <SafeAreaView style={globalStyles.container}>
          <View style={globalStyles.flexrow}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon
                name="arrow-left"
                style={{ marginHorizontal: 10 }}
                color={'#4D4639'}
                size={30}
              />
            </TouchableOpacity>
            <GlobalText style={globalStyles.heading}>
              {t(capitalizeFirstLetter(title))}
            </GlobalText>
          </View>
          {isConnected && (
            <View style={[globalStyles.flexrow, { marginTop: 10 }]}>
              <GlobalText style={[globalStyles.subHeading, { color: '#000' }]}>
                {t('downloaded_for_offline_access')}
              </GlobalText>
              <Icon
                name="check-circle"
                style={{ marginHorizontal: 10 }}
                color={'#1A8825'}
                size={18}
              />
            </View>
          )}
          <View style={styles.container}>
            <View>
              <GlobalText style={[globalStyles.text, { color: '#7C766F' }]}>
                {t('submitted_On')}
                {moment(scoreData?.lastAttemptedOn).format('DD MMM, YYYY')}
              </GlobalText>
              <View
                style={[
                  globalStyles.flexrow,
                  { justifyContent: 'space-between', marginVertical: 10 },
                ]}
              >
                <GlobalText
                  style={[globalStyles.subHeading, { fontWeight: '700' }]}
                >
                  {unansweredCount} {t('unanswered')}
                </GlobalText>
                <GlobalText
                  style={[globalStyles.subHeading, { fontWeight: '700' }]}
                >
                  {scoreData?.totalScore || 0}/{scoreData?.totalMaxScore || 0}
                </GlobalText>
              </View>
              <View style={{ borderBottomWidth: 1 }}></View>
              <GlobalText
                style={[
                  globalStyles.text,
                  { marginVertical: 20, color: '#7C766F' },
                ]}
              >
                {passedItems?.length || 0} {t('out_of')}{' '}
                {scoreData?.score_details?.length || 0} {t('correct_answers')}
              </GlobalText>
            </View>
            <FlatList
              ref={flatListRef}
              data={currentQuestions}
              keyExtractor={(item) => item.questionId}
              renderItem={({ item, index }) => (
                <View style={styles.questionContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <GlobalText style={styles.questionText}>
                      {`Q${startIndex + index + 1}.`}
                    </GlobalText>
                    <RenderHtml
                      contentWidth={width}
                      baseStyle={baseStyle}
                      source={{ html: item.queTitle }}
                    />
                  </View>
                  <GlobalText
                    style={[
                      styles.questionText,
                      { color: item?.pass == 'Yes' ? 'green' : 'red' },
                    ]}
                  >
                    {`Ans. `}
                    {(() => {
                      try {
                        console.log('resValue:', item?.resValue, 'type:', typeof item?.resValue);
                        
                        if (!item?.resValue || item.resValue === '[]') {
                          return 'NA';
                        }
                        
                        const parsed = JSON.parse(item.resValue);
                        console.log('Parsed resValue:', parsed);
                        
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          const firstItem = parsed[0];
                          if (firstItem?.label) {
                            return firstItem.label
                              .replace(/<\/?[^>]+(>|$)/g, '')
                              .replace(/^\d+\.\s*/, '');
                          }
                        }
                        
                        return 'NA';
                      } catch (error) {
                        console.error('Error parsing resValue:', error, 'resValue:', item?.resValue);
                        return 'NA';
                      }
                    })()}
                  </GlobalText>
                  
                  {/* Debug: Log solution data */}
                  {console.log('Debug - questionId:', item.questionId, 'questionSolutions:', questionSolutions["do_21438672721553817618"], 'hasSolution:', !!questionSolutions[item.questionId])}
                  
                  {/* Display solution if available */}
                  {questionSolutions[item.questionId?.toString()] && (
                    <View style={styles.solutionContainer}>
                      <View style={styles.solutionRow}>
                        <GlobalText style={styles.solutionLabel}>
                          {t('Solution') || 'Solution'}:
                        </GlobalText>
                        <RenderHtml
                          contentWidth={width - 80}
                          baseStyle={baseStyle}
                          source={{ html: questionSolutions[item.questionId][0]?.value || '' }}
                        />
                      </View>
                    </View>
                  )}
                  
                  {/* Test: Always show some debug info */}
                  {/* <View style={{ padding: 5, backgroundColor: '#e0e0e0', marginTop: 5 }}>
                    <GlobalText style={{ fontSize: 12, color: '#666' }}>
                      Debug: Question ID: {item.questionId} | Has Solution: {questionSolutions[item.questionId] ? 'Yes' : 'No'}
                    </GlobalText>
                  </View> */}
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              style={{ maxHeight: height * 0.5 }} // Set maxHeight to allow scrolling within FlatList
            />
          </View>
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' }}
              onPress={handlePrev}
              disabled={currentPage === 1}
            >
              <Icon
                name="chevron-left"
                size={42}
                color={currentPage === 1 ? 'gray' : 'black'}
              />
            </TouchableOpacity>

            <GlobalText
              style={[
                globalStyles.subHeading,
                { flex: 2, textAlign: 'center' },
              ]}
            >{`${startIndex ? startIndex + 1 : 0}-${endIndex || 0}  of ${
              scoreData?.score_details.length || 0
            }`}</GlobalText>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' }}
              onPress={handleNext}
              disabled={currentPage === totalPages}
            >
              <Icon
                name="chevron-right"
                size={42}
                color={currentPage === totalPages ? 'gray' : 'black'}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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

AnswerKeyView.propTypes = {
  route: PropTypes.any,
};

const baseStyle = {
  color: '#000',
  fontSize: 14,
  fontFamily: 'Poppins-Regular',
  width: '89%',
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#D0C5B4',
    borderRadius: 10,
    flex: 0.9,
  },
  questionContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  questionText: {
    fontSize: 14,
    color: 'black',
    marginVertical: 5,
    marginRight: 10,
  },
  solutionContainer: {
    marginTop: 2,
    padding: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  solutionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  solutionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 2,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default AnswerKeyView;
