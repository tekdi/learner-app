import axios from 'axios';
import {
  createNewObject,
  createNewObjectTarget,
  getDataFromStorage,
  getTentantId,
} from '../JsHelper/Helper';
import { deleteData, getData, insertData } from '../JsHelper/SqliteHelper';
import EndUrls from './EndUrls';
import { get, handleResponseException, patch, post } from './RestClient';
//for react native config env : dev uat prod
import Config from 'react-native-config';
import RNFS from 'react-native-fs';
import { Alert } from 'react-native';
import { TENANT_DATA } from '../Constants/app-constants';

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
    const url = `${EndUrls.login}`;

    // console.log('Calling login API...');
    // console.log(
    //   `curl -X POST ${url} \\\n` +
    //     `  -H "Content-Type: application/json" \\\n` +
    //     `  -H "Accept: application/json" \\\n` +
    //     `  -d '${JSON.stringify(params, null, 2)}'`
    // );

    const result = await post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (result?.data) {
      return result?.data?.result;
    } else {
      return {};
    }
  } catch (e) {
    console.error('Login error:', e);
    return {};
  }
};

export const refreshToken = async (params = {}) => {
  try {
    // Construct the cURL command
    const url = `${EndUrls.refresh_token}`;
    const headers = await getHeaders();
    const headersString = Object.entries(headers)
      .map(([key, value]) => `-H "${key}: ${value}"`)
      .join(' ');

    const dataString = JSON.stringify(params);
    const curlCommand = `curl -X POST ${headersString} -d '${dataString}' ${url}`;
    console.log('cURL command:', curlCommand);

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
    const url = `${EndUrls.get_current_token}`;

    // Generate the `curl` command
    const curlCommand = [
      `curl -X GET '${url}'`,
      ...Object.entries(headers || {}).map(
        ([key, value]) => `-H '${key}: ${value}'`
      ),
    ].join(' ');

    // Log the `curl` command
    // console.log('CURL Command:', curlCommand);

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

export const getStudentForm = async (tenantId) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(tenantId && { tenantId: `${tenantId}` }),
  };
  // const url = `${EndUrls.get_form}`;
  const url = `${EndUrls.get_form}`;
  const user_id = await getDataFromStorage('userId'); // Ensure this is defined
  try {
    // Generate the curl command
    const curlCommand = `curl -X GET '${url}' \\
${Object.entries(headers || {})
  .map(([key, value]) => `-H '${key}: ${value}' \\`)
  .join('\n')}`;

    // console.log(curlCommand);

    // Make the API request
    const result = await get(url, {
      headers: headers || {},
    });

    if (result) {
      await storeApiResponse(user_id, url, 'get', null, result?.data?.result);
      return result?.data?.result;
    } else {
      const result_offline = await getApiResponse(user_id, url, 'get', null);
      return result_offline;
    }
  } catch (e) {
    const result_offline = await getApiResponse(user_id, url, 'get', null);
    return result_offline;
  }
};

