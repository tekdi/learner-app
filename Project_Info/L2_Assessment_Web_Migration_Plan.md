# L2 Courses → Assessment (Online + Offline): Migration Plan from learner-app (React Native) to pratham2.0 learner-web-app

| | |
|---|---|
| **Source (reference)** | `learner-app` (React Native), branch `release-1.0.1-new-build`. Used for **Second Chance Program (SCP)** |
| **Target** | `pratham2.0/apps/learner-web-app` (Next.js 14 App Router, React 18, MUI 5), branch `release-1.17.0-prod`. For **Vocational Training (VT)**, i.e. `TenantName.YOUTHNET` |
| **Goal** | For VT learners who meet a configurable condition, show an **L2 Courses** section with **Assessment** content split into two sub-tabs: **Online** (QuML player, or the answersheet if already attempted) and **Offline** (image upload, then the answersheet once evaluated) |
| **Date** | 2026-09-28 |

---

## 1. Executive summary

About 60–70% of what we need **already exists** in learner-web-app, because the offline "manual assessment" flow and the QuML player were built for course units:

| Capability | learner-app (RN) | learner-web-app (Web) | Gap |
|---|---|---|---|
| Tab container for assessments | `MyClassDashboard` → inner tab "assessment" | ❌ Nothing. `LTwoCourse` is only an "I'm interested" card | **Build** |
| Condition gate | Active BATCH cohort + SCP tenant | Only `userProgram === 'Vocational Training'` | **Build** (configurable) |
| Assessment list (composite search) | `assessmentListApi` | `ContentSearch` exists (generic) | **Build** the VT query and a wrapper |
| Group by assessment type (Pre/Post/…) | `Assessment.js` + `TestBox` | ❌ | **Build** |
| Status per type / per question set | `/tracking/assessment/search/status` | Only `/tracking/assessment/search` wrapper | **Add** a status API wrapper |
| Online/Offline split | `ai-assessment/search` + `evaluationType==='offline'` | `searchAiAssessment` exists | **Build** the logic |
| Test detail / instructions page | `TestDetailView` | ❌ | **Build** |
| QuML player launch + result submit | `StandAlonePlayer` → `/tracking/assessment/create` | ✅ `/player/[identifier]` → players MFE → `createAssessmentTracking` | **Reuse** (verify courseId/unitId) |
| Result modal after test | `TestResultModal` | ❌ (player just exits to `exitLink`) | **Build** (light) |
| Online answersheet (read-only) | `AnswerKeyView` | ❌. `AnswerSheet.tsx` is teacher-style with Approve | **Build** |
| Offline upload (camera/gallery → S3 → submit) | `ATMAssessment` + `ImageUploadDialog` | ✅ `/manual-assessment` + `UploadOptionsPopup` | **Reuse**, handle a missing `parentId` |
| Offline status states | AI Pending / AI Processed / Approved | ✅ Same (+ `Image_Uploaded`, `Completed`) | Reuse |
| Offline answersheet after approval | `ATM/components/AnswerSheet` | ✅ `QuestionMarksManualUpdate` read-only | Reuse, verify read-only mode |
| Question paper PDF download | `PDF_GENRATE_URL?do_id=` | ✅ in `/manual-assessment` | Reuse |
| Offline sync of results (SQLite) | `Asessment_Offline_2` + `SyncCard` | N/A (web is online-only) | **Not needed** |
| Pre-download question sets | `SubjectBox` download icon | N/A | **Not needed** |
| i18n | `src/context/locales/*.json` | `libs/shared-lib-v2/src/lib/context/locales/*.json` | **Add keys** |

**Estimated effort:** about 17 tasks, roughly **14–19 dev-days** (see §7).

---

## 2. Current flow in learner-app (React Native)

### 2.1 Navigation and gating

- The tenant is **SCP** (`ProgramSwitch.js:291-304`, `LoginScreen.js:654-666`). The app routes to `SCPUserTabScreen`.
- `src/Routes/SCPUser/SCPUserTabScreen.js`:
  - The bottom-tab `AssessmentStack` is **commented out** (lines 287-291).
  - Assessments are reached through the **MyClass** tab.
