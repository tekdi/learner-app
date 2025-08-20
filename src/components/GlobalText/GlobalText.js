import React from 'react';
import { Text as RNText, I18nManager, StyleSheet } from 'react-native';

const GlobalText = ({ style, ...props }) => {
  return (
    <RNText
      {...props}
      allowFontScaling={false}
      style={[
        styles.text, // Default RTL-aware styling
        style, // Override styles if provided
      ]}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: I18nManager.isRTL ? 'right' : 'left', // Automatically adjust text alignment
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', // Ensure correct writing direction
  },
});

export default GlobalText;
