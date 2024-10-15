import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { translateDigits } from '../../utils/JsHelper/Helper';

const ProgressBarCustom = ({ progress, language, width }) => {
  return (
    <>
      <View style={[styles.container, { width }]}>
        {/* Progress Bar */}
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
        {/* Percentage Label */}
      </View>
      <Text allowFontScaling={false} style={styles.label}>{`${translateDigits(
        progress,
        language
      )}%`}</Text>
    </>
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
  },
  label: {
    marginLeft: 5, // Space between progress bar and label
    fontSize: 12,
    color: '#fff',
  },
});

export default ProgressBarCustom;