- MyClass is visible only when the cohort is an active BATCH:
  ```js
  cohortData?.type === 'BATCH' && cohortData?.cohortMemberStatus === 'active' && cohortData?.cohortStatus === 'active'
  ```
  The cohort comes from `GET /interface/v1/cohort/mycohorts/{userId}` and is re-polled every 3 s while focused.
- `MyClassDashboard.js:32-45` has the inner tabs `[learning_materials, assessment]`.
- `MyClassStack.js` contains the screens `TestView`, `TestDetailView`, `AnswerKeyView`, `ATMAssessment`, `UploadedImagesScreen`, `ImageZoomDialog`.

### 2.2 Screen flow

```
Assessment.js  (list of assessment TYPES: Pre Test, Post Test, Other, Mock Test, Unit Test → TestBox cards with status/%)
   │ tap type
   ▼
TestView.js  (sub-tabs: Online (n) | Offline (n) via ATMTabView → SubjectBox cards per question set)
   ├── Online card
   │     ├── not attempted → TestDetailView (name, description, medium, board, instructions 1-5, Start)
   │     │                     → StandAlonePlayer (QuML) → POST /tracking/assessment/create → TestResultModal (marks X/Y)
   │     └── attempted (lastAttemptedOn) → AnswerKeyView (score, unanswered, correct count, Q/Ans/Solution, 10/page)
   └── Offline card → ATMAssessment
         ├── no status        → "Not submitted" + Question paper PDF + Upload (camera/gallery) → S3 → answer-sheet-submissions/create
         ├── AI Pending/Processed → "N images uploaded" (view images) + "submitted for evaluation"
         └── Approved         → Marks + uploaded images + AnswerSheet (per-section, score badge, response, explanation)
```

### 2.3 APIs used (base `${API_URL}/interface/v1`)

| # | Purpose | Method + endpoint | Body / params (key fields) |
|---|---|---|---|
| 1 | Assessment list | `POST /action/composite/v3/search` | `filters: {program:['Second Chance'], board, assessmentType:[Pre Test,Post Test,Other,Unit Test,Mock Test], status:['Live'], primaryCategory:['Practice Question Set'], evaluationType:['offline','online','ai']}`, `sort_by:{lastUpdatedOn:'desc'}`, `limit:100`. Uses `result.QuestionSet[]` |
| 2 | Status per type | `POST /tracking/assessment/search/status` | `{userId:[id], courseId:ids, unitId:ids, contentId:ids}` (all = `IL_UNIQUE_ID[]`). Returns `[{status, percentage, assessments:[{contentId,totalScore,totalMaxScore,timeSpent,lastAttemptedOn,createdOn}]}]` |
| 3 | Answersheet / attempts | `POST /tracking/assessment/search` | `{userId, contentId, courseId:contentId, unitId:contentId}`. Returns attempts with `score_details[] {questionId, queTitle, resValue, pass, score, maxScore}` |
| 4 | Which sets are AI/offline | `POST /tracking/ai-assessment/search` | `{question_set_id:[ids]}` |
| 5 | Offline status | `POST /tracking/assessment/offline-assessment-status` | `{userIds:[id], questionSetId}`. Returns `status, fileUrls, records[] (evaluatedBy)` |
| 6 | Presigned URL | `GET /user/presigned-url?filename=&foldername=aiassessments&fileType=.jpg` | Then a multipart POST to S3, final URL = `url + fields.key` |
| 7 | Submit answer sheet | `POST /tracking/answer-sheet-submissions/create` | `{userId, questionSetId, fileUrls[], createdBy}` |
| 8 | Hierarchy | `GET /action/questionset/v2/hierarchy/{id}` | Section/question numbering |
| 9 | QS read | `GET /action/questionset/v2/read/{id}?fields=instructions,outcomeDeclaration` | maxScore |
| 10 | Question list | `POST /api/question/v2/list` | Chunks of 10 ids, used for solutions in AnswerKeyView |
| 11 | Result submit | `POST /tracking/assessment/create` | `{userId, courseId, unitId, contentId, attemptId, assessmentSummary, totalMaxScore, totalScore, lastAttemptedOn, timeSpent}` |
| 12 | Question paper | `PDF_GENRATE_URL?do_id=` | Opens the PDF |

