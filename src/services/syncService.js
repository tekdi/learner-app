// syncService.js

import { AppState, DeviceEventEmitter } from 'react-native';
import {
  CourseEnrollStatus,
  deleteTrackingOffline,
  getAssessmentStatusSync,
  getSyncTrackingOfflineOrderById,
  issueCertificate,
  syncCourseDetails,
  updateCourseStatus,
} from '../utils/API/AuthService';
import { getDataFromStorage, getTentantId } from '../utils/JsHelper/Helper';
import {
  contentTracking,
  contentTrackingSync,
  courseDetails,
  courseTrackingStatus,
} from '../utils/API/ApiCalls';

let intervalRef = null;
let appStateSubscription = null;

// Serializes sync runs: interval / resume triggers queue here; each run waits for the previous to finish.
let syncRunChain = Promise.resolve();

const SYNC_INTERVAL = 2000; // 2 sec wait in between each sync

const runSync = async () => {
  console.log('🔄 Sync started');

  try {
    // TODO:
    // 1. Read from AsyncStorage queue
    // 2. Call API
    // 3. Remove successful entries

    const token = await getDataFromStorage('Accesstoken');
    const userId = await getDataFromStorage('userId');
    if (token && userId) {
      const result_sync_offline_tracking =
        await getSyncTrackingOfflineOrderById(userId);
      if (result_sync_offline_tracking != null) {
        /*console.log(
          'result_sync_offline_tracking',
          result_sync_offline_tracking
        );*/
        //create content
        for (let i = 0; i < result_sync_offline_tracking.length; i++) {
          let cntent_tracking = result_sync_offline_tracking[i];
          try {
            let detailsObject = JSON.parse(cntent_tracking?.detailsObject);
            let create_tracking = await contentTrackingSync(
              cntent_tracking?.user_id,
              cntent_tracking?.course_id,
              cntent_tracking?.content_id,
              cntent_tracking?.content_type,
              cntent_tracking?.content_mime,
              cntent_tracking?.lastAccessOn,
              detailsObject,
              cntent_tracking?.unit_id
            );
            if (
              create_tracking &&
              create_tracking?.response?.responseCode == 201
            ) {
              //success
              // console.log('create_tracking', create_tracking);
              let isGenerateCertificate = true;
              //check is course or not
              if (
                cntent_tracking?.course_id != cntent_tracking?.content_id &&
                isGenerateCertificate == true
              ) {
                //check certififcate issue or not
                console.log('check certififcate issue or not');
                //get corse details
                let courseDetails = await syncCourseDetails(
                  cntent_tracking?.course_id
                );
                // console.log('###########qwerty courseDetails', courseDetails);
                if (courseDetails != null) {
                  console.log('course detail found');
                  await updateCOurseAndIssueCertificate({
                    userId: userId,
                    course: courseDetails,
                    unitId: cntent_tracking?.unit_id,
                    isGenerateCertificate: isGenerateCertificate,
                  });
                }
              }

              //delete from storage
              await deleteTrackingOffline(cntent_tracking?.id);
            }
          } catch (e) {
            //console.log('error in result_sync_offline ', e);
          }
        }
        // Wait for 20 seconds before proceeding further
        // await new Promise((resolve) => setTimeout(resolve, 20000));
        // console.log('20 seconds passed');
      }
    }
    console.log('✅ Sync completed');
  } catch (err) {
    console.log('❌ Sync failed', err);
  }
};

