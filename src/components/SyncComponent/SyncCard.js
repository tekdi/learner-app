import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import globalStyles from '../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/Ionicons';
import { useInternet } from '../../context/NetworkContext';

const SyncCard = () => {
  const { t } = useTranslation();
  const { isConnected } = useInternet();
  return (
    <View style={styles.container}>
      {isConnected ? (
        <>
          <Icon name="cloud-outline" color={'black'} size={22} />
          <Text style={[globalStyles.text, { marginLeft: 10 }]}>
            {t('back_online_syncing')}
          </Text>
        </>
      ) : (
        <>
          <Icon name="cloud-offline-outline" color={'#7C766F'} size={22} />
          <Text style={[globalStyles.text, { marginLeft: 10 }]}>
            {t('sync_pending_no_internet_available')}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#CDE2FF',
    // Shadow for Android
    elevation: 10, // Adjust to control the intensity of the shadow
  },
});

export default SyncCard;