### 2.4 Business rules to carry over

- The online/offline split is: offline = the id is in the `ai-assessment/search` response **or** `evaluationType === 'offline'`. Everything else is online.
- Type ordering: `Pre Test, Post Test, Other, Mock Test, Unit Test`.
- Score colour: >35% green, otherwise red. Answersheet badges: full = `#1A8825`, partial = `#987100`, zero = `#BA1A1A`.
- An online card counts as attempted when `lastAttemptedOn` is present, and then opens the answersheet. The **last** attempt is shown.
- Offline cannot be re-uploaded after submission ("cannot be resubmitted").
- The offline answersheet is shown only when `status === 'Approved'`. The record used is the one where `evaluatedBy !== 'AI'`.
- Upload validation: jpg/jpeg only, 10 MB enforced in code (the RN UI text says 50 MB and 20 images, which is inconsistent). A warning appears above 4 images.
- The list filter uses the cohort custom field `BOARD`. If there is no BOARD, nothing is fetched.

---

## 3. What already exists in learner-web-app (reuse inventory)

Paths below are relative to `apps/learner-web-app/src` unless stated otherwise.

| Area | File | Notes |
|---|---|---|
| VT landing page | `app/content/page.tsx` → `components/Content/L1ContentList.tsx` | Lines ~161-176 render `<LTwoCourse/>` when `userProgram === TenantName.YOUTHNET`. **This is the insertion point** |
| Other landing | `components/Content/CommonL1ContentList.tsx` | Lines 207-222 also render `LTwoCourse` for VT |
| L2 card | `components/Content/LTwoCourse.tsx` | Completed-courses check plus "I'm interested" → `prathamservice/v1/save-user-salesforce`. No tabs |
| Tabs component | `libs/shared-lib-v2/src/lib/Tabs/CommonTabs.tsx` | `CommonTabs({tabs:[{label,icon,content}], value, onChange})` |
| Tenant constants | `utils/app.constant.ts:43` | `TenantName.YOUTHNET = 'Vocational Training'` |
| localStorage | set in `app/login/page.tsx:408-418` | `userId, tenantId, userProgram, uiConfig, academicYearId, token, channelId, collectionFramework…` |
| HTTP client | `utils/API/RestClient.ts`, `Interceptor.ts` | Adds `Authorization`, `tenantid`, `academicyearid`; handles 401 refresh |
| Assessment APIs | `utils/API/AssesmentService.ts` | `searchAssessment`/`getAssessmentTracking` (`/tracking/assessment/search`), `createAssessmentTracking`, `getOfflineAssessmentStatus`, `searchAiAssessment`, `answerSheetSubmissions`, `hierarchyContent`, `getAssessmentDetails` |
| Content search | `utils/API/contentService.ts` | `ContentSearch()` → `/action/composite/v3/search` (`result.QuestionSet`) |
| File upload | `utils/API/FileUploadService.ts` | `uploadFileToS3(file, folder)` (presigned URL → S3) |
| Cohort | `utils/API/CohortService.ts`, `utils/helpers/cohortAssignmentHelper.ts` | `checkUserHasActiveBatch(userId)` can be reused for the condition gate |
| Player route | `app/player/[identifier]/page.tsx` → `components/Content/Player.tsx` | iframe `NEXT_PUBLIC_LEARNER_SBPLAYER?identifier=&courseId&unitId&exitLink&previousPage&userId…` |
| QuML + tracking | `mfes/players/src/components/players/SunbirdQuMLPlayer.tsx:270-340`, `mfes/players/src/services/PlayerService.ts:107-160` | Posts `/tracking/assessment/create`. courseId/unitId **default to the QS identifier** when absent |
| Launch pattern | `components/AttemptAssessmentButton.tsx:122-126` | `window.location.href = /player/${id}?previousPage=..&exitLink=..` |
| Offline page | `app/manual-assessment/page.tsx` (+ `index.tsx` helpers) | Query `assessmentId, parentId, userId, returnUrl`; statuses; upload popup; read-only marks when Approved; question paper download |
| Offline components | `components/assessment/UploadOptionsPopup.tsx`, `Camera.tsx`, `ImageViewer.tsx`, `QuestionMarksManualUpdate.tsx`, `AnswerSheet.tsx` | Upload: 5 MB per file, max 10 images |
| Attempt helpers | `utils/helpers/assessmentAttemptHelpers.ts`, `components/AssessmentAttempts/AssessmentAttempts.tsx` | SCP eligibility-test pattern (search + status) |
| Theme tokens | `assets/theme/MuiThemeProvider.tsx:37-72` | `customColors.assessment*` already defined |
| i18n | `libs/shared-lib-v2/src/lib/context/locales/{en,hi,mr,odi,tel,kan,tam,guj,ur}.json` | Existing `ASSESSMENTS.*`, `LEARNER_APP.L_TWO_COURSE.*`, `AI.*` blocks |

