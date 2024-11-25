/* eslint-disable */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@components': './src/components', // Alias for components
          '@src': './src', // Alias for src directory
        },
      },
    ],
  ],
};
