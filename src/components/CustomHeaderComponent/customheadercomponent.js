import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';
import FastImage from '@changwoolab/react-native-fast-image';

const HeaderComponent = ({ question, questionIndex, totalForms }) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.block}>
        {/* <Image style={styles.image} source={Logo} resizeMode="contain" /> */}
        <FastImage
          style={styles.image}
          source={require('../../assets/images/gif/pen_paper.gif')}
          resizeMode={FastImage.resizeMode.contain}
          priority={FastImage.priority.high} // Set the priority here
        />
        <View style={styles.textContainer}>
          <Text style={styles.text1}>
            {questionIndex}/{totalForms}
          </Text>
          <Text style={styles.text2}>{t(question)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

HeaderComponent.propTypes = {
  question: PropTypes.string,
  questionIndex: PropTypes.number,
  totalForms: PropTypes.number,
};

const styles = StyleSheet.create({
  image: {
    margin: 20,
    height: 60,
    width: 60,
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
    padding: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default HeaderComponent;