**Facilitator-side references in the same monorepo (copy patterns, not UI):**

- `mfes/youthNet/src/pages/manual-assessments/index.tsx:440-545`: the VT offline assessment search with `program:['Vocational Training'], primaryCategory:['Practice Question Set'], evaluationType:['offline']`, grouped by `assessmentType`.
- `mfes/scp-teacher-repo/src/pages/assessments/.../attempt/[assessmentTrackingId]/[assessmentId]/index.tsx`: a per-attempt online answersheet. Use it as the reference for the learner read-only answersheet.

---

## 4. Target UX in learner-web-app

```
/content  (VT learner)
 └── [existing L1 content / courses]
 └── L2 Courses section   ← shown only if L2 condition = true (§5)
      ├── Tab: L2 Courses           (existing LTwoCourse card / L2 course list)
      └── Tab: Assessments
            ├── Type cards: Pre Test | Post Test | Other | Mock Test | Unit Test   (status + % like TestBox)
            │     tap →  /l2-assessments/[type]
            └── /l2-assessments/[type]
                  ├── Sub-tab Online (n)
                  │     ├── Not attempted → /l2-assessments/detail/[id] (instructions + Start) → /player/[id]?exitLink=…&previousPage=…
                  │     │                     → back → result toast/modal → card shows score
                  │     └── Attempted → /l2-assessments/answersheet/[id]  (read-only)
                  └── Sub-tab Offline (n)
                        └── → /manual-assessment?assessmentId=[id]&userId=&parentId=[id]&returnUrl=/l2-assessments/[type]
                              (upload → AI Pending → Approved → marks + answersheet)
```

> The "2 tabs" requirement can be read two ways: **(a)** `L2 Courses | Assessments` at the top level, with Online/Offline inside Assessments (shown above), or **(b)** `Online Assessment | Offline Assessment` directly under L2 Courses. The task list works for either. Only T4/T6 change. **Product needs to confirm which one.**

Recommended new routes (App Router):

| Route | Purpose |
|---|---|
| `app/l2-assessments/[type]/page.tsx` | Online/Offline sub-tabs for one assessment type |
| `app/l2-assessments/detail/[identifier]/page.tsx` | Instructions + Start |
| `app/l2-assessments/answersheet/[identifier]/page.tsx` | Online read-only answersheet |
| (reuse) `app/manual-assessment/page.tsx` | Offline upload and result |
| (reuse) `app/player/[identifier]/page.tsx` | QuML player |

Every new route must be added to the **`isAllowedRoute` whitelist in `app/ClientLayout.tsx`**. It may also need to be allowed in `components/Layout.tsx` for the per-program route blocking.

---

## 5. Condition gate ("defined manually")

The requirement says the L2 section should appear "on some condition" that can be defined manually. Recommendation: **config-driven, not hard-coded.**

**Proposed config** (either in tenant `params.uiConfig`, already stored as `localStorage.uiConfig`, or as a constant file for phase 1):

