// SchemaConverting

export const registerSchema = async (data) => {
  try {
    // Fix field order and labels
    const schema = [
      {
        formNumber: 1,
        question: 'q1_name',
        fields: [
          {
            type: data?.[0]?.type,
            label: data?.[0]?.label.replace(/ /g, '_').toLowerCase(),
            name: data?.[0]?.name.replace(/ /g, '_').toLowerCase(),
            coreField: data?.[0]?.coreField,
            fieldId: data?.[0]?.fieldId,
            validation: {
              // required: true,
              // pattern: data?.[0]?.pattern, // Only letters, no numbers
              // minLength: data?.[0]?.minLength,
              // maxLength: data?.[0]?.maxLength,
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
              // required: true,
              // pattern: data?.[1]?.pattern, // Only letters, no numbers
              // minLength: data?.[1]?.minLength,
              // maxLength: data?.[1]?.maxLength,

              pattern: /^[A-Za-z]+$/, // Only letters, no numbers
              minLength: 3,
              maxLength: 30,
            },
          },
          {
            type: 'number',
            label: 'phone_number',
            name: 'phone_number',
            coreField: data?.[1]?.coreField,
            fieldId: data?.[1]?.fieldId,
            validation: {
              // required: true,
              // pattern: data?.[1]?.pattern, // Only letters, no numbers
              // minLength: data?.[1]?.minLength,
              // maxLength: data?.[1]?.maxLength,

              pattern: /^[0-9]{10}$/, // Only numbers,
              minLength: 3,
              maxLength: 10,
            },
          },
          {
            type: 'select_drop_down',
            label: 'state',
            name: 'state',
            coreField: data?.[1]?.coreField,
            fieldId: data?.[1]?.fieldId,
            validation: {
              required: true,
              // pattern: data?.[1]?.pattern, // Only letters, no numbers
              // minLength: data?.[1]?.minLength,
              // maxLength: data?.[1]?.maxLength,
            },
          },
        ],
      },
      {
        formNumber: 2,
        question: 'age_group',
        fields: [
          {
            type: 'number',
            label: 'age',
            name: data?.[2]?.name.replace(/ /g, '_').toLowerCase(),
            coreField: data?.[2]?.coreField,
            fieldId: data?.[2]?.fieldId,
            // options: data?.[2]?.options,
            validation: {
              // required: true,
              pattern: /^[0-9]+$/, // Only letters, no numbers
              minLength: 1,
              maxLength: 2,
            },
          },
          {
            type: 'select',
            label: data?.[3]?.label,
            name: data?.[3]?.name,
            coreField: data?.[3]?.coreField,
            fieldId: data?.[3]?.fieldId,
            options: data?.[3]?.options,
            validation: {
              // required: true,
            },
          },
        ],
      },
      {
        formNumber: 3,
        question: 'q4_language',
        fields: [
          {
            type: 'select',
            label: data?.[4]?.label,
            name: data?.[4]?.name.replace(/ /g, '_'),
            coreField: data?.[4]?.coreField,
            fieldId: data?.[4]?.fieldId,
            options: data?.[4]?.options,
            validation: {
              required: true,
            },
          },
        ],
      },

      {
        formNumber: 4,
        question: 'which_program_do_you_want_to_enroll_to',
        fields: [
          {
            type: 'radio',
            label: 'program',
            name: 'program',
            coreField: data?.[4]?.coreField,
            fieldId: data?.[4]?.fieldId,
            options: data?.[4]?.options,
            validation: {
              required: true,
            },
          },
        ],
      },
      {
        formNumber: 5,
        question: 'where_are_you_located',
        fields: [
          {
            type: data?.[5]?.type,
            label: data?.[5]?.label,
            name: data?.[5]?.name.replace(/ /g, '_'),
            coreField: data?.[5]?.coreField,
            fieldId: data?.[5]?.fieldId,
            options: data?.[5]?.options,
            validation: {
              minSelection: 3,
              maxSelection: 6,
            },
          },
        ],
      },
      {
        formNumber: 6,
        question: 'q6_login_cred',
        fields: [
          {
            type: data?.[6]?.type,
            label: data?.[6]?.label.toLowerCase(),
            name: data?.[6]?.name.toLowerCase(),
            coreField: data?.[6]?.coreField,
            fieldId: data?.[6]?.fieldId,
            placeholder: data?.[6]?.placeholder,
            validation: {
              required: true,
              // minLength: data?.[6]?.minLength,
              // maxLength: data?.[6]?.maxLength,
              minLength: 8,
              maxLength: 16,
            },
          },
          {
            type: 'password',
            label: data?.[7]?.label.toLowerCase(),
            name: data?.[7]?.name.toLowerCase(),
            coreField: data?.[7]?.coreField,
            fieldId: data?.[7]?.fieldId,
            placeholder: data?.[7]?.placeholder,
            validation: {
              required: true,
              // minLength: data?.[7]?.minLength,
              // maxLength: data?.[7]?.maxLength,
              minLength: 8,
              maxLength: 16,
            },
          },
          {
            type: 'password',
            label: data?.[8]?.name.replace(/ /g, '_').toLowerCase(),
            name: data?.[8]?.name.replace(/ /g, '_').toLowerCase(),
            coreField: data?.[8]?.coreField,
            fieldId: data?.[8]?.fieldId,
            placeholder: data?.[8]?.placeholder,
            validation: {
              required: true,
              // minLength: data?.[8]?.minLength,
              // maxLength: data?.[8]?.maxLength,
              minLength: 8,
              maxLength: 16,
              match: true,
            },
          },
        ],
      },
      {
        formNumber: 7,
        question: '',
        fields: [
          {
            type: 'plain_text',
            label: '',
            name: '',
            coreField: '',
            fieldId: null,
          },
        ],
      },
      {
        formNumber: 8,
        question: '',
        fields: [
          {
            type: 'tc_text',
            label: '',
            name: '',
            coreField: '',
            fieldId: null,
          },
        ],
      },
    ];
    return schema;
  } catch (e) {
    console.error('Error retrieving credentials:', e);
  }
};
