import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../context/LanguageContext';
import globalStyles from '../../utils/Helper/Style';

const ProfileHeader = ({ onPress }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.view}>
      <View style={globalStyles.flexrow}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon
            name="arrow-left"
            style={{ marginHorizontal: 10 }}
            color={'#0D599E'}
            size={30}
          />
          {/* <Text allowFontScaling={false}>Back</Text> */}
        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.text}>
          {t('profile')}
        </Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <Text allowFontScaling={false} style={styles.text2}>
          {t('save')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 21,
    color: 'black',
    marginLeft: 10,
    // fontWeight: '500',
  },
  text2: {
    fontSize: 21,
    color: '#0D599E',
    marginRight: 10,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#00000026',
  },
});

ProfileHeader.propTypes = {};

export default ProfileHeader;
