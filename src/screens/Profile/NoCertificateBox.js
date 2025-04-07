import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View } from 'react-native';
import globalStyles from '@src/utils/Helper/Style';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '@context/LanguageContext';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';

const NoCertificateBox = ({ userType }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={globalStyles.container}>
      <GlobalText
        numberOfLines={4}
        ellipsizeMode="tail"
        style={[globalStyles.text, { color: '#7C766F', width: '50%' }]}
      >
        {t('you_havent_completed_any_courses_yet')}
      </GlobalText>
      <View style={{ width: 210, marginTop: 10 }}>
        <PrimaryButton
          onPress={() => {
            userType == 'youthnet'
              ? navigation.navigate('YouthNetStack')
              : userType == 'scp'
                ? navigation.navigate('SCPUserStack')
                : navigation.navigate('DashboardStack');
          }}
          text={
            <SafeAreaView
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <GlobalText style={[globalStyles.subHeading]}>
                {t('explore_courses')}
              </GlobalText>
              <Icon
                name="arrow-right"
                style={{ marginHorizontal: 10, color: 'black' }}
                size={20}
              />
            </SafeAreaView>
          }
        />
      </View>
    </SafeAreaView>
  );
};

NoCertificateBox.propTypes = {
  userType: PropTypes.string,
};

export default NoCertificateBox;
