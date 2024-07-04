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
    <View>
      <View style={styles.overlap}>
        <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
          <CustomButton onPress={onPress} text={t('continue')}></CustomButton>
          <Text
            category="p2"
            style={{
              marginTop: 10,
              color: '#635E57',
              fontFamily: 'Poppins-Regular',
              textAlign: 'center',
            }}
          >
            {t('language_help')}
          </Text>
        </Layout>
      </View>
    </View>
  );
};
CustomBottomCard.propTypes = {
  onPress: PropTypes.func,
};
const styles = StyleSheet.create({
  overlap: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    bottom: 0,
    left: 0,
    right: 0,
    top: 5,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 0,
    borderWidth: 0.7,
    borderColor: '#ffffff',
    borderTopColor: '#cccccc',
  },
});
export default CustomBottomCard;
