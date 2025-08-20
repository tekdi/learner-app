import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import FastImage from '@changwoolab/react-native-fast-image';

const RocketImageClub = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <FastImage
          style={styles.img}
          source={require('../../assets/images/gif/runningrocket.gif')}
          resizeMode={FastImage.resizeMode.contain}
          priority={FastImage.priority.high} // Set the priority here
        />
        <FastImage
          style={styles.imgflag}
          source={require('../../assets/images/gif/flag.gif')}
          resizeMode={FastImage.resizeMode.contain}
          priority={FastImage.priority.high} // Set the priority here
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row', // Arrange items in a row (horizontally)
    // justifyContent: 'space-between', // Adjust spacing between images
    // alignItems: 'center', // Align items vertically centered
    // padding: 10, // Add some padding to the container if needed
  },
  img: {
    width: 100,
    height: 100,
    top: 0,
    position: 'absolute',
    // marginRight: 10, // Add spacing between the images
  },

  imgflag: {
    width: 30,
    height: 30,
    top: 30,
    left: 10,
    position: 'absolute',
  },
});

export default RocketImageClub;
