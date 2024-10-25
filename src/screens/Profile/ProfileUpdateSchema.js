// SchemaConverting

export const ProfileUpdateSchema = async (data, states) => {
  try {
    // Fix field order and labels

    const schema = [
      {
        formNumber: 1,
        question: 'q1_name',
        fields: [
          {
            type: 'text',
            label: data?.[0]?.label.replace(/ /g, '_').toLowerCase(),
            name: data?.[0]?.name.replace(/ /g, '_').toLowerCase(),
            coreField: data?.[0]?.coreField,
            fieldId: data?.[0]?.fieldId,
            validation: {
              required: true,
              pattern: /^[A-Za-z]+$/, // Only letters, no numbers
              minLength: 3,
              maxLength: 30,
            },
          },
          {
            type: data?.[1]?.type,
            label: data?.[1]?.label.replace(/ /g, '_').toLowerCase(),
            name: data?.[1]?.name.replace(/ /g, '_').toLowerCase(),
            coreField: data?.[1]?.coreField,
            fieldId: data?.[1]?.fieldId,
            validation: {
              required: true,
              pattern: /^[A-Za-z]+$/, // Only letters, no numbers
              minLength: 3,
              maxLength: 30,
            },
          },
          {
            type: 'number',
            label: 'phone_number',
            name: 'mobile',
            coreField: data?.[2]?.coreField,
            fieldId: data?.[2]?.fieldId,
            validation: {
              required: true,
              pattern: /^[0-9]{10}$/, // Only numbers,
              minLength: 10,
              maxLength: 10,
            },
          },
          {
            type: 'email',
            label: 'email',
            name: 'email',
            coreField: data?.[3]?.coreField,
            fieldId: data?.[3]?.fieldId,
            validation: {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Only letters, no numbers
            },
          },
          {
            type: 'number',
            label: 'age',
            name: 'age',
            coreField: data?.[4]?.coreField,
            fieldId: data?.[4]?.fieldId,
            validation: {
              required: true,
              pattern: /^(0?[1-9]|[1-9][0-9])$/, // Only letters, no numbers
              minLength: 1,
              maxLength: 2,
            },
          },
          {
            type: 'select',
            label: data?.[5]?.label,
            name: data?.[5]?.name,
            coreField: data?.[5]?.coreField,
            fieldId: data?.[5]?.fieldId,
            options: data?.[5]?.options,
            validation: {
              required: true,
            },
          },
          // {
          //   type: 'password',
          //   label: data?.[12]?.label.toLowerCase(),
          //   name: data?.[12]?.name.toLowerCase(),
          //   coreField: data?.[12]?.coreField,
          //   fieldId: data?.[12]?.fieldId,
          //   placeholder: data?.[12]?.placeholder,
          //   validation: {
          //     required: true,
          //     // minLength: data?.[7]?.minLength,
          //     // maxLength: data?.[7]?.maxLength,
          //     minLength: 8,
          //     maxLength: 16,
          //   },
          // },
          // {
          //   type: 'password',
          //   label: data?.[13]?.name.replace(/ /g, '_').toLowerCase(),
          //   name: data?.[13]?.name.replace(/ /g, '_').toLowerCase(),
          //   coreField: data?.[13]?.coreField,
          //   fieldId: data?.[13]?.fieldId,
          //   placeholder: data?.[13]?.placeholder,
          //   validation: {
          //     required: true,
          //     // minLength: data?.[8]?.minLength,
          //     // maxLength: data?.[8]?.maxLength,
          //     minLength: 8,
          //     maxLength: 16,
          //     match: true,
          //   },
          // },
        ],
      },
    ];
    return schema;
  } catch (e) {
    console.error('Error retrieving credentials:', e);
  }
};
