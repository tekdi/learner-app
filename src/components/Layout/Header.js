import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';
import { languages } from '../../screens/LanguageScreen/Languages';
import Logo from '../../assets/images/png/logo.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

  const navigation = useNavigation();

  const onSelect = (index) => {
    setSelectedIndex(index);
    const selectedValue = languages[index.row].value;
    console.log(`Selected value: ${selectedValue}`);
  };

  const logout = () => {
    navigation.navigate('LoginSignUpScreen');
  };

  return (
    <Layout style={styles.layout}>
      <View style={styles.container}>
        <Select
          selectedIndex={selectedIndex}
          value={languages[selectedIndex.row].value}
          onSelect={onSelect}
          style={styles.select}
        >
          {languages?.map((option, index) => (
            <SelectItem key={option.value} title={option.value} />
          ))}
        </Select>
        <View style={styles.center}>
          <Image style={styles.image} source={Logo} resizeMode="contain" />
        </View>
        <Pressable
          onPress={() => {
            logout();
          }}
        >
          <Icon name="logout" color="black" size={30} style={styles.icon} />
        </Pressable>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  layout: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    top: 40,
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
    left: -25,
  },
  image: {
    height: 50,
    width: 50,
  },
  icon: {
    marginLeft: 20,
  },
});

export default Header;
