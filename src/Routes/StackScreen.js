import React, { lazy } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabScreen from './TabScreen';
import { View } from 'react-native';

import LoadingScreen from '../screens/LoadingScreen/LoadingScreen';
import LanguageScreen from '../screens/LanguageScreen/LanguageScreen';

const RegisterScreen = lazy(() =>
  import('../screens/RegisterScreen/RegisterScreen')
);
const LoginSignUpScreen = lazy(() =>
  import('../screens/LoginSignUpScreen/LoginSignUpScreen')
);
const RegisterStart = lazy(() =>
  import('../screens/RegisterStart/RegisterStart')
);
const LoginScreen = lazy(() => import('../screens/LoginScreen/LoginScreen'));
const TermsAndCondition = lazy(() =>
  import('../screens/LoginScreen/TermsAndCondition')
);
const PlayerScreen = lazy(() => import('../screens/PlayerScreen/PlayerScreen'));
const QuMLPlayer = lazy(() =>
  import('../screens/PlayerScreen/QuMLPlayer/QuMLPlayer')
);
const QuMLPlayerOffline = lazy(() =>
  import('../screens/PlayerScreen/QuMLPlayer/QuMLPlayerOffline')
);
const PdfPlayer = lazy(() =>
  import('../screens/PlayerScreen/PdfPlayer/PdfPlayer')
);
const PdfPlayerOffline = lazy(() =>
  import('../screens/PlayerScreen/PdfPlayer/PdfPlayerOffline')
);
const VideoPlayer = lazy(() =>
  import('../screens/PlayerScreen/VideoPlayer/VideoPlayer')
);
const VideoPlayerOffline = lazy(() =>
  import('../screens/PlayerScreen/VideoPlayer/VideoPlayerOffline')
);
const EpubPlayer = lazy(() =>
  import('../screens/PlayerScreen/EpubPlayer/EpubPlayer')
);
const EpubPlayerOffline = lazy(() =>
  import('../screens/PlayerScreen/EpubPlayer/EpubPlayerOffline')
);
const ECMLPlayer = lazy(() =>
  import('../screens/PlayerScreen/ECMLPlayer/ECMLPlayer')
);
const ECMLPlayerOffline = lazy(() =>
  import('../screens/PlayerScreen/ECMLPlayer/ECMLPlayerOffline')
);
const H5PPlayer = lazy(() =>
  import('../screens/PlayerScreen/H5PPlayer/H5PPlayer')
);
const H5PPlayerOffline = lazy(() =>
  import('../screens/PlayerScreen/H5PPlayer/H5PPlayerOffline')
);
const HTMLPlayer = lazy(() =>
  import('../screens/PlayerScreen/HTMLPlayer/HTMLPlayer')
);
const HTMLPlayerOffline = lazy(() =>
  import('../screens/PlayerScreen/HTMLPlayer/HTMLPlayerOffline')
);
const YoutubePlayer = lazy(() =>
  import('../screens/PlayerScreen/YoutubePlayer/YoutubePlayer')
);
const StandAlonePlayer = lazy(() =>
  import('../screens/PlayerScreen/StandAlonePlayer/StandAlonePlayer')
);
const EnableLocationScreen = lazy(() =>
  import('../screens/Location/EnableLocationScreen')
);
import AssessmentStack from './AssessmentStack';
import DashboardStack from './DashboardStack';

const StackScreen = (props) => {
  const Stack = createNativeStackNavigator();

  const headerBackground = () => {
    return <View style={{ backgroundColor: 'white', flex: 1 }}></View>;
  };

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      //solved blanck screen issue for long time
      initialRouteName="LoadingScreen"
    >
      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          headerShown: false,
          headerBackground: () => headerBackground(),
        }}
      />
      <Stack.Screen
        name="LoginSignUpScreen"
        component={LoginSignUpScreen}
        options={{
          headerShown: false,
          headerBackground: () => headerBackground(),
        }}
      />
      <Stack.Screen name="RegisterStart" component={RegisterStart} />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Dashboard"
        component={TabScreen} // Changed to TabScreen for now to show content in dashboard
        //component={AssessmentStack} // Changed to AssessmentStack for now to show only Assessment
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PlayerScreen"
        component={PlayerScreen}
        options={{
          headerShown: false,
          headerBackground: () => (
            <View style={{ backgroundColor: 'white', flex: 1 }}></View>
          ),
        }}
      />
      <Stack.Screen
        name="QuMLPlayer"
        component={QuMLPlayer}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="QuMLPlayerOffline"
        component={QuMLPlayerOffline}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PdfPlayer"
        component={PdfPlayer}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PdfPlayerOffline"
        component={PdfPlayerOffline}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="VideoPlayer"
        component={VideoPlayer}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="VideoPlayerOffline"
        component={VideoPlayerOffline}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EpubPlayer"
        component={EpubPlayer}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EpubPlayerOffline"
        component={EpubPlayerOffline}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ECMLPlayer"
        component={ECMLPlayer}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ECMLPlayerOffline"
        component={ECMLPlayerOffline}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="H5PPlayer"
        component={H5PPlayer}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="H5PPlayerOffline"
        component={H5PPlayerOffline}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="HTMLPlayer"
        component={HTMLPlayer}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="HTMLPlayerOffline"
        component={HTMLPlayerOffline}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="YoutubePlayer"
        component={YoutubePlayer}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="StandAlonePlayer"
        component={StandAlonePlayer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="DashboardStack"
        component={DashboardStack} // Changed to Assessment for now
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EnableLocationScreen"
        component={EnableLocationScreen} // Changed to Assessment for now
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackScreen;
