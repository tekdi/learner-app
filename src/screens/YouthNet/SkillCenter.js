import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';
import BackHeader from '../../components/Layout/BackHeader';
import DropdownSelect2 from '@components/DropdownSelect/DropdownSelect2';
import { getGeoLocation } from '@src/utils/API/AuthService';
import { setDataInStorage } from '@src/utils/JsHelper/Helper';
import globalStyles from '@src/utils/Helper/Style';
import SkillCenterCard from './SkillCenterCard';
import HorizontalLine from '@components/HorizontalLine/HorizontalLine';
import { cohortSearch } from '../../utils/API/AuthService';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '../../context/LanguageContext';
import ActiveLoading from '../LoadingScreen/ActiveLoading';

const SkillCenter = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [stateData, setStateData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState([]);
  const [villageData, setVillageData] = useState([]);
  const [skillCenterData, setSkillCenterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
      limit: 1000,
      offset: 0,
      fieldName: 'state',
    };
    const data = await getGeoLocation({ payload });
    setDataInStorage('states', JSON.stringify(data?.values));
    return data?.values;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const states = await fetchstates();
      setStateData(states);
      const profileDetails = JSON.parse(await getDataFromStorage('profileData'))
        ?.getUserDetails?.[0];

      const customFields = profileDetails?.customFields.reduce(
        (acc, { label, selectedValues }) => {
          acc[label] = Array.isArray(selectedValues)
            ? selectedValues.map((item) => item?.id).join(', ')
            : selectedValues;
          return acc;
        },
        {}
      );
      const skillcenter = await cohortSearch({ customFields });
      setSkillCenterData(skillcenter?.results?.cohortDetails);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log('stateData==>', selectedState);

      const customFields = {
        STATE: selectedState?.value,
        DISTRICT: selectedDistrict?.value,
      };

      const skillcenter = await cohortSearch({ customFields });
      setSkillCenterData(skillcenter?.results?.cohortDetails);
    };
    if (selectedState) {
      fetchData();
    }
  }, [selectedState, selectedDistrict]);

  const fetchDistricts = async () => {
    const payload = {
      limit: 1000,
      offset: 0,
      fieldName: 'district',
      controllingfieldfk: [selectedState?.value || selectedState],
    };

    const data = await getGeoLocation({ payload });
    setDistrictData(data?.values);
    setSelectedVillage(null);
  };
  const fetchVillages = async () => {
    console.log('selectedDistrict', selectedDistrict);

    const payload = {
      limit: 1000,
      offset: 0,
      fieldName: 'village',
      controllingfieldfk: [selectedDistrict?.value || selectedDistrict],
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
          <View>
            <DropdownSelect2
              field={villageData}
              name={'village'}
              setSelectedIds={setSelectedVillage}
              selectedIds={selectedVillage}
              value={''}
            />
          </View>
        </View>
        {loading ? (
          <ActiveLoading />
        ) : (
          <View style={{ paddingBottom: 100, zIndex: -1 }}>
            {skillCenterData ? (
              skillCenterData?.map((item, i) => {
                return (
                  <View key={i}>
                    <SkillCenterCard data={item} />
                    <HorizontalLine />
                  </View>
                );
              })
            ) : (
              <GlobalText style={globalStyles.heading2}>
                {t('no_data_found')}
              </GlobalText>
            )}
            {}
          </View>
        )}
      </ScrollView>
    </>
  );
};

SkillCenter.propTypes = {};

export default SkillCenter;
