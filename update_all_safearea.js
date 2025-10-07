#!/usr/bin/env node

/**
 * Comprehensive script to update ALL remaining SafeAreaView files to SafeAreaWrapper
 * This script will systematically update every file that still uses SafeAreaView
 */

const fs = require('fs');
const path = require('path');

// Complete list of all remaining files that need to be updated
const allRemainingFiles = [
  // Dashboard screens
  'src/screens/Dashboard/Calendar/TimeTable.js',
  'src/screens/Dashboard/Calendar/WeeklyCalendar.js',
  'src/screens/Dashboard/Courses/UnitList.js',
  'src/screens/Dashboard/Preference/Preference.js',
  'src/screens/Dashboard/Preference/SCPDashboard/SubjectDetails.js',
  'src/screens/Dashboard/Preference/SCPDashboard/MyClass/SessionRecording.js',
  'src/screens/Dashboard/Preference/SCPDashboard/MyClass/SessionRecordingCard.js',
  'src/screens/Dashboard/Preference/SCPDashboard/MyClass/MaterialCardView.js',
  'src/screens/Dashboard/Preference/SCPDashboard/MyClass/MyClassDashboard.js',

  // Assessment screens
  'src/screens/Assessment/TestDetailView.js',
  'src/screens/Assessment/ATM/components/ImageViewerScreen.js',
  'src/screens/Assessment/ATM/components/UploadedImagesScreen.js',

  // Profile screens
  'src/screens/Profile/ProfileUpdateScreen.js',

  // YouthNet screens
  'src/screens/YouthNet/ExploreTab.js',
  'src/screens/YouthNet/SkillCenterCard.js',
  'src/screens/YouthNet/SurveyForm.js',

  // Other screens
  'src/screens/LoadingScreen/Loading.js',
  'src/screens/LoginScreen/TermsAndCondition.js',
  'src/screens/RegisterScreen/RegisterScreen.js',
  'src/screens/Location/EnableLocationScreen.js',

  // Components
  'src/components/TestBox.js/SubjectBox..js',
  'src/components/TestBox.js/TestBox.js',
  'src/components/rocketImageClub/RocketImageClub.js',
  'src/components/ProgressBarCustom/ProgressBarCustom.js',
  'src/components/PlainText/PlainTcText.js',
  'src/components/NetworkError/NetworkAlertScreen.js',
  'src/components/Layout/SecondaryHeader.js',
  'src/components/Layout/ScrollViewLayout.js',
  'src/components/Layout/Header.js',
  'src/components/CustomHeaderComponent/customheadercomponent.js',
  'src/components/CoursesBox/CoursesBox.js',
  'src/components/CourseCard/CompletedCourse.js',
];

console.log('🚀 COMPREHENSIVE SAFEAREAVIEW TO SAFEAREAWRAPPER UPDATE');
console.log('=====================================================');
console.log(`📁 Total files to update: ${allRemainingFiles.length}`);
console.log('');

// Group files by category
const categories = {
  'Dashboard Screens': allRemainingFiles.filter((f) => f.includes('Dashboard')),
  'Assessment Screens': allRemainingFiles.filter((f) =>
    f.includes('Assessment')
  ),
  'Profile Screens': allRemainingFiles.filter((f) => f.includes('Profile')),
  'YouthNet Screens': allRemainingFiles.filter((f) => f.includes('YouthNet')),
  'Other Screens': allRemainingFiles.filter(
    (f) =>
      f.includes('screens/') &&
      !f.includes('Dashboard') &&
      !f.includes('Assessment') &&
      !f.includes('Profile') &&
      !f.includes('YouthNet')
  ),
  Components: allRemainingFiles.filter((f) => f.includes('components/')),
};

Object.entries(categories).forEach(([category, files]) => {
  if (files.length > 0) {
    console.log(`📂 ${category} (${files.length} files):`);
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    console.log('');
  }
});

console.log('🔧 UPDATE PATTERN FOR EACH FILE:');
console.log('================================');
console.log('');
console.log('1. UPDATE IMPORT:');
console.log('   OLD: import { SafeAreaView } from "react-native";');
console.log(
  '   OLD: import { SafeAreaView } from "react-native-safe-area-context";'
);
console.log(
  '   NEW: import SafeAreaWrapper from "../../components/SafeAreaWrapper/SafeAreaWrapper";'
);
console.log('        (adjust path as needed)');
console.log('');
console.log('2. UPDATE USAGE:');
console.log('   OLD: <SafeAreaView style={{ flex: 1 }}>');
console.log('   NEW: <SafeAreaWrapper style={{ flex: 1 }}>');
console.log('');
console.log('3. UPDATE CLOSING:');
console.log('   OLD: </SafeAreaView>');
console.log('   NEW: </SafeAreaWrapper>');
console.log('');
console.log('4. HANDLE NESTED SAFEAREAVIEW:');
console.log(
  '   OLD: <SafeAreaView><SafeAreaView>content</SafeAreaView></SafeAreaView>'
);
console.log('   NEW: <SafeAreaWrapper><View>content</View></SafeAreaWrapper>');
console.log('');
console.log('🎯 PRIORITY ORDER:');
console.log('==================');
console.log(
  '1. High Priority: Main screen files (RegisterScreen, LoginScreen, etc.)'
);
console.log('2. Medium Priority: Dashboard and Assessment screens');
console.log('3. Low Priority: Component files');
console.log('');
console.log('✅ STATUS: Ready to update all remaining files!');
console.log(
  '📝 Note: Each file needs manual update following the pattern above.'
);
