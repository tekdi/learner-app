import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SecondaryButton from '../../components/SecondaryButton/SecondaryButton';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useTranslation } from '../../context/LanguageContext';
import Logo from '../../assets/images/png/logo.png';
import GlobalText from '@components/GlobalText/GlobalText';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import Config from 'react-native-config';

const CopilotView = walkthroughable(View); // Wrap Text to make it interactable

const LoginSignUpScreen = () => {
  const { t } = useTranslation();
  const nav = useNavigation();
  const { start, copilotEvents, goToNth, unregisterStep } = useCopilot();
  const [CopilotStarted, setCopilotStarted] = useState(false);

  // useEffect(() => {
  //   const COPILOT_ENABLED = Config.COPILOT_ENABLE;
  //   // Start Copilot only if it's not already started
  //   if (!CopilotStarted && COPILOT_ENABLED) {
  //     // Unregister steps 1 and 2
  //     unregisterStep('start'); // Unregister step 1
  //     unregisterStep('continueButton'); // Unregister step 2

  //     // Optionally register new steps if required
  //     // registerStep(3); // Example of dynamically registering a step

  //     start(); // Start the Copilot tour
  //     // goToNth(3); // Navigate to step 3 to skip steps 1 and 2

  //     copilotEvents.on('start', () => setCopilotStarted(true));
  //   }
  // }, [start, copilotEvents, CopilotStarted, unregisterStep, goToNth]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <TouchableOpacity
            style={styles.backbutton}
            onPress={() => nav.navigate('LanguageScreen')}
          >
            <Image
              source={backIcon}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 2 }}>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Image style={styles.image} source={Logo} resizeMode="contain" />
            <GlobalText style={styles.title}>{t('let_log_in')}</GlobalText>
          </View>
        </View>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={styles.buttonContainer}>
            <CopilotStep
              text={t('click_here_to_login')}
              isFirstStep={true}
              order={3}
              name="login"
            >
              <CopilotView>
                <PrimaryButton
                  text={t('login')}
                  onPress={() => nav.navigate('LoginScreen')}
                />
              </CopilotView>
            </CopilotStep>
            <View style={{ padding: 10 }} />
            <CopilotStep
              text={t('click_here_to_create_new_account')}
              order={4}
              name="create_account"
            >
              <CopilotView>
                <SecondaryButton
                  text={'create_new_account'}
                  onPress={() => nav.navigate('RegisterStart')}
                  style={{ fontSize: 14.5 }}
                />
              </CopilotView>
            </CopilotStep>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: 'white',
  },
  backbutton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  buttonContainer: {
    padding: 10,
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  image: {
    height: 60,
    width: 60,
  },
  container_image: {
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    marginTop: 15,
    fontWeight: '1000',
    textAlign: 'center',
  },
});

export default LoginSignUpScreen;
