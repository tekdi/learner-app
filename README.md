# Pratham Learning App

## Project Overview

Welcome to Pratham Learning App, a React Native application created using the React Native Community CLI. This project provides a starting point for building a mobile application using React Native.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/)
- **Java Development Kit (JDK)**: Install the latest JDK. [Download JDK](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- **Android Studio**: Install Android Studio with the following requirements:
  - **Android Studio version**: Koala 2024.1.1
  - **Compile SDK version**: 34
  - **System Image**: Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image

## Setting Up Your Environment

1. **Android Studio Configuration**:
    - Open Android Studio.
    - Download the required system image from Android Studio.
    - Make sure your emulator runs successfully in Android Studio.

2. **Creating a New React Native Project**:
    ```sh
    npx @react-native-community/cli@latest init ProjectName
    ```

3. **Modifying Gradle Version**:
    - Navigate to the `android` folder in your project directory.
    - Open `gradle-wrapper.properties`.
    - Change the Gradle version from `8.6` to `8.5`.

## Running the Project

1. **Starting Metro**:
    Metro is the JavaScript build tool for React Native. To start the Metro development server, run the following command from your project folder:
    ```sh
    npm start
    ```

2. **Starting Your Application**:
    Let Metro Bundler run in its own terminal. Open a new terminal inside your React Native project folder and run:
    ```sh
    npx react-native run-android
    ```

3. **Modifying Your App**:
    - Open `App.tsx` in your text editor of choice.
    - Edit some lines to customize your application.

## Visual Studio Code Extensions for React Native

To enhance your development experience, install the following VSCode extensions:

1. **ES7+ React/Redux/React-Native snippets**
2. **React Native Snippet**
3. **React Native Tools**
4. **Simple React Snippets**
5. **Git Lens**
6. **Prettier**
7. **Sonar Lint**

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Metro Documentation](https://facebook.github.io/metro/docs/getting-started)
- [Android Studio Download](https://developer.android.com/studio)


## Adding UI Kitten to Your Project

UI Kitten is a React Native framework for creating modern, stylish, and customizable UI components. Follow these steps to add UI Kitten to your existing React Native project.

### Installation

1. **Install UI Kitten and Eva Design System**:
    Open your terminal and navigate to your React Native project directory. Run the following commands to install UI Kitten and the Eva Design System:
    ```sh
    npm i @ui-kitten/components @eva-design/eva react-native-svg
    ```

2. **Install React Navigation**:
    UI Kitten requires React Navigation for handling navigation within the app. Install the necessary packages using the following commands:
    ```sh
    npm install @react-navigation/native
    npm install @react-navigation/native-stack
    npm install react-native-screens react-native-safe-area-context
    ```

3. **Install Additional Peer Dependencies**:
    To ensure everything works correctly, install additional peer dependencies for React Navigation:
    ```sh
    npm install react-native-gesture-handler react-native-reanimated
    ```


2. **Install Poppins Font**:
   Follow the steps shown in the below link.
 - [Custom Font](https://blog.logrocket.com/adding-custom-fonts-react-native/)

3. **Install Necessary Packages**:
   Use --legacy-peer-deps where necessary
   Follow the steps shown in the below link.
 - [Yup](https://www.npmjs.com/package/yup)
 - [React-hook-form](https://react-hook-form.com/)
 - [Eva Icons](https://akveo.github.io/eva-icons/#/)
 - [@hookform/resolvers/yup](https://www.npmjs.com/package/@hookform/resolvers)

### Additional Resources
Please follow all the necessary steps as is shown in the below given link.
- [UI Kitten Documentation](https://akveo.github.io/react-native-ui-kitten/)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started/)
- [Eva Design System](https://eva.design/)

### Troubleshooting

- **UI Kitten components not displaying correctly**: Ensure that the `ApplicationProvider` is correctly wrapping your application and that you have imported and applied the theme correctly.
- **Navigation issues**: Verify that you have installed all the necessary React Navigation packages and dependencies.
## Troubleshooting

### Common Issues

- **Metro Bundler not starting**: Ensure you have run `npm install` before starting Metro.
- **Emulator not working**: Make sure your emulator is running correctly in Android Studio before launching your app.
- **Gradle issues**: Verify the Gradle version in `gradle-wrapper.properties`.
