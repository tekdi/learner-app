import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
  Linking,
  ImageBackground,
} from 'react-native';
import { Layout } from '@ui-kitten/components';
import globalStyles from '../../../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/FontAwesome6';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from '../../../../context/LanguageContext';
import { formatDateTimeRange } from '../../../../utils/JsHelper/Helper';
import { useNavigation } from '@react-navigation/native';

const SubjectCard = ({ item }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleCopyLink = () => {
    Clipboard.setString(zoomLink); // Copy the Zoom link to the clipboard
    setShowToast(true); // Show toast message
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
            <Text style={[globalStyles.subHeading, { marginLeft: 5 }]}>
              {item?.metadata?.subject}
            </Text>
          </View>

          <Text style={[globalStyles.text]}>
            {formatDateTimeRange(item?.startDateTime)} -
            {formatDateTimeRange(item?.endDateTime)}
          </Text>
        </View>

        <Text style={[globalStyles.text, { color: '#7C766F', marginTop: 5 }]}>
          {item?.metadata?.teacherName}
        </Text>
        {/* Zoom Link with Copy Icon */}
        <View style={styles.linkRow}>
          {item?.onlineDetails && (
            <>
              <TouchableOpacity
                onPress={() => Linking.openURL(item?.onlineDetails?.url)}
              >
                <Text
                  style={styles.zoomLink}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item?.onlineDetails?.url}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCopyLink}>
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
          <Text style={[globalStyles.text, { color: '#7C766F' }]}>
            {t('what_you_are_going_to_learn')}
          </Text>
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
                  <Icon name="book-open" size={20} color="#0D599E" />

                  <Text style={styles.accordionDetails}>
                    {item?.erMetaData?.topic}
                  </Text>
                </View>
                <View style={[globalStyles.flexrow, { marginLeft: 15 }]}>
                  <MaterialIcon
                    name="arrow-right-bottom"
                    size={20}
                    color="#0D599E"
                  />
                  {item?.erMetaData?.subTopic?.map((subItem, index) => {
                    const isLastItem =
                      index === item.erMetaData.subTopic.length - 1; // Check if it's the last item
                    return (
                      <Text key={index} style={styles.accordionDetails}>
                        {subItem}
                        {!isLastItem && ','}
                        {/* Only add comma if not the last item */}
                      </Text>
                    );
                  })}
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={globalStyles.text}>{t('no_topics')}</Text>
            )}
          </View>
        )}
      </View>
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