```ts
// apps/learner-web-app/src/utils/l2Config.ts
export const L2_ASSESSMENT_CONFIG = {
  enabledPrograms: ['Vocational Training'],          // TenantName.YOUTHNET
  requireActiveBatch: true,                           // reuse checkUserHasActiveBatch()
  requireCompletedL1Course: false,                    // reuse fetchUserCoursesWithContent() (LTwoCourse logic)
  requiredCustomFields: {},                           // e.g. { LEVEL: ['L2'] } matched on user customFields label/selectedValues
  assessmentTypes: ['Pre Test', 'Post Test', 'Other', 'Mock Test', 'Unit Test'],
  searchFilters: {                                    // composite search filters
    program: ['Vocational Training'],
    primaryCategory: ['Practice Question Set'],
    status: ['Live'],
    evaluationType: ['offline', 'online', 'ai'],
  },
  cohortFilterField: 'BOARD',                         // optional; null = don't filter by cohort field
};
```

Put the gate in a hook, `useL2Eligibility()`, that returns `{loading, eligible}`. `uiConfig.l2Assessment` overrides the constant, so the condition can be changed per tenant without a deploy.

**Open question:** confirm the exact VT condition. Options include an active batch, a completed L1 course, a user field like level or track, or an admin-assigned cohort.

---

## 6. Task breakdown

Legend: 🟢 reuse / small, 🟡 moderate, 🔴 new / larger.

### Phase A: Foundation

| # | Task | Details | Files | Est. |
|---|---|---|---|---|
| **T1** 🟢 | Confirm requirements | Freeze the 2-tab layout (§4 a/b), the L2 condition (§5), the assessment types used for VT, and whether VT question sets have `board` or another filter field. Confirm the backend returns VT data for `ai-assessment/search` and `offline-assessment-status` | — | 0.5 d |
| **T2** 🟡 | L2 config + eligibility hook | `utils/l2Config.ts` plus `hooks/useL2Eligibility.ts`. Program check, optional active batch (`checkUserHasActiveBatch`), optional completed L1, optional custom-field rule; `uiConfig` override | new | 1 d |
| **T3** 🟡 | Assessment API layer | In `AssesmentService.ts` add:<br>• `getL2AssessmentList({filters})`: wraps `ContentSearch`, reads `result.QuestionSet`, `limit 100`, `sort lastUpdatedOn desc`<br>• `getAssessmentStatusSummary({userId:[..], courseId, unitId, contentId})` → `POST /tracking/assessment/search/status` (**new**, not in web yet)<br>• Reuse `searchAssessment`, `searchAiAssessment`, `getOfflineAssessmentStatus`<br>• Add a `getLastAttemptPerContent()` helper (port of RN `Helper.getLastMatchingData`) | `utils/API/AssesmentService.ts`, `utils/helpers/` | 1 d |

### Phase B: L2 tab container and list

| # | Task | Details | Files | Est. |
|---|---|---|---|---|
| **T4** 🟡 | L2 Courses tab container | New `components/L2Courses/L2CoursesSection.tsx` using `CommonTabs`: Tab 1 is L2 Courses (existing `LTwoCourse`), Tab 2 is Assessments. Render it in `L1ContentList.tsx` (~L161-176) and `CommonL1ContentList.tsx` (~L207-222) in place of the bare `<LTwoCourse/>`, gated by `useL2Eligibility`. Keep the selected tab in the `?l2tab=` query param | `components/L2Courses/*`, `L1ContentList.tsx`, `CommonL1ContentList.tsx` | 1 d |
| **T5** 🟡 | Assessment type cards (port of `Assessment.js` + `TestBox`) | Fetch the list, collect unique `assessmentType` values, sort by config order, and fetch the status summary per type. Show cards with status (Not started / In progress "x of y completed" / Completed + % with the >35% colour rule). Add loading skeletons and empty state (`no_data_found`) | `components/L2Courses/AssessmentTypeList.tsx`, `AssessmentTypeCard.tsx` | 1.5 d |
| **T6** 🔴 | Online/Offline sub-tab page (port of `TestView`) | `app/l2-assessments/[type]/page.tsx`: load the question sets of that type, call `searchAiAssessment`, split online/offline (§2.4), merge the last-attempt data onto each QS, load `getOfflineAssessmentStatus` for each offline QS (in parallel with `Promise.all`), and show tabs with counts (hidden when empty). Back navigation goes to `/content?l2tab=assessments`. Cache in state or sessionStorage to avoid re-fetching on return | new route, `components/L2Courses/AssessmentQuestionSetCard.tsx` | 2 d |
| **T7** 🟡 | Question set card (port of `SubjectBox`) | Online variant: "Take the test" if not attempted, otherwise score `X/Y` + submitted-on, and click opens the answersheet. Offline variant: status chip (Not submitted / Submitted for evaluation / Marks X/Y %) + published-on, and click opens `/manual-assessment`. Reuse `getStatusIcon`/`getStatusLabel` from `app/manual-assessment/index.tsx` | `AssessmentQuestionSetCard.tsx` | 1 d |

