import globalStyles from '@src/utils/Helper/Style';
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8; // 80% width of the screen

const FilterDrawer = ({ isVisible, onClose, children }) => {
  const translateX = useSharedValue(isVisible ? 0 : -DRAWER_WIDTH);

  React.useEffect(() => {
    translateX.value = withSpring(isVisible ? 0 : -DRAWER_WIDTH);
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
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FilterDrawer;
