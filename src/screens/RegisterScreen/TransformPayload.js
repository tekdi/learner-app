export const transformPayload = async (data) => {
  const customFields = [
    {
      value: data.preferred_language.value,
      fieldId: data.preferred_language.fieldId,
    },
    {
      value: data.age_group.value,
      fieldId: data.age_group.fieldId,
    },
    {
      value: data.gender.value,
      fieldId: data.gender.fieldId,
    },
    {
      value: data.interested_content.value,
      fieldId: data.interested_content.fieldId,
    },
  ];

  return {
    name: `${data.first_name} ${data.last_name}`,
    username: data.username,
    password: data.password,
    customFields: customFields,
  };
};
