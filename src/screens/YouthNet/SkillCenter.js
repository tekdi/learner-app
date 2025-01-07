import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';
import BackHeader from '../../components/Layout/BackHeader';
import DropdownSelect2 from '@components/DropdownSelect/DropdownSelect2';
import { getGeoLocation } from '@src/utils/API/AuthService';
import { setDataInStorage } from '@src/utils/JsHelper/Helper';
import globalStyles from '@src/utils/Helper/Style';
import SkillCenterCard from './SkillCenterCard';
import HorizontalLine from '@components/HorizontalLine/HorizontalLine';

const SkillCenter = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [stateData, setStateData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState([]);
  const [villageData, setVillageData] = useState([]);

  const mydata = {
    title: 'Bhor Electrical',
    address: 'Sharmik Hall, Near By ST Stand Bhor ,Tal Bhor, Dist Pune 412206',
    images: [
      'https://jll-global-gdim-res.cloudinary.com/image/upload/c_fill,h_600,w_1200/v1505556290/IN_ML20170916/Lohia-Jain-IT-Park---Wing-A_7569_20170916_002.jpg',
      'https://www.lohiajaingroup.com/images/lohiajain-projects-bavdhan.jpg',
      'https://images.nobroker.in/img/5e973c0da5a1662dac0b3444/5e973c0da5a1662dac0b3444_68671_733194_large.jpg',
    ],
  };

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

  const fetchDistricts = async () => {
    const payload = {
      // limit: 10,
      offset: 0,
      fieldName: 'districts',
      controllingfieldfk: selectedState?.value || selectedState,
    };

    const data = await getGeoLocation({ payload });

    setDistrictData(data?.values);
    setSelectedVillage(null);
  };
  const fetchVillages = async () => {
    const payload = {
      // limit: 10,
      offset: 0,
      fieldName: 'villages',
      controllingfieldfk: selectedDistrict?.value || selectedDistrict,
    };

    const data = await getGeoLocation({ payload });

    setVillageData(data?.values);
  };

  useEffect(() => {
    if (selectedState?.value) {
      fetchDistricts();
      setSelectedDistrict(null);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedState?.value && selectedDistrict?.value) {
      fetchVillages();
    }
  }, [selectedDistrict]);

  return (
    <>
      <SecondaryHeader logo />
      <ScrollView style={[globalStyles.container, { borderWidth: 1 }]}>
        <View>
          <BackHeader title={'all_skilling_centers'} />
          <View style={[globalStyles.flexrow, { alignItems: 'flex-start' }]}>
            <View style={{ flex: 2 }}>
              <DropdownSelect2
                field={stateData}
                name={'state'}
                setSelectedIds={setSelectedState}
                selectedIds={selectedState}
                value={''}
              />
            </View>
            <View style={{ flex: 2 }}>
              <DropdownSelect2
                field={districtData}
                name={'district'}
                setSelectedIds={setSelectedDistrict}
                selectedIds={selectedDistrict}
                // value={''}
              />
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              top: 140,
              width: '100%',
              zIndex: -1,
            }}
          >
            <DropdownSelect2
              field={villageData}
              name={'village'}
              setSelectedIds={setSelectedVillage}
              selectedIds={selectedVillage}
              value={''}
            />
          </View>
        </View>
        <View style={{ top: 100, paddingBottom: 140 }}>
          <SkillCenterCard data={mydata} />
          {/* <HorizontalLine />
          <SkillCenterCard data={mydata} />
          <SkillCenterCard data={mydata} /> */}
        </View>
      </ScrollView>
    </>
  );
};

SkillCenter.propTypes = {};

export default SkillCenter;
