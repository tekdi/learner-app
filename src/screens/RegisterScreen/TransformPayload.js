import { convertDate } from '../../utils/Helper/JSHelper';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';

export const transformPayload = async (data) => {
  const studentForm = JSON.parse(await getDataFromStorage('studentForm'));
  const studentProgramForm = JSON.parse(
    await getDataFromStorage('studentProgramForm')
  );
  console.log('data', JSON.stringify(data));

  const mergedForm = [...studentForm, ...studentProgramForm];

  const getFieldIdByName = () => {
    const result = {
      customFields: [],
      tenantCohortRoleMapping: [],
    };

    mergedForm.forEach((field) => {
      const keyName = field.name; // Get field name from studentForm
      const type = field.type;

      console.log({ keyName });

      if (data.hasOwnProperty(keyName)) {
        if (field.fieldId) {
          // Push to customFields if fieldId is present
          if (type === 'drop_down') {
            data[keyName].value &&
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
              roleId:
                data[keyName]?.roleId || 'eea7ddab-bdf9-4db1-a1bb-43ef503d65ef',
            },
          ];
        } else {
          result[keyName] = data[keyName];
        }
      }
    });

    return result;
  };

  return getFieldIdByName();
};
