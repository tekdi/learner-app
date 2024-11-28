import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import public_img from '../../assets/images/png/public.png';

export const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Debugging logs
  // console.log('Images array:', images);
  // console.log('Current index:', currentIndex);

  useEffect(() => {
    setLoading(true);
    if (!images || images.length === 0) {
      console.warn('No images provided to ImageCarousel.');
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    setLoading(false);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [images]);

  // Fallback for empty or invalid images array
  if (!images || images.length === 0) {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.noImageText}>No Images Available</Text> */}
        <Image source={public_img} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Carousel Image */}
      <View style={styles.imageContainer}>
        {loading ? (
          <ActiveLoading />
        ) : (
          <Image source={{ uri: images[currentIndex] }} style={styles.image} />
        )}
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
    width: '100%',
    // height: 300,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    marginBottom: 20,
    overflow: 'hidden',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
  },
  indicator: {
    width: 20,
    height: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#FDBE16',
    width: 25,
  },
  inactiveIndicator: {
    backgroundColor: 'gray',
  },
  noImageText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});
