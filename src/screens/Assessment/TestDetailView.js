import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import Icon from 'react-native-vector-icons/FontAwesome6';
import HorizontalLine from '../../components/HorizontalLine/HorizontalLine';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { convertSecondsToMinutes } from '../../utils/JsHelper/Helper';
import moment from 'moment';

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

const TestDetailView = ({ route }) => {
  const { title, data } = route.params;
  const time = convertSecondsToMinutes(JSON.parse(data?.timeLimits)?.maxTime);
  const publishDate = moment(data?.lastPublishedOn).format('DD-MM-YYYY');
  const { t } = useTranslation();

  const navigation = useNavigation();

  console.log({ time, publishDate, data });

  const handlethis = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ paddingTop: 40, flex: 1 }}>
      <View style={styles.View}>
        <Text style={styles.text}>{t(title)}</Text>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="xmark" color="black" size={30} style={styles.icon} />
        </Pressable>
      </View>
      <ScrollView style={styles.mapContainer}>
        <View style={styles.testcard}>
          <View style={styles.testcardContainer}>
            <View>
              <Text style={styles.texttime}>{time}</Text>
            </View>
            <View>
              <Text style={styles.textMin}>{t('MIN')}</Text>
              <Text style={styles.textMin}>{data?.name}</Text>
            </View>
          </View>
          <HorizontalLine />
          <View>
            <Text style={styles.textXam}>{data?.description}</Text>
          </View>
          <View>
            <Text style={styles.textmed}>{t('Test_Medium')}</Text>
            <Text style={styles.mediumText}>{data?.medium?.[0]}</Text>
          </View>
          <View>
            <Text style={styles.textmed}>{t('Board')}</Text>
            <Text style={styles.mediumText}>{data?.board}</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={[
              styles.text,
              { fontWeight: '500', paddingVertical: 20, fontSize: 18 },
            ]}
          >
            {t('General_Instructions')}
          </Text>
          {instructions.map((item) => {
            return (
              <View key={item?.title} style={styles.itemContainer}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.itemText}>{t(item.title)}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <PrimaryButton text={'start_test'} onPress={handlethis} />
      </View>
    </SafeAreaView>
  );
};

TestDetailView.propTypes = {
  route: PropTypes.any,
};

const styles = StyleSheet.create({
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
  text: {
    fontSize: 26,
    color: '#000',
    fontWeight: '500',
  },
  View: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    shadowColor: '#00000026', // iOS shadow
    shadowOffset: { width: 0, height: 15 }, // iOS shadow
    shadowOpacity: 1, // iOS shadow
    borderBottomWidth: 1.5,
    borderBottomColor: '#00000026',
  },
  testcard: {
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
    color: '#000',
    marginTop: 40,
    backgroundColor: 'white',
    // Android shadow
    elevation: 5,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  testcardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom: 10,
  },
  texttime: {
    fontSize: 50,
    fontWeight: '500',
    color: '#DAA200',
    marginRight: 10,
  },
  textMin: {
    fontSize: 18,
    fontWeight: '500',
    color: '#DAA200',
    flexWrap: 'wrap',
    width: '90%', // Add this line to make sure the text wraps within the container
    flexShrink: 1, // Ensure the text doesn't overflow the container
  },
  textXam: {
    marginTop: 10,
    color: '#000',
  },
  textmed: {
    fontSize: 16,
    marginTop: 10,
    color: '#7C766F',
  },
  mediumText: {
    fontSize: 16,
    marginTop: 10,
    color: '#000',
    fontWeight: '500',
  },

  bottom: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    shadowColor: '#00000026', // iOS shadow
    shadowOffset: { width: 0, height: 15 }, // iOS shadow
    shadowOpacity: 1, // iOS shadow
    borderTopWidth: 1.5,
    borderTopColor: '#00000026',
  },
});

export default TestDetailView;
