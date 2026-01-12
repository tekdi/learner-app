import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { languages } from '@context/Languages';
import { useTranslation } from '../../context/LanguageContext';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';
import Logo from '../../assets/images/png/logo.png';
import PropTypes from 'prop-types';
import GlobalText from '@components/GlobalText/GlobalText';
import ProgramSwitch from '../ProgramSwitch/ProgramSwitch';

const SecondaryHeader = ({ logo }) => {
  const navigation = useNavigation();
  const { setLanguage, language, t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState();
  const [value, setValue] = useState();
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');
  const [showProgramSwitch, setShowProgramSwitch] = useState(false);

  useEffect(() => {
    // Set the initial value based on the current language
    const currentLanguageIndex = languages.findIndex(
      (lang) => lang.value === language
    );
    if (currentLanguageIndex >= 0) {
      setSelectedIndex(new IndexPath(currentLanguageIndex));
      setValue(language);
    }

    // Fetch userType and userId from AsyncStorage
    fetchUserTypeAndId();
  }, [language]); // Include language as a dependency

  // Add focus effect to refresh data when returning from other screens
  useFocusEffect(
    React.useCallback(() => {
      // Reset modal state when screen comes into focus
      setShowProgramSwitch(false);
      // Refresh user data
      fetchUserTypeAndId();
    }, [])
  );

  const fetchUserTypeAndId = async () => {
    try {
      const storedUserType = await getDataFromStorage('userType');
      const storedUserId = await getDataFromStorage('userId');
      setUserType(storedUserType || '');
      setUserId(storedUserId || '');
    } catch (error) {
      console.error('Error fetching userType or userId:', error);
    }
  };

  const onSelect = (index) => {
    //setSelectedIndex(index);
    const selectedValue = languages[index.row].value;
    //setValue(selectedValue);
    setLanguage(selectedValue);
  };

  const handleProgramSwitchToggle = () => {
    setShowProgramSwitch(!showProgramSwitch);
  };

  const handleProgramSwitchClose = () => {
    setShowProgramSwitch(false);
    // Refresh userType after switching
    fetchUserTypeAndId();
  };

  return (
    <SafeAreaView style={styles.layout}>
      <StatusBar
        barStyle="dark-content"
        // translucent={true}
        backgroundColor="transparent"
      />

      <View style={styles.container}>
        {!logo ? (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack(); // Fix: Use goBack() correctly
            }}
          >
            <Icon
              name="arrow-left"
              style={{ marginHorizontal: 10 }}
              color={'#1F1B13'}
              size={30}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.centerContainer}>
            <Image style={styles.image} source={Logo} resizeMode="contain" />
            {userType && (
              <TouchableOpacity
                style={styles.userTypeContainer}
                onPress={handleProgramSwitchToggle}
              >
                <GlobalText style={styles.userTypeText} numberOfLines={1}>
                  {userType === "scp" ? "Second Chance Program" : userType === "youthnet" ? "Vocational Training" : userType}
                </GlobalText>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color="#4D4639"
                  style={styles.dropdownIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        <Select
          selectedIndex={selectedIndex} // Set the selected index
          value={t(value)}
          onSelect={onSelect}
          style={styles.select}
        >
          {languages?.map((option) => (
            <SelectItem key={option.value} title={t(option?.title)} />
          ))}
        </Select>
      </View>

      {/* ProgramSwitch Modal */}
      <Modal
        visible={showProgramSwitch}
        animationType="slide"
        transparent={true}
        onRequestClose={handleProgramSwitchClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <GlobalText style={styles.modalTitle}>
                Switch Program
              </GlobalText>
              <TouchableOpacity onPress={handleProgramSwitchClose}>
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>
            {showProgramSwitch && (
              <ProgramSwitch
                key={`program-switch-${userId}-${Date.now()}`}
                userId={userId}
                onSuccess={(userData) => {
                  console.log('Program switched successfully:', userData);
                //  handleProgramSwitchClose();
                }}
                onError={(error) => {
                  console.error('Program switch error:', error);
                }}
                onClose={handleProgramSwitchClose}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // paddingTop: 40,
    width: '100%',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
    shadowColor: '#00000026', // iOS shadow
    shadowOffset: { width: 0, height: 15 }, // iOS shadow
    shadowOpacity: 1, // iOS shadow
    borderBottomWidth: 1.5,
    borderBottomColor: '#00000026',
    padding: 10,
  },
  select: {
    width: 110,
    flexShrink: 0,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 10,
  },
  image: {
    height: 50,
    width: 50,
  },
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexShrink: 1,
    maxWidth: '70%',
  },
  userTypeText: {
    fontSize: 14,
    color: '#4D4639',
    fontFamily: 'Poppins-Medium',
    marginRight: 4,
    flexShrink: 1,
  },
  dropdownIcon: {
    marginLeft: 2,
  },
  icon: {
    marginLeft: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
  },
});

SecondaryHeader.propTypes = {
  logo: PropTypes.bool,
};

export default SecondaryHeader;
