import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider } from '@ui-kitten/components';
//importing all designs from eva as eva
import * as eva from '@eva-design/eva';
//importing custom theme for UI Kitten
import theme from './assets/themes/theme.json';
//multiple language
import { LanguageProvider } from './context/LanguageContext'; // Adjust path as needed
import { hideNavigationBar } from 'react-native-navigation-bar-color';
import StackScreen from './Routes/StackScreen';

const App = () => {
  useEffect(() => {
    hideNavigationBar();
  }, []);

  return (
    <LanguageProvider>
      {/* // App.js file has to be wrapped with ApplicationProvider for UI Kitten to
      work */}
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <NavigationContainer>
          <StackScreen />
        </NavigationContainer>
      </ApplicationProvider>
    </LanguageProvider>
  );
};

export default App;
