import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Layout/Header';
import { backAction } from '../../utils/JsHelper/Helper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';
import ContentCard from '../../components/ContentCard/ContentCard';
import ScrollViewLayout from '../../components/Layout/ScrollViewLayout';
import { useTranslation } from '../../context/LanguageContext';
import wave from '../../assets/images/png/wave.png';
import ContentBox from '../../components/ContentBox/ContentBox';
import HorizontalLine from '../../components/HorizontalLine/HorizontalLine';
import { contentListApi } from '../../utils/API/AuthService';
import Loading from '../LoadingScreen/Loading';

const Content = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BackHandler.addEventListener('backAction', backAction);

    return () => {
      BackHandler.removeEventListener('backAction', backAction);
    };
  }, [navigation]);

  const handlePress = () => {
    navigation.navigate('Preference');
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await contentListApi();
      setData(data?.content);
      setLoading(false);
    };
    fetchData();
  }, []);

  // const data = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <SafeAreaView>
      <Header />
      <View style={styles.view}>
        {loading ? (
          <Loading style={{ top: 300 }} />
        ) : (
          <>
            <Text style={styles.text}>{t('Learning_Content')}</Text>
            <View style={styles.view2}>
              <Image source={wave} resizeMode="contain" />
              <Text style={styles.text2}>{t('welcome')}, Ameya!</Text>
            </View>
            <ScrollViewLayout horizontalScroll={false}>
              <ContentBox
                title={'Continue_Learning'}
                description={'Food_Production'}
                style={{ titlecolor: '#06A816' }}
                viewAllLink={() =>
                  navigation.navigate('ViewAll', {
                    title: 'Continue_Learning',
                    data: data,
                  })
                }
                ContentData={data}
              />
              <HorizontalLine />
              <TouchableOpacity onPress={handlePress}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 10,
                    width: '98%',
                    padding: 20,
                    marginTop: 10,
                    backgroundColor: '#ffdea1',
                  }}
                >
                  <Text
                    style={[
                      styles.description,
                      { color: 'black', width: '90%' },
                    ]}
                  >
                    {t(
                      'Update_your_preferences_to_get_the_best_picks_just_for_you'
                    )}
                  </Text>
                  <Icon
                    name="arrow-right"
                    style={{ marginHorizontal: 10 }}
                    color={'black'}
                    size={20}
                  />
                </View>
              </TouchableOpacity>
              <ContentBox
                title={'Based_on_Your_Interests'}
                description={'Financial_Literacy'}
                style={{ titlecolor: '#785913' }}
                viewAllLink={() =>
                  navigation.navigate('ViewAll', {
                    title: 'Based_on_Your_Interests',
                  })
                }
                ContentData={data}
              />

              <ContentBox
                description={'Conceptual_Thinking'}
                viewAllLink={() =>
                  navigation.navigate('ViewAll', {
                    title: 'Conceptual_Thinking',
                  })
                }
                ContentData={data}
              />

              <HorizontalLine />

              <ContentBox
                title={'Todays_Top_Pick'}
                description={'Art'}
                style={{ titlecolor: '#785913' }}
                viewAllLink={() => navigation.navigate('ViewAll')}
                ContentData={data}
              />
              <HorizontalLine />
            </ScrollViewLayout>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    top: 40,
    width: '100%',
    //backgroundColor: 'white',
    padding: 15,
  },
  view2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  image: {
    height: 30,
    width: 20,
  },
  text: { fontSize: 26, color: 'black', fontWeight: '500' },
  text2: {
    fontSize: 14,
    color: 'black',
    marginLeft: 10,
    fontWeight: '500',
  },
});

export default Content;
