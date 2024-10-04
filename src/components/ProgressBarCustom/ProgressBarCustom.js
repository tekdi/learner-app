import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBarCustom = ({ progress, width }) => {
  return (
    <>
      <View style={[styles.container, { width }]}>
        {/* Progress Bar */}
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
        {/* Percentage Label */}
      </View>
      <Text style={styles.label}>{`${progress}%`}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center vertically
    backgroundColor: '#000000',
    borderRadius: 5,
    height: 15,
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