### Phase C: Online flow

| # | Task | Details | Files | Est. |
|---|---|---|---|---|
| **T8** 🟡 | Test detail / instructions page (port of `TestDetailView`) | `app/l2-assessments/detail/[identifier]`: name, description, medium, board, time limit, instructions 1-5 (i18n), and a Start button that navigates to `/player/{id}?previousPage=/l2-assessments/{type}&exitLink=/l2-assessments/{type}?completed={id}`. Question set metadata can come from `getAssessmentDetails` / hierarchy, or be passed via sessionStorage | new route | 1 d |
| **T9** 🟡 | Verify player tracking for standalone QS | Check that the players MFE posts `/tracking/assessment/create` with `courseId = unitId = contentId = QS id` when no course is given (matches the RN status query, which uses the same id in all three). Check the `isGenerateCertificate`/`trackable` flags in the iframe `name`. Make sure `exitLink` fires on completion and `previousPage` fires on early exit. Fix if needed | `components/Content/Player.tsx`, `mfes/players/src/components/players/SunbirdQuMLPlayer.tsx`, `mfes/players/src/services/PlayerService.ts` | 1 d |
| **T10** 🟢 | Result feedback after test (port of `TestResultModal`) | On return with `?completed={id}`, refetch status and show a modal "Test completed – Your marks X/Y" | `[type]/page.tsx`, small modal component | 0.5 d |
| **T11** 🔴 | Online read-only answersheet (port of `AnswerKeyView`) | `app/l2-assessments/answersheet/[identifier]`: `searchAssessment({userId, contentId, courseId:id, unitId:id})` and take the **last** attempt. Header: submitted-on, unanswered count (`resValue === '[]'`), `totalScore/totalMaxScore`, "N out of M correct". Questions: Q number + `queTitle` (sanitised HTML), answer from `JSON.parse(resValue)[0].label` coloured by `pass`, and solution text. Get the solution by fetching the hierarchy plus `/api/question/v2/list` (chunks of 10); a new `listQuestions` wrapper is needed, going through the `/action` proxy. Paginate at 10 per page. Either build a read-only variant of `components/assessment/AnswerSheet.tsx` (`readOnly` prop that hides Approve/edit) or a new component; refer to scp-teacher-repo's attempt page | new route, `components/assessment/AnswerSheet.tsx` (readOnly prop) | 2 d |

### Phase D: Offline flow

| # | Task | Details | Files | Est. |
|---|---|---|---|---|
| **T12** 🟡 | Make `/manual-assessment` work for standalone L2 assessments | Today `parentId` = course id (from `UnitGrid`/`CourseUnitDetails`). For L2, pass `parentId = assessmentId` (or make it optional) and check all status and tracking calls (`getOfflineAssessmentStatus`, `getAssessmentTracking`, `answerSheetSubmissions`) against the backend. Make `returnUrl` go back to `/l2-assessments/{type}` and trigger a refresh | `app/manual-assessment/page.tsx` | 1 d |
| **T13** 🟢 | Align offline business rules | Align with RN: no re-upload once submitted (the web currently allows re-upload, so product must decide); size limit (web 5 MB vs RN 10 MB); max images (web 10); jpg only vs any image; "recommended 4 images" hint; S3 folder `aiassessments` vs web default `cohort` | `UploadOptionsPopup.tsx`, `FileUploadService.ts` | 0.5 d |
| **T14** 🟢 | Offline answersheet after approval | Verify that `QuestionMarksManualUpdate` in read-only mode (status `Approved`) shows per-section grouping, score badges (green/amber/red), response, and AI explanation (truncated with See more), and uses the record where `evaluatedBy !== 'AI'`. Hide every edit control for learners | `app/manual-assessment/page.tsx`, `components/assessment/QuestionMarksManualUpdate.tsx` | 0.5–1 d |

