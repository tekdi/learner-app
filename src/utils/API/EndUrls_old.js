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
  login: API_URL + '/user/v1/auth/login',
  learner_register: API_URL + '/user/v1/create',
  update_profile: API_URL + '/user/v1/update',
  get_current_token: API_URL + '/user/v1/auth',
  refresh_token: API_URL + '/user/v1/auth/refresh',
  get_form: API_URL + '/user/v1/form/read?context=USERS&contextType=LEARNER',
  userExist: API_URL + `/user/v1/check`,
  programDetails: API_URL + `/user/v1/tenant/read`,
  cohort: API_URL + `/user/v1/cohort/mycohorts`,
  academicyears: API_URL + `/user/v1/academicyears/list`,
  trackAssessment: `${API_URL}/v1/tracking/assessment/list`,
  AssessmentCreate: `${API_URL}/v1/tracking/assessment/create`,
  AssessmentStatus: `${API_URL}/v1/tracking/assessment/search/status`,
  AssessmentSearch: `${API_URL}/v1/tracking/assessment/search`,
  profileDetails: `${API_URL}/user/v1/list`,
  telemetryTracking: TELEMETRY_URL,
  ContentCreate: `${API_URL}/v1/tracking/content/create`,
  ContentTrackingStatus: `${API_URL}/v1/tracking/content/search/status`,
  CourseTrackingStatus: `${API_URL}/v1/tracking/content/course/status`,
  CourseInProgress: `${API_URL}/v1/tracking/content/course/inprogress`,
  geolocation: `${API_URL}/user/v1/fields/options/read`,
  forgotPassword: `${API_URL}/user/v1/password-reset-link`,
  resetPassword: `${API_URL}/user/v1/reset-password`,
  eventList: `${API_URL}/event-service/event/v1/list`,
  targetedSolutions: `${EVENT_DETAILS}/solutions/targetedSolutions?type=improvementProject&currentScopeOnly=true`,
  EventDetails: `${EVENT_DETAILS}/userProjects/details`,
  SolutionEvent: `${EVENT_DETAILS}/solutions/details`,
  attendance: `${API_URL}/api/v1/attendance/list`,
  notificationSubscribe: `${API_URL}/user/v1/update`,
  sendOTP: `${API_URL}/user/v1/send-otp`,
  verifyOTP: `${API_URL}/user/v1/verify-otp`,
  suggestUsername: `${API_URL}/user/v1/suggestUsername`,
  tenantRead: `${API_URL}/user/v1/tenant/read`,

  // Certificate APis

  courseEnroll: `https://qa-interface.prathamdigital.org/interface/v1/tracking/user_certificate/status/create`,
  courseEnrollStatus: `https://qa-interface.prathamdigital.org/interface/v1/tracking/user_certificate/status/get`,
  updateCourseStatus: `https://qa-interface.prathamdigital.org/interface/v1/tracking/user_certificate/status/update`,
  issueCertificate: `https://qa-interface.prathamdigital.org/interface/v1/tracking/certificate/issue`,
  viewCertificate: `https://qa-interface.prathamdigital.org/interface/v1/tracking/certificate/render`,
  // https://qa-interface.prathamdigital.org/interface/v1/user/check

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
  hierarchy_content: `${API_URL}/action/questionset/v2/hierarchy/`, //pass do id at end
  course_details: `${API_URL}/api/course/v1/hierarchy/`, //pass do id at end
  read_content: `${API_URL}/api/content/v1/read/`, //pass do id at end
  contentList: `${API_URL}/action/composite/v3/search?orgdetails=orgName,email&framework=${FRAMEWORK_ID}`,
  contentList_testing: `${API_URL}/action/composite/v3/search?orgdetails=orgName,email&framework=${FRAMEWORK_ID}`,
  contentSearch: `${API_URL}/action/composite/v3/search`,
  framework: `${API_URL}/api/framework/v1/read/${FRAMEWORK_ID}`,
  question_set_read: `${API_URL}/action/questionset/v2/read/`, //pass do id at end ?fields=instructions,outcomeDeclaration
  // filterContent: `https://lap.prathamdigital.org/api/framework/v1/read/scp-framework`,
  filterContent: `${API_URL}/api/framework/v1/read`,
  staticFilterContent: `${API_URL}/action/object/category/definition/v1/read?fields=objectMetadata,forms,name,label`,
};

export default EndUrls;
