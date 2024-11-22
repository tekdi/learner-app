//multi language
import { useTranslation } from '../../context/LanguageContext'; // Adjust path as needed
//multi language setup
const { t } = useTranslation();

export const languages = [
  {
    title: 'english',
    value: 'en',
  },
  {
    title: 'hindi',
    value: 'hi',
  },
  {
    title: 'marathi',
    value: 'ma',
  },
  // {
  //   title: 'bengali',
  //   value: 'ba',
  // },
  // {
  //   title: 'telugu',
  //   value: 'te',
  // },
  // {
  //   title: 'kannada',
  //   value: 'ka',
  // },
  // {
  //   title: 'gujarati',
  //   value: 'gu',
  // },
  {
    title: 'urdu',
    value: 'ur',
  },
];
