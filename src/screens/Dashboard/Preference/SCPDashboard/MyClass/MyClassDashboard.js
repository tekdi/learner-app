import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SafeAreaWrapper from '../../../../../components/SafeAreaWrapper/SafeAreaWrapper';
import SecondaryHeader from '../../../../../components/Layout/SecondaryHeader';
import { useTranslation } from '../../../../../context/LanguageContext';
import globalStyles from '../../../../../utils/Helper/Style';
import CustomTabView from '../../../../../components/CustomTabView/CustomTabView';
import MaterialCard from './MaterialCard';
import Assessment from '../../../../Assessment/Assessment';
import HorizontalLine from '../../../../../components/HorizontalLine/HorizontalLine';
import SessionRecording from './SessionRecording';
import LearningMaterial from './LearningMaterial';

import GlobalText from '@components/GlobalText/GlobalText';

const MyClassDashboard = () => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  // console.log({ selectedIds });

  const tabs = [
    {
      title: t('learning_materials'),
      content: <LearningMaterial />,
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

  // Refresh the component.
  const handleRefresh = async () => {
    setLoading(true); // Start Refresh Indicator

    try {
      console.log('Fetching Data...');
      // fetchData();
      // fetchCompleteWeekData();
      setRefreshKey((prevKey) => prevKey + 1);
      // navigation.navigate('SCPUserTabScreen');
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop Refresh Indicator
    }
  };

  return (
    <SafeAreaWrapper key={refreshKey} style={{ backgroundColor: 'white' }}>
      <SecondaryHeader logo />

      <View style={{ padding: 0 }}>
        <GlobalText
          style={[globalStyles.heading, { paddingLeft: 20, marginTop: 20 }]}
        >
          {t('my_class')}
        </GlobalText>

        <CustomTabView
          tabs={tabs}
          activeTabStyle={{ borderBottomWidth: 2, borderColor: '#FDBE16' }}
          inactiveTabStyle={{ borderBottomWidth: 1, borderColor: '#EBE1D4' }}
          tabTextStyle={{ color: '#888' }}
          // activeTextStyle={{ color: 'black', fontWeight: 'bold' }}
        />
      </View>
    </SafeAreaWrapper>
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
