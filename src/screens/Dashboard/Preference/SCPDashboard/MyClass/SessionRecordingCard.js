import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import globalStyles from '../../../../../utils/Helper/Style';

const SessionRecordingCard = () => {
  return (
    <SafeAreaView>
      <View style={styles.view}>
        <Text
          style={[globalStyles.subHeading, { color: '#7C766F' }, styles.margin]}
        >
          Maths-double-clear
        </Text>
        <View style={[globalStyles.flexrow, { marginVertical: 5 }]}>
          <Octicons name="calendar" color={'#0D599E'} size={20} />
          <Text style={[globalStyles.subHeading, { top: 3, marginLeft: 10 }]}>
            10 May, 2 pm - 4 pm
          </Text>
        </View>
        <Text
          style={[globalStyles.subHeading, { color: '#7C766F' }, styles.margin]}
        >
          Vicky Phalke
        </Text>
        <TouchableOpacity style={{ marginVertical: 5 }}>
          <Text style={[globalStyles.text, { color: '#0D599E' }]}>
            Recording_10AM_4 May 2024
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
