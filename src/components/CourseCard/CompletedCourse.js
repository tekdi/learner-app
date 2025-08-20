import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from '@changwoolab/react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '../../context/LanguageContext';
import globalStyles from '../../utils/Helper/Style';
import Octicons from 'react-native-vector-icons/Octicons';
import CertificateViewer from '../../screens/CertificateViewer/CertificateViewer';
import moment from 'moment';
import { viewCertificate } from '../../utils/API/AuthService';

const CompletedCourse = ({ data }) => {
  const backgroundImage = require('../../assets/images/png/Course.png');
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false); // State to track which item is expanded
  const [certificateHtml, setCertificateHtml] = useState(null); // State to track which item is expanded
  let certificateId = data?.certificateId;

  const handleViewCertificate = async () => {
    const data = await viewCertificate({ certificateId });
    // console.log('data', JSON.stringify(data?.result));
    setCertificateHtml(data?.result);
    setVisible(true);
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={[globalStyles.flexrow, styles.view]}>
        <FastImage
          style={styles.cardBackgroundImage}
          source={
            data?.posterImage
              ? {
                  uri: data?.posterImage,
                  priority: FastImage.priority.high,
                }
              : backgroundImage
          }
          resizeMode={FastImage.resizeMode.cover}
          priority={FastImage.priority.high}
        />
        <View style={{ marginLeft: 10 }}>
          <View style={[globalStyles.flexrow]}>
            <Icon name={'checkmark-circle'} size={20} color="#06A816" />
            <GlobalText
              style={[globalStyles.text, { color: '#06A816', top: 1 }]}
            >
              {t('completed_on')}: {moment(data?.issuedOn).format('DD/MM/YYYY')}
            </GlobalText>
          </View>
          <GlobalText style={[globalStyles.text, { marginLeft: 5 }]}>
            {data?.name}
          </GlobalText>
          <TouchableOpacity
            onPress={handleViewCertificate}
            style={globalStyles.flexrow}
          >
            <GlobalText
              style={[globalStyles.text, { marginLeft: 5, color: '#0D599E' }]}
            >
              {t('preview_certificate')}
            </GlobalText>
            <Octicons
              name="arrow-right"
              style={{ marginHorizontal: 10, color: '#0D599E' }}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
      <CertificateViewer
        visible={visible}
        setVisible={setVisible}
        certificateHtml={certificateHtml}
        certificateId={data?.certificateId}
        certificateName={data?.name}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardBackgroundImage: {
    width: 100,
    height: 90,
    borderRadius: 10,
  },
  view: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 10,

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Android Shadow
    elevation: 5,
  },
});

CompletedCourse.propTypes = {};

export default CompletedCourse;
