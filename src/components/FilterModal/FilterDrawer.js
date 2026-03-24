import globalStyles from '@src/utils/Helper/Style';
import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

const FilterDrawer = ({ isVisible, onClose, children }) => {
  const translateX = useRef(new Animated.Value(isVisible ? 0 : -DRAWER_WIDTH)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isVisible ? 0 : -DRAWER_WIDTH,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={globalStyles.text}>X</Text>
      </TouchableOpacity>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
});

export default FilterDrawer;