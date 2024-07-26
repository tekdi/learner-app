// SchemaConverting

export const Schema = async () => {
  try {
    // Fix field order and labels

    const schema = [
      {
        type: 'singleCard',
        label: t('q2_age_group'),
        name: 'yearcards',
        options: [
          { id: 1, title: t('q2_op_1') },
          { id: 2, title: t('q2_op_2') },
          { id: 3, title: t('q2_op_3') },
          { id: 4, title: t('q2_op_4') },
        ],
        validation: {
          required: true,
        },
      },
      {
        type: 'multipleCard',
        label: t('q5_interested_in'),
        name: 'multiplecards',
        options: [
          { id: 0, title: t('q5_op_1') },
          { id: 1, title: t('q5_op_2') },
          { id: 2, title: t('q5_op_3') },
          { id: 3, title: t('q5_op_4') },
          { id: 4, title: t('q5_op_5') },
          { id: 5, title: t('q5_op_6') },
          { id: 6, title: t('q5_op_7') },
          { id: 7, title: t('q5_op_8') },
          { id: 8, title: t('q5_op_9') },
          { id: 9, title: t('q5_op_10') },
          { id: 10, title: t('q5_op_11') },
        ],
        validation: {
          minSelection: 4,
          maxSelection: 4,
        },
      },

      {
        type: 'singleCard',
        label: t('q4_language'),
        name: 'languagecards',
        options: [
          { id: 1, title: 'English' },
          { id: 2, title: 'Marathi' },
          { id: 3, title: 'Hindi' },
          { id: 4, title: 'தமிழ்' },
          { id: 5, title: 'ಕನ್ನಡ' },
          { id: 6, title: 'ગુજરાતી' },
        ],
        validation: {
          required: true,
        },
      },
    ];

    return schema;
  } catch (e) {
    console.error('Error retrieving credentials:', e);
  }
};
