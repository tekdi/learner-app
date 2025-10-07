# Remaining SafeAreaView Files to Update

## ✅ COMPLETED FILES (Updated to SafeAreaWrapper)

### Main Screens:

- ✅ `src/screens/RegisterScreen/RegistrationForm.js`
- ✅ `src/screens/LoginScreen/LoginScreen.js`
- ✅ `src/screens/Profile/Profile.js`
- ✅ `src/screens/Assessment/TestView.js`
- ✅ `src/screens/Dashboard/Courses/Courses.js`
- ✅ `src/screens/Assessment/ATM/ATMAssessment.js`
- ✅ `src/screens/Assessment/Assessment.js`
- ✅ `src/screens/Dashboard/Preference/SCPDashboard/SCPDashboard.js`
- ✅ `src/screens/LanguageScreen/LanguageScreen.js`
- ✅ `src/screens/Profile/NoCertificateBox.js`
- ✅ `src/screens/Dashboard/Courses/CourseContentList.js`
- ✅ `src/screens/Assessment/AnswerKeyView.js`
- ✅ `src/screens/YouthNet/L1Courses.js`
- ✅ `src/screens/Dashboard/Contents.js`

## 🔄 REMAINING FILES TO UPDATE

### High Priority (Main Screens):

1. `src/screens/Dashboard/Preference/SCPDashboard/MyClass/MaterialCardView.js`
2. `src/screens/RegisterStart/RegisterStart.js`
3. `src/screens/LoginSignUpScreen/LoginSignUpScreen.js`
4. `src/screens/Dashboard/ViewAllContent.js`
5. `src/screens/Dashboard/Calendar/FullAttendance.js`
6. `src/screens/Dashboard/Calendar/TimeTable.js`
7. `src/screens/Dashboard/Calendar/WeeklyCalendar.js`
8. `src/screens/Dashboard/Courses/UnitList.js`
9. `src/screens/Dashboard/Preference/Preference.js`
10. `src/screens/Dashboard/Preference/SCPDashboard/SubjectDetails.js`
11. `src/screens/Dashboard/Preference/SCPDashboard/MyClass/SessionRecording.js`
12. `src/screens/Dashboard/Preference/SCPDashboard/MyClass/SessionRecordingCard.js`
13. `src/screens/LoadingScreen/Loading.js`
14. `src/screens/Assessment/TestDetailView.js`
15. `src/screens/LoginScreen/TermsAndCondition.js`
16. `src/screens/Profile/ProfileUpdateScreen.js`
17. `src/screens/YouthNet/ExploreTab.js`
18. `src/screens/YouthNet/SkillCenterCard.js`
19. `src/screens/YouthNet/SurveyForm.js`
20. `src/screens/RegisterScreen/RegisterScreen.js`
21. `src/screens/Location/EnableLocationScreen.js`

### Components (Lower Priority):

22. `src/components/TestBox.js/SubjectBox..js`
23. `src/components/TestBox.js/TestBox.js`
24. `src/screens/Assessment/ATM/components/ImageViewerScreen.js`
25. `src/screens/Assessment/ATM/components/UploadedImagesScreen.js`
26. `src/screens/Dashboard/Preference/SCPDashboard/MyClass/MyClassDashboard.js`

## 🔧 UPDATE PATTERN

For each remaining file, apply this pattern:

### 1. Update Import:

```javascript
// OLD
import { SafeAreaView } from 'react-native';
// OR
import { SafeAreaView } from 'react-native-safe-area-context';

// NEW
import SafeAreaWrapper from '../../components/SafeAreaWrapper/SafeAreaWrapper';
// (adjust path as needed)
```

### 2. Update Usage:

```javascript
// OLD
<SafeAreaView style={{ flex: 1 }}>
  {/* content */}
</SafeAreaView>

// NEW
<SafeAreaWrapper style={{ flex: 1 }}>
  {/* content */}
</SafeAreaWrapper>
```

### 3. Handle Nested SafeAreaView:

```javascript
// OLD
<SafeAreaView style={{ flex: 1 }}>
  <SafeAreaView style={styles.inner}>
    {/* content */}
  </SafeAreaView>
</SafeAreaView>

// NEW
<SafeAreaWrapper style={{ flex: 1 }}>
  <View style={styles.inner}>
    {/* content */}
  </View>
</SafeAreaWrapper>
```

## 📊 PROGRESS SUMMARY

- **Total Files Found**: 46 files
- **Files Updated**: 14 files ✅
- **Files Remaining**: 32 files 🔄
- **Progress**: ~30% Complete

## 🚀 QUICK COMMANDS

To find all remaining files:

```bash
grep -r "SafeAreaView" src/ --include="*.js" | grep -v "SafeAreaWrapper"
```

To update a file quickly:

1. Replace import
2. Replace `<SafeAreaView` with `<SafeAreaWrapper`
3. Replace `</SafeAreaView>` with `</SafeAreaWrapper>`
4. Replace nested SafeAreaView with View
