import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import React from 'react';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { Layout } from '@ui-kitten/components';
import { useTranslation } from '../../context/LanguageContext';

import GlobalText from '@components/GlobalText/GlobalText';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import globalStyles from '../../utils/Helper/Style';

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
        <CopilotStep
          text={t(copilotStepText)}
          order={copilotStepOrder}
          name={copilotStepName}
        >
          <CopilotView>
            <PrimaryButton onPress={onPress} text="Continue" />
          </CopilotView>
        </CopilotStep>
        <GlobalText
          category="p2"
          style={[
            globalStyles.text,
            {
              marginTop: 10,
            },
          ]}
        >
          {t('language_help')}
        </GlobalText>
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
    top: 10,
    padding: 5,
  },
});
export default CustomBottomCard;
