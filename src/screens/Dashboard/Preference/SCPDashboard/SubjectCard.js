import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
  Linking,
  ImageBackground,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Layout } from '@ui-kitten/components';
import globalStyles from '../../../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/FontAwesome6';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../../../../context/LanguageContext';
import { formatDateTimeRange, getStoredUsername } from '../../../../utils/JsHelper/Helper';
import { useNavigation } from '@react-navigation/native';
import menu_book from '../../../../assets/images/png/menu_book.png';
import ZoomWebView from '../../../../components/ZoomWebView/ZoomWebView';

import GlobalText from '@components/GlobalText/GlobalText';

// Appends the learner's name as the Zoom `uname` query param so the
// external browser / native Zoom app can prefill the display name on join.
// const buildZoomUriWithUsername = (baseUri, userName) => {
//   if (!userName) return baseUri;
//   try {
//     const url = new URL(baseUri);
//     url.searchParams.set('uname', userName);
//     return url.toString();
//   } catch {
//     const sep = baseUri.includes('?') ? '&' : '?';
//     return `${baseUri}${sep}uname=${encodeURIComponent(userName)}`;
//   }
// };

const SubjectCard = ({ item }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [userName, setUserName] = useState('');
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedUsername = await getStoredUsername();
        if (storedUsername) {
          setUserName(storedUsername);
        }
      } catch (error) {
        console.log('Error fetching user name:', error);
      }
    };
    fetchUserName();
  }, []);

  const handleCopyLink = (zoomLink) => {
    Clipboard.setString(zoomLink); // Copy the Zoom link to the clipboard
    setShowToast(true); // Show toast message
  };

  const handleOpenZoom = () => {
    if (item?.onlineDetails?.url) {
      // setShowZoomModal(true);
      // Linking.openURL(buildZoomUriWithUsername(item.onlineDetails.url, userName));
      Linking.openURL(item.onlineDetails.url);
    }
  };

  return (
    <Layout style={styles.card}>
      {/* Subject Name */}

      <View style={{ padding: 15 }}>
        <View
          style={[globalStyles.flexrow, { justifyContent: 'space-between' }]}
        >
          <View style={[globalStyles.flexrow]}>
            {!item?.onlineDetails ? (
              <Icon name="building" size={20} color="#000" />
            ) : (
              <SimpleIcon name="social-youtube" size={20} color="#000" />
            )}
            <GlobalText style={[globalStyles.subHeading, { marginLeft: 5 }]}>
              {item?.metadata?.subject}
            </GlobalText>
          </View>

          <GlobalText style={[globalStyles.text]}>
            {formatDateTimeRange(item?.startDateTime)} -
            {formatDateTimeRange(item?.endDateTime)}
          </GlobalText>
        </View>

        <GlobalText
          style={[globalStyles.text, { color: '#7C766F', marginTop: 5 }]}
        >
          {item?.metadata?.teacherName}
        </GlobalText>
        {/* Zoom Link with Copy Icon */}
        <View style={styles.linkRow}>
          {item?.onlineDetails && (
            <>
              <TouchableOpacity
                onPress={handleOpenZoom}
              >
                <GlobalText style={styles.zoomLink}>
                  {item?.onlineDetails?.url}
                </GlobalText>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={() => handleCopyLink(item?.onlineDetails?.url)}
              >
                <Icon
                  name={showToast ? 'clipboard-check' : 'copy'}
                  color={showToast ? '#1A8825' : '#0D599E'}
                  size={20}
                />
              </TouchableOpacity> */}
            </>
          )}
        </View>
      </View>
      {/* Accordion */}
      <View
        style={{ backgroundColor: '#F3EDF7', padding: 10, borderRadius: 10 }}
      >
        <TouchableOpacity
          style={[
            globalStyles.flexrow,
            {
              justifyContent: 'space-between',
              padding: 10,
            },
          ]}
          onPress={() => setAccordionOpen(!isAccordionOpen)}
        >
          <GlobalText style={[globalStyles.text, { color: '#7C766F' }]}>
            {t('what_you_are_going_to_learn')}
          </GlobalText>
          <Icon
            name={isAccordionOpen ? 'angle-up' : 'angle-down'}
            color="#0D599E"
            size={20}
          />
        </TouchableOpacity>

        {isAccordionOpen && (
          <View style={styles.accordionContent}>
            {item?.erMetaData?.topic ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SubjectDetails', {
                    topic: item?.erMetaData?.topic,
                    subTopic: item?.erMetaData?.subTopic,
                    courseType: item?.metadata?.courseType,
                    item: item,
                  });
                }}
              >
                <View style={globalStyles.flexrow}>
                  <Image
                    source={menu_book}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />

                  <GlobalText style={styles.accordionDetails}>
                    {item?.erMetaData?.topic}
                  </GlobalText>
                </View>
                <View style={[globalStyles.flexrow, { marginLeft: 15 }]}>
                  <MaterialIcon
                    name="arrow-right-bottom"
                    size={20}
                    color="#0D599E"
                  />
                  <View
                    style={[
                      globalStyles.flexrow,
                      {
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        // justifyContent: 'space-around',
                      },
                    ]}
                  >
                    {item?.erMetaData?.subTopic?.map((subItem, index) => {
                      const isLastItem =
                        index === item.erMetaData.subTopic.length - 1; // Check if it's the last item
                      return (
                        <Text
                          numberOfLines={4}
                          ellipsizeMode="tail"
                          key={index}
                          style={[styles.accordionDetails]}
                        >
                          {subItem}
                          {!isLastItem && ','}
                          {/* Only add comma if not the last item */}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <GlobalText style={globalStyles.text}>
                {t('no_topics')}
              </GlobalText>
            )}
          </View>
        )}
      </View>

      {/* Zoom WebView Modal */}
      <Modal
        visible={showZoomModal}
        animationType="slide"
        onRequestClose={() => setShowZoomModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1f1f1f" />
          <View style={styles.modalHeader}>
            <GlobalText style={styles.modalHeaderText}>Zoom Meeting</GlobalText>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowZoomModal(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {item?.onlineDetails?.url && (
            <ZoomWebView
              uri={item.onlineDetails.url}
              userName={userName}
            />
          )}
        </SafeAreaView>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 10,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  zoomLink: {
    width: 250,
    color: '#0D599E',
    textDecorationLine: 'underline',
  },
  icon: {
    width: 24,
    height: 24,
    color: '#333',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },

  accordionContent: {
    paddingVertical: 0,
  },
  accordionDetails: {
    color: '#0D599E',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1f1f1f',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
});

export default SubjectCard;
