import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Accordion2 from '../../../../../components/Accordion/Accordion2';
import {
  EventDetails,
  targetedSolutions,
} from '../../../../../utils/API/AuthService';
import { SafeAreaView, ScrollView } from 'react-native';
import SecondaryHeader from '../../../../../components/Layout/SecondaryHeader';

const MaterialCardView = ({ route }) => {
  const { subjectName, type } = route.params;
  const [details, setDetails] = useState([]);

  console.log({ subjectName, type });

  useEffect(() => {
    const fetchData = async () => {
      const data = await targetedSolutions({ subjectName, type });
      // const id = data?.[0]?._id;
      const id = '67220a82dfe4eb0015fb6324';
      const result = await EventDetails({ id });
      console.log('fuck', JSON.stringify(result?.tasks));

      setDetails(result?.tasks || []);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <SecondaryHeader />
      <ScrollView style={{ maxHeight: '85%' }}>
        {details?.map((item, i) => {
          return (
            <Accordion2
              key={i}
              index={i}
              title={item?.name}
              children={item?.children}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

MaterialCardView.propTypes = {};

export default MaterialCardView;
