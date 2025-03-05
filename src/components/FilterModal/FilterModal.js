import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';
import globalStyles from '../../utils/Helper/Style';
import { Button } from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalText from '@components/GlobalText/GlobalText';
import MultiSelectDropdown from '@components/MultiSelectDropdown/MultiSelectDropdown';
import MultiSelectDropdown2 from '@components/MultiSelectDropdown/MultiSelectDropdown2';
import { filterContent, staticFilterContent } from '@src/utils/API/AuthService';
import ActiveLoading from '@src/screens/LoadingScreen/ActiveLoading';
import { getDataFromStorage } from '@src/utils/JsHelper/Helper';

const FilterModal = ({
  isModal,
  setIsModal,
  setParentFormData,
  setParentStaticFormData,
  parentFormData,
  parentStaticFormData,
  setOrginalFormData,
  orginalFormData,
  instant,
}) => {
  const { t } = useTranslation();
  const [filterData, setFilterData] = useState([]);
  const [renderForm, setrenderForm] = useState([]);
  const [renderStaticForm, setRenderStaticForm] = useState([]);
  const [staticFilter, setStaticFilter] = useState([]);
  const [formData, setFormData] = useState([]);
  const [staticFormData, setStaticFormData] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setParentFormData(formData);
  //   setParentStaticFormData(staticFormData);
  // }, [formData, staticFormData]);

  var maxIndex = renderForm.length;
  //convert transformCategoriesto array of obj
  function convertToStructuredArray(obj) {
    return Object.keys(obj).map((key) => ({
      [key]: {
        name: obj[key].name,
        code: obj[key].code,
        options: obj[key].options,
      },
    }));
  }
  // Key value pair function
  function transformCategories(categories) {
    return categories
      .sort((a, b) => a.index - b.index)
      .reduce((acc, category) => {
        acc[category.code] = {
          name: category.name,
          code: category.code,
          index: category.ndex,
          options: category.terms
            .sort((a, b) => a.index - b.index)
            .map((term) => {
              // Group associations by category
              const groupedAssociations =
                term.associations?.reduce((grouped, assoc) => {
                  if (!grouped[assoc.category]) {
                    grouped[assoc.category] = [];
                  }
                  grouped[assoc.category].push(assoc);
                  return grouped;
                }, {}) || {};

              // Sort each category's associations by index
              Object.keys(groupedAssociations).forEach((key) => {
                groupedAssociations[key].sort((a, b) => a.index - b.index);
              });

              return {
                code: term.code,
                name: term.name,
                category: term.category,
                associations: groupedAssociations, // Associations grouped by category
              };
            }),
        };

        return acc;
      }, {});
  }

  function transformRenderForm(categories) {
    return categories
      .sort((a, b) => a.index - b.index)
      .map((category) => ({
        name: category.name,
        code: category.code,
        options: category.terms
          .sort((a, b) => a.index - b.index)
          .map((term) => ({
            code: term.code,
            name: term.name,
            identifier: term.identifier,
          })),
        // associations: category.terms.flatMap((term) => term.associations || []),
        index: category.index,
      }));
  }

  function filterObjectsWithSourceCategory(data, filteredNames) {
    const filter = data?.filter((section) =>
      // eslint-disable-next-line no-prototype-builtins
      section.fields.some((field) => field?.hasOwnProperty('sourceCategory'))
    );
    setStaticFilter(filter);
    const filterData = removeFilteredFields(filter, filteredNames);
    return filterData;
  }

  function removeFilteredFields(filter, filteredNames) {
    return filter.map((category) => ({
      ...category,
      fields: category.fields.filter(
        (field) => !filteredNames.includes(field.name)
      ),
    }));
  }

  function extractNames(renderForm) {
    return renderForm.map((item) => item.name);
  }
  const fetchData = async () => {
    setLoading(true);
    console.log('instant', instant);
    const instantId = instant?.frameworkId;
    const data = await filterContent({ instantId });
    const categories = data?.framework?.categories;
    const transformedOutput = transformCategories(categories);
    const result = convertToStructuredArray(transformedOutput);
    // RenderForm
    const transformRenderFormOutput = transformRenderForm(categories || []);

    setrenderForm(transformRenderFormOutput);
    fetchStaticForm(transformRenderFormOutput);
    setFilterData(result);
  };
  const fetchStaticForm = async (transformRenderFormOutput) => {
    const instantId = instant?.channelId;
    const data = await staticFilterContent({ instantId });
    const form = data?.objectCategoryDefinition?.forms?.create?.properties;
    const filteredNames = extractNames(transformRenderFormOutput);
    const filteredForm = filterObjectsWithSourceCategory(form, filteredNames);

    setRenderStaticForm(filteredForm?.[0]?.fields);
    // setFilterData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    setFormData(orginalFormData);
    setStaticFormData(parentStaticFormData);
  }, []);

  const findAndRemoveIndexes = (currentSelectedIndex, maxIndex, form) => {
    return form.map((item) => ({
      ...item,
      options: item.index > currentSelectedIndex ? [] : item.options,
    }));
  };

  const updateRenderFormWithAssociations = (
    category,
    newCategoryData,
    form,
    renderForm
  ) => {
    // Find the object in form that matches the given category
    // console.log('category', category);
    // console.log('newCategoryData', JSON.stringify(newCategoryData));
    // console.log('form', JSON.stringify(form));
    // console.log('renderForm', JSON.stringify(renderForm));

    const categoryObject = form.find((obj) => obj[category]);
    if (!categoryObject) return renderForm; // If category not found, return original renderForm

    const categoryData = categoryObject[category];
    // Find matching options in form based on newCategoryData
    const newCategoryCodes = newCategoryData.map((category) => category.code);
    const matchedOptions = categoryData.options.filter((option) =>
      newCategoryCodes.includes(option.code)
    );
    // console.log('matchedOptions', JSON.stringify(matchedOptions));

    // Extract associations from matched options, ensuring no duplicates
    let associationsToPush = {};

    matchedOptions.forEach((option) => {
      Object.keys(option.associations).forEach((assocKey) => {
        if (!associationsToPush[assocKey]) {
          associationsToPush[assocKey] = [];
        }

        // Merge unique options by checking for duplicate codes
        option.associations[assocKey].forEach((newOption) => {
          const existingIndex = associationsToPush[assocKey].findIndex(
            (opt) => opt.code === newOption.code
          );

          if (existingIndex !== -1) {
            // Replace existing option with the new one
            associationsToPush[assocKey][existingIndex] = newOption;
          } else {
            // Add new option if it doesn’t exist
            associationsToPush[assocKey].push(newOption);
          }
        });
      });
    });

    // Push associations into renderForm based on the association key
    return renderForm.map((item) => {
      const assocKey = item.code; // The key in renderForm should match the association category

      return {
        ...item,
        options: associationsToPush[assocKey] || item.options, // Update options if association exists
      };
    });
  };

  const replaceOptionsWithAssoc = ({ category, index, newCategoryData }) => {
    if (newCategoryData?.length === 0 && index === 1) {
      fetchData();
    } else {
      const data = findAndRemoveIndexes(index, maxIndex, renderForm);

      const newData = updateRenderFormWithAssociations(
        category,
        newCategoryData,
        filterData,
        data
      );
      const cleanedFormData = cleanFormData(newData);

      setrenderForm(newData);
      return cleanedFormData;
    }
  };

  const cleanFormData = (renderForm) => {
    let cleanedFormData = { ...formData };

    Object.keys(cleanedFormData).forEach((key) => {
      // Find corresponding renderForm object by matching code
      const renderFormItem = renderForm.find((item) => item.code === key);

      if (renderFormItem) {
        // Extract valid option codes from renderForm
        const validCodes = renderFormItem.options.map((option) => option.code);

        // Filter formData values that have a code present in validCodes
        cleanedFormData[key] = cleanedFormData[key].filter((value) =>
          validCodes.includes(value.code)
        );

        // Remove the key if no valid values remain
        if (cleanedFormData[key].length === 0) {
          delete cleanedFormData[key];
        }
      }
    });

    return cleanedFormData;
  };

  const transformFormData = (formData, staticFilter) => {
    // Create a mapping from sourceCategory to code
    const categoryToCodeMap = {};
    staticFilter.forEach((filter) => {
      filter.fields.forEach((field) => {
        if (field.sourceCategory) {
          categoryToCodeMap[field.sourceCategory] = field.code;
        }
      });
    });

    // Transform the formData object
    const transformedData = {};
    Object.keys(formData).forEach((key) => {
      if (categoryToCodeMap[key]) {
        transformedData[categoryToCodeMap[key]] = formData[key].map(
          (item) => item.identifier
        );
      }
    });

    return transformedData;
  };

  const handleFilter = () => {
    const transformedFormData = transformFormData(formData, staticFilter);
    console.log('staticFilter', JSON.stringify(transformedFormData));
    console.log('staticFormData', JSON.stringify(staticFormData));
    setParentFormData(transformedFormData);
    setOrginalFormData(formData);
    setParentStaticFormData(staticFormData);
    setIsModal(false);
  };

  return (
    <Modal visible={isModal} transparent={true} animationType="slide">
      <View style={styles.modalContainer} activeOpacity={1}>
        <View style={styles.alertBox}>
          {/* Header */}
          <View style={styles.header}>
            <GlobalText style={[globalStyles.heading2, { fontWeight: 'bold' }]}>
              {t('filters')}
            </GlobalText>
            <TouchableOpacity
              onPress={() => {
                setIsModal(false);
                // setParentFormData([]);
                // setParentStaticFormData([]);
              }}
            >
              <Icon name={'close'} color="#000" size={30} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          {loading ? (
            <View style={{ height: 200 }}>
              <ActiveLoading />
            </View>
          ) : (
            <ScrollView
              nestedScrollEnabled={true} // ✅ Enables independent scrolling
              style={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ padding: 10 }}>
                {renderForm?.map((item, key) => {
                  return (
                    <View key={key}>
                      <GlobalText
                        style={[
                          globalStyles.subHeading,
                          { fontWeight: 600, marginLeft: 10 },
                        ]}
                      >
                        {item?.name}
                      </GlobalText>

                      <MultiSelectDropdown
                        setFormData={setFormData}
                        formData={formData}
                        options={item?.options}
                        category={item?.code}
                        index={item?.index}
                        replaceOptionsWithAssoc={replaceOptionsWithAssoc}
                      />
                    </View>
                  );
                })}
              </View>
              <GlobalText
                style={[
                  globalStyles.heading2,
                  { fontWeight: 700, marginLeft: 10 },
                ]}
              >
                {t('other_filters')}
              </GlobalText>
              <View style={{ padding: 10 }}>
                {renderStaticForm?.map((item, key) => {
                  return (
                    <View key={key}>
                      <GlobalText
                        style={[
                          globalStyles.subHeading,
                          { fontWeight: 600, marginLeft: 10 },
                        ]}
                      >
                        {item?.name}
                      </GlobalText>

                      <MultiSelectDropdown2
                        setStaticFormData={setStaticFormData}
                        staticFormData={staticFormData}
                        options={item?.range}
                        category={item?.code}
                      />
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
          {/* Footer Buttons */}
          <View style={styles.btnbox}>
            <Button status="primary" style={styles.btn} onPress={handleFilter}>
              {() => (
                <GlobalText
                  style={[globalStyles.subHeading, { marginRight: 10 }]}
                >
                  {t('filter')}
                </GlobalText>
              )}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

FilterModal.propTypes = {
  isModal: PropTypes.bool,
  onClick: PropTypes.any,
  setIsModal: PropTypes.any,
  setParentFormData: PropTypes.any,
  setParentStaticFormData: PropTypes.any,
  parentFormData: PropTypes.any,
  parentStaticFormData: PropTypes.any,
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    paddingBottom: 10,
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#D0C5B4',
  },
  scrollContainer: {
    width: '100%',
    height: 500, // ✅ Limits modal content height
  },
  btnbox: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#D0C5B4',
    padding: 20,
  },
  btn: {
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FilterModal;
