import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { translateDigits } from '../../utils/JsHelper/Helper';
import globalStyles from '../../utils/Helper/Style';

import GlobalText from '@components/GlobalText/GlobalText';

const ProgressBarCustom = ({
  progress,
  language,
  width,
  color,
  horizontal,
}) => {
  return (
    <SafeAreaView style={globalStyles.flexrow}>
      <View style={[styles.container, { width }]}>
        {/* Progress Bar */}
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
              backgroundColor: progress >= 50 ? 'green' : 'red',
            },
          ]}
        />
        {/* Percentage Label */}
      </View>
      <GlobalText style={[styles.label, { color: color }]}>
        {translateDigits(progress, language) === null
          ? `0%`
          : `${translateDigits(progress, language)} %`}
      </GlobalText>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center vertically
    backgroundColor: '#3A3A3ACC',
    borderRadius: 5,
    height: 10,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ff0000',
    borderRadius: 5,
    width: 100,
  },
  label: {
    marginLeft: 5, // Space between progress bar and label
    fontSize: 12,
    color: '#fff',
  },
});

export default ProgressBarCustom;
