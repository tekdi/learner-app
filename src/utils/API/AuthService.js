import {
  createNewObject,
  getDataFromStorage,
  getTentantId,
} from '../JsHelper/Helper';
import { deleteData, getData, insertData } from '../JsHelper/SqliteHelper';
import EndUrls from './EndUrls';
import { get, handleResponseException, patch, post } from './RestClient';
//for react native config env : dev uat prod
import Config from 'react-native-config';

const getHeaders = async () => {
  const token = await getDataFromStorage('Accesstoken');
  let tenantId = await getTentantId();

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    tenantId: `${tenantId}`,
  };
};
const getHeaderswithoutTenant = async () => {
  const token = await getDataFromStorage('Accesstoken');
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
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
    console.log(`curl -X POST '${EndUrls.login}' \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d '${params}'
    `);
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
    const headers = await getHeaderswithoutTenant();
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
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const url = `${EndUrls.get_form}`;

    // Generate the curl command
    const curlCommand = `curl -X GET '${url}' \\
${Object.entries(headers || {})
  .map(([key, value]) => `-H '${key}: ${value}' \\`)
  .join('\n')}`;

    // Log the curl command to the console
    // console.log('Generated curl command:');
    // console.log(curlCommand);

    // Make the API request
    const result = await get(url, {
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
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    // Log the cURL command
    // console.log(
    //   `curl -X ${method} ${url} -H 'Content-Type: application/json' -H 'Authorization: ${
    //     headers.Authorization
    //   }' -d '${JSON.stringify(params)}'`
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
export const updateUser = async ({ payload, user_id }) => {
  try {
    const method = 'PATCH'; // Define the HTTP method
    const url = `${EndUrls.update_profile}/${user_id}`; // Define the URL
    const token = await getDataFromStorage('Accesstoken');
    const headers = await getHeaders();

    //     const curlCommand = `
    // curl -X PATCH '${url}' \\
    // -H 'Content-Type: application/json' \\
    // -H 'Accept: application/json' \\
    // -H 'Authorization:  ${headers.Authorization}' \\
    // -H 'tenantId: ${headers.tenantId}' \\
    // -d '${JSON.stringify(payload)}'
    //     `;
    //     console.log('cURL Command:', curlCommand);

    // Make the actual request
    const result = await patch(url, payload, {
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

export const courseListApi_testing = async ({ searchText }) => {
  const user_id = await getDataFromStorage('userId');
  const url = `${EndUrls.contentList_testing}`; // Define the URL
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  let userType = await getDataFromStorage('userType');
  const payload = {
    request: {
      filters: {
        program: (userType = 'scp' ? 'secondchance' : 'youthnet'),
        status: ['Live'],
        primaryCategory: ['Course'],
      },
      limit: 100,
      sort_by: {
        lastPublishedOn: 'desc',
      },
      ...(searchText && { query: searchText }), // Add query conditionally
      fields: [
        'name',
        'appIcon',
        'description',
        'posterImage',
        'mimeType',
        'identifier',
        'resourceType',
        'primaryCategory',
        'contentType',
        'trackable',
        'children',
        'leafNodes',
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

  try {
    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });
    console.loh = ('####### result ', JSON.stringify(result));

    if (result) {
      // store result
      await storeApiResponse(
        user_id,
        url,
        'post',
        payload,
        result?.data?.result
      );
      return result?.data?.result;
    } else {
      let result_offline = await getApiResponse(user_id, url, 'post', payload);
      return result_offline;
    }
  } catch (e) {
    console.log('no internet available');
    let result_offline = await getApiResponse(user_id, url, 'post', payload);
    return result_offline;
  }
};

export const contentListApi_Pratham = async ({ searchText }) => {
  const user_id = await getDataFromStorage('userId');
  const url = `${EndUrls.contentList}`; // Define the URL
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  let userType = await getDataFromStorage('userType');
  let payload = {
    request: {
      filters: {
        program: (userType = 'scp' ? 'secondchance' : 'youthnet'),
        //board: ['CBSE'],
        primaryCategory: ['Learning Resource', 'Practice Question Set'],
        visibility: ['Default', 'Parent'],
      },
      limit: 100,
      sort_by: {
        lastPublishedOn: 'desc',
      },
      ...(searchText && { query: searchText }), // Add query conditionally
      fields: [
        'name',
        'appIcon',
        'description',
        'posterImage',
        'mimeType',
        'identifier',
        'resourceType',
        'primaryCategory',
        'contentType',
        'trackable',
        'children',
        'leafNodes',
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

  //get language user
  //removed below filter for Pilot release
  /*const result = JSON.parse(await getDataFromStorage('profileData'));
  if (result?.getUserDetails?.[0]?.customFields?.[0]?.value) {
    let language = [result?.getUserDetails?.[0]?.customFields?.[0]?.value];
    payload.request.filters['se_mediums'] = language;
  }*/
  console.log('######## payload ', JSON.stringify(payload));

  try {
    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });
    if (result) {
      // store result
      await storeApiResponse(
        user_id,
        url,
        'post',
        payload,
        result?.data?.result
      );
      return result?.data?.result;
    } else {
      let result_offline = await getApiResponse(user_id, url, 'post', payload);
      return result_offline;
    }
  } catch (e) {
    console.log('no internet available', e);
    let result_offline = await getApiResponse(user_id, url, 'post', payload);
    return result_offline;
  }
};

export const getCohort = async ({ user_id, tenantid, academicYearId }) => {
  try {
    const token = await getDataFromStorage('Accesstoken');
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      tenantid: tenantid,
      academicyearid: academicYearId,
    };
    const url = `${EndUrls.cohort}/${user_id}`;

    // Log the curl command
    console.log(
      `curl -X GET '${url}' -H 'Content-Type: application/json'${
        headers.Authorization
          ? ` -H 'Authorization: ${headers.Authorization}'`
          : ''
      }
      -H 'tenantid: ${headers.tenantid}'`
    );

    const result = await get(url, {
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

export const getProgramDetails = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const url = `${EndUrls.programDetails}`;

    // Log the curl command
    // console.log(
    //   `curl -X GET '${url}' -H 'Content-Type: application/json'${
    //     headers.Authorization
    //       ? ` -H 'Authorization: ${headers.Authorization}'`
    //       : ''
    //   }`
    // );

    const result = await get(url, {
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

export const setAcademicYear = async ({ tenantid }) => {
  try {
    const token = await getDataFromStorage('Accesstoken');
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      tenantid: tenantid,
    };
    const url = `${EndUrls.academicyears}`;
    const payload = {
      isActive: true,
    };

    // Log the curl command

    console.log(
      `curl -X POST '${url}' \\\n` +
        `-H 'Content-Type: application/json' \\\n` +
        `-H 'Accept: application/json' \\\n` +
        `-H 'Authorization: ${headers.Authorization}' \\\n` +
        `-H 'tenantid: ${headers.tenantid}' \\\n` +
        `-d '${JSON.stringify(payload)}'`
    );

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

// Assessment List API

export const assessmentListApi = async (params = {}) => {
  const user_id = params?.user_id;
  const url = `${EndUrls.contentSearch}`; // Define the URL
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  let userType = await getDataFromStorage('userType');
  const payload = {
    request: {
      filters: {
        program: (userType = 'scp' ? 'secondchance' : 'youthnet'),
        board: `${params?.boardName}`,
        assessmentType: ['pre-test', 'post-test'],
        status: ['Live'],
        primaryCategory: ['Practice Question Set'],
      },
      sort_by: {
        lastUpdatedOn: 'desc',
      },
      query: '',
      limit: 10,
      offset: 0,
    },
  };
  try {
    // Make the actual request
    const result = await post(url, payload, {
      params: {
        orgdetails: 'orgName,email',
        licenseDetails: 'name,description,url',
      },
      headers: headers || {},
    });
    if (result) {
      //store result
      await storeApiResponse(
        user_id,
        url,
        'post',
        payload,
        result?.data?.result
      );
      return result?.data?.result;
    } else {
      let result_offline = await getApiResponse(user_id, url, 'post', payload);
      return result_offline;
    }
  } catch (e) {
    console.log('no internet available');
    let result_offline = await getApiResponse(user_id, url, 'post', payload);
    return result_offline;
  }
};
export const getDoits = async ({ payload }) => {
  const user_id = await getDataFromStorage('userId');
  const url = `${EndUrls.contentSearch}`; // Define the URL
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Construct curl command
  const curlCommand = `curl -X POST '${url}' -H 'Content-Type: application/json' -H 'Accept: application/json' -d '${JSON.stringify(
    payload
  )}'`;
  console.log('Curl Command:', curlCommand);

  try {
    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });
    if (result) {
      //store result
      await storeApiResponse(
        user_id,
        url,
        'post',
        payload,
        result?.data?.result
      );
      return result?.data?.result;
    } else {
      let result_offline = await getApiResponse(user_id, url, 'post', payload);
      return result_offline;
    }
  } catch (e) {
    console.log('No internet available');
    let result_offline = await getApiResponse(user_id, url, 'post', payload);
    return result_offline;
  }
};

export const trackAssessment = async (params = {}) => {
  try {
    const url = `${EndUrls.trackAssessment}`; // Define the URL
    const headers = await getHeaders();
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
    console.log('CALLED');

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

    const headers = await getHeaders();

    const payload = {
      userId: [params?.user_id],
      courseId: params?.uniqueAssessmentsId,
      unitId: params?.uniqueAssessmentsId,
      contentId: params?.uniqueAssessmentsId,
    };

    const curlCommand = `curl -X POST '${url}' \\ 
    ${Object.entries(headers || {})
      .map(([key, value]) => `  -H '${key}: ${value}' \\`)
      .join('\n')} 
      -d '${JSON.stringify(payload)}'`;

    console.log('cURL Command:', curlCommand);

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

    const headers = await getHeaders();

    const payload = {
      userId: params?.user_id,
      contentId: params?.contentId,
      courseId: params?.contentId,
      unitId: params?.contentId,
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

//store all api response in offline storage
export const storeApiResponse = async (
  user_id,
  api_url,
  api_type,
  payload,
  response
) => {
  try {
    //delete if exist to overwrite
    const data_delete = {
      user_id: user_id,
      api_url: api_url,
      api_type: api_type,
      payload: JSON.stringify(payload),
    };
    // console.log('data_delete', data_delete);
    await deleteData({
      tableName: 'APIResponses',
      where: data_delete,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
    //store or overwrite
    const data_insert = {
      user_id: user_id,
      api_url: api_url,
      api_type: api_type,
      payload: JSON.stringify(payload),
      response: JSON.stringify(response),
    };
    await insertData({
      tableName: 'APIResponses',
      data: data_insert,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
  } catch (e) {
    console.log(e);
  }
};

export const getApiResponse = async (user_id, api_url, api_type, payload) => {
  try {
    //get result
    const data_get = {
      user_id: user_id,
      api_url: api_url,
      api_type: api_type,
      payload: JSON.stringify(payload),
    };
    let result_data = null;
    await getData({
      tableName: 'APIResponses',
      where: data_get,
    })
      .then((rows) => {
        if (rows.length > 0) {
          try {
            result_data = JSON.parse(rows[0]?.response);
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.error('err', err);
      });
    return result_data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

//store assessment offline
export const storeAsessmentOffline = async (user_id, content_id, payload) => {
  try {
    //delete if exist to overwrite
    const data_delete = {
      user_id: user_id,
      content_id: content_id,
    };
    // console.log('data_delete', data_delete);
    await deleteData({
      tableName: 'Asessment_Offline_2',
      where: data_delete,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
    //store or overwrite
    const data_insert = {
      user_id: user_id,
      content_id: content_id,
      payload: JSON.stringify(payload),
    };
    await insertData({
      tableName: 'Asessment_Offline_2',
      data: data_insert,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
  } catch (e) {
    console.log(e);
  }
};
export const deleteAsessmentOffline = async (user_id, content_id) => {
  try {
    //delete if exist to overwrite
    const data_delete = {
      user_id: user_id,
      content_id: content_id,
    };
    await deleteData({
      tableName: 'Asessment_Offline_2',
      where: data_delete,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
  } catch (e) {
    console.log(e);
  }
};
export const getAsessmentOffline = async (user_id, content_id) => {
  try {
    //get result
    const data_get = {
      user_id: user_id,
      content_id: content_id,
    };
    let result_data = null;
    await getData({
      tableName: 'Asessment_Offline_2',
      where: data_get,
    })
      .then((rows) => {
        if (rows.length > 0) {
          try {
            result_data = JSON.parse(rows[0]?.payload);
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.error('err', err);
      });
    return result_data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
export const getSyncAsessmentOffline = async (user_id) => {
  try {
    //get result
    const data_get = {
      user_id: user_id,
    };
    let result_data = null;
    await getData({
      tableName: 'Asessment_Offline_2',
      where: data_get,
    })
      .then((rows) => {
        if (rows.length > 0) {
          try {
            result_data = rows;
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.error('err', err);
      });
    return result_data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
//telemetry offline
//store
export const storeTelemetryOffline = async (user_id, telemetry_object) => {
  try {
    //store
    const data_insert = {
      user_id: user_id,
      telemetry_object: JSON.stringify(telemetry_object),
    };
    await insertData({
      tableName: 'Telemetry_Offline',
      data: data_insert,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
  } catch (e) {
    console.log(e);
  }
};
export const getSyncTelemetryOffline = async (user_id) => {
  try {
    //get result
    const data_get = {
      user_id: user_id,
    };
    let result_data = null;
    await getData({
      tableName: 'Telemetry_Offline',
      where: data_get,
    })
      .then((rows) => {
        //console.log('rows', rows);
        if (rows.length > 0) {
          try {
            result_data = rows;
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.error('err', err);
      });
    return result_data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
export const deleteTelemetryOffline = async (id) => {
  try {
    //delete if exist to overwrite
    const data_delete = {
      id: id,
    };
    //console.log('data_delete', data_delete);
    await deleteData({
      tableName: 'Telemetry_Offline',
      where: data_delete,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
  } catch (e) {
    console.log(e);
  }
};
//tracking offline
//store
export const storeTrackingOffline = async (
  user_id,
  course_id,
  content_id,
  content_type,
  content_mime,
  lastAccessOn,
  detailsObject,
  unit_id
) => {
  try {
    //store
    const data_insert = {
      user_id: user_id,
      course_id: course_id,
      content_id: content_id,
      content_type: content_type,
      content_mime: content_mime,
      lastAccessOn: lastAccessOn,
      detailsObject: JSON.stringify(detailsObject),
      unit_id: unit_id,
    };
    await insertData({
      tableName: 'Tracking_Offline_2',
      data: data_insert,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
  } catch (e) {
    console.log(e);
  }
};
export const getSyncTrackingOffline = async (user_id) => {
  try {
    //get result
    const data_get = {
      user_id: user_id,
    };
    let result_data = null;
    await getData({
      tableName: 'Tracking_Offline_2',
      where: data_get,
    })
      .then((rows) => {
        //console.log('rows', rows);
        if (rows.length > 0) {
          try {
            result_data = rows;
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.error('err', err);
      });
    return result_data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
export const deleteTrackingOffline = async (id) => {
  try {
    //delete if exist to overwrite
    const data_delete = {
      id: id,
    };
    //console.log('data_delete', data_delete);
    await deleteData({
      tableName: 'Tracking_Offline_2',
      where: data_delete,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
  } catch (e) {
    console.log(e);
  }
};
export const getSyncTrackingOfflineCourse = async (user_id, course_id) => {
  try {
    //get result
    const data_get = {
      user_id: user_id,
      course_id: course_id,
    };
    let result_data = null;
    await getData({
      tableName: 'Tracking_Offline_2',
      where: data_get,
    })
      .then((rows) => {
        //console.log('rows', rows);
        if (rows.length > 0) {
          try {
            result_data = rows;
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.error('err', err);
      });
    return result_data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getGeoLocation = async ({ payload }) => {
  try {
    const url = `${EndUrls.geolocation}`; // Define the URL
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    console.log(
      `curl -X POST ${url} -H 'Content-Type: application/json' -H -d '${JSON.stringify(
        payload
      )}'`
    );

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
export const forgotPassword = async ({ payload }) => {
  try {
    const url = `${EndUrls.forgotPassword}`; // Define the URL
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    // console.log(
    //   `curl -X POST ${url} -H 'Content-Type: application/json' -H -d '${JSON.stringify(
    //     payload
    //   )}'`
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
export const resetPassword = async ({ payload }) => {
  try {
    const url = `${EndUrls.resetPassword}`; // Define the URL
    const headers = await getHeaders();

    const curlCommand = `
    curl -X POST '${url}' \\
    -H 'Content-Type: application/json' \\
    -H 'Accept: application/json' \\
    -H 'Authorization:  ${headers.Authorization}' \\
    -H 'tenantId: ${headers.tenantId}' \\
    -d '${JSON.stringify(payload)}'
        `;
    console.log('cURL Command:', curlCommand);

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

export async function reverseGeocode(latitude, longitude) {
  const GOOGLE_KEY = Config.GOOGLE_KEY;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_KEY}`
  );

  const data = await response.json();
  // console.log(JSON.stringify(data));
  if (data.results.length > 0) {
    const addressComponents = data.results[0].address_components;
    const state = addressComponents.find((comp) =>
      comp.types.includes('administrative_area_level_1')
    )?.long_name;
    const district = addressComponents.find((comp) =>
      comp.types.includes('administrative_area_level_3')
    )?.long_name;
    const block = addressComponents.find((comp) =>
      comp.types.includes('sublocality')
    )?.long_name;
    // console.log({ state, district, block });
    return { state, district, block };
  }
  return { state: null, district: null, block: null };
}

export const eventList = async ({ startDate, endDate }) => {
  try {
    const url = `${EndUrls.eventList}`; // Define the URL
    const headers = await getHeaders();
    const cohort = JSON.parse(await getDataFromStorage('cohortData'));
    // console.log({ startDate, endDate, cohort });
    // console.log(cohort?.cohortData?.[0]?.cohortId);

    const payload = {
      limit: 0,
      offset: 0,
      filters: {
        date: {
          after: startDate,
          before: endDate,
        },
        cohortId: cohort?.cohortData?.[0]?.cohortId,
        status: ['live'],
      },
    };
    const curlCommand = `
    curl -X POST '${url}' \\
    -H 'Content-Type: application/json' \\
    -H 'Accept: application/json' \\
    -H 'Authorization:  ${headers.Authorization}' \\
    -H 'tenantId: ${headers.tenantId}' \\
    -d '${JSON.stringify(payload)}'
        `;
    // console.log('cURL Command:', curlCommand);

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
export const targetedSolutions = async ({ subjectName, type }) => {
  try {
    const method = 'POST'; // Define the HTTP method
    const url = `${EndUrls.targetedSolutions}`; // Define the URL
    const token = await getDataFromStorage('Accesstoken');
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie:
        'AWSALB=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+; AWSALBCORS=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+',
      'x-auth-token': token,
    };
    const cohort = JSON.parse(await getDataFromStorage('cohortData'));
    const requiredLabels = ['GRADE', 'STATES', 'MEDIUM', 'BOARD'];
    const customFields = cohort?.cohortData?.[0]?.customField;
    const data = createNewObject(customFields, requiredLabels);

    const payload = {
      subject: subjectName,
      state: data?.STATES,
      medium: data?.MEDIUM,
      class: data?.GRADE,
      board: data?.BOARD,
      type: type,
    };

    console.log(
      `curl -X ${method} '${url}' -H 'Content-Type: application/json' -H 'x-auth-token: ${
        headers['x-auth-token']
      }' -d '${JSON.stringify(payload)}'`
    );

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
export const EventDetails = async ({ id }) => {
  try {
    const method = 'POST'; // Define the HTTP method
    const url = `${EndUrls.EventDetails}/${id}`; // Define the URL
    const token = await getDataFromStorage('Accesstoken');
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie:
        'AWSALB=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+; AWSALBCORS=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+',
      'x-auth-token': token,
    };

    const payload = {};

    // console.log(
    //   `curl -X ${method} '${url}' -H 'Content-Type: application/json' -H 'x-auth-token: ${
    //     headers['x-auth-token']
    //   }' -d '${JSON.stringify(payload)}'`
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
export const SolutionEvent = async ({ solutionId }) => {
  try {
    const method = 'POST'; // Define the HTTP method
    const url = `${EndUrls.SolutionEvent}/${solutionId}`; // Define the URL
    const token = await getDataFromStorage('Accesstoken');
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie:
        'AWSALB=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+; AWSALBCORS=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+',
      'x-auth-token': token,
    };

    const payload = { role: 'Teacher' };

    // console.log(
    //   `curl -X ${method} '${url}' -H 'Content-Type: application/json' -H 'x-auth-token: ${
    //     headers['x-auth-token']
    //   }' -d '${JSON.stringify(payload)}'`
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
export const SolutionEventDetails = async ({ templateId, solutionId }) => {
  try {
    const method = 'POST'; // Define the HTTP method
    const url = `${EndUrls.EventDetails}?templateId=${templateId}&solutionId=${solutionId}`; // Define the URL
    const token = await getDataFromStorage('Accesstoken');
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie:
        'AWSALB=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+; AWSALBCORS=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+',
      'x-auth-token': token,
    };

    const payload = { role: 'Teacher' };

    console.log(
      `curl -X ${method} '${url}' -H 'Content-Type: application/json' -H 'x-auth-token: ${
        headers['x-auth-token']
      }' -d '${JSON.stringify(payload)}'`
    );

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

export const getAttendance = async ({ todate, fromDate }) => {
  try {
    const method = 'POST'; // Define the HTTP method
    const url = `${EndUrls.attendance}`; // Define the URL
    const token = await getDataFromStorage('Accesstoken');
    let userId = await getDataFromStorage('userId');
    let cohortId = await getDataFromStorage('cohortId');
    const tenantid = await getTentantId();

    const headers = await getHeaders();

    const payload = {
      limit: 300,
      page: 0,
      filters: {
        contextId: cohortId,
        scope: 'student',
        toDate: todate,
        fromDate: fromDate,
        userId: userId,
      },
    };

    const curlCommand = `
    curl -X POST '${url}' \\
    -H 'Content-Type: application/json' \\
    -H 'Accept: application/json' \\
    -H 'Authorization:  ${headers.Authorization}' \\
    -H 'tenantId: ${headers.tenantId}' \\
    -d '${JSON.stringify(payload)}'
        `;
    // console.log('cURL Command:', curlCommand);

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });

    if (result) {
      return result?.data?.data;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};
export const LearningMaterialAPI = async () => {
  try {
    const method = 'get'; // Define the HTTP method
    const url = `${EndUrls.framework}`; // Define the URL
    const headers = await getHeaders();

    // Construct the curl command
    let curlCommand = `curl -X ${method.toUpperCase()} '${url}' \\\n`;
    for (const [key, value] of Object.entries(headers || {})) {
      curlCommand += `-H '${key}: ${value}' \\\n`;
    }
    // console.log(curlCommand);
    // Make the actual request
    const result = await get(url, {
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

export const notificationSubscribe = async ({ deviceId, user_id }) => {
  try {
    console.log('api_called');

    const url = `${EndUrls.notificationSubscribe}/${user_id}`; // Define the URL
    const headers = await getHeaders(); // Ensure headers are awaited
    const payload = {
      userData: {
        deviceId: deviceId,
      },
    };

    // Construct cURL command
    const curlCommand = `
curl -X PATCH '${url}' \\
-H 'Content-Type: application/json' \\
-H 'Accept: application/json' \\
-H 'Authorization:  ${headers.Authorization}' \\
-H 'tenantId: ${headers.tenantId}' \\
-d '${JSON.stringify(payload)}'
    `;
    // console.log('cURL Command:', curlCommand);

    // Make the actual request
    const result = await patch(url, payload, {
      headers: headers || {},
    });
    console.log({ result });

    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};
