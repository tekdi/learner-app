import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SafeAreaWrapper from '../../../../../components/SafeAreaWrapper/SafeAreaWrapper';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import globalStyles from '../../../../../utils/Helper/Style';

import GlobalText from '@components/GlobalText/GlobalText';

const SessionRecordingCard = () => {
  return (
    <SafeAreaWrapper>
      <View style={styles.view}>
        <GlobalText
          style={[globalStyles.subHeading, { color: '#7C766F' }, styles.margin]}
        >
          Maths-double-clear
        </GlobalText>
        <View style={[globalStyles.flexrow, { marginVertical: 5 }]}>
          <Octicons name="calendar" color={'#0D599E'} size={20} />
          <GlobalText
            style={[globalStyles.subHeading, { top: 3, marginLeft: 10 }]}
          >
            10 May, 2 pm - 4 pm
          </GlobalText>
        </View>
        <GlobalText
          style={[globalStyles.subHeading, { color: '#7C766F' }, styles.margin]}
        >
          Vicky Phalke
        </GlobalText>
        <TouchableOpacity style={{ marginVertical: 5 }}>
          <GlobalText style={[globalStyles.text, { color: '#0D599E' }]}>
            Recording_10AM_4 May 2024
          </GlobalText>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  view: {
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#7C766F',
  },
});

export default SessionRecordingCard;
