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
  {
    title: 'odia',
    value: 'odia',
  },
  // {
  //   title: 'bengali',
  //   value: 'ba',
  // },
  {
    title: 'telugu',
    value: 'te',
  },
  {
    title: 'kannada',
    value: 'ka',
  },
  {
    title: 'tamil',
    value: 'ta',
  },
  {
    title: 'gujarati',
    value: 'gu',
  },
  // {
  //   title: 'urdu',
  //   value: 'ur',
  // },
];

// Function to get title from value
export const getTitleFromValue = (value) => {
  const language = languages.find((language) => language.value === value);
  return language ? language.title : null; // Return null if no match is found
};
