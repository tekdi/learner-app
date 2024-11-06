import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SecondaryHeader from '../../../../../components/Layout/SecondaryHeader';
import { useTranslation } from '../../../../../context/LanguageContext';
import globalStyles from '../../../../../utils/Helper/Style';
import CustomTabView from '../../../../../components/CustomTabView/CustomTabView';
import MaterialCard from './MaterialCard';
import Assessment from '../../../../Assessment/Assessment';
import HorizontalLine from '../../../../../components/HorizontalLine/HorizontalLine';
import SessionRecording from './SessionRecording';
import LearningMaterial from './LearningMaterial';

const MyClassDashboard = () => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState(null);

  console.log({ selectedIds });

  const tabs = [
    {
      title: t('learning_materials'),
      content: (
        <>
          <LearningMaterial />
        </>
      ),
    },
    // {
    //   title: t('session_recordings'),
    //   content: <SessionRecording />,
    // },
    {
      title: t('assessment'),
      content: <Assessment header background />,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <SecondaryHeader />
      <View style={{ padding: 20 }}>
        <Text style={globalStyles.heading}>{t('my_class')}</Text>

        <CustomTabView
          tabs={tabs}
          activeTabStyle={{ borderBottomWidth: 2, borderColor: '#FDBE16' }}
          inactiveTabStyle={{ borderBottomWidth: 1, borderColor: '#EBE1D4' }}
          tabTextStyle={{ color: '#888' }}
          // activeTextStyle={{ color: 'black', fontWeight: 'bold' }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewbox: {
    // borderWidth: 1,
    padding: 15,
    borderRadius: 20,
    // paddingBottom: 50,
    backgroundColor: '#FBF4E4',
  },
});

export default MyClassDashboard;