### Phase E: Cross-cutting

| # | Task | Details | Files | Est. |
|---|---|---|---|---|
| **T15** 🟢 | Routing and guards | Add `/l2-assessments/*` to `isAllowedRoute` in `app/ClientLayout.tsx`, check the per-program route blocking in `components/Layout.tsx`, and optionally add a navbar item via `uiConfig.navbarItems` | `ClientLayout.tsx`, `Layout.tsx` | 0.5 d |
| **T16** 🟡 | i18n | Add keys to `en.json` and translate all 9 locale files (`hi, mr, odi, tel, kan, tam, guj, ur`) using `translation/jsonToCsv.js` / `csvToJson.js`. Suggested namespace: `LEARNER_APP.L2_ASSESSMENT.*` covering `L2_COURSES, ASSESSMENTS, ONLINE_ASSESSMENT, OFFLINE_ASSESSMENT, TAKE_THE_TEST, NOT_STARTED, IN_PROGRESS, COMPLETED, X_OUT_OF_Y_COMPLETED, SUBMITTED_ON, UNANSWERED, CORRECT_ANSWERS, SOLUTION, INSTRUCTIONS_1..5, START_TEST, TEST_COMPLETED, YOUR_MARKS, NOT_SUBMITTED, SUBMITTED_FOR_EVALUATION, PUBLISHED_ON, NO_ONLINE_ASSESSMENTS, NO_OFFLINE_ASSESSMENTS`, plus type labels `PRE_TEST, POST_TEST, MOCK_TEST, UNIT_TEST, OTHER` (these labels are missing in RN too). Reuse existing `ASSESSMENTS.*` keys where possible | `libs/shared-lib-v2/src/lib/context/locales/*.json` | 1 d |
| **T17** 🟡 | QA and responsive testing | Mobile-first (the RN parity target), desktop layout, Android WebView (`isAndroidApp` param in the player), telemetry/GA events, and the test matrix in §8 | — | 1.5–2 d |

---

## 7. Effort summary

| Phase | Tasks | Estimate |
|---|---|---|
| A: Foundation | T1–T3 | 2.5 d |
| B: L2 container and lists | T4–T7 | 5.5 d |
| C: Online flow | T8–T11 | 4.5 d |
| D: Offline flow | T12–T14 | 2–2.5 d |
| E: Cross-cutting | T15–T17 | 3–3.5 d |
| **Total** | **17 tasks** | **~17.5–18.5 dev-days** (about 14–15 if T11 reuses the scp-teacher-repo answersheet heavily) |

Suggested order: T1 → T2/T3 → T4 → T5 → T6/T7 → (T8–T11 ‖ T12–T14) → T15 → T16 → T17. The online and offline tracks can run in parallel with two developers.

---

## 8. Test matrix

| Scenario | Expected |
|---|---|
| Non-VT user | No L2 section |
| VT user, condition false | No L2 section (or the existing LTwoCourse card only, per product) |
| VT user, condition true, no assessments | Assessments tab shows the empty state |
| Online not attempted | Card shows "Take the test", detail page, player; score shows after exit |
| Online attempted (multiple attempts) | Answersheet shows the **latest** attempt |
| Player closed mid-way | Returns to `previousPage`, no tracking record, card stays not attempted |
| Offline, no submission | "Not submitted", question paper download, upload enabled |
| Offline upload > size / wrong type | Validation error |
| Offline submitted | "Submitted for evaluation", images viewable, no re-upload (if T13 decides so) |
| Offline AI Processed (not approved) | Still shows "submitted for evaluation" and no marks |
| Offline Approved | Marks + read-only answersheet with section grouping |
| Type status | Completed/In progress/Not started + % match `/tracking/assessment/search/status` |
| Token expiry during upload | Interceptor refresh works; upload retried or clear error shown |
| Languages | All new strings translated in 9 locales |

