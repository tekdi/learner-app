import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';
import globalStyles from '../../utils/Helper/Style';
import { Button } from '@ui-kitten/components';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  capitalizeFirstLetter,
  getDataFromStorage,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import { useNavigation } from '@react-navigation/native';

import GlobalText from '@components/GlobalText/GlobalText';
import { removeData } from '../../utils/Helper/JSHelper';

const TestResultModal = ({ modal, title }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const closeModal = async () => {
    //navigation.replace('Dashboard');
    let isSCP = false;
    let userType = await getDataFromStorage('userType');
    if (userType == 'scp') {
      isSCP = true;
    }
    // console.log('############# isSCP', isSCP);
    if (isSCP == true) {
      // console.log('############# isSCP', isSCP);
      // const stackRoutes = navigation.getState()?.routes || [];
      // // Extract screen names from the routes array
      // const screenNames = stackRoutes.map((route) => route.name);
      // console.log('############# Screens in navigation stack:', screenNames);
      await setDataInStorage('isFromPlayer', 'yes');
      navigation.navigate('SCPUserTabScreen');
      navigation.navigate('MyClass');
      navigation.navigate('TestView', { title: title });
      // After navigating to the 'Profile' tab, reset the stack inside the tab
      // navigation.reset({
      //   index: 0, // Reset to the first index screen of the tab for assessment
      //   routes: [{ name: 'MyClass' }], // Ensure this is the initial screen of the stack
      // });
    } else {
      navigation.goBack();
    }
  };

  return (
    <Modal visible={!!modal} transparent={true} animationType="slide">
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        // onPress={closeModal} // Close the modal when pressing outside the alert box
      >
        <View style={styles.alertBox}>
          <View style={styles.View}>
            <GlobalText style={globalStyles.heading}>
              {t(capitalizeFirstLetter(title))}
            </GlobalText>
          </View>
          <TouchableOpacity
            activeOpacity={1} // Prevent closing the modal when clicking inside the alert box
            style={styles.alertSubBox}
          >
            <MaterialIcons
              name="check-circle-outline"
              size={48}
              color="#1A8825"
            />
            <GlobalText style={[globalStyles.heading2, { marginVertical: 10 }]}>
              {t('test_completed')}
            </GlobalText>
            {modal?.totalMaxScore && (
              <GlobalText
                style={[
                  globalStyles.subHeading,
                  {
                    marginVertical: 10,
                    backgroundColor: '#E4F4E6',
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                  },
                ]}
              >
                {t('your_marks')} {modal?.totalScore}/{modal?.totalMaxScore}
              </GlobalText>
            )}
            {!modal?.totalMaxScore && (
              <GlobalText
                style={[
                  globalStyles.text,
                  { textAlign: 'center', marginVertical: 10 },
                ]}
              >
                {t('your_test_will_be_auto_saved_once_you_are_back_online')}
              </GlobalText>
            )}
          </TouchableOpacity>
          <View style={styles.btnbox}>
            <Button status="primary" style={styles.btn} onPress={closeModal}>
              {() => (
                <GlobalText
                  style={[globalStyles.subHeading, { marginRight: 10 }]}
                >
                  {t('okay')}
                </GlobalText>
              )}
            </Button>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertSubBox: {
    padding: 20,
    alignItems: 'center',
  },

  btnbox: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#D0C5B4',
    padding: 20,
  },
  btn: {
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  View: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#D0C5B4',
    padding: 20,
  },
});

TestResultModal.propTypes = {
  modal: PropTypes.any,
  title: PropTypes.any,
};

export default TestResultModal;
