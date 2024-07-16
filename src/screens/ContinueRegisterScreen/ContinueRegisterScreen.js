import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import nerd from '../../assets/images/png/nerdface.png';
import { useNavigation } from '@react-navigation/native';
const ContinueRegisterScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={nerd}
          resizeMode="contain"
          style={{ width: 70, height: 70, marginBottom: 30 }}
        ></Image>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Poppins-Regular',
            textAlign: 'center',
            fontSize: 18,
          }}
        >
          Just a few quick questions before we start your learning journey
        </Text>
      </View>
      <View style={{ position: 'absolute', bottom: 60, alignSelf: 'center' }}>
        <PrimaryButton
          text="Continue"
          onPress={() => {
            navigation.navigate('RegisterScreen');
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20,
  },
});
export default ContinueRegisterScreen;
