import { getDataFromStorage, getSavedToken } from '../JsHelper/Helper';
import EndUrls from './EndUrls';
import { get, handleResponseException, post } from './RestClient';

const getHeaders = async () => {
  const token = await getDataFromStorage('Accesstoken');
  // console.log('token', token?.data);
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token?.data}`,
  };
};

export const login = async (params = {}) => {
  try {
    const result = await post(`${EndUrls.login}`, params, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    // console.log(`curl -X POST '${EndUrls.login}' \
    // -H 'Content-Type: application/json' \
    // -H 'Accept: application/json' \
    // -d '${params}'
    // `);
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
    // Construct the cURL command
    const url = `${EndUrls.refresh_token}`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const headersString = Object.entries(headers)
      .map(([key, value]) => `-H "${key}: ${value}"`)
      .join(' ');

    const dataString = JSON.stringify(params);
    const curlCommand = `curl -X POST ${headersString} -d '${dataString}' ${url}`;
    // console.log('cURL command:', curlCommand);

    const result = await post(url, params, { headers });

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
        Accept: 'application/json',
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
      Accept: 'application/json',
    };
    const payload = {
      request: {
        filters: {
          primaryCategory: ['course'],
          visibility: ['Default', 'Parent'],
        },
        limit: 100,
        sort_by: {
          lastPublishedOn: 'desc',
        },
        fields: [
          'name',
          'appIcon',
          'mimeType',
          'gradeLevel',
          'identifier',
          'medium',
          'pkgVersion',
          'board',
          'subject',
          'resourceType',
          'primaryCategory',
          'contentType',
          'channel',
          'organisation',
          'trackable',
        ],
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
    const url = `${EndUrls.contentSearch}`; // Define the URL
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
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
      params: {
        orgdetails: 'orgName,email',
        licenseDetails: 'name,description,url',
      },
      headers: headers || {},
    });
    // console.log('result', result);
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
      Accept: 'application/json',
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
export const getProfileDetails = async (params = {}) => {
  try {
    const url = `${EndUrls.profileDetails}`; // Define the URL
    const headers = await getHeaders();
    const payload = {
      limit: 0,
      filters: {
        userId: params?.userId,
      },
      sort: ['createdAt', 'asc'],
      offset: 0,
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
export const getAssessmentStatus = async (params = {}) => {
  try {
    const url = `${EndUrls.AssessmentStatus}`; // Define the URL
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const payload = {
      userId: [params?.user_id],
      contentId: params?.uniqueAssessmentsId,
      batchId: params?.cohort_id,
    };

    // console.log(
    //   `curl -X POST ${url} -H 'Content-Type: application/json' -H 'Authorization: ${headers.Authorization}' -d '${JSON.stringify(payload)}'`
    // );

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });

    if (result?.data) {
      return result?.data?.data;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};
export const getAssessmentAnswerKey = async (params = {}) => {
  try {
    const url = `${EndUrls.AssessmentSearch}`; // Define the URL
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const payload = {
      userId: params?.user_id,
      contentId: params?.contentId,
      batchId: params?.cohort_id,
    };

    // console.log(
    //   `curl -X POST ${url} -H 'Content-Type: application/json' -H 'Authorization: ${headers.Authorization}' -d '${JSON.stringify(payload)}'`
    // );

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });

    if (result?.data) {
      return result?.data?.data;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};
