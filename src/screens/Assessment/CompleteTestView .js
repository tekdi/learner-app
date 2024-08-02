import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Layout/Header';
import AssessmentHeader from './AssessmentHeader';
import SubjectBox from '../../components/TestBox.js/SubjectBox.';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from '../../context/LanguageContext';

const CompleteTestView = ({ route }) => {
  const { t } = useTranslation();
  const { title } = route.params;

  return (
    <SafeAreaView style={{ backgroundColor: '#fbf5e6', flex: 1 }}>
      <Header />

      <View>
        <AssessmentHeader testText={title} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 15,
            marginLeft: 20,
          }}
        >
          <Icon name="check-circle" size={24} color="black" />
          <Text style={styles.preTestText}>{t('completed')}</Text>
        </View>
        <View style={{ padding: 20 }}>
          <SubjectBox name={'ENGLISH'} />
          <SubjectBox name={'HINDI'} />
        </View>
      </View>
    </SafeAreaView>
  );
};

CompleteTestView.propTypes = {
  route: PropTypes.any,
};

const styles = StyleSheet.create({
  preTestText: {
    fontSize: 16,
    color: '#4D4639',
    fontWeight: '500',
    marginLeft: 10,
  },
});

export default CompleteTestView;
