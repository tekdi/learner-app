import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useState, React, useEffect } from 'react';
import { Button, CheckBox } from '@ui-kitten/components';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { login } from '../../utils/API/AuthService';
import {
  getSavedToken,
  saveRefreshToken,
  saveToken,
} from '../../utils/JsHelper/Helper';
import LoginTextField from '../../components/LoginTextField/LoginTextField';
import { useTranslation } from '../../context/LanguageContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [savePassword, setSavePassword] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [errmsg, setErrmsg] = useState('');

  const onChangeText = (e) => {
    setUserName(e.trim());
  };
  const onChangePassword = (e) => {
    setPassword(e.trim());
  };
  const rememberPassword = (value) => {
    setSavePassword(value);
  };
  const handleLogin = async () => {
    const payload = {
      username: userName,
      password: password,
    };
    const data = await login(payload);
    if (data?.params?.status !== 'failed') {
      if (savePassword) {
        await saveToken(data?.access_token);
        await saveRefreshToken(data?.refresh_token);
        navigation.navigate('Dashboard');
      } else {
        navigation.navigate('Dashboard');
      }
    } else {
      console.log('reached here');
      setErrmsg(data?.params?.errmsg);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSavedToken();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userName.length > 0 && password.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [userName, password]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backbutton}
        onPress={() => {
          navigation.navigate('LoginSignUpScreen');
        }}
      >
        <Image
          source={backIcon}
          resizeMode="contain"
          style={{ width: 30, height: 30 }}
        />
        {/* <Text>Back</Text> */}
      </TouchableOpacity>
      <View style={styles.textfieldbox}>
        <LoginTextField
          text="username"
          onChangeText={onChangeText}
          value={userName}
        />
        <View style={{ padding: 10 }}></View>
        <LoginTextField
          text="password"
          onChangeText={onChangePassword}
          value={password}
        />
        {errmsg !== '' && (
          <Text style={{ color: 'red', top: -10, left: 20 }}>{errmsg}</Text>
        )}
      </View>
      <TouchableOpacity style={{ paddingLeft: 20, marginBottom: 30 }}>
        <Text
          style={{
            color: '#0D599E',
            fontFamily: 'Poppins-Medium',
            fontSize: 15,
          }}
        >
          {t('forgot_password')}
        </Text>
      </TouchableOpacity>
      <View style={styles.rembox}>
        <CheckBox
          style={{ paddingLeft: 10 }}
          value={savePassword}
          checked={savePassword}
          onChange={(e) => {
            rememberPassword(e);
          }}
        />
        <View style={{ paddingLeft: 10 }}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Regular',
              fontSize: 17,
            }}
          >
            {t('remember_me')}
          </Text>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          padding: 10,
          alignSelf: 'center',
        }}
      >
        <PrimaryButton
          text={t('login')}
          onPress={() => {
            handleLogin();
          }}
          isDisabled={isDisabled}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  backbutton: {},
  container: {
    flex: 1,
    height: '100%',
    paddingTop: 50,
    padding: 20,
    backgroundColor: 'white',
  },
  scrollView: {
    height: '100%',
    borderWidth: 1,
    flex: 1,
  },
  textfieldbox: {
    marginTop: 40,
  },
  rembox: {
    alignContent: 'center',
    flexDirection: 'row',
  },
});
export default LoginScreen;
