import React, { useCallback, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  FlatList,
  View,
  ScrollView,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import { useTranslation } from '../../context/LanguageContext';
import ContentCard from './ContentCard';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';
import { contentListApi } from '../../utils/API/AuthService';
import SyncCard from '../../components/SyncComponent/SyncCard';
import BackButtonHandler from '../../components/BackNavigation/BackButtonHandler';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';
import wave from '../../assets/images/png/wave.png';

const Contents = () => {
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

  useEffect(() => {
    fetchData();
  }, [navigation]);

  const fetchData = async () => {
    const data = await contentListApi();
    const result = JSON.parse(await getDataFromStorage('profileData'));
    setUserInfo(result?.getUserDetails);
    setData(data?.content);
    setLoading(false);
  };

  const renderContentCard = ({ item, index }) => {
    return (
      <ContentCard
        item={item}
        index={index}
        course_id={item?.identifier}
        unit_id={item?.identifier}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SecondaryHeader logo />
      <ScrollView nestedScrollEnabled>
        <View style={styles.view}>
          {loading ? (
            <ActivityIndicator style={{ top: 300 }} />
          ) : (
            <SafeAreaView>
              <Text style={styles.text}>{t('Learning_Content')}</Text>
              <View style={styles.view2}>
                <Image source={wave} resizeMode="contain" />
                <Text style={styles.text2}>
                  {t('welcome')}, {userInfo?.[0]?.name}!
                </Text>
              </View>
              <SyncCard doneSync={fetchData} />
              <View>
                <FlatList
                  data={data}
                  renderItem={renderContentCard}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2} // Number of columns for side by side view
                  contentContainerStyle={styles.flatListContent}
                  columnWrapperStyle={styles.columnWrapper} // Adds space between columns
                  scrollEnabled={false}
                />
              </View>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    width: '100%',
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
  flatListContent: {
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Spacing between columns
    paddingHorizontal: 10,
  },
});

export default Contents;
