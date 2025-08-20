import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const ScrollViewLayout = ({ horizontalScroll, children }) => {
  const { width, height } = Dimensions.get('window');
  return (
    <SafeAreaView style={{ height: height }}>
      <ScrollView
        horizontal={horizontalScroll}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.gridContainer}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 200, // Add extra padding at the bottom
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
});

ScrollViewLayout.propTypes = {
  children: PropTypes.any,
  horizontalScroll: PropTypes.bool,
};

export default ScrollViewLayout;
