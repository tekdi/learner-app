// SchemaConverting

export const ProfileUpdateSchema = async () => {
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
    ];
    return schema;
  } catch (e) {
    console.error('Error retrieving credentials:', e);
  }
};