export const userExist = async (payload) => {
  try {
    const curlCommand = `
    curl -X POST ${EndUrls.userExist} \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '${JSON.stringify(payload)}'
  `.trim();

    // Log the cURL command
    console.log('cURL Command:', curlCommand);
    const result = await post(`${EndUrls.userExist}`, payload, {
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
export const sendOtp = async (payload) => {
  try {
    const curlCommand = `
      curl -X POST ${EndUrls.sendOTP} \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d '${JSON.stringify(payload)}'
    `.trim();

    //   // Log the cURL command
    console.log('cURL Command:', curlCommand);
    const result = await post(`${EndUrls.sendOTP}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    console.log('########## otp sent', JSON.stringify(result));

    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};
export const verifyOtp = async (payload) => {
  try {
    const curlCommand = `
      curl -X POST ${EndUrls.verifyOTP} \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d '${JSON.stringify(payload)}'
    `.trim();

    //   // Log the cURL command
    console.log('cURL Command:', curlCommand);
    const result = await post(`${EndUrls.verifyOTP}`, payload, {
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
export const suggestUsername = async (payload) => {
  try {
    const curlCommand = `
    //   curl -X POST ${EndUrls.suggestUsername} \
    //   -H "Content-Type: application/json" \
    //   -H "Accept: application/json" \
    //   -d '${JSON.stringify(payload)}'
    // `.trim();

    //   // Log the cURL command
    console.log('cURL Command:', curlCommand);
    const result = await post(`${EndUrls.suggestUsername}`, payload, {
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
    console.log(
      `curl -X ${method} ${url} -H 'Content-Type: application/json' -d '${JSON.stringify(
        params
      )}'`
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
export const updateUser = async ({ payload, user_id }) => {
  try {
    const method = 'PATCH'; // Define the HTTP method
    const url = `${EndUrls.update_profile}/${user_id}`; // Define the URL
    const token = await getDataFromStorage('Accesstoken');
    const headers = await getHeaders();

    const curlCommand = `
    curl -X PATCH '${url}' \\
    -H 'Content-Type: application/json' \\
    -H 'Accept: application/json' \\
    -H 'Authorization:  ${headers.Authorization}' \\
    -H 'tenantId: ${headers.tenantId}' \\
    -d '${JSON.stringify(payload)}'
        `;
    console.log('cURL Command:', curlCommand);

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

export const courseListApi_testing = async ({
  searchText,
  inprogress_do_ids,
}) => {
  const tenantData = JSON.parse(await getDataFromStorage('tenantData'));
  const collectionFramework = tenantData?.[0]?.collectionFramework;
  const user_id = await getDataFromStorage('userId');
  const url = `${EndUrls.contentList_testing}${collectionFramework}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  let userType = await getDataFromStorage('userType');
  const payload = {
    request: {
      filters: {
        program:
          userType == 'scp'
            ? ['secondchance', 'Second Chance']
            : ['Youthnet', 'youthnet', 'YouthNet', TENANT_DATA.YOUTHNET],
        ...(inprogress_do_ids && { identifier: inprogress_do_ids }),
        primaryCategory: ['Course'],
      },
      limit: 100,
      sort_by: {
        lastPublishedOn: 'desc',
      },
      ...(searchText && { query: searchText }),
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

  // Generate cURL command
  const curlCommand = `curl -X POST "${url}" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '${JSON.stringify(payload, null, 2)}'`;

  console.log('Generated cURL Command:');
  console.log(curlCommand);

  try {
    const result = await post(url, payload, { headers });

    if (result) {
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
    let result_offline = await getApiResponse(user_id, url, 'post', payload);
    return result_offline;
  }
};

export const courseListApi_New = async ({
  searchText,
  mergedFilter,
  instant,
  offset,
  inprogress_do_ids,
  contentFilter,
}) => {
  const tenantData = JSON.parse(await getDataFromStorage('tenantData'));
  const channelId = tenantData?.[0]?.channelId;
  const collectionFramework = tenantData?.[0]?.collectionFramework;

  const user_id = await getDataFromStorage('userId');
  const url = `${EndUrls.contentList_testing}${collectionFramework}`; // Define the URL
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  let userType = await getDataFromStorage('userType');

  const payload = {
    request: {
      filters: {
        channel: instant?.channelId || channelId,
        // program:
        //   userType == 'scp'
        //     ? ['secondchance', 'Second Chance']
        //     : ['Youthnet', 'youthnet', 'YouthNet'],
        domain: contentFilter?.domain,
        program: contentFilter?.program,
        ...(inprogress_do_ids && { identifier: inprogress_do_ids }), // Add identifier conditionally
        status: ['Live'],
        primaryCategory: ['Course'],
        ...(mergedFilter && mergedFilter),
      },
      limit: 10,
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
      // facets: [
      //   'se_boards',
      //   'se_gradeLevels',
      //   'se_subjects',
      //   'se_mediums',
      //   'primaryCategory',
      // ],
      offset: offset ? offset : 0,
    },
  };
  // Construct the cURL command
  let curlCommand = `curl -X POST '${url}' \\\n`;
  for (const [key, value] of Object.entries(headers)) {
    curlCommand += `-H '${key}: ${value}' \\\n`;
  }
  curlCommand += `-d '${JSON.stringify(payload)}'`;

  // Output the cURL command to the console
  console.log('Equivalent cURL command:\n', curlCommand);
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
    let result_offline = await getApiResponse(user_id, url, 'post', payload);
    return result_offline;
  }
};

export const profileCourseListApi = async () => {
  const user_id = await getDataFromStorage('userId');
  const url = `${EndUrls.getCourseCompletedList}`; // Define the URL
  let tenantId = await getTentantId();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    tenantId: tenantId,
  };
  const payload = {
    filters: {
      status: ['completed', 'viewCertificate'],
      userId: user_id,
    },
    limit: 100,
    offset: 0,
  };
  // Construct the cURL command
  let curlCommand = `curl -X POST '${url}' \\\n`;
  for (const [key, value] of Object.entries(headers)) {
    curlCommand += `-H '${key}: ${value}' \\\n`;
  }
  curlCommand += `-d '${JSON.stringify(payload)}'`;

  // Output the cURL command to the console
  console.log('Equivalent cURL command:\n', curlCommand);
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
    let result_offline = await getApiResponse(user_id, url, 'post', payload);
    return result_offline;
  }
};

export const contentListApi_Pratham = async ({
  searchText,
  // mergedFilter,
  instant,
  offset,
}) => {
  const tenantData = JSON.parse(await getDataFromStorage('tenantData'));
  const collectionFramework = tenantData?.[0]?.collectionFramework;
  const channelId = tenantData?.[0]?.channelId;
  const user_id = await getDataFromStorage('userId');
  const url = `${EndUrls.contentList}${collectionFramework}`; // Define the URL
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  let userType = await getDataFromStorage('userType');

  let payload = {
    request: {
      filters: {
        channel: channelId,

        primaryCategory: ['Learning Resource', 'Practice Question Set'],
        visibility: ['Default', 'Parent'],
      },
      limit: 10,
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
      // facets: [
      //   'se_boards',
      //   'se_gradeLevels',
      //   'se_subjects',
      //   'se_mediums',
      //   'primaryCategory',
      // ],
      offset: offset ? offset : 0,
    },
  };

  //get language user
  //removed below filter for Pilot release
  /*const result = JSON.parse(await getDataFromStorage('profileData'));
  if (result?.getUserDetails?.[0]?.customFields?.[0]?.value) {
    let language = [result?.getUserDetails?.[0]?.customFields?.[0]?.value];
    payload.request.filters['se_mediums'] = language;
  }*/

  // Construct the cURL command
  let curlCommand = `curl -X POST '${url}' \\\n`;
  for (const [key, value] of Object.entries(headers)) {
    curlCommand += `-H '${key}: ${value}' \\\n`;
  }
  curlCommand += `-d '${JSON.stringify(payload)}'`;

  // Output the cURL command to the console
  console.log('Equivalent cURL command:\n', curlCommand);

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
    // console.log(
    //   `curl -X GET '${url}' -H 'Content-Type: application/json'${
    //     headers.Authorization
    //       ? ` -H 'Authorization: ${headers.Authorization}'`
    //       : ''
    //   }
    //   -H 'tenantid: ${headers.tenantid}'
    //   -H 'academicyearid: ${headers.academicyearid}'`
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

export const getProgramDetails = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const url = `${EndUrls.tenantRead}`;

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

    // console.log(
    //   `curl -X POST '${url}' \\\n` +
    //     `-H 'Content-Type: application/json' \\\n` +
    //     `-H 'Accept: application/json' \\\n` +
    //     `-H 'Authorization: ${headers.Authorization}' \\\n` +
    //     `-H 'tenantid: ${headers.tenantid}' \\\n` +
    //     `-d '${JSON.stringify(payload)}'`
    // );

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
        program: userType == 'scp' ? ['Second Chance'] : [TENANT_DATA.YOUTHNET],
        board: `${params?.boardName}`,
        // board: `Maharashtra Education Board`,
        // state: `${params?.stateName}`,
        // assessmentType: ['pre-test', 'post-test'],
        assessmentType: ['Pre Test', 'Post Test', 'Other', 'Unit Test' , 'Mock Test'],
        status: ['Live'],
        primaryCategory: ['Practice Question Set'],
        // new different type
        // undo this
        // evaluationType: ['offline', 'online', 'ai'],
      },
      sort_by: {
        lastUpdatedOn: 'desc',
      },
      query: '',
      limit: 100,
      offset: 0,
    },
  };
  try {
    const curlCommand = `
curl -X POST '${url}' \\
-H 'Content-Type: application/json' \\
-H 'Accept: application/json' \\
-d '${JSON.stringify(payload)}'
    `;
    console.log('CURL Command:\n', curlCommand); // Log the generated curl command

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
  // console.log('Curl Command:', curlCommand);

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
  const user_id = await getDataFromStorage('userId'); // Ensure this is defined
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
  try {
    // Convert headers object to cURL header format
    const headerString = Object.entries(headers || {})
      .map(([key, value]) => `-H "${key}: ${value}"`)
      .join(' ');

    // Convert payload to JSON string
    const payloadString = JSON.stringify(payload);

    // Construct cURL command
    const curlCommand = `curl -X POST "${url}" ${headerString} -H "Content-Type: application/json" -d '${payloadString}'`;

    console.log('#### loginmultirole Generated cURL Command:', curlCommand);

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });
    console.log('#### loginmultirole profileData result', result);
    if (result) {
      await storeApiResponse(
        user_id,
        url,
        'post',
        payload,
        result?.data?.result
      );
      return result?.data?.result;
    } else {
      const result_offline = await getApiResponse(
        user_id,
        url,
        'post',
        payload
      );
      return result_offline;
    }
  } catch (e) {
    const result_offline = await getApiResponse(user_id, url, 'post', payload);
    return result_offline;
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

    console.log('#########atm do_ids cURL Command:', curlCommand);

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
    await deleteData({
      tableName: 'APIResponses',
      where: data_delete,
    })
      .then((msg) => console.log())
      .catch((err) => console.error());
    //store or overwrite
    const data_insert = {
      user_id: user_id,
      api_url: api_url,
      api_type: api_type,
      payload: JSON.stringify(payload),
      response: JSON.stringify(response),
    };
    // console.log('data_insert===>', JSON.stringify(data_insert));

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
    // console.log('data_get===>', JSON.stringify(data_get));

    await getData({
      tableName: 'APIResponses',
      where: data_get,
    })
      .then((rows) => {
        if (rows.length > 0) {
          try {
            result_data = JSON.parse(rows[0]?.response);
          } catch (e) {
            console.log('e', e);
          }
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
    await deleteData({
      tableName: 'Asessment_Offline_2',
      where: data_delete,
    })
      .then((msg) => console.log())
      .catch((err) => console.error());
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
      .then((msg) => console.log())
      .catch((err) => console.error());
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
      .then((msg) => console.log())
      .catch((err) => console.error());
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
      .then((msg) => console.log())
      .catch((err) => console.error());
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
      .then((msg) => console.log())
      .catch((err) => console.error());
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
      .then((msg) => console.log())
      .catch((err) => console.error());
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
    await deleteData({
      tableName: 'Tracking_Offline_2',
      where: data_delete,
    })
      .then((msg) => console.log())
      .catch((err) => console.error());
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

export async function reverseGeocode(latitude, longitude) {
  const GOOGLE_KEY = Config.GOOGLE_KEY;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_KEY}`
  );

  const data = await response.json();
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
    return { state, district, block };
  }
  return { state: null, district: null, block: null };
}

export const eventList = async ({ startDate, endDate }) => {
  const user_id = await getDataFromStorage('userId'); // Ensure this is defined
  const url = `${EndUrls.eventList}`; // Define the URL
  const headers = await getHeaders();
  const cohort = JSON.parse(await getDataFromStorage('cohortData'));
  const payload = {
    limit: 0,
    offset: 0,
    filters: {
      date: {
        after: startDate,
        before: endDate,
      },
      cohortId: cohort?.cohortId,
      status: ['live'],
    },
  };
  try {
    // const curlCommand = `
    // curl -X POST '${url}' \\
    // -H 'Content-Type: application/json' \\
    // -H 'Accept: application/json' \\
    // -H 'Authorization:  ${headers.Authorization}' \\
    // -H 'tenantId: ${headers.tenantId}' \\
    // -d '${JSON.stringify(payload)}'
    //     `;
    // console.log('cURL Command_Event:', curlCommand);

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });

    if (result) {
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
    let result_offline = await getApiResponse(user_id, url, 'post', payload);
    return result_offline;
  }
};
export const targetedSolutions = async ({ subjectName, type }) => {
  const user_id = await getDataFromStorage('userId'); // Ensure this is defined
  const url = `${EndUrls.targetedSolutions}`; // Define the URL
  const method = 'POST'; // Define the HTTP method
  const token = await getDataFromStorage('Accesstoken');
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Cookie:
      'AWSALB=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+; AWSALBCORS=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+',
    'x-auth-token': token,
  };
  const cohort = JSON.parse(await getDataFromStorage('cohortData'));
  // console.log('cohort==>', JSON.stringify(cohort));

  const requiredLabels = ['GRADE', 'STATES', 'MEDIUM', 'BOARD'];
  const customFields = cohort?.customField;
  const data = createNewObjectTarget(customFields, requiredLabels);
  // console.log('data==>', JSON.stringify(data));

  const payload = {
    subject: subjectName,
    // state: data?.STATES,
    medium: data?.MEDIUM?.value,
    class: data?.GRADE?.value,
    board: data?.BOARD?.value,
    courseType: type,
  };
  try {
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
    let result_offline = await getApiResponse(user_id, url, 'post', payload);

    return result_offline;
  }
};
export const EventDetails = async ({ id }) => {
  const url = `${EndUrls.EventDetails}/${id}`; // Define the URL
  const user_id = await getDataFromStorage('userId'); // Ensure this is defined
  const payload = {};
  const method = 'POST'; // Define the HTTP method
  const token = await getDataFromStorage('Accesstoken');
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Cookie:
      'AWSALB=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+; AWSALBCORS=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+',
    'x-auth-token': token,
  };

  try {
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
    let result_offline = await getApiResponse(user_id, url, 'post', payload);
    return result_offline;
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

export const getAttendance = async ({ todate, fromDate }) => {
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
      context: 'cohort',
      contextId: cohortId,
      scope: 'Learner',
      toDate: todate,
      fromDate: fromDate,
      userId: userId,
    },
  };

  try {
    // const curlCommand = `
    // curl -X POST '${url}' \\
    // -H 'Content-Type: application/json' \\
    // -H 'Accept: application/json' \\
    // -H 'Authorization:  ${headers.Authorization}' \\
    // -H 'tenantId: ${headers.tenantId}' \\
    // -d '${JSON.stringify(payload)}'
    //     `;
    // console.log('cURL Command:', curlCommand);

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });

    if (result) {
      await storeApiResponse(userId, url, 'post', payload, result?.data?.data);
      return result?.data?.data;
    } else {
      let result_offline = await getApiResponse(userId, url, 'post', payload);
      return result_offline;
    }
  } catch (e) {
    let result_offline = await getApiResponse(userId, url, 'post', payload);
    return result_offline;
  }
};
export const LearningMaterialAPI = async () => {
  const user_id = await getDataFromStorage('userId'); // Ensure this is defined
  const tenantData = JSON.parse(await getDataFromStorage('tenantData'));
  const collectionFramework = tenantData?.[0]?.collectionFramework;
  const channelId = tenantData?.[0]?.channelId;
  const url = `${EndUrls.framework}${collectionFramework}`; // Define the URL
  try {
    const method = 'get'; // Define the HTTP method
    const headers = await getHeaders();

    // Construct the curl command
    // let curlCommand = `curl -X ${method.toUpperCase()} '${url}' \\\n`;
    // for (const [key, value] of Object.entries(headers || {})) {
    //   curlCommand += `-H '${key}: ${value}' \\\n`;
    // }
    // console.log('curlCom', curlCommand);

    // Make the actual request
    const result = await get(url, {
      headers: headers || {},
    });

    if (result) {
      await storeApiResponse(user_id, url, 'get', null, result?.data);
      return result?.data;
    } else {
      const result_offline = await getApiResponse(user_id, url, 'get', null);
      return result_offline;
    }
  } catch (e) {
    console.log('No internet available, retrieving offline data...');
    const result_offline = await getApiResponse(user_id, url, 'get', null);
    return result_offline;
  }
};

export const notificationSubscribe = async ({ deviceId, user_id, action }) => {
  try {
    const url = `${EndUrls.update_profile}/${user_id}`; // Define the URL
    const headers = await getHeaders(); // Ensure headers are awaited
    const payload = {
      userData: {
        deviceId: deviceId,
        action: action,
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

    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch (e) {
    return handleResponseException(e);
  }
};

export const filterContent = async ({ instantId }) => {
  const tenantData = JSON.parse(await getDataFromStorage('tenantData'));
  const collectionFramework = tenantData?.[0]?.collectionFramework;
  const channelId = tenantData?.[0]?.channelId;
  const url = `${EndUrls.filterContent}/${collectionFramework}`; // Define the URL
  try {
    const method = 'get'; // Define the HTTP method
    const headers = await getHeaders();

    // Construct the curl command
    let curlCommand = `curl -X ${method.toUpperCase()} '${url}' \\\n`;
    for (const [key, value] of Object.entries(headers || {})) {
      curlCommand += `-H '${key}: ${value}' \\\n`;
    }
    console.log('curlCom fetchTopics', curlCommand);

    // Make the actual request
    const result = await get(url, {
      headers: headers || {},
    });

    if (result) {
      return result?.data?.result;
    }
  } catch (e) {
    console.log('No internet available, retrieving offline data...', e);
  }
};

export const staticFilterContent = async ({ instantId }) => {
  const tenantData = JSON.parse(await getDataFromStorage('tenantData'));
  const collectionFramework = tenantData?.[0]?.collectionFramework;
  const channelId = tenantData?.[0]?.channelId;
  const url = `${EndUrls.staticFilterContent}`; // Define the URL
  const headers = await getHeaders();
  const payload = {
    request: {
      objectCategoryDefinition: {
        objectType: 'Collection',
        name: 'Course',
        channel: channelId,
      },
    },
  };
  try {
    const curlCommand = `
    curl -X POST '${url}' \\
    -H 'Content-Type: application/json' \\
    -H 'Accept: application/json' \\
    -d '${JSON.stringify(payload)}'
        `;
    console.log('cURL Command:', curlCommand);

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });

    if (result) {
      return result?.data?.result;
    }
  } catch (e) {
    console.log('e', e);
  }
};
export const CourseEnrollStatus = async ({ course_id }) => {
  const url = `${EndUrls.courseEnrollStatus}`; // Define the URL
  const headers = await getHeaders();
  const headersString = Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(' ');

  const user_id = await getDataFromStorage('userId');
  const payload = {
    userId: user_id,
    courseId: course_id,
  };
  try {
    const curlCommand = `curl -X POST ${headersString} -d '${JSON.stringify(
      payload
    )}' ${url}`;

    console.log('cURL Command:', curlCommand);

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });

    if (result) {
      await storeApiResponse(user_id, url, 'post', payload, result?.data);
      return result?.data;
    } else {
      const result_offline = await getApiResponse(
        user_id,
        url,
        'post',
        payload
      );
      return result_offline;
    }
  } catch (e) {
    console.log('e', e);
    const result_offline = await getApiResponse(user_id, url, 'post', payload);
    return result_offline;
  }
};
export const courseEnroll = async ({ course_id }) => {
  const url = `${EndUrls.courseEnroll}`; // Define the URL
  const headers = await getHeaders();
  const headersString = Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(' ');

  const user_id = await getDataFromStorage('userId');
  const payload = {
    userId: user_id,
    courseId: course_id,
  };
  try {
    const curlCommand = `curl -X POST ${headersString} -d '${JSON.stringify(
      payload
    )}' ${url}`;

    console.log('cURL Command:', curlCommand);

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });

    if (result) {
      return result?.data;
    }
  } catch (e) {
    console.log('e', e);
  }
};
export const updateCourseStatus = async ({ course_id, status }) => {
  const url = `${EndUrls.updateCourseStatus}`; // Define the URL
  const headers = await getHeaders();
  const headersString = Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(' ');

  const user_id = await getDataFromStorage('userId');
  const payload = {
    userId: user_id,
    courseId: course_id,
    ...(status && { status: status }),
  };
  try {
    const curlCommand = `curl -X POST ${headersString} -d '${JSON.stringify(
      payload
    )}' ${url}`;

    console.log('cURL Command:', curlCommand);

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });

    console.log('######### course inprogress:', JSON.stringify(result));

    if (result) {
      return result?.data;
    }
  } catch (e) {
    console.log('e', e);
  }
};
export const issueCertificate = async ({ payload }) => {
  const url = `${EndUrls.issueCertificate}`; // Define the URL
  const headers = await getHeaders();
  const headersString = Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(' ');

  try {
    const curlCommand = `curl -X POST ${headersString} -d '${JSON.stringify(
      payload
    )}' ${url}`;

    console.log('cURL Command:', curlCommand);

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });

    if (result) {
      return result?.data;
    }
  } catch (e) {
    console.log('e', e);
  }
};
export const viewCertificate = async ({ certificateId }) => {
  const url = `${EndUrls.viewCertificate}`; // Define the URL
  const headers = await getHeaders();
  const headersString = Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(' ');
  const user_id = await getDataFromStorage('userId');
  const template_id = await getDataFromStorage('templateId');

  const payload = {
    credentialId: certificateId,
    templateId: template_id,
  };

  try {
    const curlCommand = `curl -X POST ${headersString} -d '${JSON.stringify(
      payload
    )}' ${url}`;

    console.log('cURL Command:', curlCommand);

    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });

    if (result) {
      await storeApiResponse(user_id, url, 'post', payload, result?.data);
      return result?.data;
    } else {
      const result_offline = await getApiResponse(
        user_id,
        url,
        'post',
        payload
      );
      return result_offline;
    }
  } catch (e) {
    console.log('e', e);
    const result_offline = await getApiResponse(user_id, url, 'post', payload);
    return result_offline;
  }
};
export const enrollInterest = async (selectedIds) => {
  const url = `${EndUrls.enrollInterest}`; // Define the URL
  const headers = await getHeaders();
  const profileDetails = JSON.parse(await getDataFromStorage('profileData'))
    ?.getUserDetails?.[0];

  const customFields = profileDetails?.customFields.reduce(
    (acc, { label, selectedValues }) => {
      acc[label] = Array.isArray(selectedValues)
        ? selectedValues.map((item) => item?.value).join(', ')
        : selectedValues; // If not an array, assign directly

      return acc;
    },
    {}
  );
  const headersString = Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(' ');
  const payload = {
    first_name: profileDetails?.firstName,
    middle_name: profileDetails?.middleName ? profileDetails?.middleName : '',
    last_name: profileDetails?.lastName,
    mother_name: customFields?.MOTHER_NAME ? customFields?.MOTHER_NAME : '',
    gender: profileDetails?.gender,
    email_address: profileDetails?.email
      ? profileDetails?.email
      : 'test@tekditechnologies.com',
    dob: profileDetails?.dob,
    qualification:
      customFields?.HIGHEST_EDCATIONAL_QUALIFICATION_OR_LAST_PASSED_GRADE
        ? customFields?.HIGHEST_EDCATIONAL_QUALIFICATION_OR_LAST_PASSED_GRADE
        : '',
    phone_number: profileDetails?.mobile,
    state: customFields?.STATE ? customFields?.STATE : '',
    district: customFields?.DISTRICT ? customFields?.DISTRICT : '',
    block: customFields?.BLOCK ? customFields?.BLOCK : '',
    village: customFields?.VILLAGE ? customFields?.VILLAGE : '',
    blood_group: '',
    userId: profileDetails?.userId,
    enrollmentId: profileDetails?.enrollmentId || '',
    courseId: '',
    courseName: '',
    topicName: selectedIds?.label,
  };
  const curlCommand = `curl -X POST ${headersString} -d '${JSON.stringify(
    payload
  )}' ${url}`;
  console.log('cURL enrollInterest Command:', curlCommand);
  try {
    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });
    if (result) {
      return result?.data;
    }
  } catch (e) {
    console.log('e', e);
  }
};
export const telemetryTrackingData = async ({ telemetryPayloadData }) => {
  const url = `${EndUrls.telemetryTrackingData}`; // Define the URL
  const headers = await getHeaders();
  const profileDetails = JSON.parse(await getDataFromStorage('profileData'))
    ?.getUserDetails?.[0];

  const headersString = Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(' ');
  const payload = {
    id: 'api.sunbird.telemetry',
    ver: '3.0',
    params: {
      msgid: '35cfea6c3cf2b3de56fd03c9b52a8de1',
    },
    ets: telemetryPayloadData?.ets,
    events: [
      {
        eid: 'IMPRESSION',
        ets: telemetryPayloadData?.ets,
        ver: '3.0',
        mid: 'IMPRESSION:fc44e5d5f9549938db7cce963cc0d6ad',
        actor: {
          id: 'Anonymous',
          type: 'User',
        },
        context: {
          channel: 'pratham-learner-app',
          pdata: {
            id: 'pratham-learner-app',
            pid: '0.0.1',
            ver: 'pratham-learner-app',
          },
          env: telemetryPayloadData?.event,
          sid: profileDetails?.userId,
          did: '86d25010904db7eed2c034cfc7109b4c',
          cdata: [
            {
              id: profileDetails?.userId,
              type: 'UserSession',
            },
            {
              id: 'uuid',
              type: 'Device',
            },
          ],
          rollup: {},
          uid: profileDetails?.userId,
          userName: profileDetails?.username,
        },
        object: {},
        tags: [],
        edata: {
          type: telemetryPayloadData?.type,
          subtype: '',
          pageid: telemetryPayloadData?.event,
          uri: telemetryPayloadData?.event,
        },
      },
    ],
  };
  const curlCommand = `curl -X POST ${headersString} -d '${JSON.stringify(
    payload
  )}' ${url}`;
  console.log('cURL Command telemetryTrackingData:', curlCommand);
  try {
    // Make the actual request
    const result = await post(url, payload, {
      headers: headers || {},
    });
    if (result) {
      return result?.data;
    }
  } catch (e) {
    console.log('e', e);
  }
};
export const cohortSearch = async ({ customFields }) => {
  const token = await getDataFromStorage('Accesstoken');
  const academicYearId = await getDataFromStorage('academicYearId');
  const tenantId = await getDataFromStorage('userTenantid');

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    tenantid: tenantId,
    academicyearid: academicYearId,
  };

  const url = `${EndUrls.cohortSearch}`;
  const headersString = Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(' ');
  const payload = {
    limit: 10,
    offset: 0,
    filters: {
      state: customFields?.STATE,
      district: customFields?.DISTRICT,
      // block: customFields?.BLOCK,
      // village: customFields?.VILLAGE,
    },
  };

  const curlCommand = `curl -X POST ${headersString} -d '${JSON.stringify(
    payload
  )}' ${url}`;
  console.log('cURL Command:', curlCommand);

  try {
    const result = await post(url, payload, { headers });
    return result?.data?.result;
  } catch (e) {
    if (e?.response?.data) {
      return e.response.data;
    }

    return { error: true, message: e.message || 'Unknown error' };
  }
};

