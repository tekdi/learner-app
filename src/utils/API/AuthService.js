import { getDataFromStorage } from '../JsHelper/Helper';
import { deleteData, getData, insertData } from '../JsHelper/SqliteHelper';
import EndUrls from './EndUrls';
import { get, handleResponseException, post } from './RestClient';

const getHeaders = async () => {
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

export const courseListApi_testing = async (params = {}) => {
  const user_id = await getDataFromStorage('userId');
  const url = `${EndUrls.contentList_testing}`; // Define the URL
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const payload = {
    request: {
      filters: {
        se_boards: ['west bengal board of secondary education'],
        se_mediums: ['english'],
        se_gradeLevels: ['class 10', 'class 09', 'class 08'],
        primaryCategory: ['Course'],
        visibility: ['Default', 'Parent'],
      },
      limit: 100,
      sort_by: {
        lastPublishedOn: 'desc',
      },
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

export const courseListApi = async (params = {}) => {
  const user_id = await getDataFromStorage('userId');
  const url = `${EndUrls.contentList}`; // Define the URL
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const payload = {
    request: {
      filters: {
        se_boards: [
          'Odisha',
          'Uttar Pradesh',
          'Madhya Pradesh',
          'NIOS',
          'Rajasthan',
        ],
        primaryCategory: ['Course'],
        visibility: ['Default', 'Parent'],
      },
      limit: 100,
      sort_by: {
        lastPublishedOn: 'desc',
      },
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

export const contentListApi = async (params = {}) => {
  const user_id = await getDataFromStorage('userId');
  const url = `${EndUrls.contentList}`; // Define the URL
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const payload = {
    request: {
      filters: {
        board: [
          'Odisha',
          'Uttar Pradesh',
          'Madhya Pradesh',
          'NIOS',
          'Rajasthan',
        ],
        primaryCategory: ['Learning Resource'],
        visibility: ['Default', 'Parent'],
      },
      limit: 100,
      sort_by: {
        lastPublishedOn: 'desc',
      },
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
  const user_id = params?.user_id;
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
      courseId: params?.uniqueAssessmentsId,
      unitId: params?.uniqueAssessmentsId,
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
    console.log('data_delete', data_delete);
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
export const storeAsessmentOffline = async (
  user_id,
  batch_id,
  content_id,
  payload
) => {
  try {
    //delete if exist to overwrite
    const data_delete = {
      user_id: user_id,
      batch_id: batch_id,
      content_id: content_id,
    };
    console.log('data_delete', data_delete);
    await deleteData({
      tableName: 'Asessment_Offline',
      where: data_delete,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
    //store or overwrite
    const data_insert = {
      user_id: user_id,
      batch_id: batch_id,
      content_id: content_id,
      payload: JSON.stringify(payload),
    };
    await insertData({
      tableName: 'Asessment_Offline',
      data: data_insert,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
  } catch (e) {
    console.log(e);
  }
};
export const deleteAsessmentOffline = async (user_id, batch_id, content_id) => {
  try {
    //delete if exist to overwrite
    const data_delete = {
      user_id: user_id,
      batch_id: batch_id,
      content_id: content_id,
    };
    await deleteData({
      tableName: 'Asessment_Offline',
      where: data_delete,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
  } catch (e) {
    console.log(e);
  }
};
export const getAsessmentOffline = async (user_id, batch_id, content_id) => {
  try {
    //get result
    const data_get = {
      user_id: user_id,
      batch_id: batch_id,
      content_id: content_id,
    };
    let result_data = null;
    await getData({
      tableName: 'Asessment_Offline',
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
      tableName: 'Asessment_Offline',
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
  batch_id,
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
      batch_id: batch_id,
      content_id: content_id,
      content_type: content_type,
      content_mime: content_mime,
      lastAccessOn: lastAccessOn,
      detailsObject: JSON.stringify(detailsObject),
      unit_id: unit_id,
    };
    await insertData({
      tableName: 'Tracking_Offline',
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
      tableName: 'Tracking_Offline',
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
      tableName: 'Tracking_Offline',
      where: data_delete,
    })
      .then((msg) => console.log('msg', msg))
      .catch((err) => console.error('err', err));
  } catch (e) {
    console.log(e);
  }
};
export const getSyncTrackingOfflineCourse = async (
  user_id,
  batch_id,
  course_id
) => {
  try {
    //get result
    const data_get = {
      user_id: user_id,
      batch_id: batch_id,
      course_id: course_id,
    };
    let result_data = null;
    await getData({
      tableName: 'Tracking_Offline',
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
    // console.log(
    //   `curl -X POST ${url} -H 'Content-Type: application/json' -H -d '${JSON.stringify(payload)}'`
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
export const forgotPassword = async ({ payload }) => {
  try {
    const url = `${EndUrls.forgotPassword}`; // Define the URL
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    // console.log(
    //   `curl -X POST ${url} -H 'Content-Type: application/json' -H -d '${JSON.stringify(payload)}'`
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

export const reverseGeocode = async (latitude, longitude) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  );
  const data = await response.json();
  return data;
};
