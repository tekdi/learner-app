import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import React from 'react';
import CustomButton from '../CustomButton/CustomButton';
import { Layout, Text } from '@ui-kitten/components';
import { useTranslation } from '../../context/LanguageContext';

const CustomBottomCard = ({ onPress }) => {
  //multi language setup
  const { t } = useTranslation();

  return (
    <View style={styles.overlap}>
      <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
        <CustomButton onPress={onPress} text={t('continue')}></CustomButton>
        <Text
          category="p2"
          style={{ color: '#635E57', fontFamily: 'Poppins-Regular' }}
        >
          {t('language_help')}
        </Text>
      </Layout>
    </View>
  );
};
CustomBottomCard.propTypes = {
  onPress: PropTypes.func,
};
const styles = StyleSheet.create({
  overlap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 3,
    borderWidth: 0.7,
    elevation: 10,
    borderColor: '#cccccc',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.7, // Increase this value for a darker shadow
    shadowRadius: 10,
    height: "13%"
  },
});
export default CustomBottomCard;
