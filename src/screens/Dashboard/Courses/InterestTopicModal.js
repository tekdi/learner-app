import FastImage from '@changwoolab/react-native-fast-image';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Modal } from 'react-native';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';
import GlobalText from '@components/GlobalText/GlobalText';
import globalStyles from '../../../utils/Helper/Style';
import { useTranslation } from '../../../context/LanguageContext';
import DropdownSelect2 from '../../../components/DropdownSelect/DropdownSelect2';

import Icon from 'react-native-vector-icons/Ionicons';

const InterestTopicModal = ({
  isTopicModal,
  setIsTopicModal,
  topicList,
  handleInterest,
}) => {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState(null);

  return (
    <Modal visible={isTopicModal} transparent={true} animationType="slide">
      <View style={styles.modalContainer} activeOpacity={1}>
        <View style={styles.alertBox}>
          <View
            style={{ width: '100%', alignItems: 'flex-end', paddingRight: 10 }}
          >
            <TouchableOpacity
              onPress={() => {
                setIsTopicModal(false);
              }}
            >
              <Icon name={'close'} color="#000" size={30} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderTopWidth: 1,
              borderColor: '#D0C5B4',
              marginVertical: 20,
              width: '100%',
            }}
          >
            {/* <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Icon
                name={'checkmark-circle-outline'}
                color="#1A8825"
                size={50}
              />
            </View> */}
            <View style={{ paddingVertical: 10 }}>
              <GlobalText
                style={[
                  globalStyles.subHeading,
                  { textAlign: 'center', fontWeight: 'bold' },
                ]}
              >
                {t('great_we_excited_to_help_you_level_up')}
              </GlobalText>
              <GlobalText
                style={[
                  globalStyles.subHeading,
                  { textAlign: 'center', marginVertical: 10 },
                ]}
              >
                {t('which_topic_are_you_most_interested_in')}
              </GlobalText>
              <DropdownSelect2
                field={topicList?.[0]?.terms}
                name={'topics'}
                setSelectedIds={setSelectedIds}
                selectedIds={selectedIds}
                value={''}
              />
              <GlobalText
                style={[globalStyles.subHeading, { textAlign: 'center' }]}
              >
                {t('select_course_desp')}
              </GlobalText>
            </View>
          </View>
          <View style={styles.btnbox}>
            <PrimaryButton
              text={t('submit')}
              onPress={() => {
                handleInterest(selectedIds);
              }}
              isDisabled={!selectedIds?.label}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    padding: 10,
  },
  btnbox: {
    width: 200,
  },
});

export default InterestTopicModal;
