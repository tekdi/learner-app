import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/images/png/logo.png';
import CustomBottomCard from '../../components/CustomBottomCard/CustomBottomCard';
import HorizontalLine from '../../components/HorizontalLine/HorizontalLine';
import CustomCardLanguage from '../../components/CustomCardLanguage/CustomCardLanguage';
import { languages } from './Languages';
// Multi-language context
import { useTranslation } from '../../context/LanguageContext';

import FastImage from '@changwoolab/react-native-fast-image';

import {
  getDataFromStorage,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from '../../utils/JsHelper/Helper';
import { refreshToken } from '../../utils/API/AuthService';
import Loading from '../LoadingScreen/Loading';
import { useInternet } from '../../context/NetworkContext';
import { createTable } from '../../utils/JsHelper/SqliteHelper';

const LanguageScreen = () => {
  const navigation = useNavigation();
  const { t, setLanguage, language } = useTranslation();
  const [loading, setLoading] = useState(true);
  const { isConnected } = useInternet();

  useEffect(() => {
    const fetchData = async () => {
      //create tables local
      //APIResponses
      let tableName = 'APIResponses';
      let columns = [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'user_id TEXT',
        'api_url TEXT',
        'api_type TEXT',
        'payload TEXT',
        'response TEXT',
      ];
      const query_APIResponses = await createTable({ tableName, columns });
      console.log('query_APIResponses', query_APIResponses);
      //asessment_offline
      tableName = 'Asessment_Offline';
      columns = [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'user_id TEXT',
        'batch_id TEXT',
        'content_id TEXT',
        'payload TEXT',
      ];
      const query_Asessment_Offline = await createTable({ tableName, columns });
      console.log('query_Asessment_Offline', query_Asessment_Offline);
      //telemetry_offline
      tableName = 'Telemetry_Offline';
      columns = [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'user_id TEXT',
        'telemetry_object TEXT',
      ];
      const query_Telemetry_Offline = await createTable({ tableName, columns });
      console.log('query_Telemetry_Offline', query_Telemetry_Offline);
      //tracking_offline
      tableName = 'Tracking_Offline';
      columns = [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'user_id TEXT',
        'course_id TEXT',
        'batch_id TEXT',
        'content_id TEXT',
        'content_type TEXT',
        'content_mime TEXT',
        'lastAccessOn TEXT',
        'detailsObject TEXT',
      ];
      const query_Tracking_Offline = await createTable({ tableName, columns });
      console.log('query_Tracking_Offline', query_Tracking_Offline);

      const token = await getDataFromStorage('Accesstoken');
      if (token) {
        if (isConnected) {
          const refresh_token = await getRefreshToken();
          const data = await refreshToken({
            refresh_token: refresh_token,
          });
          if (token && data?.access_token) {
            await saveAccessToken(data?.access_token);
            await saveRefreshToken(data?.refresh_token);
            console.log('status successful');
            navigation.replace('Dashboard');
          } else {
            console.log('error');
            setLoading(false);
          }
        } else {
          navigation.replace('Dashboard');
        }
      } else {
        console.log('no Accesstoken');
        setLoading(false);
      }
    };
    fetchData();
  }, [navigation]);

  const changeLanguage = (lng) => {
    setLanguage(lng);
  };

  const renderItem = ({ item }) => (
    <CustomCardLanguage
      key={item.value}
      title={item.title}
      clickEvent={changeLanguage}
      value={item.value}
      active={item.value == language}
    />
  );

  const handlethis = () => {
    //direct login show
    // navigation.navigate('LoginScreen');
    //show register and content button
    navigation.navigate('LoginSignUpScreen');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <Layout style={styles.container}>
        <Image style={styles.image} source={Logo} resizeMode="contain" />
        {/* Text Samples here */}
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Text category="s1" style={styles.title}>
            {t('welcome')}!
          </Text>
          {/* Use to load gif and images fast */}
          <FastImage
            style={styles.gif_image}
            source={require('../../assets/images/gif/smile.gif')}
            resizeMode={FastImage.resizeMode.contain}
            priority={FastImage.priority.high} // Set the priority here
          />
        </View>
        <Text style={styles.subtitle}>{t('choose_language')}</Text>
        <Text category="p1" style={styles.description}>
          {t('select_language')}
        </Text>
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.list}
            data={languages}
            renderItem={renderItem}
            initialNumToRender={10} // Adjust the number of items to render initially
            maxToRenderPerBatch={10} // Number of items rendered per batch
            numColumns={2}
            windowSize={21} // Controls the number of items rendered around the current index
          />
          <HorizontalLine />
        </View>
        <CustomBottomCard onPress={handlethis} />
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    marginTop: 20,
    height: 50,
    width: 50,
  },
  title: {
    fontSize: 25,
    fontFamily: 'Poppins-Regular',
    marginTop: 15,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 5,
    fontFamily: 'Poppins-Bold',
  },
  description: {
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
  },
  list: {
    height: '55%',
    marginTop: 20,
  },
  gif_image: {
    width: 50,
    height: 50,
    marginLeft: 5,
  },
});

export default LanguageScreen;
