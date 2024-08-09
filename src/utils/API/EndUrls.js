import { BASE_URL_PROD } from './index';

//for react native config env : dev uat prod
import Config from 'react-native-config';

const API_URL = Config.API_URL;
const CONTENT_URL = Config.CONTENT_URL;
const tracking_assessment = Config.tracking_assessment;

const EndUrls = {
  login: API_URL + '/user/v1/auth/login',
  learner_register: API_URL + '/user/v1/create',
  get_current_token: API_URL + '/user/v1/auth',
  refresh_token: API_URL + '/user/v1/auth/refresh',
  get_form: API_URL + '/user/v1/form/read?context=USERS&contextType=STUDENT',

  //content url
  hierarchy_content: `${CONTENT_URL}/learner/questionset/v1/hierarchy/`, //pass do id at end
  quml_question_list: `${CONTENT_URL}/api/question/v1/list`,
  read_content: `${CONTENT_URL}/api/content/v1/read/`, //pass do id at end

  userExist: API_URL + `/user/v1/check`,
  contentList: `${CONTENT_URL}/api/content/v1/search?orgdetails=orgName,email&framework=pragatifw`,
  cohort: API_URL + `/user/v1/cohort/mycohorts`,
  contentSearch: `${CONTENT_URL}/api/content/v1/search`,
  trackAssessment: `${tracking_assessment}/tracking-assessment/v1/list`,
  AssessmentCreate: `${tracking_assessment}/tracking-assessment/v1/create`,
  AssessmentStatus: `${tracking_assessment}/tracking-assessment/v1/search/status`,
  AssessmentSearch: `${tracking_assessment}/tracking-assessment/v1/search`,
  profileDetails: `${API_URL}/user/v1/list`,
};

export default EndUrls;
