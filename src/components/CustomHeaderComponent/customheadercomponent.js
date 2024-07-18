import {
  Image,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import Logo from '../../assets/images/png/form.png';
import { useTranslation } from '../../context/LanguageContext';

const HeaderComponent = ({ question, questionIndex, totalForms }) => {
  const { t } = useTranslation();
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.block}>
        <Image style={styles.image} source={Logo} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.text1}>
            {questionIndex}/{totalForms}
          </Text>
          <Text style={styles.text2}>{t(question)}</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  image: {
    margin: 20,
    height: 90,
    width: 70,
  },
  container: {
    backgroundColor: 'white',
    maxHeight: 120,
    flex: 1,
  },
  text1: {
    color: '#7C766F',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginRight: 15,
  },
  text2: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 20,
    flexWrap: 'wrap',
  },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderColor: 'black',
    // borderWidth: 1,
    padding: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default HeaderComponent;
