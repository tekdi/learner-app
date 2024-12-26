import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Text, View } from 'react-native';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';
import BackHeader from '../../components/Layout/BackHeader';
import DropdownSelect2 from '@components/DropdownSelect/DropdownSelect2';
import { getGeoLocation } from '@src/utils/API/AuthService';
import { setDataInStorage } from '@src/utils/JsHelper/Helper';

const SkillCenter = (props) => {
  const [selectedIds, setSelectedIds] = useState(null);
  const [stateData, setStateData] = useState([]);

  const fetchstates = async () => {
    const payload = {
      limit: 10,
      offset: 0,
      fieldName: 'states',
    };
    const data = await getGeoLocation({ payload });
    setDataInStorage('states', JSON.stringify(data?.values));
    return data?.values;
  };

  useEffect(() => {
    const fetchData = async () => {
      const states = await fetchstates();
      setStateData(states);
    };

    fetchData();
  }, []);

  console.log('states', JSON.stringify(stateData));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SecondaryHeader logo />
      <View style={{ padding: 15 }}>
        <BackHeader title={'all_skilling_centers'} />
        <View>
          <DropdownSelect2
            field={stateData}
            name={'state'}
            setSelectedIds={setSelectedIds}
            selectedIds={selectedIds}
            value={''}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

SkillCenter.propTypes = {};

export default SkillCenter;
