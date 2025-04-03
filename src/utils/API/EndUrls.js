import { BASE_URL_PROD } from './index';

//for react native config env : dev uat prod
import Config from 'react-native-config';

const API_URL = Config.API_URL;
// const CONTENT_URL = Config.CONTENT_URL;
// const TRACKING_MICROSERVICE = Config.TRACKING_MICROSERVICE;
const TELEMETRY_URL = Config.TELEMETRY_URL;
const EVENT_DETAILS = Config.EVENT_DETAILS;
const FRAMEWORK_ID = Config.FRAMEWORK_ID;

const EndUrls = {
  learner_register: `${API_URL}/interface/v1/account/create`,
  login: `${API_URL}/interface/v1/account/login`,
  tenantRead: `${API_URL}/interface/v1/tenant/read`,
  cohort: `${API_URL}/interface/v1/cohort/mycohorts`,
  profileDetails: `${API_URL}/interface/v1/user/list`,
  refresh_token: `${API_URL}/interface/v1/user/auth/refresh`,
  get_current_token: `${API_URL}/interface/v1/user/auth`,
  resetPassword: `${API_URL}/interface/v1/user/reset-password`,
  forgotPassword: `${API_URL}/interface/v1/user/password-reset-link`,
  suggestUsername: `${API_URL}/interface/v1/user/suggestUsername`,
  get_form: `${API_URL}/interface/v1/form/read?context=USERS&contextType=LEARNER`,
  geolocation: `${API_URL}/interface/v1/fields/options/read`,
  academicyears: API_URL + `/interface/v1/academicyears/list`,
  update_profile: API_URL + '/interface/v1/user/update',
  trackAssessment: `${API_URL}/interface/v1/tracking/assessment/list`,
  AssessmentCreate: `${API_URL}/interface/v1/tracking/assessment/create`,
  AssessmentStatus: `${API_URL}/interface/v1/tracking/assessment/search/status`,
  AssessmentSearch: `${API_URL}/interface/v1/tracking/assessment/search`,
  ContentCreate: `${API_URL}/interface/v1/tracking/content/create`,
  ContentTrackingStatus: `${API_URL}/interface/v1/tracking/content/search/status`,
  CourseTrackingStatus: `${API_URL}/interface/v1/tracking/content/course/status`,
  CourseInProgress: `${API_URL}/interface/v1/tracking/content/course/inprogress`,
  eventList: `${API_URL}/interface/v1/event/list`,
  attendance: `${API_URL}/interface/v1/account/attendance/list`,
  sendOTP: `${API_URL}/interface/v1/user/send-otp`,
  verifyOTP: `${API_URL}/interface/v1/user/verify-otp`,
  userExist: API_URL + `/interface/v1/user/check`,

  targetedSolutions: `${EVENT_DETAILS}/solutions/targetedSolutions?type=improvementProject&currentScopeOnly=true`,
  EventDetails: `${EVENT_DETAILS}/userProjects/details`,
  SolutionEvent: `${EVENT_DETAILS}/solutions/details`,
  telemetryTracking: TELEMETRY_URL,

  // Certificate APis

  courseEnroll: `${API_URL}/interface/v1/tracking/user_certificate/status/create`,
  courseEnrollStatus: `${API_URL}/interface/v1/tracking/user_certificate/status/get`,
  updateCourseStatus: `${API_URL}/interface/v1/tracking/user_certificate/status/update`,
  issueCertificate: `${API_URL}/interface/v1/tracking/certificate/issue`,
  viewCertificate: `${API_URL}/interface/v1/tracking/certificate/render`,
  downloadCertificate: `${API_URL}/interface/v1/tracking/certificate/render-PDF`,
  getCourseCompletedList: `${API_URL}/interface/v1/tracking/user_certificate/status/search`,

  // SalesForce APis (L2 Interest)
  enrollInterest: `https://dev-middleware.prathamdigital.org/prathamservice/v1/save-user-salesforce`,

  //CMS sunbird saas
  // hierarchy_content: `${CONTENT_URL}/learner/questionset/v1/hierarchy/`, //pass do id at end
  // course_details: `${CONTENT_URL}/api/course/v1/hierarchy/`, //pass do id at end
  // quml_question_list: `${CONTENT_URL}/api/question/v1/list`,
  // read_content: `${CONTENT_URL}/api/content/v1/read/`, //pass do id at end
  // contentList: `${CONTENT_URL}/api/content/v1/search?orgdetails=orgName%2Cemail&framework=gujaratboardfw`,
  // contentList_testing: `${CONTENT_URL}/api/content/v1/search?orgdetails=orgName,email&framework=pragatifw`,
  // contentSearch: `${CONTENT_URL}/api/content/v1/search`,
  // framework: `${CONTENT_URL}/api/framework/v1/read/gujaratboardfw`,

  //CMS pratham CMS
  hierarchy_content: `${API_URL}/interface/v1/action/questionset/v2/hierarchy/`, //pass do id at end
  course_details: `${API_URL}/interface/v1/api/course/v1/hierarchy/`, //pass do id at end
  quml_question_list: `${API_URL}/interface/v1/api/question/v2/list`,
  read_content: `${API_URL}/interface/v1/api/content/v1/read/`, //pass do id at end
  contentList: `${API_URL}/interface/v1/action/composite/v3/search?orgdetails=orgName,email&framework=${FRAMEWORK_ID}`,
  contentList_testing: `${API_URL}/interface/v1/action/composite/v3/search?orgdetails=orgName,email&framework=${FRAMEWORK_ID}`,
  contentSearch: `${API_URL}/interface/v1/action/composite/v3/search`,
  framework: `${API_URL}/interface/v1/api/framework/v1/read/${FRAMEWORK_ID}`,
  question_set_read: `${API_URL}/interface/v1/action/questionset/v2/read/`, //pass do id at end ?fields=instructions,outcomeDeclaration
  // filterContent: `https://lap.prathamdigital.org/api/framework/v1/read/scp-framework`,
  filterContent: `${API_URL}/interface/v1/api/framework/v1/read`,
  staticFilterContent: `${API_URL}/interface/v1/action/object/category/definition/v1/read?fields=objectMetadata,forms,name,label`,
};

export default EndUrls;
