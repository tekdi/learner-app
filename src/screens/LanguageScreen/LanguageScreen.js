import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  ScrollView,
  View,
} from 'react-native';
import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import CustomCard from '../../components/CustomCard/CustomCard';
import Logo from '../../assets/images/png/logo.png';
import CustomBottomCard from '../../components/CustomBottomCard/CustomBottomCard';
import { languages } from './Languages';
import { useNavigation } from '@react-navigation/native';
import HorizontalLine from '../../components/HorizontalLine/HorizontalLine';
//import env variables
import Config from 'react-native-config';

//multi language
import { useTranslation } from '../../context/LanguageContext';

const LanguageScreen = () => {
  //multi language setup
  const { t, setLanguage, language } = useTranslation();
  const changeLanguage = (lng) => {
    setLanguage(lng);
  };

  const renderItem = ({ item }) => (
    <CustomCard
      key={item.value}
      title={item.title}
      clickEvent={changeLanguage}
      value={item.value}
      active={item.value == language ? true : false}
    />
  );

  const navigation = useNavigation();
  const handlethis = () => {
    navigation.navigate('LoginSignUpScreen');
  };
  return (
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
        <Text category="s1" style={styles.title}>
          {t('welcome')}! 😊
        </Text>
        <Text style={styles.subtitle}>{t('choose_language')}</Text>
        <Text category="p1" style={styles.description}>
          {t('select_language')}
        </Text>
        {/* List of Languages */}
        <View>
          <FlatList
            showsVerticalScrollIndicator={true}
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
});

export default LanguageScreen;
