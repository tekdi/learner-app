import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import SessionRecordingCard from './SessionRecordingCard';
import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';
import globalStyles from '../../../../../utils/Helper/Style';

const SessionRecording = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

  return (
    <SafeAreaView>
      <View
        style={[
          globalStyles.flexrow,
          { justifyContent: 'space-between', top: 20 },
        ]}
      >
        <Layout style={styles.container} level="1">
          <Select
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
          >
            <SelectItem title="Option 1" />
            <SelectItem title="Option 2" />
            <SelectItem title="Option 3" />
          </Select>
        </Layout>
        <Layout style={styles.container} level="1">
          <Select
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
          >
            <SelectItem title="Option 1" />
            <SelectItem title="Option 2" />
            <SelectItem title="Option 3" />
          </Select>
        </Layout>
      </View>

      <SessionRecordingCard />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 128,
    // borderWidth: 1,
    width: 150,
  },
});

SessionRecording.propTypes = {};

export default SessionRecording;
