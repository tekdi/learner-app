import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import GlobalText from '@components/GlobalText/GlobalText';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useTranslation } from '../../context/LanguageContext';
import globalStyles from '../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { default as Ionicons } from 'react-native-vector-icons/Ionicons';

import Clipboard from '@react-native-clipboard/clipboard';

const SuggestUsername = ({
  suggestedUsernames,
  setSuggestedUsernames,
  setModal,
  setFormData,
  formData,
}) => {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(false);

  const handleCopyLink = (zoomLink) => {
    Clipboard.setString(zoomLink); // Copy the Zoom link to the clipboard
    setShowToast(true); // Show toast message
  };
  return (
    <View style={styles.alertBox}>
      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <GlobalText style={globalStyles.heading2}>
          {t('username_already_exists')}
        </GlobalText>
        <TouchableOpacity
          onPress={() => {
            setModal(false);
          }}
        >
          <Ionicons name={'close'} color="#000" size={30} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderColor: '#D0C5B4',
          paddingHorizontal: 5,
          marginVertical: 10,
        }}
      >
        <GlobalText
          style={[
            globalStyles.subHeading,
            { marginLeft: 10, textAlign: 'center' },
          ]}
        >
          {t('uh_oh_the_username_you_entered_already_exists')}
        </GlobalText>
        <GlobalText
          style={[
            globalStyles.subHeading,
            { marginLeft: 10, textAlign: 'center', fontWeight: 'bold' },
          ]}
        >
          {t('here_is_an_available_one')}
        </GlobalText>

        <View
          style={{
            padding: 10,
            backgroundColor: '#EDE1CF',
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 10,
          }}
        >
          <GlobalText
            style={[
              globalStyles.subHeading,
              { marginLeft: 10, textAlign: 'center' },
            ]}
          >
            {suggestedUsernames}
          </GlobalText>
          <TouchableOpacity onPress={() => handleCopyLink(suggestedUsernames)}>
            <Icon
              name={showToast ? 'clipboard-check' : 'copy'}
              color={showToast ? '#1A8825' : '#0D599E'}
              size={20}
            />
          </TouchableOpacity>
        </View>
        <GlobalText
          style={[globalStyles.text, { marginLeft: 10, textAlign: 'center' }]}
        >
          {t(
            'you_can_copy_this_username_and_save_it_on_your_device_youll_also_find_it_anytime_in_your_profile'
          )}
        </GlobalText>
      </View>

      <PrimaryButton
        text={t('use_suggested_username')}
        onPress={() => {
          setModal(false);
          setFormData({ ...formData, username: suggestedUsernames });
          setSuggestedUsernames([]);
        }}
      />
      <TouchableOpacity
        style={{ marginVertical: 10 }}
        onPress={() => {
          setModal(false), setSuggestedUsernames([]);
        }}
      >
        <GlobalText
          style={[
            globalStyles.subHeading,
            { marginLeft: 10, textAlign: 'center', color: '#0D599E' },
          ]}
        >
          {t('enter_new_one')}
        </GlobalText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    Bottom: 16,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 10,
  },

  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%', // Adjust the width as per your design
    alignSelf: 'center',
  },
  pinCodeText: {
    color: '#000',
  },
  pinCodeContainer: {
    // marginHorizontal: 5,
  },
  pinContainer: {
    width: '100%',
  },
  btnbox: {
    marginVertical: 10,
    alignItems: 'center',
  },
});

SuggestUsername.propTypes = {};

export default SuggestUsername;
