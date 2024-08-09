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
import { useTranslation } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryButton from '../SecondaryButton/SecondaryButton';
import { convertSecondsToMinutes } from '../../utils/JsHelper/Helper';
import moment from 'moment';

const SubjectBox = ({ name, disabled, data }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const time = convertSecondsToMinutes(JSON.parse(data?.timeLimits)?.maxTime);
  // const IL_UNIQUE_ID = data?.IL_UNIQUE_ID;
  // console.log('time', IL_UNIQUE_ID);

  const handlePress = () => {
    navigation.navigate('AnswerKeyView', { title: name });
  };

  return (
    <SafeAreaView>
      <TouchableOpacity disabled={disabled} onPress={handlePress}>
        <View style={styles.card}>
          <View style={styles.rightContainer}>
            <Text style={styles.preTestText}>{t(name)}</Text>
            {disabled ? (
              <Text style={[styles.preTestText, { color: '#7C766F' }]}>
                {t('not_started')}
              </Text>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#000' }}>
                  {data?.totalScore}/{data?.totalMaxScore}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}
                >
                  <Icon name="circle" size={8} color="#7C766F" />
                  <Text
                    style={[
                      styles.preTestText,
                      { color: '#7C766F', marginLeft: 5 },
                    ]}
                  >
                    {moment(data?.lastAttemptedOn).format('DD-MM-YYYY')}
                  </Text>
                </View>
              </View>
            )}
          </View>
          {data?.lastAttemptedOn ? (
            <Icon name="chevron-right" size={24} color="black" />
          ) : (
            <SecondaryButton
              onPress={() => {
                navigation.navigate('TestDetailView', {
                  title: name,
                  data: data,
                });
              }}
              text={'take_the_test'}
            />
          )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

SubjectBox.propTypes = {
  name: PropTypes.string,
  data: PropTypes.any,
  disabled: PropTypes.bool,
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
    padding: 10,
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
    marginVertical: 5,
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

export default SubjectBox;
