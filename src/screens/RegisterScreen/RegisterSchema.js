// SchemaConverting

export const registerSchema = async () => {
  try {
    // Fix field order and labels
    const schema = [
      // {
      //   order: '1',
      //   name: 'first_name',
      //   type: 'text',
      //   label: 'first_name',
      //   isRequired: false,
      //   pattern: /^[A-Za-z]+$/, // Only letters, no numbers
      //   maxLength: null,
      //   minLength: 3,
      // },
      // {
      //   order: '1',
      //   name: 'middle_name',
      //   type: 'text',
      //   label: 'middle_name',
      //   isRequired: false,
      //   options: [],
      //   pattern: /^[A-Za-z]+$/, // Only letters, no numbers
      //   maxLength: null,
      //   minLength: 3,
      // },
      // {
      //   order: '1',
      //   name: 'last_name',
      //   type: 'text',
      //   label: 'last_name',
      //   isRequired: false,
      //   options: [],
      //   pattern: /^[A-Za-z]+$/, // Only letters, no numbers
      //   maxLength: null,
      //   minLength: 3,
      // },
      // {
      //   order: '1',
      //   name: 'email',
      //   type: 'email',
      //   label: 'EMAIL',
      //   pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Only letters, no numbers
      //   isRequired: false,
      // },
      {
        order: '1',
        name: 'phone_number',
        type: 'numeric',
        label: 'phone_number',
        // pattern: /^[6-9]\d{9}$/, // Only numbers,
        pattern: null, // Only numbers,
        maxLength: 10,
        minLength: 10,
        isRequired: true,
      },

      // {
      //   order: '2',
      //   name: 'DOB',
      //   type: 'date',
      //   label: 'DOB',
      //   isRequired: false,
      //   options: [],
      //   pattern: null, // Only letters, no numbers
      //   maxLength: null,
      //   minLength: 3,
      // },
      {
        order: '2',
        label: 'WHAT’S_YOUR_GENDER',
        name: 'gender',
        type: 'select',
        isRequired: false,
        options: [
          {
            label: 'MALE',
            value: 'male',
          },
          {
            label: 'FEMALE',
            value: 'female',
          },
          {
            label: 'TRANSGENDER',
            value: 'transgender',
          },
          {
            label: 'OTHER',
            value: 'other',
          },
        ],
      },
      // {
      //   order: '2',
      //   name: 'mothers_name',
      //   type: 'text',
      //   label: 'mothers_name',
      //   isRequired: false,
      //   options: [],
      //   pattern: /^[A-Za-z]+$/, // Only letters, no numbers
      //   maxLength: null,
      //   minLength: 3,
      // },

      // {
      //   order: '3',
      //   label: 'highest_education_level',
      //   name: 'highest_education_level',
      //   type: 'drop_down',
      //   isRequired: true,
      //   options: [
      //     {
      //       label: 'No Schooling',
      //       value: 'No Schooling',
      //     },
      //     {
      //       label: '1',
      //       value: '1',
      //     },
      //     {
      //       label: '2',
      //       value: '2',
      //     },
      //     {
      //       label: '3',
      //       value: '3',
      //     },
      //     {
      //       label: '4',
      //       value: '4',
      //     },
      //     {
      //       label: '5',
      //       value: '5',
      //     },
      //     {
      //       label: '6',
      //       value: '6',
      //     },
      //     {
      //       label: '7',
      //       value: '7',
      //     },
      //     {
      //       label: '8',
      //       value: '8',
      //     },
      //     {
      //       label: '9',
      //       value: '9',
      //     },
      //     {
      //       label: '10',
      //       value: '10',
      //     },
      //   ],
      // },
      // {
      //   order: '3',
      //   label: 'marital_status',
      //   name: 'marital_status',
      //   type: 'drop_down',
      //   isRequired: true,
      //   options: [
      //     {
      //       label: 'marrried',
      //       value: 'marrried',
      //     },
      //     {
      //       label: 'unmarrried',
      //       value: 'unmarrried',
      //     },
      //     {
      //       label: 'divorced_widow',
      //       value: 'divorced_widow',
      //     },
      //   ],
      // },
      // {
      //   order: '3',
      //   type: 'radio',
      //   label: 'type_of_phone_available',
      //   name: 'type_of_phone_available',
      //   isRequired: true,
      //   options: [
      //     {
      //       label: 'keypad',
      //       value: 'keypad',
      //     },
      //     {
      //       label: 'smartphone',
      //       value: 'smartphone',
      //     },
      //   ],
      // },
      // {
      //   order: '3',
      //   type: 'radio',
      //   label: 'does_this_phone_belong_to_you',
      //   name: 'does_this_phone_belong_to_you',
      //   isRdequired: true,
      //   options: [
      //     {
      //       label: 'yes',
      //       value: 'yes',
      //     },
      //     {
      //       label: 'no',
      //       value: 'no',
      //     },
      //   ],
      // },
      {
        order: '4',
        label: 'state',
        name: 'state',
        type: 'drop_down',
        isRequired: true,

        options: [
          {
            value: 'SLP',
          },
          {
            value: 'TGN',
          },
          {
            value: 'TGT',
          },
          {
            value: 'SDH',
          },
          {
            value: 'SGA',
          },
          {
            value: 'SH',
          },
          {
            value: 'SHE',
          },
          {
            value: 'SNW',
          },
          {
            value: 'SSN',
          },
          {
            value: 'STT',
          },
          {
            value: 'AP',
          },
          {
            value: 'KTR',
          },
          {
            value: 'UP',
          },
          {
            value: 'KA',
          },
          {
            value: 'PG',
          },
          {
            value: 'HJK',
          },
          {
            value: 'NSS',
          },
          {
            value: 'AS',
          },
          {
            value: 'CH',
          },
          {
            value: 'PNJ',
          },
          {
            value: 'MH',
          },
          {
            value: 'BR',
          },
          {
            value: 'RJ',
          },
          {
            value: 'KK',
          },
          {
            value: 'TN',
          },
          {
            value: 'JK',
          },
        ],
      },
      {
        order: '4',
        label: 'district',
        name: 'district',
        type: 'drop_down',
        isRequired: true,
      },
      {
        order: '4',
        label: 'block',
        name: 'block',
        type: 'drop_down',
        isRequired: true,
      },
      {
        order: '4',
        label: 'village',
        name: 'village',
        type: 'drop_down',
        isRequired: false,
      },
      // {
      //   order: '5',
      //   name: 'username',
      //   type: 'text',
      //   label: 'username',
      //   pattern: null,
      //   maxLength: null,
      //   minLength: 3,
      //   isRequired: false,
      // },
      // {
      //   order: '5',
      //   name: 'password',
      //   type: 'password',
      //   label: 'password',
      //   maxLength: null,
      //   minLength: 8,
      //   isRequired: false,
      // },
      // {
      //   order: '5',
      //   name: 'confirm_password',
      //   type: 'password',
      //   label: 'confirm_password',
      //   isRequired: false,
      //   maxLength: null,
      //   minLength: 8,
      // },
      {
        order: '6',
        type: 'Cradio',
        label: 'program',
        name: 'program',
        isRequired: true,
      },
      // {
      //   order: '5',
      //   label: 'parent_name',
      //   name: 'parent_name',
      //   type: 'text',
      //   isRequired: true,
      //   pattern: /^[A-Za-z]+$/, // Only letters, no numbers
      //   maxLength: null,
      //   minLength: 3,
      // },
      // {
      //   order: '5',
      //   label: 'parent_phone',
      //   name: 'parent_phone',
      //   type: 'numeric',
      //   isRequired: true,
      //   pattern: /^[6-9]\d{9}$/, // Only numbers,
      //   maxLength: 10,
      //   minLength: 10,
      // },
      // {
      //   order: '5',
      //   label: 'parent_phone_belong',
      //   name: 'parent_phone_belong',
      //   type: 'drop_down',
      //   isRequired: true,

      //   options: [
      //     {
      //       label: 'PARENT',
      //       value: 'parent',
      //     },
      //     {
      //       label: 'GUARDIAN',
      //       value: 'guardian',
      //     },
      //     {
      //       label: 'NEIGHBOR_OTHERS',
      //       value: 'others',
      //     },
      //   ],
      // },
    ];
    return schema;
  } catch (e) {
    console.error('Error retrieving credentials:', e);
  }
};
