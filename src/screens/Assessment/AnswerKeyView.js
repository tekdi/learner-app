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
  getDataFromStorage,
  getUserId,
} from '../../utils/JsHelper/Helper';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import RenderHtml from 'react-native-render-html';
import globalStyles from '../../utils/Helper/Style';

const ITEMS_PER_PAGE = 10;

const AnswerKeyView = ({ route }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const { title, contentId } = route.params;
  const { height } = Dimensions.get('window');

  const [scoreData, setScoreData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const cohort = await getDataFromStorage('cohortId');
        const cohort_id = cohort?.data;
        const user_id = await getUserId();
        const data = await getAssessmentAnswerKey({
          user_id,
          cohort_id,
          contentId,
        });
        setScoreData(data?.[0]);
        setLoading(false);
      };
      fetchData();
    }, [navigation])
  );

  const passedItems = scoreData?.score_details?.filter(
    (item) => item.pass === 'Yes'
  );

  const totalPages = Math.ceil(
    scoreData?.score_details?.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    scoreData?.score_details.length
  );
  const currentQuestions = scoreData?.score_details?.slice(
    startIndex,
    endIndex
  );

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
      <Header />
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
            <Text style={globalStyles.heading}>
              {t(capitalizeFirstLetter(title))}
            </Text>
          </View>
          <View style={styles.container}>
            <View>
              <Text style={[globalStyles.text, { color: '#7C766F' }]}>
                {t('submitted_On')}
                {moment(scoreData?.lastAttemptedOn).format('DD MMM, YYYY')}
              </Text>
              <View
                style={[
                  globalStyles.flexrow,
                  { justifyContent: 'space-between', marginVertical: 10 },
                ]}
              >
                <Text style={[globalStyles.subHeading, { fontWeight: '700' }]}>
                  {t('total_marks')}
                </Text>
                <Text style={[globalStyles.subHeading, { fontWeight: '700' }]}>
                  {scoreData?.totalScore}/{scoreData?.totalMaxScore}
                </Text>
              </View>
              <View style={{ borderBottomWidth: 1 }}></View>
              <Text
                style={[
                  globalStyles.text,
                  { marginVertical: 20, color: '#7C766F' },
                ]}
              >
                {passedItems?.length} {t('out_of')}{' '}
                {scoreData?.score_details?.length} {t('correct_answers')}
              </Text>
            </View>
            <FlatList
              ref={flatListRef}
              data={currentQuestions}
              keyExtractor={(item) => item.questionId}
              renderItem={({ item, index }) => (
                <View style={styles.questionContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.questionText}>
                      {`Q${startIndex + index + 1}.`}
                    </Text>
                    <RenderHtml
                      contentWidth={width}
                      baseStyle={baseStyle}
                      source={{ html: item.queTitle }}
                    />
                  </View>
                  <Text
                    style={[
                      styles.questionText,
                      { color: item?.pass == 'Yes' ? 'green' : 'red' },
                    ]}
                  >
                    {`Ans. `}
                    {JSON.parse(item?.resValue)?.[0]
                      ?.label.replace(/<\/?[^>]+(>|$)/g, '')
                      .replace(/^\d+\.\s*/, '') || 'NA'}
                  </Text>
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

            <Text
              style={[
                globalStyles.subHeading,
                { flex: 2, textAlign: 'center' },
              ]}
            >{`${startIndex + 1}-${endIndex} of ${scoreData?.score_details.length}`}</Text>
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
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default AnswerKeyView;
