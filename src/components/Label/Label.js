import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../context/LanguageContext';

import GlobalText from '@components/GlobalText/GlobalText';
import globalStyles from '../../utils/Helper/Style';

const Label = ({ text }) => {
  const { t } = useTranslation();

  return <GlobalText style={globalStyles.h6}>{t(text)}</GlobalText>;
};

Label.propTypes = {
  text: PropTypes.string,
};

export default Label;
