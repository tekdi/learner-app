import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBarCustom = ({ progress, width }) => {
  return (
    <View style={[styles.container, { width }]}>
      {/* Progress Bar */}
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
      {/* Percentage Label */}
      <Text style={styles.label}>{`${progress}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center vertically
    backgroundColor: '#3A3A3ACC',
    borderRadius: 5,
    height: 18,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ff0000',
    borderRadius: 5,
  },
  label: {
    marginLeft: 10, // Space between progress bar and label
    fontSize: 12,
    color: '#fff',
  },
});

export default ProgressBarCustom;
