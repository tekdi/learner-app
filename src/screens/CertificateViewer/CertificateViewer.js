import GlobalText from '@components/GlobalText/GlobalText';
import globalStyles from '@src/utils/Helper/Style';
import React, { useRef } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '@context/LanguageContext';

const CertificateViewer = ({ visible, setVisible, certificateHtml }) => {
  const webViewRef = useRef(null);
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.alertBox}>
          {/* WebView inside a defined modal size */}
          <View
            style={{
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderBottomWidth: 1,
            }}
          >
            <GlobalText style={globalStyles.heading2}>
              {t('certificate')}
            </GlobalText>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
              }}
            >
              <Icon name={'close'} color="#000" size={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.webViewContainer}>
            <WebView
              originWhitelist={['*']}
              source={{ html: certificateHtml }}
              ref={webViewRef}
              style={styles.webview} // Ensures full width & scrollability
            />
          </View>
          {/* Close Button */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  alertBox: {
    width: 350, // Matching size from NetworkAlert
    height: '80%', // Adjusted height
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden', // Ensures proper boundary for WebView
  },
  webViewContainer: {
    // flex: 1, // Makes WebView take most of the space
    width: '105%',
    height: 500,
    // borderWidth: 5,
  },
  webview: {
    // flex: 1, // Ensures scrollability within defined space
    // borderWidth: 5,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CertificateViewer;
