import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';
import JotFormEmbed from './JotFormEmbed';
import { getDataFromStorage, getDeviceId } from '../../utils/JsHelper/Helper';

const SupportRequest = () => {
  const [queryParams, setQueryParams] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const profileData = JSON.parse(await getDataFromStorage('profileData'))
        ?.getUserDetails?.[0];
      console.log('profileData', JSON.stringify(profileData));

      const name = `${profileData?.username} ${profileData?.lastName} `;
      const loginUserName = profileData?.username;
      const userid = profileData?.userId;
      const email = profileData?.email || '';
      const deviceId = await getDeviceId();

      console.log('name', name);

      const deviceInfo = `
          Model: ${DeviceInfo.getModel()}
          OS: ${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}
          Brand: ${DeviceInfo.getBrand()}
          Device ID: ${deviceId}
          Time Zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
        `.trim();

      setQueryParams({
        fullName: name,
        userName: loginUserName,
        userId: userid,
        email,
        deviceInfo,
      });
    };

    fetchDeviceInfo();
  }, []);

  console.log('qqqq', JSON.stringify(queryParams));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="orange" />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.title}>We Are Here To Help</Text>
          <Text style={styles.subtitle}>Submit your request for issues</Text>
        </View>
      </View>
      <JotFormEmbed queryParams={queryParams} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  textContainer: { marginLeft: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  subtitle: { fontSize: 14, color: 'gray', marginTop: 4 },
});

export default SupportRequest;
