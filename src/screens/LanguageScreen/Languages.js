//multi language
import { useTranslation } from '../../context/LanguageContext'; // Adjust path as needed
//multi language setup
const { t } = useTranslation();

export const languages = [
  {
    title: t('english'),
    value: 'en',
  },
  {
    title: t('hindi'),
    value: 'hi',
  },
  {
    title: t('marathi'),
    value: 'ma',
  },
  {
    title: t('bangla'),
    value: 'ba',
  },
  {
    title: t('telugu'),
    value: 'te',
  },
  {
    title: t('kannada'),
    value: 'ka',
  },
  {
    title: t('gujarati'),
    value: 'gu',
  },
];
