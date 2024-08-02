import React from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';

const IconConditions = ({ status, styles }) => {
  let iconName;
  let IconComponent;

  switch (status) {
    case 'completed':
      iconName = 'check-circle';
      IconComponent = Icon;
      break;
    case 'inprogress':
      iconName = 'circle-o';
      IconComponent = Icon;
      break;
    default:
      iconName = 'dash';
      IconComponent = Octicons;
  }

  return (
    <View style={styles.leftContainer}>
      <IconComponent name={iconName} size={24} color="black" />
    </View>
  );
};

const StatusCondition = ({ status, styles, t }) => {
  let content;

  switch (status) {
    case 'completed':
      content = (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {t('Overallscore')}
            <Text style={{ color: '#1A8825' }}> 88%</Text>
          </Text>
          <Text style={styles.smileyText}>😄</Text>
        </View>
      );
      break;
    case 'inprogress':
      content = (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{t('Inprogress')}</Text>
        </View>
      );
      break;
    default:
      content = (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{t('not_started')}</Text>
        </View>
      );
  }

  return <View>{content}</View>;
};

const TestBox = ({ testText, status }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('InprogressTestView', { title: testText });
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.card}>
          <IconConditions status={status} styles={styles} />
          <View style={styles.rightContainer}>
            <Text style={styles.preTestText}>{t(testText)}</Text>

            <StatusCondition status={status} styles={styles} t={t} />
          </View>
          <View style={styles.rightArrow}>
            <Icon name="chevron-right" size={24} color="black" />
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

TestBox.propTypes = {
  testText: PropTypes.string,
  status: PropTypes.string,
};
IconConditions.propTypes = {
  status: PropTypes.string,
  styles: PropTypes.object,
};
StatusCondition.propTypes = {
  status: PropTypes.string,
  styles: PropTypes.object,
  t: PropTypes.any,
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'white',
  },
  leftContainer: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFDEA1',
    paddingVertical: 20,
    // borderWidth: 1,
  },
  rightContainer: {
    flex: 4,
    marginLeft: 10,
    // borderWidth: 1,
  },
  preTestText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  smileyText: {
    fontSize: 16,
    marginLeft: 5,
  },
  rightArrow: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 20,
  },
});

export default TestBox;