---

## 9. Differences, risks, open questions

1. **Tab placement is ambiguous.** Confirm whether it is (a) `L2 Courses | Assessments` or (b) `Online | Offline` directly (§4).
2. **The L2 condition is undefined.** It needs product sign-off (§5).
3. **Filter field for VT.** RN filters by cohort `BOARD`. VT question sets may not have `board`. The youthNet facilitator app filters only by `program`, so confirm the VT filter (board / state / course mapping via `leafNodes`?).
4. **Standalone vs course-linked assessments.** youthNet maps offline assessments to Courses via `leafNodes`. If L2 assessments belong to L2 courses, `courseId`/`parentId` must be the real course id rather than the QS id. This affects T3, T9 and T12.
5. **`/tracking/assessment/search/status`** is used by RN but has no wrapper in web yet. Confirm it works with the web `tenantid`/`academicyearid` headers.
6. **Re-upload policy differs.** RN blocks re-upload after submission, while web `/manual-assessment` supports re-upload. Product decision needed (T13).
7. **Upload limits differ.** RN is 10 MB and "up to 20" images (UI text says 50 MB); web is 5 MB and max 10 images. Standardise.
8. **No offline mode on web.** The RN SQLite caching and `SyncCard` retry are dropped. If the `tracking/assessment/create` call fails on web, the result is lost. Consider a retry, or at least an error toast, in the players MFE (T9).
9. **Answersheet solutions.** RN shows only the solution text, not the correct option. Keep parity or improve; a product call.
10. **Polling.** RN does not poll evaluation status. Web can refetch on focus/visibility change; optional.
11. **The Assessment bottom tab in RN is commented out.** The live RN path is MyClass → Assessment. Parity should follow the live path.

---

## 10. Source file cross-reference (RN → Web)

| RN (learner-app) | Web (learner-web-app) |
|---|---|
| `src/Routes/SCPUser/SCPUserTabScreen.js`, `MyClassStack.js` | `app/content/page.tsx`, `components/Content/L1ContentList.tsx`, new `app/l2-assessments/*` |
| `src/screens/Dashboard/Preference/SCPDashboard/MyClass/MyClassDashboard.js` | new `components/L2Courses/L2CoursesSection.tsx` (CommonTabs) |
| `src/screens/Assessment/Assessment.js`, `src/components/TestBox.js/TestBox.js`, `AssessmentHeader.js` | new `AssessmentTypeList.tsx`, `AssessmentTypeCard.tsx` |
| `src/screens/Assessment/TestView.js`, `ATM/components/ATMTabView.js` | new `app/l2-assessments/[type]/page.tsx` |
| `src/components/TestBox.js/SubjectBox..js` | new `AssessmentQuestionSetCard.tsx` |
| `src/screens/Assessment/TestDetailView.js` | new `app/l2-assessments/detail/[identifier]/page.tsx` |
| `src/screens/PlayerScreen/StandAlonePlayer/StandAlonePlayer.js` | `app/player/[identifier]/page.tsx` + `mfes/players` (existing) |
| `src/screens/Assessment/TestResultModal.js` | new result modal |
| `src/screens/Assessment/AnswerKeyView.js` | new `app/l2-assessments/answersheet/[identifier]/page.tsx` |
| `src/screens/Assessment/ATM/ATMAssessment.js`, `ImageUploadDialog.js`, `ImageUploadHelper.js`, `UploadedImagesScreen`, `ImageZoomDialog` | `app/manual-assessment/page.tsx`, `components/assessment/UploadOptionsPopup.tsx`, `Camera.tsx`, `ImageViewer.tsx` (existing) |
| `src/screens/Assessment/ATM/components/AnswerSheet.js` | `components/assessment/QuestionMarksManualUpdate.tsx` / `AnswerSheet.tsx` (existing) |
| `src/utils/API/AuthService.js`, `ApiCalls.js`, `EndUrls.js` | `utils/API/AssesmentService.ts`, `contentService.ts`, `FileUploadService.ts`, `EndUrls.ts` |
| `src/context/locales/*.json` | `libs/shared-lib-v2/src/lib/context/locales/*.json` |
