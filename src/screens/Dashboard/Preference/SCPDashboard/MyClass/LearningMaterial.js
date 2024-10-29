import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import DropdownSelect2 from '../../../../../components/DropdownSelect/DropdownSelect2';
import { View } from 'react-native';
import MaterialCard from './MaterialCard';
import { useTranslation } from '../../../../../context/LanguageContext';

const LearningMaterial = () => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState(null);

  console.log({ selectedIds });
  const field = {
    options: [
      { label: 'abc', value: '1' },
      { label: 'xyz', value: '2' },
    ],
  };

  return (
    <SafeAreaView>
      <DropdownSelect2
        field={field}
        name={'course_type'}
        setSelectedIds={setSelectedIds}
        selectedIds={selectedIds}
        value={''}
      />
      {selectedIds?.value && (
        <View style={styles.viewbox}>
          <MaterialCard title="Maths" />
          <MaterialCard title="Maths" />
          <MaterialCard title="Maths" />
          <MaterialCard title="Maths" />
          <MaterialCard title="Maths" />
          <MaterialCard title="Maths" />
          <MaterialCard title="Maths" />
          <MaterialCard title="Maths" />
        </View>
      )}
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

export default LearningMaterial;
