import Config from 'react-native-config';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';

export const transformPayload = async (data) => {
  const studentForm = JSON.parse(await getDataFromStorage('studentForm'));
  const getFieldIdByName = (name) => {
    // Assuming studentForm is the array that contains all the fields
    const field = studentForm.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    // If the field is found, return its fieldId, otherwise return null
    return field ? field.fieldId : null;
  };
  const ROLE_ID = Config.ROLE_ID;

  const customFields = [
    {
      value: data.preferred_language.value,
      fieldId: getFieldIdByName('preferred language'),
    },
    {
      value: data.age,
      fieldId: getFieldIdByName('age'),
    },
    {
      value: data.gender.value,
      fieldId: data.gender.fieldId,
    },
    {
      value: [data?.state?.value] || null,
      fieldId: getFieldIdByName('states'),
    },
    {
      value: [data?.district?.value] || null,
      fieldId: getFieldIdByName('districts'),
    },
    {
      value: [data?.block?.value] || null,
      fieldId: getFieldIdByName('blocks'),
    },
    // Conditionally add interested_content only if it's present
    ...(data?.interested_content?.value
      ? [
          {
            value: data.interested_content.value,
            fieldId: getFieldIdByName('interested content'),
          },
        ]
      : []),
  ];

  const tenantCohortRoleMapping = [
    {
      tenantId: data?.program?.tenantId,
      roleId: data?.program?.roleId,
    },
  ];

  return {
    name: `${data.first_name} ${data.last_name}`,
    username: data.username,
    password: data.password,
    email: data?.email,
    mobile: data?.mobile,
    tenantCohortRoleMapping, // Conditionally added based on the presence of data.program
    customFields: customFields,
  };
};
