import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import { languages } from '@context/Languages';
import { useTranslation } from '../../context/LanguageContext';
import Logo from '../../assets/images/png/logo.png';
import PropTypes from 'prop-types';

const SecondaryHeader = ({ logo }) => {
  const navigation = useNavigation();
  const { setLanguage, language, t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState();
  const [value, setValue] = useState();

  useEffect(() => {
    // Set the initial value based on the current language
    const currentLanguageIndex = languages.findIndex(
      (lang) => lang.value === language
    );
    if (currentLanguageIndex >= 0) {
      setSelectedIndex(new IndexPath(currentLanguageIndex));
      setValue(language);
    }
  }, [language]); // Include language as a dependency

  const onSelect = (index) => {
    //setSelectedIndex(index);
    const selectedValue = languages[index.row].value;
    //setValue(selectedValue);
    setLanguage(selectedValue);
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
          <View style={styles.center}>
            <Image style={styles.image} source={Logo} resizeMode="contain" />
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
    width: 100,
  },
  center: {
    alignItems: 'center',
  },
  image: {
    height: 50,
    width: 50,
  },
  icon: {
    marginLeft: 20,
  },
});

SecondaryHeader.propTypes = {
  logo: PropTypes.bool,
};

export default SecondaryHeader;
