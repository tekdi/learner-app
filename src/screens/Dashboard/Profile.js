import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Layout/Header';

const Profile = (props) => {
  return (
    <>
      <Header />
      <View
        style={{
          borderWidth: 1,
          top: 40,
          width: '100%',
          backgroundColor: 'white',
        }}
      >
        <Text style={{ color: 'black' }}>Profile</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
});

Profile.propTypes = {};

export default Profile;
