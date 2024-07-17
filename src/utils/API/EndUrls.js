import { BASE_URL_PROD } from './index';

//for react native config env : dev uat prod
import Config from 'react-native-config';

const API_URL = Config.API_URL;
const CONTENT_URL = Config.CONTENT_URL;

const EndUrls = {
  get_token: API_URL + '/user/v1/auth/login',
  learner_register: API_URL + '/user/v1/create',

  //content url
  quml_hierarchy: `${CONTENT_URL}/learner/questionset/v1/hierarchy/`, //pass do id at end
  quml_question_list: `${CONTENT_URL}/api/question/v1/list`,
  read_content: `${CONTENT_URL}/api/content/v1/read/`, //pass do id at end
};

export default EndUrls;
