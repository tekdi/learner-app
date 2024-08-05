import { getSavedToken } from '../JsHelper/Helper';
import EndUrls from './EndUrls';
import { get, handleResponseException, post } from './RestClient';

const getHeaders = async () => {
  const token = await getSavedToken();
  // console.log('token', token?.token);
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
      return result?.data;
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
    // console.log(
    //   `curl -X ${method} ${url} -H 'Content-Type: application/json' -H 'Authorization: ${headers.Authorization}' -d '${JSON.stringify(params)}'`
    // );

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

export const getCohort = async ({ user_id }) => {
  try {
    const headers = await getHeaders();
    const result = await get(`${EndUrls.cohort}/${user_id}`, {
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

// Assessment List API

export const assessmentListApi = async (params = {}) => {
  try {
    const url = `${EndUrls.AssessmentList}`; // Define the URL
    const headers = {
      'Content-Type': 'application/json',
    };
    const payload = {
      request: {
        filters: {
          program: ['Second chance'],
          se_boards: [`${params?.boardName}`],
          primaryCategory: ['Practice Question Set'],
          visibility: ['Default', 'Parent'],
        },
        limit: 100,
        sort_by: {
          lastPublishedOn: 'desc',
        },
        facets: [
          'se_boards',
          'se_gradeLevels',
          'se_subjects',
          'se_mediums',
          'primaryCategory',
        ],
        offset: 0,
      },
    };

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });
    console.log('result', result);
    if (result) {
      return result?.data?.result;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};

export const trackAssessment = async (params = {}) => {
  try {
    const url = `${EndUrls.trackAssessment}`; // Define the URL
    const headers = {
      'Content-Type': 'application/json',
    };
    const payload = {
      filters: {
        userId: params?.user_id,
        // ...(params?.contentId && { contentId: 'do_1140753589854208001135' }),
      },
      sort: {
        field: 'userId',
        order: 'asc',
      },
    };

    // console.log(
    //   `curl -X POST ${url} -H 'Content-Type: application/json' -H 'Authorization: ${headers.Authorization}' -d '${JSON.stringify(payload)}'`
    // );

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
