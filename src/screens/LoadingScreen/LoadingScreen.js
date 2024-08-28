import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Loading from './Loading';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LanguageScreen'); // Replace 'LanguageScreen' with your target route name
    }, 500); // 500 milliseconds = 0.5 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigation]);

  return <Loading />;
};

LoadingScreen.propTypes = {
  navigation: PropTypes.any,
};

export default LoadingScreen;
