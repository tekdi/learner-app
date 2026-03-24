/* eslint-disable */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@context': './src/context', // Alias for context
          '@components': './src/components', // Alias for components
          '@src': './src', // Alias for src directory
        },
      },
    ],
    'react-native-reanimated/plugin', // Ensure this is the LAST plugin
  ],
};
