import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Accordion2 from '../../../../../components/Accordion/Accordion2';
import {
  EventDetails,
  SolutionEvent,
  SolutionEventDetails,
  targetedSolutions,
} from '../../../../../utils/API/AuthService';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import SecondaryHeader from '../../../../../components/Layout/SecondaryHeader';
import globalStyles from '../../../../../utils/Helper/Style';
import { useTranslation } from '../../../../../context/LanguageContext';
import ActiveLoading from '../../../../LoadingScreen/ActiveLoading';
import CustomSearchBox from '../../../../../components/CustomSearchBox/CustomSearchBox';
import GlobalText from '@components/GlobalText/GlobalText';

const MaterialCardView = ({ route }) => {
  const { subjectName, type } = route.params;
  const [details, setDetails] = useState([]);
  const [completeDetails, setCompleteDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const { t } = useTranslation();

  const callProgramIfempty = async ({ solutionId, id }) => {
    const data = await SolutionEvent({ solutionId });
    const templateId = data?.externalId;
    const result = await SolutionEventDetails({ templateId, solutionId });
    if (!id) {
      fetchData();
    } else {
      console.log('error_API_Success');
    }
  };

  const fetchData = async () => {
    const data = await targetedSolutions({ subjectName, type });
    const id = data?.data?.[0]?._id;
    const solutionId = data?.data?.[0]?.solutionId;
    if (data?.data?.[0]?._id == '') {
      callProgramIfempty({ solutionId, id });
    } else {
      // console.log('reachedElse');
      const result = await EventDetails({ id });

      console.log('result', JSON.stringify(result));

      setDetails(result?.tasks || []);
      setCompleteDetails(result?.tasks || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async () => {
    const results = details?.filter((item) =>
      item?.name?.toLowerCase().includes(searchText?.toLowerCase())
    );

    // Update the filtered data
    if (searchText === '') {
      setDetails(completeDetails);
    } else {
      setDetails(results || []);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <SecondaryHeader />
      {loading ? (
        <ActiveLoading />
      ) : (
        <ScrollView style={{ maxHeight: '85%' }}>
          <View style={{ padding: 20 }}>
            <GlobalText style={globalStyles.heading}>{subjectName}</GlobalText>
            <GlobalText style={globalStyles.text}>{type}</GlobalText>
          </View>

          <CustomSearchBox
            setSearchText={setSearchText}
            searchText={searchText}
            handleSearch={handleSearch}
            placeholder={t('Search Content')}
          />

          {details.length > 0 ? (
            details?.map((item, i) => {
              return (
                <Accordion2
                  key={i}
                  index={i}
                  openDropDown={true}
                  title={item?.name}
                  children={item?.children}
                />
              );
            })
          ) : (
            <GlobalText style={globalStyles.heading}>
              {t('no_topics')}
            </GlobalText>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

MaterialCardView.propTypes = {};

export default MaterialCardView;
