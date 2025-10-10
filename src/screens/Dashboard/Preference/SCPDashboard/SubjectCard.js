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
} from 'react-native';
import { Layout } from '@ui-kitten/components';
import globalStyles from '../../../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/FontAwesome6';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from '../../../../context/LanguageContext';
import { formatDateTimeRange, getDataFromStorage } from '../../../../utils/JsHelper/Helper';
import { useNavigation } from '@react-navigation/native';
import menu_book from '../../../../assets/images/png/menu_book.png';

import GlobalText from '@components/GlobalText/GlobalText';
import ZoomMeeting from '../../../../components/ZoomMeeting/ZoomMeeting';
import { parseZoomLink } from '../../../../utils/Helper/ZoomHelper';

const SubjectCard = ({ item }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showZoomMeeting, setShowZoomMeeting] = useState(false);
  const [storedUsername, setStoredUsername] = useState('');
  const [meetingDetails, setMeetingDetails] = useState(null);
  const { t } = useTranslation();
  const navigation = useNavigation();

  // Load stored username on component mount
  useEffect(() => {
    const loadUsername = async () => {
      try {
        const username = await getDataFromStorage('Username');
        if (username) {
          setStoredUsername(username);
        }
      } catch (error) {
        console.error('Error loading username:', error);
      }
    };
    loadUsername();
  }, []);

  const handleCopyLink = (zoomLink) => {
    Clipboard.setString(zoomLink); // Copy the Zoom link to the clipboard
    setShowToast(true); // Show toast message
  };

  const handleJoinZoomMeeting = (zoomLink) => {
    try {
      const parsed = parseZoomLink(zoomLink);
      if (parsed.isValid) {
        setMeetingDetails(parsed);
        setShowZoomMeeting(true);
        console.log('✅ Joining Zoom meeting:', parsed.meetingNumber);
      } else {
        console.error('❌ Invalid Zoom link:', parsed.error);
        // Fallback to opening in browser/external app
        Linking.openURL(zoomLink);
      }
    } catch (error) {
      console.error('Error parsing Zoom link:', error);
      // Fallback to opening in browser/external app
      Linking.openURL(zoomLink);
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
                onPress={() => handleJoinZoomMeeting(item?.onlineDetails?.url)}
              >
                <GlobalText style={styles.zoomLink}>
                  {item?.onlineDetails?.url}
                </GlobalText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCopyLink(item?.onlineDetails?.url)}
              >
                <Icon
                  name={showToast ? 'clipboard-check' : 'copy'}
                  color={showToast ? '#1A8825' : '#0D599E'}
                  size={20}
                />
              </TouchableOpacity>
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

      {/* Zoom Meeting Component - Opens in-app when user clicks on Zoom link */}
      {showZoomMeeting && meetingDetails && (
        <ZoomMeeting
          meetingNumber={meetingDetails.meetingNumber}
          password={meetingDetails.password}
          displayName={storedUsername || 'Student'}
          autoJoin={true} // Automatically join the meeting
          onMeetingJoined={() => {
            console.log('Zoom meeting joined successfully from SubjectCard');
            // Hide the component after a short delay for smooth transition
            setTimeout(() => {
              setShowZoomMeeting(false);
            }, 2000);
          }}
          onMeetingEnd={() => {
            console.log('User left Zoom meeting from SubjectCard');
            setShowZoomMeeting(false);
          }}
          onMeetingError={(error) => {
            console.error('Zoom meeting error from SubjectCard:', error);
            // Keep showing the component so user can retry
          }}
        />
      )}
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
});

export default SubjectCard;
