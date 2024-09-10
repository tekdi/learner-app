import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Layout/Header';
import {
  useFocusEffect,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';
import ScrollViewLayout from '../../components/Layout/ScrollViewLayout';
import { useTranslation } from '../../context/LanguageContext';
import wave from '../../assets/images/png/wave.png';
import ContentBox from '../../components/ContentBox/ContentBox';
import HorizontalLine from '../../components/HorizontalLine/HorizontalLine';
import { contentListApi, getAccessToken } from '../../utils/API/AuthService';
import SyncCard from '../../components/SyncComponent/SyncCard';
import BackButtonHandler from '../../components/BackNavigation/BackButtonHandler';

const Content = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [userInfo, setUserInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);

  const routeName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (routeName === 'Content') {
          setShowExitModal(true);
          return true; // Prevent default back behavior
        }
        return false; // Allow default back behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [routeName])
  );

  const handleExitApp = () => {
    setShowExitModal(false);
    BackHandler.exitApp(); // Exit the app
  };

  const handleCancel = () => {
    setShowExitModal(false); // Close the modal
  };

  const handlePress = () => {
    navigation.navigate('Preference');
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await contentListApi();
        const user_Info = await getAccessToken();
        setUserInfo(user_Info);
        setData(data?.content);
        setLoading(false);
      };
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, top: 40 }}>
      {/* <Header /> */}
      <View style={styles.view}>
        {loading ? (
          <ActivityIndicator style={{ top: 300 }} />
        ) : (
          <SafeAreaView>
            <Text style={styles.text}>{t('Learning_Content')}</Text>
            <View style={styles.view2}>
              <Image source={wave} resizeMode="contain" />
              <Text style={styles.text2}>
                {t('welcome')}, {userInfo?.result?.name} !
              </Text>
            </View>
            <SyncCard />

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
                    data: data,
                  })
                }
                ContentData={data}
              />

              <ContentBox
                description={'Conceptual_Thinking'}
                viewAllLink={() =>
                  navigation.navigate('ViewAll', {
                    title: 'Conceptual_Thinking',
                    data: data,
                  })
                }
                ContentData={data}
              />

              <HorizontalLine />

              <ContentBox
                title={'Todays_Top_Pick'}
                description={'Art'}
                style={{ titlecolor: '#785913' }}
                viewAllLink={() =>
                  navigation.navigate('ViewAll', {
                    title: 'Todays_Top_Pick',
                    data: data,
                  })
                }
                ContentData={data}
              />
              <HorizontalLine />
            </ScrollViewLayout>
          </SafeAreaView>
        )}
        {showExitModal && (
          <BackButtonHandler
            exitRoute={true} // You can pass any props needed by the modal here
            onCancel={handleCancel}
            onExit={handleExitApp}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
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
