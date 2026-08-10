import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '@context/LanguageContext';
import globalStyles from '../../utils/Helper/Style';
import {
  buildUserDetailsObject,
  getDataFromStorage,
  getMergedProfileSchema,
  getMissingProfileFields,
} from '../../utils/JsHelper/Helper';

const CompleteProfileBanner = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [banner, setBanner] = useState({ visible: false, tenantId: null });

  const checkProfileCompletion = useCallback(async () => {
    try {
      const tenantData = JSON.parse((await getDataFromStorage('tenantData')) || 'null');
      const tenantId = tenantData?.[0]?.tenantId;
      if (!tenantId) {
        setBanner({ visible: false, tenantId: null });
        return;
      }

      // Scope is common + program-specific, matching web. getMissingProfileFields
      // applies the banner's own exclusion list (e.g. middleName never counts).
      const schema = await getMergedProfileSchema(tenantId);
      const profileData = JSON.parse((await getDataFromStorage('profileData')) || 'null');
      const userDetails = buildUserDetailsObject(profileData, schema);
      const { isComplete } = getMissingProfileFields(schema, userDetails);

      // The form derives its own field list (it asks for a few things the banner
      // ignores), so only the tenant is handed over.
      setBanner({ visible: !isComplete, tenantId });
    } catch {
      // Fail closed - don't nag the user if we couldn't determine completeness.
      setBanner({ visible: false, tenantId: null });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkProfileCompletion();
    }, [checkProfileCompletion])
  );

  if (!banner.visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <GlobalText style={[globalStyles.text, styles.message]}>
        {t('complete_profile_banner_message')}
      </GlobalText>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('CompleteProfileForm', {
            tenantId: banner.tenantId,
          })
        }
      >
        <GlobalText style={styles.buttonText}>{t('complete_profile_button')}</GlobalText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCE7B8',
    borderRadius: 16,
    marginVertical: 15,
    padding: 15,
  },
  message: {
    marginBottom: 10,
  },
  button: {
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#F0A809',
    paddingHorizontal: 14,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: 'Roboto-Black',
    fontSize: 13,
    color: '#1F1B13',
  },
});

export default CompleteProfileBanner;
