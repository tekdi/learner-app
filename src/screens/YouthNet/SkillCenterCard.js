import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import globalStyles from '../../utils/Helper/Style';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '../../context/LanguageContext';
import Google_Maps from '../../assets/images/png/Google_Maps.jpg';

const SkillCenterCard = ({ data }) => {
  const { t } = useTranslation();
  const renderItem = ({ item }) => (
    <Image
      src={item}
      style={{
        borderWidth: 1,
        width: 150,
        height: 150,
        marginHorizontal: 10,
        borderRadius: 10,
      }}
    />
  );

  const handleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data?.address)}`;
    Linking.openURL(url); // Opens the email client
  };
  return (
    <SafeAreaView style={{ paddingVertical: 10 }}>
      <FlatList
        data={data?.images}
        renderItem={renderItem}
        keyExtractor={(item) => item?.identifier}
        horizontal={true} // Enable horizontal scrolling
        initialNumToRender={10} // Adjust the number of items to render initially
        maxToRenderPerBatch={10} // Number of items rendered per batch
        windowSize={21} // Controls the number of items rendered around the current index
      />
      <GlobalText
        style={[globalStyles.subHeading, { fontWeight: '700', marginTop: 10 }]}
      >
        {data?.title}
      </GlobalText>
      <GlobalText style={[globalStyles.text, { marginVertical: 10 }]}>
        {data?.address}
      </GlobalText>
      <TouchableOpacity style={globalStyles.flexrow} onPress={handleMaps}>
        <GlobalText style={[globalStyles.text, { color: '#0D599E' }]}>
          {t('open_on_maps')}
        </GlobalText>
        <Image
          source={Google_Maps}
          style={{ width: 20, height: 20, marginLeft: 10 }}
          resizeMode="center"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

SkillCenterCard.propTypes = {
  data: PropTypes.object,
};

export default SkillCenterCard;