//function for update course and issue certificate
async function updateCOurseAndIssueCertificate({
  course,
  userId,
  unitId,
  isGenerateCertificate,
}) {
  let isCertificateIssued = false;
  try {
    const response = await courseTrackingStatus(userId, [course?.identifier]);
    // console.log('response', response);

    const courseStatus = await calculateCourseStatus({
      statusData: response?.data?.[0]?.course?.[0],
      allCourseIds: course.leafNodes ?? [],
      courseId: course?.identifier,
    });
    // console.log('qwerty courseStatus', courseStatus);

    if (courseStatus?.status === 'in progress') {
      await updateCourseStatus({
        course_id: course?.identifier,
        status: 'inprogress',
      });
    } else if (courseStatus?.status === 'completed' && isGenerateCertificate) {
      const data = await CourseEnrollStatus({
        course_id: course?.identifier,
      });
      // console.log('qwerty data', data);
      if (data?.result?.status !== 'viewCertificate') {
        const result = JSON.parse(await getDataFromStorage('profileData'));
        const userResponse = result?.getUserDetails?.[0];
        const responseCriteria = await checkCriteriaForCertificate({
          userId: userId,
          courseId: course?.identifier,
        });
        console.log('qwerty responseCriteria', responseCriteria);

        if (responseCriteria === true) {
          try {
            await issueCertificate({
              payload: {
                userId: userId,
                courseId: course?.identifier,
                unitId: unitId,
                issuanceDate: new Date().toISOString(),
                expirationDate: new Date(
                  new Date().setFullYear(new Date().getFullYear() + 20)
                ).toISOString(),
                // credentialId: data?.result?.usercertificateId,
                firstName: userResponse?.firstName ?? '',
                middleName: userResponse?.middleName ?? '',
                lastName: userResponse?.lastName ?? '',
                courseName: course?.name ?? '',
              },
            });
            isCertificateIssued = true;
            DeviceEventEmitter.emit('CERTIFICATE_ISSUED', { courseId: course?.identifier });
            console.log('qwerty issueCertificate response', response);
          } catch (error) {
            await updateCourseStatus({
              course_id: course?.identifier,
              status: 'completed',
            });
          }
        } else if (data !== 'completed') {
          await updateCourseStatus({
            course_id: course?.identifier,
            status: 'completed',
          });
        }
      }
    } else if (courseStatus?.status != 'not started') {
      await updateCourseStatus({
        course_id: course?.identifier,
        status: 'completed',
      });
    }
  } catch (error) {
    console.error('Error in updateCOurseAndIssueCertificate:', error);
    throw error;
  }
  return isCertificateIssued;
}
async function calculateCourseStatus({ statusData, allCourseIds, courseId }) {
  const completedList = new Set(statusData?.completed_list || []);
  const inProgressList = new Set(statusData?.in_progress_list || []);

  let completedCount = 0;
  let inProgressCount = 0;
  const completed_list = [];
  const in_progress_list = [];

  for (const id of allCourseIds) {
    if (completedList.has(id)) {
      completedCount++;
      completed_list.push(id);
    } else if (inProgressList.has(id)) {
      inProgressCount++;
      in_progress_list.push(id);
    }
  }

  const total = allCourseIds.length;
  let status = 'not started';

  if (completedCount === total && total > 0) {
    status = 'completed';
  } else if (completedCount > 0 || inProgressCount > 0) {
    status = 'in progress';
  }

  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return {
    completed_list,
    in_progress_list,
    completed: completedCount,
    in_progress: inProgressCount,
    courseId,
    status,
    percentage: percentage,
  };
}
async function checkCriteriaForCertificate(reqBody) {
  const userId = reqBody?.userId;
  const courseId = reqBody?.courseId;

  try {
    const response = await courseDetails(courseId);
    if (Object.keys(response?.result?.content).length > 0) {
      const content = response?.result?.content;

      // Extract question set identifiers with their parent unit IDs
      const questionSetData = [];

      function extractQuestionSets(node, parentId) {
        // Check if current node is a question set
        if (node.mimeType === 'application/vnd.sunbird.questionset') {
          questionSetData.push({
            contentId: node.identifier,
            unitId: parentId || node.parent || '',
          });
        }

        // Recursively traverse children if they exist
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((child) => {
            // Pass the current node's identifier as parent for its children
            extractQuestionSets(child, node.identifier);
          });
        }
      }

      // Start extraction from the root content
      extractQuestionSets(content);

      console.log('Question Set Data:', questionSetData);

      //tenantId
      const tenantId = getTentantId();

      // You can now use questionSetData array for further processing
      // Example output: [{contentId: "do_214302433656496128152", unitId: "do_214373529013116928121"}]

      // Add your additional logic here using questionSetData
      if (questionSetData.length > 0) {
        // Process each question set data
        let criteriaCompleted = false;
        // Collect all contentIds and unitIds
        const contentIds = questionSetData.map((item) => item.contentId);
        const unitIds = questionSetData.map((item) => item.unitId);
        const options = {
          userId: [userId],
          courseId: [courseId], // temporary added here assessmentList(contentId)... if assessment is done then need to pass actual course id and unit id here
          unitId: unitIds,
          contentId: contentIds,
        };

        const response = await getAssessmentStatusSync(options);

        console.log('qwerty getAssessmentStatusSync response', response);
        if (response?.data?.length > 0) {
          // Filter data for specific userId
          const userData = response?.data.find(
            (item) => item.userId === userId
          );

          if (userData) {
            const assessments = userData?.assessments || [];

            // Check if all contentIds are present in the response
            const foundContentIds = assessments.map(
              (assessment) => assessment.contentId
            );
            const allContentIdsFound = contentIds.every((contentId) =>
              foundContentIds.includes(contentId)
            );

            if (allContentIdsFound) {
              // Check if all assessments have percentage >= 40%
              const allPassed = assessments.every((assessment) => {
                const percentage = parseFloat(assessment.percentage);
                //percentage comparison from program specific configuration
                let percentageComparision = 40;
                if (tenantId === '914ca990-9b45-4385-a06b-05054f35d0b9') {
                  percentageComparision = 80;
                }
                return percentage >= percentageComparision;
              });

              criteriaCompleted = allPassed;
            } else {
              criteriaCompleted = false;
            }
          } else {
            criteriaCompleted = false;
          }
        } else {
          criteriaCompleted = false;
        }

        if (criteriaCompleted) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
//call below function course card list
export const courseListSyncFromCardList = async (coursescontent, userId ) => {
  // console.log('###########qwerty coursescontent', coursescontent);
  let isCertificateIssued = false;
  if (coursescontent != null) {
    console.log('course detail found');
    isCertificateIssued = await updateCOurseAndIssueCertificate({
      userId: userId,
      course: coursescontent,
      unitId: null,
      isGenerateCertificate: true,
    });
  }
  return isCertificateIssued;
};

//end of function for update course and issue certificate

const syncQueue = () => {
  syncRunChain = syncRunChain
    .then(() => runSync())
    .catch((err) => {
      // Keep the chain alive if runSync throws outside its try/catch
      console.log('❌ Sync failed', err);
    });
};

// ▶ Start interval
const startInterval = () => {
  if (!intervalRef) {
    intervalRef = setInterval(() => {
      syncQueue();
    }, SYNC_INTERVAL);
    console.log('🚀 Sync interval started');
  }
};

// ⏹ Stop interval
const stopInterval = () => {
  if (intervalRef) {
    clearInterval(intervalRef);
    intervalRef = null;
    console.log('⛔ Sync interval stopped');
  }
};

// 🌍 Public function to start global sync
export const startGlobalSync = () => {
  // Start immediately
  startInterval();

  // Listen to app state
  appStateSubscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      console.log('📱 App active → start sync');
      startInterval();
      syncQueue(); // immediate sync on resume
    } else {
      console.log('📱 App inactive → stop sync');
      stopInterval();
    }
  });
};

// 🌍 Public function to stop everything
export const stopGlobalSync = () => {
  stopInterval();

  if (appStateSubscription) {
    appStateSubscription.remove();
    appStateSubscription = null;
  }
};
