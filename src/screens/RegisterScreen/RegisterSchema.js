// SchemaConverting

export const registerSchema = async () => {
  try {
    // Fix field order and labels
    const schema = [
      {
        order: '1',
        name: 'first_name',
        type: 'text',
        label: 'first_name',
        isRequired: true,
        pattern: /^[A-Za-z]+$/, // Only letters, no numbers
        maxLength: null,
        minLength: 3,
      },
      {
        order: '2',
        name: 'last_name',
        type: 'text',
        label: 'last_name',
        isRequired: true,
        options: [],
        pattern: /^[A-Za-z]+$/, // Only letters, no numbers
        maxLength: null,
        minLength: 3,
      },
      {
        order: '3',
        name: 'email',
        type: 'email',
        label: 'EMAIL',
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Only letters, no numbers
        isRequired: false,
      },
      {
        order: '4',
        name: 'mobile',
        type: 'numeric',
        label: 'MOBILE',
        pattern: /^[6-9]\d{9}$/, // Only numbers,
        maxLength: 10,
        minLength: 10,
        isRequired: true,
      },
      {
        order: '5',
        label: 'age',
        name: 'age',
        type: 'numeric',
        isRequired: true,
        pattern: /^(0?[1-9]|[1-9][0-9])$/, // Only letters, no numbers
        maxLength: 2,
        minLength: 1,
      },
      {
        order: '6',
        label: 'WHAT’S_YOUR_GENDER',
        name: 'gender',
        type: 'select',
        isRequired: true,
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
      {
        order: '7',
        type: 'radio',
        label: 'program',
        name: 'program',
        isRequired: true,
      },
      {
        order: '8',
        label: 'states',
        name: 'states',
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
        order: '9',
        label: 'districts',
        name: 'districts',
        type: 'drop_down',
        isRequired: true,
      },
      {
        order: '10',
        label: 'blocks',
        name: 'blocks',
        type: 'drop_down',
        isRequired: true,
      },
      {
        order: '11',
        name: 'username',
        type: 'text',
        label: 'username',
        pattern: null,
        maxLength: null,
        minLength: 3,
        isRequired: true,
      },
      {
        order: '12',
        name: 'password',
        type: 'password',
        label: 'password',
        maxLength: null,
        minLength: 8,
        isRequired: true,
      },
      {
        order: '13',
        name: 'confirm_password',
        type: 'password',
        label: 'confirm_password',
        isRequired: true,
        maxLength: null,
        minLength: 8,
      },
      {
        order: '14',
        label: 'parent_name',
        name: 'parent_name',
        type: 'text',
        isRequired: true,
        pattern: /^[A-Za-z]+$/, // Only letters, no numbers
        maxLength: null,
        minLength: 3,
      },
      {
        order: '15',
        label: 'parent_phone',
        name: 'parent_phone',
        type: 'numeric',
        isRequired: true,
        pattern: /^[6-9]\d{9}$/, // Only numbers,
        maxLength: 10,
        minLength: 10,
      },
      {
        order: '16',
        label: 'parent_phone_belong',
        name: 'parent_phone_belong',
        type: 'drop_down',
        isRequired: true,

        options: [
          {
            label: 'PARENT',
            value: 'parent',
          },
          {
            label: 'GUARDIAN',
            value: 'guardian',
          },
          {
            label: 'NEIGHBOR_OTHERS',
            value: 'others',
          },
        ],
      },
    ];
    return schema;
  } catch (e) {
    console.error('Error retrieving credentials:', e);
  }
};
