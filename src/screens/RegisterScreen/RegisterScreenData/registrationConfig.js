//multi language
import { useTranslation } from '../../../context/LanguageContext'; // Adjust path as needed
//multi language setup
const { t } = useTranslation();

export const schema = [
  {
    formNumber: 1,
    question: t('q1_name'),
    fields: [
      {
        type: 'text',
        label: t('lb_first_name'),
        name: 'firstname',
        validation: {
          required: true,
          pattern: /^[A-Za-z]+$/, // Only letters, no numbers
          minLength: 3,
          maxLength: 30,
        },
      },
      {
        type: 'text',
        label: t('lb_last_name'),
        name: 'lastname',
        validation: {
          pattern: /^[A-Za-z]+$/, // Only letters, no numbers
          required: true,
          minLength: 3,
          maxLength: 30,
        },
      },
    ],
  },
  {
    formNumber: 2,
    question: t('q2_age_group'),
    fields: [
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
    ],
  },
  {
    formNumber: 3,
    question: t('q3_gender'),
    fields: [
      {
        type: 'singleCard',
        label: t('q3_gender'),
        name: 'gendercards',
        options: [
          { id: 1, title: t('q3_op_2') },
          { id: 2, title: t('q3_op_1') },
          { id: 3, title: 'Others' },
        ],
        validation: {
          required: true,
        },
      },
    ],
  },
  {
    formNumber: 4,
    question: t('q4_language'),
    fields: [
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
    ],
  },
  {
    formNumber: 5,
    question: t('q5_interested_in'),
    fields: [
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
        },
      },
    ],
  },
  {
    formNumber: 6,
    question: t('q6_login_cred'),
    fields: [
      {
        type: 'text',
        label: t('lb_username'),
        name: 'username',
        placeholder: 'Enter your username',
        validation: {
          required: true,
          maxLength: 15,
        },
      },
      {
        type: 'password',
        label: t('lb_pass'),
        name: 'password',
        placeholder: 'Enter your password',
        validation: {
          required: true,
          minLength: 8,
        },
      },
      {
        type: 'password',
        label: t('lb_conf_pass'),
        name: 'repeatpassword',
        placeholder: 'Confirm your password',
        validation: {
          required: true,
          minLength: 8,
          match: true,
        },
      },
    ],
  },
];
