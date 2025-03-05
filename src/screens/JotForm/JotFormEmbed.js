import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useTranslation } from '../../context/LanguageContext';
import Config from 'react-native-config';

const JotFormEmbed = ({ queryParams }) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const jotForm = Config.NEXT_PUBLIC_JOTFORM_URL;
  const formId = Config.NEXT_PUBLIC_JOTFORM_ID;

  const queryString = new URLSearchParams(queryParams).toString();
  console.log('queryString', queryString);

  const formUrl = `${jotForm}/${formId}?${queryString}`;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <WebView
        source={{ uri: formUrl }}
        onLoad={() => setLoading(false)}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  webview: {
    flex: 1,
  },
});

export default JotFormEmbed;
