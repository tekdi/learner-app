import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from '@changwoolab/react-native-fast-image';
import { useTranslation } from '../../../context/LanguageContext';
import StatusCardIcon from '../../../components/StatusCard/StatusCardIcon';
import globalStyles from '../../../utils/Helper/Style';

const UnitCard = ({ item }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const handleCardPress = (item) => {
    navigation.navigate('UnitList', {
      children: item?.children,
      name: item?.name,
    });
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCardPress(item)}
      >
        {/* Background image */}
        <FastImage
          style={styles.cardBackgroundImage}
          source={require('../../../assets/images/png/Unit.png')}
          resizeMode={FastImage.resizeMode.cover}
          priority={FastImage.priority.high}
        />

        {/* Content overlay */}
        <View style={styles.overlay}>
          <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
            {t('unit')}
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={[globalStyles.flexrow, { marginLeft: 20, marginVertical: 10 }]}
      >
        <StatusCardIcon status="inprogress" />
        <Text
          style={[styles.cardText, { color: '#000' }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 100,
    borderRadius: 20,
    margin: 5,
    overflow: 'hidden', // Ensure content doesn't overflow the card boundaries
  },
  cardBackgroundImage: {
    ...StyleSheet.absoluteFillObject, // Makes the background image cover the entire card
    borderRadius: 20,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for text visibility
    width: 70,
    padding: 5,
    fontSize: 10,
    top: 15,
  },
  cardText: {
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
});

export default UnitCard;
