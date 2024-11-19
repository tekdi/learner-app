import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

export const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [images.length]);

  return (
    <View style={styles.container}>
      {/* Carousel Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: images[currentIndex] }} style={styles.image} />
      </View>

      {/* Indicator Dots */}
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index
                ? styles.activeIndicator
                : styles.inactiveIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    marginBottom: 20,
    overflow: 'hidden',
    borderRadius: 10,
    // borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  indicatorContainer: {
    flexDirection: 'row',
    // marginTop: 10,
    top: -50,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: 'blue',
  },
  inactiveIndicator: {
    backgroundColor: 'gray',
  },
});
