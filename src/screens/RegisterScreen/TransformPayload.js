import { convertDate } from '../../utils/Helper/JSHelper';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';

export const transformPayload = async (data) => {
  const studentForm = JSON.parse(await getDataFromStorage('studentForm'));
  const studentProgramForm = JSON.parse(
    await getDataFromStorage('studentProgramForm')
  );

  const mergedForm = [...studentForm, ...studentProgramForm];

  const getFieldIdByName = () => {
    const result = {
      customFields: [],
      tenantCohortRoleMapping: [],
    };

    mergedForm.forEach((field) => {
      const keyName = field.name; // Get field name from studentForm
      const type = field.type;

      if (data.hasOwnProperty(keyName)) {
        if (field.fieldId) {
          // Push to customFields if fieldId is present
          if (type === 'drop_down') {
            result.customFields.push({
              value: [data[keyName].value],
              fieldId: field.fieldId,
            });
          } else {
            result.customFields.push({
              value: data[keyName].value || data[keyName],
              fieldId: field.fieldId,
            });
          }
        } else if (keyName === 'program') {
          result['tenantCohortRoleMapping'] = [
            {
              tenantId: data[keyName]?.value,
              roleId: data[keyName]?.roleId,
            },
          ];
        } else {
          if (keyName === 'dob') {
            result[keyName] = convertDate(data[keyName]);
          } else {
            result[keyName] = data[keyName];
          }
          // Add directly to result if fieldId is absent (Core Fields)
        }
      }
    });

    return result;
  };

  return getFieldIdByName();
};
