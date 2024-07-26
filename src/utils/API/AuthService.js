import { getSavedToken } from '../JsHelper/Helper';
import EndUrls from './EndUrls';
import { get, handleResponseException, post } from './RestClient';

const getHeaders = async () => {
  const token = await getSavedToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token?.token}`,
  };
};

export const login = async (params = {}) => {
  try {
    const result = await post(`${EndUrls.login}`, params, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (result?.data) {
      return result?.data?.result;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};

export const refreshToken = async (params = {}) => {
  try {
    const result = await post(`${EndUrls.refresh_token}`, params, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (result?.data) {
      return result?.data?.result;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};

export const getAccessToken = async () => {
  try {
    const headers = await getHeaders();
    const result = await get(`${EndUrls.get_current_token}`, {
      headers: headers || {},
    });
    if (result) {
      return result?.data?.params?.status;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};

export const getStudentForm = async () => {
  try {
    const headers = await getHeaders();
    const result = await get(`${EndUrls.get_form}`, {
      headers: headers || {},
    });
    if (result) {
      return result?.data?.result;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};

export const userExist = async (params = {}) => {
  try {
    const result = await post(`${EndUrls.userExist}`, params, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};

export const registerUser = async (params = {}) => {
  try {
    const method = 'POST'; // Define the HTTP method
    const url = `${EndUrls.learner_register}`; // Define the URL
    const headers = await getHeaders(); // Get headers

    // Log the cURL command
    console.log('cURL Command:');
    console.log(
      `curl -X ${method} ${url} -H 'Content-Type: application/json' -H 'Authorization: ${headers.Authorization}' -d '${JSON.stringify(params)}'`
    );

    // Make the actual request
    const result = await post(url, params, {
      headers: headers || {},
    });

    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};
export const contentListApi = async (params = {}) => {
  try {
    const method = 'POST'; // Define the HTTP method
    const url = `${EndUrls.contentList}`; // Define the URL
    const headers = {
      'Content-Type': 'application/json',
    };
    const payload = {
      request: {
        filters: {
          se_boards: ["Prerak's Corner"],
          se_mediums: ['Hindi'],
          se_gradeLevels: ['General'],
          primaryCategory: ['Digital Textbook', 'eTextbook', 'Course'],
          channel: [],
          visibility: [],
        },
        limit: 100,
        fields: [
          'name',
          'appIcon',
          'medium',
          'subject',
          'resourceType',
          'contentType',
          'organisation',
          'topic',
          'mimeType',
          'trackable',
          'gradeLevel',
          'se_boards',
          'se_subjects',
          'se_mediums',
          'se_gradeLevels',
        ],
        facets: [
          'subject',
          'primaryCategory',
          'medium',
          'banner',
          'additionalCategories',
          'search',
          'ContinueLearning',
        ],
      },
    };

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });

    if (result) {
      return result?.data?.result;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};
