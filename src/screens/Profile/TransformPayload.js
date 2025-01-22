import { getDataFromStorage } from '../../utils/JsHelper/Helper';

export const transformPayload = async (data) => {
  // console.log(data?.program);

  const studentForm = JSON.parse(await getDataFromStorage('studentForm'));
  // console.log({ studentForm });

  const getFieldIdByName = (name) => {
    // Assuming studentForm is the array that contains all the fields
    const field = studentForm.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    // If the field is found, return its fieldId, otherwise return null
    return field ? field.fieldId : null;
  };

  const customFields = [
    {
      value: data.age,
      fieldId: getFieldIdByName('age'),
    },
    {
      value: data.gender,
      fieldId: getFieldIdByName('gender'),
    },
  ];

  return {
    userData: {
      name: `${data.first_name} ${data.last_name}`,
      email: data?.email,
      mobile: data?.mobile,
    },
    customFields: customFields,
  };
};
