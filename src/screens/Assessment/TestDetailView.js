import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import { useInternet } from '../../context/NetworkContext';
import Icon from 'react-native-vector-icons/FontAwesome6';
import HorizontalLine from '../../components/HorizontalLine/HorizontalLine';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import {
  capitalizeFirstLetter,
  convertSecondsToMinutes,
} from '../../utils/JsHelper/Helper';
import globalStyles from '../../utils/Helper/Style';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import { getData } from '../../utils/Helper/JSHelper';

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
  const { t } = useTranslation();
  const { isConnected } = useInternet();
  const [networkstatus, setNetworkstatus] = useState(true);

  const navigation = useNavigation();

  const handlethis = async () => {
    let content_do_id = data?.IL_UNIQUE_ID;
    let contentObj = await getData(content_do_id, 'json');
    if (contentObj == null) {
      if (isConnected) {
        setNetworkstatus(true);

        navigation.navigate('StandAlonePlayer', {
          content_do_id: data?.IL_UNIQUE_ID,
          content_mime_type: data?.mimeType,
          isOffline: false,
          title: title,
        });
      } else {
        setNetworkstatus(false);
      }
    } else {
      navigation.navigate('StandAlonePlayer', {
        content_do_id: data?.IL_UNIQUE_ID,
        content_mime_type: data?.mimeType,
        isOffline: false,
        title: title,
      });
    }
  };

  return (
    <SafeAreaView style={{ paddingTop: 40, flex: 1 }}>
      <View style={styles.View}>
        <Text allowFontScaling={false} style={globalStyles.heading}>
          {t(capitalizeFirstLetter(title))}
        </Text>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="xmark" color="black" size={30} style={styles.icon} />
        </Pressable>
      </View>
      <ScrollView>
        <View style={styles.testcard}>
          <View style={[globalStyles.flexrow, { marginBottom: 10 }]}>
            <View>
              <Text allowFontScaling={false} style={styles.texttime}>
                {time}
              </Text>
            </View>
            <View>
              <Text allowFontScaling={false} style={styles.textMin}>
                {t('MIN')}
              </Text>
              <Text allowFontScaling={false} style={styles.textMin}>
                {data?.name}
              </Text>
            </View>
          </View>
          <HorizontalLine />
          <View>
            <Text
              allowFontScaling={false}
              style={[globalStyles.text, { marginTop: 10 }]}
            >
              {data?.description}
            </Text>
          </View>
          <View>
            <Text allowFontScaling={false} style={styles.textmed}>
              {t('test_medium')}
            </Text>
            <Text allowFontScaling={false} style={styles.mediumText}>
              {data?.medium?.[0]}
            </Text>
          </View>
          <View>
            <Text allowFontScaling={false} style={styles.textmed}>
              {t('board')}
            </Text>
            <Text allowFontScaling={false} style={styles.mediumText}>
              {data?.board}
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            allowFontScaling={false}
            style={[
              globalStyles.subHeading,
              { fontWeight: '700', paddingVertical: 20 },
            ]}
          >
            {t('general_instructions')}
          </Text>
          {instructions.map((item) => {
            return (
              <View key={item.id.toString()} style={styles.itemContainer}>
                <Text allowFontScaling={false} style={styles.bullet}>
                  {'\u2022'}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[globalStyles.subHeading]}
                >
                  {t(item.title)}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <PrimaryButton text={t('start_test')} onPress={() => handlethis()} />
      </View>
      <NetworkAlert
        onTryAgain={handlethis}
        isConnected={networkstatus}
        closeModal={() => {
          setNetworkstatus(!networkstatus);
        }}
      />
    </SafeAreaView>
  );
};

TestDetailView.propTypes = {
  route: PropTypes.any,
};

const styles = StyleSheet.create({
  bullet: {
    fontSize: 32,
    marginRight: 10,
    color: '#000',
    top: -10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20, // match the padding of container
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

  texttime: {
    fontSize: 50,
    fontWeight: '700',
    fontFamily: 'Poppins-Regular',
    color: '#DAA200',
    marginRight: 10,
  },
  textMin: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    fontWeight: '700',
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
    fontFamily: 'Poppins-Regular',
    color: '#7C766F',
  },
  mediumText: {
    fontSize: 16,
    marginTop: 10,
    color: '#000',
    fontFamily: 'Poppins-Regular',
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
