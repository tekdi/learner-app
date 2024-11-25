import React from 'react';
import CircularProgressBarCustom from '../../../../../components/CircularProgressBarCustom.js/CircularProgressBarCustom';
import globalStyles from '../../../../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import GlobalText from "@components/GlobalText/GlobalText";

const MaterialCard = ({ title, selectedIds }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[globalStyles.flexrow, styles.view]}
      onPress={() =>
        navigation.navigate('MaterialCardView', {
          subjectName: title,
          type: selectedIds?.value,
        })
      }
    >
      <View style={globalStyles.flexrow}>
        {/* <CircularProgressBarCustom
            size={30}
            strokeWidth={5}
            progress={40 / 100}
            color="green"
            backgroundColor="#e6e6e6"
            textStyle={{ fontSize: 8, color: 'black' }}
          /> */}
        <GlobalText
          style={[globalStyles.subHeading, { marginLeft: 20, width: '70%' }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </GlobalText>
      </View>
      <Icon
        name="angle-right"
        size={20}
        color={'black'}
        style={{ marginRight: 10 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'space-between',
    marginVertical: 10,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: '#B1AAA2',
    backgroundColor: 'white',
  },
});

export default MaterialCard;
