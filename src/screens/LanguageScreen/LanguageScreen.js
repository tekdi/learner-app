import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import Logo from '../../assets/images/png/logo.png';
import CustomBottomCard from '../../components/CustomBottomCard/CustomBottomCard';
import { languages } from './Languages';
import { useNavigation } from '@react-navigation/native';
import HorizontalLine from '../../components/HorizontalLine/HorizontalLine';
//import env variables

//multi language
import { useTranslation } from '../../context/LanguageContext';
import CustomCardLanguage from '../../components/CustomCardLanguage/CustomCardLanguage';
import {
  getRefreshToken,
  getSavedToken,
  saveRefreshToken,
  saveToken,
} from '../../utils/JsHelper/Helper';
import { getAccessToken, refreshToken } from '../../utils/API/AuthService';
import Loading from '../LoadingScreen/Loading';
import FastImage from '@changwoolab/react-native-fast-image';

const LanguageScreen = () => {
  //multi language setup
  const { t, setLanguage, language } = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

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

  return loading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <Layout style={styles.container}>
        {/* Icon png here */}
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
        {/* List of Languages */}
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.list}
            data={languages}
            renderItem={renderItem}
            keyExtractor={(item) => item.value}
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
    height: '60%',
    marginTop: 20,
  },
  gif_image: {
    width: 50,
    height: 50,
    marginLeft: 5,
  },
});

export default LanguageScreen;
