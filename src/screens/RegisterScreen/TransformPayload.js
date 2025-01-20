import { getDataFromStorage } from '../../utils/JsHelper/Helper';

export const transformPayload = async (data) => {
  const studentForm = JSON.parse(await getDataFromStorage('studentForm'));

  const getFieldIdByName = (name) => {
    const field = studentForm.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    return field ? field.fieldId : null;
  };

  const customFields = [
    // {
    //   value: data.preferred_language.value,
    //   fieldId: getFieldIdByName('preferred language'),
    // },
    {
      value: data.age,
      fieldId: getFieldIdByName('age'),
    },
    {
      value: data.gender,
      fieldId: getFieldIdByName('gender'),
    },
    ...(data?.parent_name
      ? [
          {
            value: data.parent_name,
            fieldId: getFieldIdByName('parent_name'),
          },
          {
            value: data.parent_phone,
            fieldId: getFieldIdByName('parent_phone'),
          },
          {
            value: [data.parent_phone_belong?.value],
            fieldId: getFieldIdByName('parent_phone_belong'),
          },
        ]
      : []),

    // Add state, district, and block only if block value is present
    ...(data?.blocks?.value
      ? [
          {
            // eslint-disable-next-line no-constant-binary-expression
            value: [data?.states?.value] || null,
            fieldId: getFieldIdByName('states'),
          },
          {
            // eslint-disable-next-line no-constant-binary-expression
            value: [data?.districts?.value] || null,
            fieldId: getFieldIdByName('districts'),
          },
          {
            // eslint-disable-next-line no-constant-binary-expression
            value: [data?.blocks?.value] || '',
            fieldId: getFieldIdByName('blocks'),
          },
        ]
      : []),
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
      tenantId: data?.program?.value,
      roleId: data?.program?.roleId,
    },
  ];

  return {
    name: `${data.first_name} ${data.last_name}`,
    username: data.username,
    password: data.password,
    email: data?.email,
    mobile: data?.mobile,
    tenantCohortRoleMapping,
    customFields,
  };
};