export const downloadCertificate = async ({
  certificateId,
  certificateName,
}) => {
  const url = `${EndUrls.downloadCertificate}`; // Define the URL
  const headers = await getHeaders();
  console.log('### certificate certificateId', certificateId);
  const user_id = await getDataFromStorage('userId'); // Ensure this is defined
  const template_id = await getDataFromStorage('templateId');

  const payload = {
    credentialId: certificateId,
    templateId: template_id,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: headers || {},
      responseType: 'arraybuffer', // Ensures we get binary data
    });
    console.log('### certificate response', response);
    const data = response?.request?._response;
    console.log('data', data);

    const base64Data = data; // Base64 string from API
    const fileName = `${certificateName}_${user_id}.pdf`;
    const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    await RNFS.writeFile(path, base64Data, 'base64');
    Alert.alert('Success', `PDF saved at ${path}`);
    console.log('PDF downloaded to:', path);
    return true;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    Alert.alert('Error', 'Failed to download PDF');
    return true;
  }
};
export const shareCertificate = async ({ certificateId }) => {
  const url = `${EndUrls.downloadCertificate}`; // Define the URL
  const headers = await getHeaders();
  const template_id = await getDataFromStorage('templateId');
  const payload = {
    credentialId: certificateId,
    templateId: template_id,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: headers || {},
      responseType: 'arraybuffer', // Ensures we get binary data
    });
    const data = response?.request?._response;
    return data;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return true;
  }
};
