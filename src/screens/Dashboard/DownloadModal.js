import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import FastImage from '@changwoolab/react-native-fast-image';
import globalStyles from '../../utils/Helper/Style';
import { useTranslation } from '../../context/LanguageContext';

const DownloadModal = ({ setDrawerVisible, isDrawerVisible, title }) => {
  const { t } = useTranslation();

  const toggleDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <Modal
      visible={isDrawerVisible}
      transparent={true} // Enable transparency for the modal
      animationType="slide" // Slide in from the bottom
      onRequestClose={toggleDrawer} // Handle back button press (Android)
    >
      <Pressable style={styles.backdrop} onPress={toggleDrawer}>
        {/* Close on backdrop press */}
        <View />
      </Pressable>
      <View style={styles.drawer}>
        {/* Top Indicator */}
        <View style={styles.indicator} />

        {/* Modal Content */}
        <View style={{ width: '100%' }}>
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={[
              globalStyles.subHeading,
              { color: '#7C766F', marginBottom: 10 },
            ]}
          >
            {title}
          </Text>

          {/* Save for Offline */}
          <TouchableOpacity style={globalStyles.flexrow}>
            <FastImage
              style={styles.img}
              source={require('../../assets/images/png/cloud.png')}
              resizeMode={FastImage.resizeMode.contain}
              priority={FastImage.priority.high}
            />
            <Text style={[globalStyles.text, { marginLeft: 10 }]}>
              {t('save_for_offline_access')}
            </Text>
          </TouchableOpacity>

          {/* Saving */}
          <TouchableOpacity style={globalStyles.flexrow}>
            <View style={styles.flexRow}>
              <FastImage
                style={styles.img}
                source={require('../../assets/images/png/cloud_download.gif')}
                resizeMode={FastImage.resizeMode.contain}
                priority={FastImage.priority.high}
              />
              <Text style={[globalStyles.text, { marginLeft: 5 }]}>99%</Text>
            </View>
            <Text style={[globalStyles.text, { marginLeft: 10 }]}>
              {t('saving')}
            </Text>
          </TouchableOpacity>

          {/* Remove Offline Access */}
          <TouchableOpacity style={globalStyles.flexrow}>
            <FastImage
              style={styles.img}
              source={require('../../assets/images/png/cloud_done.png')}
              resizeMode={FastImage.resizeMode.contain}
              priority={FastImage.priority.high}
            />
            <Text style={[globalStyles.text, { marginLeft: 10 }]}>
              {t('remove_offline_access')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent black background
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  drawer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    height: '30%', // Height of the drawer
    position: 'absolute',
    bottom: 0, // Align at the bottom
  },
  indicator: {
    borderWidth: 5,
    width: 50,
    borderRadius: 20,
    borderColor: '#DADADA',
    marginBottom: 20,
  },
  img: {
    width: 30,
    height: 30,
  },
});

export default DownloadModal;
