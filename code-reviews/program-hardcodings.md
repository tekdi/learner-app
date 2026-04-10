Here's a comprehensive report of all program-specific hardcodings found in the codebase:

---

## Program-Specific Hardcodings Found

### Category 1 — Hardcoded String Literals in Conditionals

The most widespread issue. Program names and identifiers appear as raw strings in logic, instead of being resolved from server data.

**`'scp'` as a userType string** — appears in 6+ files:
- `LoginScreen.js:627, 637`
- `ProgramsScreen.js:188, 200`
- `PlpWebViewScreen.js:218+`
- `LanguageScreen.js:229, 261`
- `Assessment/TestResultModal.js:26–28`
- `Profile/NoCertificateBox.js:31`

**`'youthnet'` as a userType string** — same pattern:
- `LoginScreen.js`, `ProgramsScreen.js`, `PlpWebViewScreen.js`, `Profile.js:353`, `TabScreen.js:93`

**`'Camp to Club'` as a raw string**:
- `Profile.js:353` — `userType == 'Camp to Club'`

---

### Category 2 — Hardcoded `'Second Chance Program'` Name in Filters

Three separate files filter tenants by matching the program name as a literal string instead of using a constant:

```js
// LoginScreen.js:616, ProgramsScreen.js:177, PlpWebViewScreen.js:209
const scp = tenantDetails
  ?.filter((item) => item.name === 'Second Chance Program')
  ?.map((item) => item.tenantId);
```

`TENANT_DATA` constants exist in `app-constants.js` but are not consistently used.

---

### Category 3 — Program-Specific Navigation Routes

The app navigates to different tab screens based on program identity:

```js
navigation.navigate('SCPUserTabScreen');   // SCP-specific
navigation.reset({ routes: [{ name: 'YouthNetTabScreen' }] });  // YouthNet-specific
```

Found in: `LoginScreen.js`, `ProgramsScreen.js`, `PlpWebViewScreen.js`, `LanguageScreen.js`, `NoCertificateBox.js`, `ProgramSwitch.js`, `DeepLink.js`

---

### Category 4 — Hardcoded Channel IDs

SCP-specific content filtering logic using hardcoded channel/framework strings:

```js
// Courses.js:292, ContinueLearning.js:83
if (channelId == 'scp-channel') {
  mergedFilter.targetBoardIds = ["scp-framework_board_cocurricular"];
}

// FilterList.js:692
if (filteredDefaultFormData.gradeLevel && channelId === 'scp-channel') {
  delete filteredDefaultFormData.gradeLevel;
}
```

---

### Category 5 — Hardcoded Display Name Logic

```js
// ProgramSwitch.js:620
{currentUserType === "scp" ? "Second Chance Program"
  : currentUserType === "youthnet" ? "Vocational Traning"   // ← also a typo
  : currentUserType}
```

---

### Category 6 — Complex Duplicated Routing Logic

The same program-routing block is copy-pasted across 4+ files (`LoginScreen`, `ProgramsScreen`, `PlpWebViewScreen`, `ProgramSwitch`, `DeepLink`):

```js
if (scpTenantIds?.includes(tenantId)) {
  await setDataInStorage('userType', 'scp');
  navigation.reset({ routes: [{ name: 'SCPUserTabScreen' }] });
} else if (youthnetTenantIds?.includes(tenantId)) {
  await setDataInStorage('userType', 'youthnet');
  ...
} else if (campToClubTenantIds?.includes(tenantId)) {
  ...
}
```

Every new program requires touching all these files.

---

### Summary Table

| # | Type | Severity | Files Affected |
|---|------|----------|----------------|
| 1 | `'scp'`/`'youthnet'`/`'Camp to Club'` string literals in conditionals | High | 8+ files |
| 2 | `'Second Chance Program'` literal in filter (not using constant) | Medium | 3 files |
| 3 | Program-specific navigation routes hardcoded | High | 7 files |
| 4 | Hardcoded `scp-channel` and `scp-framework_board_cocurricular` | High | 3 files |
| 5 | Display name ternary with hardcoded strings (+ typo) | Medium | `ProgramSwitch.js` |
| 6 | Routing logic duplicated across 5 files | High | 5 files |

---

### Root Cause

The app stores a `userType` string (`'scp'`, `'youthnet'`, etc.) in AsyncStorage after login, then branches on this string everywhere. This string is essentially a program-specific enum that has leaked into almost every navigation-critical file. The fix would be to drive behavior from config served by the API (e.g., a tenant capability map) rather than from a hardcoded program identity string.