import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Header from '../../components/Layout/Header';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../context/LanguageContext';
import HorizontalLine from '../../components/HorizontalLine/HorizontalLine';
import { ScoreData } from './testData';
import moment from 'moment';

const ITEMS_PER_PAGE = 10;

const AnswerKeyView = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { title } = route.params;
  const { height } = Dimensions.get('window');
  const passedItems = ScoreData?.score_details.filter(
    (item) => item.pass === 'Yes'
  );

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    ScoreData?.score_details?.length / ITEMS_PER_PAGE
  );

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    ScoreData?.score_details.length
  );
  const currentQuestions = ScoreData?.score_details.slice(startIndex, endIndex);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <View style={{ padding: 20, flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon
              name="arrow-left"
              style={{ marginHorizontal: 10 }}
              color={'#0D599E'}
              size={30}
            />
          </TouchableOpacity>
          <Text style={styles.text}>{t(title)}</Text>
        </View>
        <View style={styles.container}>
          <View>
            <Text style={styles.submitText}>
              {t('submitted_On')}
              {moment(ScoreData?.lastAttemptedOn).format('DD-MM-YYYY')}
            </Text>
            <View style={styles.readView}>
              <Text style={styles.readText}>{t('reading')}</Text>
              <Text style={styles.readText}>
                {ScoreData?.totalScore}/{ScoreData.totalMaxScore}
              </Text>
            </View>
            <View style={{ borderBottomWidth: 1 }}></View>
            <Text
              style={[styles.submitText, { fontSize: 16, marginVertical: 20 }]}
            >
              {passedItems?.length} {t('out_of')}{' '}
              {ScoreData?.score_details.length} {t('correct_answers')}
            </Text>
          </View>
          <FlatList
            data={currentQuestions}
            keyExtractor={(item) => item.questionId}
            renderItem={({ item }) => (
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{item.queTitle}</Text>
                <Text
                  style={[
                    styles.questionText,
                    { color: item?.pass == 'Yes' ? 'green' : 'red' },
                  ]}
                >
                  Ans.{' '}
                  {JSON.parse(item?.resValue)?.[0]
                    ?.label.replace(/<\/?[^>]+(>|$)/g, '')
                    .replace(/^\d+\.\s*/, '')}
                </Text>
                {/* {console.log(JSON.parse(item?.resValue)?.[0]?.label)} */}
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
            style={[styles.pageText, { flex: 2 }]}
          >{`${startIndex + 1}-${endIndex} of ${ScoreData?.score_details.length}`}</Text>
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
      </View>
    </SafeAreaView>
  );
};

AnswerKeyView.propTypes = {
  route: PropTypes.any,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    backgroundColor: '#f8efe7',
    borderRadius: 10,
    flex: 0.9,
  },
  questionContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  questionText: {
    fontSize: 18,
    color: 'black',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
  },

  pageText: {
    fontSize: 16,
    color: '#000',
    alignItems: 'center',
    textAlign: 'center',
  },
  text: {
    fontSize: 25,
    color: 'black',
    marginLeft: 10,
  },
  submitText: {
    fontSize: 14,
    color: '#7C766F',
  },
  readText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  readView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    width: '100%',
  },
});

export default AnswerKeyView;
