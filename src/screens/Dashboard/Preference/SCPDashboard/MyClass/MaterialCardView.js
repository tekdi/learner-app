import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Accordion2 from '../../../../../components/Accordion/Accordion2';
import {
  EventDetails,
  getAcademicYearList,
  SolutionEvent,
  SolutionEventDetails,
  targetedSolutions,
} from '../../../../../utils/API/AuthService';
import { ScrollView, Text, View } from 'react-native';
import SafeAreaWrapper from '../../../../../components/SafeAreaWrapper/SafeAreaWrapper';
import SecondaryHeader from '../../../../../components/Layout/SecondaryHeader';
import globalStyles from '../../../../../utils/Helper/Style';
import { useTranslation } from '../../../../../context/LanguageContext';
import ActiveLoading from '../../../../LoadingScreen/ActiveLoading';
import CustomSearchBox from '../../../../../components/CustomSearchBox/CustomSearchBox';
import GlobalText from '@components/GlobalText/GlobalText';
import { getDataFromStorage } from '@src/utils/JsHelper/Helper';

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
    try{
      const tenantid = await getDataFromStorage('userTenantid');
         const academicYearId = await getDataFromStorage('academicYearId');
       console.log('#### SubjectDetails academicYearId', academicYearId);
        const academicYearList = await getAcademicYearList({ tenantid });
    //     console.log('#### SubjectDetails academicYearList', academicYearList);
     const storedAcademicYear = academicYearList?.find((ay) => ay?.id === academicYearId);
       const isStoredYearActive = storedAcademicYear?.isActive === true;
        // console.log('#### SubjectDetails isStoredYearActive', isStoredYearActive);
        let startDate, endDate, academicYearRange , data
        if (isStoredYearActive) {
          startDate = storedAcademicYear?.startDate;
          endDate = storedAcademicYear?.endDate;
          academicYearRange = `${startDate?.split('-')[0]}-${endDate?.split('-')[0]}`;
          console.log('#### MaterialCardView academicYearRange', academicYearRange);
          data= await targetedSolutions({ subjectName, type, academicYearRange });
        }
        else{
               data = await targetedSolutions({ subjectName, type });

        }
    console.log('data====>', JSON.stringify(data));
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
  }
    catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
    <SafeAreaWrapper style={{ flex: 1, backgroundColor: 'white' }}>
      <SecondaryHeader />
      {loading ? (
        <ActiveLoading />
      ) : (
        <ScrollView style={[globalStyles.container, { maxHeight: '85%' }]}>
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
            <GlobalText style={[globalStyles.h3, { marginLeft: 10 }]}>
              {t('no_topics')}
            </GlobalText>
          )}
        </ScrollView>
      )}
    </SafeAreaWrapper>
  );
};

MaterialCardView.propTypes = {};

export default MaterialCardView;
