#!/usr/bin/env node

/**
 * Batch script to update SafeAreaView to SafeAreaWrapper across all files
 * This script helps automate the process of replacing old SafeAreaView with SafeAreaWrapper
 */

const fs = require('fs');
const path = require('path');

// List of files that need to be updated
const filesToUpdate = [
  'src/screens/Dashboard/Preference/SCPDashboard/MyClass/MaterialCardView.js',
  'src/screens/YouthNet/L1Courses.js',
  'src/screens/Dashboard/Contents.js',
  'src/components/TestBox.js/SubjectBox..js',
  'src/components/TestBox.js/TestBox.js',
  'src/screens/Assessment/ATM/components/ImageViewerScreen.js',
  'src/screens/Assessment/ATM/components/UploadedImagesScreen.js',
  'src/screens/Dashboard/Preference/SCPDashboard/MyClass/MyClassDashboard.js',
  'src/screens/RegisterStart/RegisterStart.js',
  'src/screens/LoginSignUpScreen/LoginSignUpScreen.js',
  'src/screens/Dashboard/ViewAllContent.js',
  'src/screens/Dashboard/Calendar/FullAttendance.js',
  'src/screens/Dashboard/Calendar/TimeTable.js',
  'src/screens/Dashboard/Calendar/WeeklyCalendar.js',
  'src/screens/Dashboard/Courses/UnitList.js',
  'src/screens/Dashboard/Preference/Preference.js',
  'src/screens/Dashboard/Preference/SCPDashboard/SubjectDetails.js',
  'src/screens/Dashboard/Preference/SCPDashboard/MyClass/SessionRecording.js',
  'src/screens/Dashboard/Preference/SCPDashboard/MyClass/SessionRecordingCard.js',
  'src/screens/LoadingScreen/Loading.js',
  'src/screens/Assessment/TestDetailView.js',
  'src/screens/LoginScreen/TermsAndCondition.js',
  'src/screens/Profile/ProfileUpdateScreen.js',
  'src/screens/YouthNet/ExploreTab.js',
  'src/screens/YouthNet/SkillCenterCard.js',
  'src/screens/YouthNet/SurveyForm.js',
  'src/screens/RegisterScreen/RegisterScreen.js',
  'src/screens/Location/EnableLocationScreen.js',
];

console.log('SafeAreaView to SafeAreaWrapper Batch Update Script');
console.log('==================================================');
console.log(`Found ${filesToUpdate.length} files to update`);
console.log('');

filesToUpdate.forEach((filePath, index) => {
  console.log(`${index + 1}. ${filePath}`);
});

console.log('');
console.log('Manual update required for each file:');
console.log('1. Replace SafeAreaView import with SafeAreaWrapper import');
console.log('2. Replace <SafeAreaView> with <SafeAreaWrapper>');
console.log('3. Replace </SafeAreaView> with </SafeAreaWrapper>');
console.log('4. Remove nested SafeAreaView components and replace with View');
console.log('');
console.log('Example transformation:');
console.log('OLD: import { SafeAreaView } from "react-native";');
console.log(
  'NEW: import SafeAreaWrapper from "../../components/SafeAreaWrapper/SafeAreaWrapper";'
);
console.log('');
console.log('OLD: <SafeAreaView style={{ flex: 1 }}>');
console.log('NEW: <SafeAreaWrapper style={{ flex: 1 }}>');
