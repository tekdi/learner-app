import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Layout/Header';
import AssessmentHeader from './AssessmentHeader';
import { useTranslation } from '../../context/LanguageContext';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';
import SubjectBox from '../../components/TestBox.js/SubjectBox.';

const instructions = [
  {
    id: 1,
    title: 'instruction1',
  },
  {
    id: 2,
    title: 'instruction2',
  },
  {
    id: 3,
    title: 'instruction3',
  },
  {
    id: 4,
    title: 'instruction4',
  },
  {
    id: 5,
    title: 'instruction5',
  },
];

const InprogressTestView = ({ route }) => {
  const { title } = route.params;
  const { t } = useTranslation();

  const [questionsets, setQuestionsets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDataFromStorage('QuestionSet');
      const parseData = JSON.parse(data?.data);
      setQuestionsets(parseData);
    };
    fetchData();
  }, []);

  const renderHeader = () => (
    <View>
      <Header />
      <AssessmentHeader testText={title} />
      <View style={styles.container}>
        <Text style={styles.text}>{t('assessment_instructions')}</Text>
        {questionsets?.map((item) => {
          return (
            <SubjectBox
              key={item?.IL_UNIQUE_ID}
              disabled
              name={item?.subject?.[0]?.toUpperCase()}
              data={item}
            />
          );
        })}
        <View style={styles.note}>
          <Text style={styles.text}>{t('assessment_note')}</Text>
        </View>
        <Text
          style={[
            styles.text,
            { fontWeight: '500', paddingVertical: 20, fontSize: 18 },
          ]}
        >
          {t('general_instructions')}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={instructions}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.itemText}>{t(item.title)}</Text>
        </View>
      )}
      contentContainerStyle={{ backgroundColor: '#fbf5e6', flexGrow: 1 }}
    />
  );
};

InprogressTestView.propTypes = {
  route: PropTypes.any,
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 20 },
  text: { color: '#000', fontSize: 16, paddingVertical: 10 },
  note: {
    padding: 10,
    backgroundColor: '#FFDEA1',
    borderRadius: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20, // match the padding of container
    // borderWidth: 1,
  },
  bullet: {
    fontSize: 20,
    marginRight: 10,
    color: '#000',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
    // textAlign: 'justify',
    margin: 5,
  },
});

export default InprogressTestView;
