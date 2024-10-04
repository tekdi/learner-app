// SchemaConverting

export const registerSchema = async (data, states) => {
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
        ],
      },
      {
        formNumber: 2,
        question: 'age_group',
        fields: [
          {
            type: 'number',
            label: 'age',
            name: 'age',
            coreField: data?.[3]?.coreField,
            fieldId: data?.[3]?.fieldId,
            validation: {
              required: true,
              pattern: /^[0-9]+$/, // Only letters, no numbers
              minLength: 1,
              maxLength: 2,
            },
          },
          {
            type: 'select',
            label: data?.[4]?.label,
            name: data?.[4]?.name,
            coreField: data?.[4]?.coreField,
            fieldId: data?.[4]?.fieldId,
            options: data?.[4]?.options,
            validation: {
              required: true,
            },
          },
        ],
      },
      // {
      //   formNumber: 3,
      //   question: 'q4_language',
      //   fields: [
      //     {
      //       type: 'select',
      //       label: data?.[5]?.label,
      //       name: data?.[5]?.name.replace(/ /g, '_'),
      //       coreField: data?.[5]?.coreField,
      //       fieldId: data?.[5]?.fieldId,
      //       options: data?.[5]?.options,
      //       validation: {
      //         required: true,
      //       },
      //     },
      //   ],
      // },

      // {
      //   formNumber: 4,
      //   question: 'which_program_do_you_want_to_enroll_to',
      //   fields: [
      //     {
      //       type: 'radio',
      //       label: 'program',
      //       name: 'program',
      //       // coreField: data?.[4]?.coreField,
      //       // fieldId: data?.[4]?.fieldId,
      //       // options: data?.[4]?.options,
      //       validation: {
      //         required: true,
      //       },
      //     },
      //   ],
      // },
      // {
      //   formNumber: 3,
      //   question: 'q5_interested_in',
      //   fields: [
      //     {
      //       type: data?.[9]?.type,
      //       label: data?.[9]?.label,
      //       name: data?.[9]?.name.replace(/ /g, '_'),
      //       coreField: data?.[9]?.coreField,
      //       fieldId: data?.[9]?.fieldId,
      //       options: data?.[9]?.options,
      //       validation: {
      //         minSelection: 3,
      //         maxSelection: 6,
      //       },
      //     },
      //   ],
      // },
      // {
      //   formNumber: 6,
      //   question: 'where_are_you_located',
      //   fields: [
      //     {
      //       type: 'select_drop_down',
      //       label: 'state',
      //       name: 'state',
      //       coreField: data?.[6]?.coreField,
      //       fieldId: data?.[6]?.fieldId,
      //       options: states,
      //       validation: {
      //         required: true,
      //       },
      //     },
      //     {
      //       type: 'select_drop_down',
      //       label: 'district',
      //       name: 'district',
      //       coreField: data?.[7]?.coreField,
      //       fieldId: data?.[7]?.fieldId,
      //       validation: {
      //         required: true,
      //       },
      //     },
      //     {
      //       type: 'select_drop_down',
      //       label: 'block',
      //       name: 'block',
      //       coreField: data?.[8]?.coreField,
      //       fieldId: data?.[8]?.fieldId,
      //       validation: {
      //         required: true,
      //       },
      //     },
      //     // {
      //     //   type: 'select_drop_down',
      //     //   label: 'village',
      //     //   name: 'village',
      //     //   coreField: data?.[1]?.coreField,
      //     //   fieldId: data?.[1]?.fieldId,
      //     //   validation: {
      //     //     required: true,

      //     //   },
      //     // },
      //   ],
      // },
      {
        formNumber: 3,
        question: 'q6_login_cred',
        fields: [
          {
            type: data?.[10]?.type,
            label: data?.[10]?.label.toLowerCase(),
            name: data?.[10]?.name.toLowerCase(),
            coreField: data?.[10]?.coreField,
            fieldId: data?.[10]?.fieldId,
            placeholder: data?.[10]?.placeholder,
            validation: {
              required: true,
              // minLength: data?.[6]?.minLength,
              // maxLength: data?.[6]?.maxLength,
              minLength: 8,
              maxLength: 32,
            },
          },
          {
            type: 'password',
            label: data?.[11]?.label.toLowerCase(),
            name: data?.[11]?.name.toLowerCase(),
            coreField: data?.[11]?.coreField,
            fieldId: data?.[11]?.fieldId,
            placeholder: data?.[11]?.placeholder,
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
            label: data?.[12]?.name.replace(/ /g, '_').toLowerCase(),
            name: data?.[12]?.name.replace(/ /g, '_').toLowerCase(),
            coreField: data?.[12]?.coreField,
            fieldId: data?.[12]?.fieldId,
            placeholder: data?.[12]?.placeholder,
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
      // {
      //   formNumber: 8,
      //   question: '',
      //   fields: [
      //     {
      //       type: 'plain_text',
      //       label: '',
      //       name: '',
      //       coreField: '',
      //       fieldId: null,
      //     },
      //   ],
      // },
      {
        formNumber: 4,
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
