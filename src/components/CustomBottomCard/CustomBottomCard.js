import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import React from 'react';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { Layout } from '@ui-kitten/components';
import { useTranslation } from '../../context/LanguageContext';

import GlobalText from '@components/GlobalText/GlobalText';
import { CopilotStep, walkthroughable } from 'react-native-copilot';

const CopilotView = walkthroughable(View);

const CustomBottomCard = ({
  onPress,
  copilotStepText,
  copilotStepOrder,
  copilotStepName,
}) => {
  //multi language setup
  const { t } = useTranslation();

  return (
    <View style={styles.overlap}>
      <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
        <GlobalText
          category="p2"
          style={{
            marginBottom: 10,
            color: '#635E57',
            fontFamily: 'Poppins-Regular',
            textAlign: 'center',
          }}
        >
          {t('language_help')}
        </GlobalText>
        <CopilotStep
          text={t(copilotStepText)}
          order={copilotStepOrder}
          name={copilotStepName}
        >
          <CopilotView>
            <PrimaryButton onPress={onPress} text="Continue" />
          </CopilotView>
        </CopilotStep>
      </Layout>
    </View>
  );
};
CustomBottomCard.propTypes = {
  onPress: PropTypes.func,
  copilotStepText: PropTypes.string.isRequired,
  copilotStepOrder: PropTypes.number.isRequired,
  copilotStepName: PropTypes.string.isRequired,
};
const styles = StyleSheet.create({
  overlap: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    padding: 5,
  },
});
export default CustomBottomCard;
