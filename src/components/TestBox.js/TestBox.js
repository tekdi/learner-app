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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../utils/Helper/Style';

const IconConditions = ({ status, styles }) => {
  let iconName;
  let IconComponent;

  switch (status) {
    case 'Completed':
      iconName = 'check-circle';
      IconComponent = Icon;
      break;
    case 'In_Progress':
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

const StatusCondition = ({ status, styles, t, percentage }) => {
  let content;

  switch (status) {
    case 'Completed':
      content = (
        <View style={globalStyles.flexrow}>
          <Text allowFontScaling={false} style={globalStyles.subHeading}>
            {t('Overallscore')}
            <Text
              allowFontScaling={false}
              style={{ color: percentage > 35 ? '#1A8825' : 'red' }}
            >
              {' '}
              {percentage}%
            </Text>
          </Text>
          <Text allowFontScaling={false} style={styles.smileyText}>
            {percentage > 35 && `😄`}
          </Text>
        </View>
      );
      break;
    case 'In_Progress':
      content = (
        <View style={globalStyles.flexrow}>
          <Text allowFontScaling={false} style={globalStyles.subHeading}>
            {t('Inprogress')}
          </Text>
        </View>
      );
      break;
    default:
      content = (
        <View style={globalStyles.flexrow}>
          <Text allowFontScaling={false} style={globalStyles.subHeading}>
            {t('not_started')}
          </Text>
        </View>
      );
  }

  return <View>{content}</View>;
};

const TestBox = ({ testText, status, percentage }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('TestView', { title: testText });
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.card}>
          <IconConditions status={status} styles={styles} />
          <View style={styles.rightContainer}>
            <Text allowFontScaling={false} style={globalStyles.subHeading}>
              {t(testText)}
            </Text>

            <StatusCondition
              status={status}
              styles={styles}
              t={t}
              percentage={percentage}
            />
          </View>
          <View style={styles.rightArrow}>
            <MaterialIcons name="navigate-next" size={32} color="black" />
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

TestBox.propTypes = {
  testText: PropTypes.string,
  status: PropTypes.string,
  percentage: PropTypes.string,
};
IconConditions.propTypes = {
  status: PropTypes.string,
  styles: PropTypes.object,
};
StatusCondition.propTypes = {
  status: PropTypes.string,
  styles: PropTypes.object,
  t: PropTypes.any,
  percentage: PropTypes.any,
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D0C5B4',
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
