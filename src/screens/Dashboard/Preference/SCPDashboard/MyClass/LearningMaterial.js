import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import DropdownSelect2 from '../../../../../components/DropdownSelect/DropdownSelect2';
import { View } from 'react-native';
import MaterialCard from './MaterialCard';
import { useTranslation } from '../../../../../context/LanguageContext';
import {
  getDataFromStorage,
  getOptionsByCategory,
} from '../../../../../utils/JsHelper/Helper';
import { LearningMaterialAPI } from '../../../../../utils/API/AuthService';
import ActiveLoading from '../../../../LoadingScreen/ActiveLoading';

const LearningMaterial = () => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState(null);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courseSubjectList, setCourseSubjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const boardData = await LearningMaterialAPI();
      // console.log({ boardData });

      const cohort = JSON.parse(await getDataFromStorage('cohortData'));
      const cohortData = cohort?.cohortData?.[0];

      const frameworks = boardData?.result?.framework;
      const state = cohortData.customField.find(
        (item) => item.label === 'STATES'
      );
      const board = cohortData.customField.find(
        (item) => item.label === 'BOARD'
      );
      const medium = cohortData.customField.find(
        (item) => item.label === 'MEDIUM'
      );
      const grade = cohortData.customField.find(
        (item) => item.label === 'GRADE'
      );

      const getStates = getOptionsByCategory(frameworks, 'state');
      const matchState = getStates.find((item) => item.name === state?.value);

      const getBoards = getOptionsByCategory(frameworks, 'board');
      const matchBoard = getBoards.find(
        (item) => item.name === (board?.value || 'Maharashtra')
      );

      const getMedium = getOptionsByCategory(frameworks, 'medium');
      const matchMedium = getMedium.find(
        (item) => item.name === (medium?.value || 'Marathi')
      );

      const getGrades = getOptionsByCategory(frameworks, 'gradeLevel');
      const matchGrade = getGrades.find(
        (item) => item.name === (grade?.value || 'Grade 10')
      );

      console.log({ matchGrade });

      const getCourseTypes = getOptionsByCategory(frameworks, 'courseType');
      const courseType = getCourseTypes?.map((type) => type.name);
      const courseTypesAssociations = getCourseTypes?.map((type) => {
        return {
          code: type.code,
          name: type.name,
          associations: type.associations,
        };
      });

      const courseSubjectLists = courseTypesAssociations.map((courseType) => {
        const commonAssociations = courseType?.associations.filter(
          (assoc) =>
            matchState?.associations.some((item) => item.code === assoc.code) &&
            matchBoard?.associations.some((item) => item.code === assoc.code) &&
            matchMedium?.associations.some(
              (item) => item.code === assoc.code
            ) &&
            matchGrade?.associations.some((item) => item.code === assoc.code)
        );

        const getSubjects = getOptionsByCategory(frameworks, 'subject');
        const subjectAssociations = commonAssociations?.filter((assoc) =>
          getSubjects.some((item) => assoc.code === item?.code)
        );

        console.log(JSON.stringify(cohortData));

        return {
          courseTypeName: courseType?.name,
          courseType: courseType?.code,
          subjects: subjectAssociations?.map((subject) => subject?.name),
        };
      });

      setCourseSubjectList(courseSubjectLists);
      setCourseTypes(courseType);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Find the selected course and update the subjects
    const selectedCourse = courseSubjectList.find(
      (item) => item.courseTypeName === selectedIds?.label
    );

    setSubjects(selectedCourse ? selectedCourse.subjects : []);
  }, [selectedIds]);

  // console.log('DDDD', subjects);
  // console.log('courseSubjectLists', JSON.stringify(courseSubjectList));

  return loading ? (
    <ActiveLoading />
  ) : (
    <SafeAreaView>
      <DropdownSelect2
        field={courseTypes}
        name={'course_type'}
        setSelectedIds={setSelectedIds}
        selectedIds={selectedIds}
        value={''}
      />

      {selectedIds?.value && subjects && (
        <View style={styles.viewbox}>
          {subjects.map((item, key) => {
            return (
              <MaterialCard key={key} selectedIds={selectedIds} title={item} />
            );
          })}
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
