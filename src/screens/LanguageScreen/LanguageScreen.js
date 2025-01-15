import React, { useEffect, useState } from 'react';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import { Layout } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/images/png/logo.png';
import CustomBottomCard from '../../components/CustomBottomCard/CustomBottomCard';
import HorizontalLine from '../../components/HorizontalLine/HorizontalLine';
import CustomCardLanguage from '../../components/CustomCardLanguage/CustomCardLanguage';
import AppUpdatePopup from '../../components/AppUpdate/AppUpdatePopup';
import { languages } from '@context/Languages';
// Multi-language context
import { useTranslation } from '../../context/LanguageContext';

import FastImage from '@changwoolab/react-native-fast-image';

import {
  getActiveCohortData,
  getActiveCohortIds,
  getDataFromStorage,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import {
  getCohort,
  getProgramDetails,
  refreshToken,
} from '../../utils/API/AuthService';
import Loading from '../LoadingScreen/Loading';
import { useInternet } from '../../context/NetworkContext';
import { alterTable, createTable } from '../../utils/JsHelper/SqliteHelper';

import GlobalText from '@components/GlobalText/GlobalText';

const CopilotView = walkthroughable(View); // Wrap Text to make it interactable

// Make the Text component walkthroughable for the copilot tutorial
const LanguageScreen = () => {
  const { start, copilotEvents } = useCopilot();
  const navigation = useNavigation();
  const { t, setLanguage, language } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [CopilotStarted, setCopilotStarted] = useState(false);
  const { isConnected } = useInternet();

  // Listen to tutorial start and stop events
  useEffect(() => {
    if (!CopilotStarted) {
      start();
      copilotEvents.on('start', () => setCopilotStarted(true));
    }
  }, [start]);

  const getProgramData = async () => {
    const data = await getProgramDetails();

    // console.log('################ getProgramData', JSON.stringify(data));

    await setDataInStorage('tenantDetails', JSON.stringify(data));
  };

  const setCurrentCohort = async () => {
    const tenantData = JSON.parse(await getDataFromStorage('tenantData'));
    const tenantid = tenantData?.[0]?.tenantId;
    const user_id = await getDataFromStorage('userId');
    const academicYearId = await getDataFromStorage('academicYearId');
    // console.log({ tenantid });
    const cohort = await getCohort({
      user_id,
      tenantid,
      academicYearId,
    });
    const getActiveCohort = await getActiveCohortData(cohort?.cohortData);
    const getActiveCohortId = await getActiveCohortIds(cohort?.cohortData);
    const cohort_id = getActiveCohortId?.[0];
    // console.log({ cohort_id });

    await setDataInStorage(
      'cohortData',
      JSON.stringify(getActiveCohort?.[0]) || ''
    );
    await setDataInStorage(
      'cohortId',
      cohort_id || '00000000-0000-0000-0000-000000000000'
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
      await createTable({ tableName, columns });
      //asessment_offline_2
      tableName = 'Asessment_Offline_2';
      columns = [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'user_id TEXT',
        'content_id TEXT',
        'payload TEXT',
      ];
      await createTable({
        tableName,
        columns,
      });
      //telemetry_offline
      tableName = 'Telemetry_Offline';
      columns = [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'user_id TEXT',
        'telemetry_object TEXT',
      ];
      await createTable({ tableName, columns });
      //Tracking_Offline_2
      tableName = 'Tracking_Offline_2';
      columns = [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'user_id TEXT',
        'course_id TEXT',
        'content_id TEXT',
        'content_type TEXT',
        'content_mime TEXT',
        'lastAccessOn TEXT',
        'detailsObject TEXT',
      ];
      await createTable({ tableName, columns });

      //alter table for new columns add
      //add unit_id in Tracking_Offline_2
      tableName = 'Tracking_Offline_2';
      columns = ['unit_id TEXT'];
      await alterTable({
        tableName,
        newColumns: columns,
      });
      const cohort_id = await getDataFromStorage('cohortId');
      const token = await getDataFromStorage('Accesstoken');
      const userType = await getDataFromStorage('userType');
      console.log('userType', userType);

      if (token) {
        if (isConnected) {
          const refresh_token = await getRefreshToken();
          const data = await refreshToken({
            refresh_token: refresh_token,
          });
          if (token && data?.access_token) {
            await saveAccessToken(data?.access_token);
            await saveRefreshToken(data?.refresh_token);
            if (
              cohort_id !== '00000000-0000-0000-0000-000000000000' ||
              userType === 'scp'
            ) {
              await setCurrentCohort(cohort_id);
              navigation.navigate('SCPUserTabScreen');
            } else {
              if (userType === 'youthnet') {
                navigation.navigate('YouthNetTabScreen');
              } else {
                navigation.navigate('Dashboard');
              }
            }
          } else if (token) {
            if (
              cohort_id !== '00000000-0000-0000-0000-000000000000' ||
              userType === 'scp'
            ) {
              await setCurrentCohort(cohort_id);
              navigation.navigate('SCPUserTabScreen');
            } else {
              if (userType === 'youthnet') {
                navigation.navigate('YouthNetTabScreen');
              } else {
                navigation.navigate('Dashboard');
              }
            }
          } else {
            setLoading(false);
          }
        } else {
          if (
            cohort_id !== '00000000-0000-0000-0000-000000000000' ||
            userType === 'scp'
          ) {
            // await setCurrentCohort(cohort_id);
            navigation.navigate('SCPUserTabScreen');
          } else {
            if (userType === 'youthnet') {
              navigation.navigate('YouthNetTabScreen');
            } else {
              navigation.navigate('Dashboard');
            }
          }
        }
      } else {
        setLoading(false);
      }
      await getProgramData();
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
    navigation.navigate('LoginSignUpScreen');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppUpdatePopup />
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />

      <Layout style={styles.container}>
        <Image style={styles.image} source={Logo} resizeMode="contain" />
        {/* Text Samples here */}
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <GlobalText category="s1" style={styles.title}>
            {t('welcome')}!
          </GlobalText>
          {/* Use to load gif and images fast */}
          <FastImage
            style={styles.gif_image}
            source={require('../../assets/images/gif/smile.gif')}
            resizeMode={FastImage.resizeMode.contain}
            priority={FastImage.priority.high} // Set the priority here
          />
        </View>
        <GlobalText style={styles.subtitle}>{t('choose_language')}</GlobalText>
        <GlobalText category="p1" style={styles.description}>
          {t('select_language')}
        </GlobalText>
        <CopilotStep text={t('select_language')} order={1} name="start">
          <CopilotView style={{ width: '100%' }}>
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
            </View>
          </CopilotView>
        </CopilotStep>
        <View style={{ top: -10 }}>
          <HorizontalLine />
          <CustomBottomCard
            onPress={handlethis}
            copilotStepText="click_here_to_continue"
            copilotStepOrder={2}
            copilotStepName="continueButton"
          />
        </View>
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
    color: 'black',
  },
  subtitle: {
    marginTop: 5,
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
  description: {
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
    color: 'black',
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
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
});

LanguageScreen.propTypes = {};

export default LanguageScreen;
