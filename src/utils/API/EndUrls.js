import { BASE_URL_PROD } from './index';

//for react native config env : dev uat prod
import Config from 'react-native-config';

const API_URL = Config.API_URL;

const EndUrls = {
  get_token: API_URL + '/user/v1/auth/login',
  learner_register: API_URL + '/user/v1/create',
};

export default EndUrls;
