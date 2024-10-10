import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';
import FastImage from '@changwoolab/react-native-fast-image';
import backIcon from '../../assets/images/png/arrow-back-outline.png';

const HeaderComponent = ({ question, questionIndex, totalForms }) => {
  const { t } = useTranslation();

  return (
    question && (
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
            <Text allowFontScaling={false} style={styles.text1}>
              {questionIndex}/{totalForms}
            </Text>
            <Text allowFontScaling={false} style={styles.text2}>
              {t(question)}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    )
  );
};

HeaderComponent.propTypes = {
  question: PropTypes.string,
  questionIndex: PropTypes.number,
  totalForms: PropTypes.number,
};

const styles = StyleSheet.create({
  image: {
    marginHorizontal: 20,
    height: 60,
    width: 60,
  },
  container: {
    backgroundColor: 'white',
    maxHeight: 90,
    flex: 1,
    marginBottom: 15,
    // borderWidth: 1,
  },
  text1: {
    color: '#7C766F',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginRight: 15,
  },
  text2: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 16,
    flexWrap: 'wrap',
  },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    // borderWidth: 1,
  },
});

export default HeaderComponent;
