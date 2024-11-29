import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import WebView from 'react-native-webview';
import globalStyles from '../../utils/Helper/Style';
import ConsentAbove18 from './ConsentAbove18';
import ConsentBelow18 from './ConsentBelow18';

const FullPagePdfModal = ({ isModalVisible, setModalVisible, age }) => {
  // const [isModalVisible, setModalVisible] = useState(false);

  // Test with a publicly accessible PDF URL
  const pdfUrl = 'https://www.pdf995.com/samples/pdf.pdf'; // Use a public PDF for testing

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const htmlFilePath = Platform.select({
    android: `file:///android_asset/pdf/ConsentPdfViewer/index.html`,
  });
  const newPath = Platform.select({
    android: `file:///android_asset/pdf/ConsentPdfViewer/consent_form_above_18_hindi.pdf`,
  });

  return (
    <View style={styles.container}>
      {/* Full-screen Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          <View>{age < 18 ? <ConsentBelow18 /> : <ConsentAbove18 />}</View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  closeButton: {
    // position: 'absolute',
    // top: 40, // Adjust the position based on your preference
    right: 20, // Position from the right side
    padding: 10,
    borderRadius: 20,
    alignSelf: 'flex-end',
    zIndex: 1,
  },
  closeText: {
    color: '#000',
    fontSize: 18,
  },
  pdf: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default FullPagePdfModal;
