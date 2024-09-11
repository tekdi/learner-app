import React, { useState } from 'react';
import download from '../../assets/images/png/download.png';
import download_inprogress from '../../assets/images/png/download_inprogress.png';
import download_complete from '../../assets/images/png/download_complete.png';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

const DownloadCard = () => {
  const [downloadIcon, setDownloadIcon] = useState(download);

  const handleDownload = () => {
    setDownloadIcon(download_inprogress);
    setTimeout(() => {
      setDownloadIcon(download_complete);
    }, 1000);
  };

  return (
    <TouchableOpacity onPress={handleDownload}>
      <Image style={styles.img} source={downloadIcon} resizeMode="contain" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
});

DownloadCard.propTypes = {};

export default DownloadCard;
