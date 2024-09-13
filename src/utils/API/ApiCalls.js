import EndUrls from './EndUrls';
import axios from 'axios';
import uuid from 'react-native-uuid';
import { getApiResponse, storeApiResponse } from './AuthService';
import { getDataFromStorage } from '../JsHelper/Helper';

export const getAccessToken = async () => {
  const url = EndUrls.login;
  let data = JSON.stringify({
    username: 'test1',
    password: '12345',
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
    data: data,
  };

  let api_response = null;

  await axios
    .request(config)
    .then((response) => {
      if (response?.data?.result?.access_token) {
        api_response = response.data.result.access_token;
      }
    })
    .catch((error) => {});
  return api_response;
};

//read content
export const readContent = async (content_do_id) => {
  const url =
    EndUrls.read_content +
    content_do_id +
    `?fields=transcripts,ageGroup,appIcon,artifactUrl,downloadUrl,attributions,attributions,audience,author,badgeAssertions,board,body,channel,code,concepts,contentCredits,contentType,contributors,copyright,copyrightYear,createdBy,createdOn,creator,creators,description,displayScore,domain,editorState,flagReasons,flaggedBy,flags,framework,gradeLevel,identifier,itemSetPreviewUrl,keywords,language,languageCode,lastUpdatedOn,license,mediaType,medium,mimeType,name,originData,osId,owner,pkgVersion,publisher,questions,resourceType,scoreDisplayConfig,status,streamingUrl,subject,template,templateId,totalQuestions,totalScore,versionKey,visibility,year,primaryCategory,additionalCategories,interceptionPoints,interceptionType&orgdetails=orgName,email&licenseDetails=name,description,url`;

  let api_response = null;

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };

  await axios
    .request(config)
    .then((response) => {
      api_response = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return api_response;
};

//hierarchy content
export const hierarchyContent = async (content_do_id) => {
  console.log({ content_do_id });
  const url = EndUrls.hierarchy_content + content_do_id;

  let api_response = null;

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };

  await axios
    .request(config)
    .then((response) => {
      api_response = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return api_response;
};
export const courseDetails = async (content_do_id) => {
  const user_id = await getDataFromStorage('userId'); // Ensure this is defined
  const url = `${EndUrls.course_details}${content_do_id}`;
  let api_response = null;

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.request(config);
    api_response = response.data;
    if (api_response) {
      await storeApiResponse(user_id, url, 'get', null, api_response);
      return api_response;
    } else {
      const result_offline = await getApiResponse(user_id, url, 'get', null);
      return result_offline;
    }
  } catch (error) {
    console.log('No internet available, retrieving offline data...');
    const result_offline = await getApiResponse(user_id, url, 'get', null);
    return result_offline;
  }
};
//list question
export const listQuestion = async (url, identifiers) => {
  let data = JSON.stringify({
    request: {
      search: {
        identifier: identifiers,
      },
    },
  });

  let api_response = null;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Content-Type': 'application/json',
      Connection: 'keep-alive',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
    },
    data: data,
  };

  await axios
    .request(config)
    .then((response) => {
      api_response = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return api_response;
};

export const assessmentTracking = async (
  scoreDetailsString,
  identifierWithoutImg,
  maxScore,
  seconds,
  userId,
  batchId,
  lastAttemptedOn
) => {
  const attemptId = uuid.v4();
  let scoreDetails;
  try {
    scoreDetails = scoreDetailsString;
  } catch (e) {
    console.error('Error parsing scoreDetails string', e);
    throw new Error('Invalid scoreDetails format');
  }

  // Calculate the total score
  let totalScore = 0;
  if (Array.isArray(scoreDetails)) {
    totalScore = scoreDetails.reduce((sectionTotal, section) => {
      const sectionScore = section.data.reduce((itemTotal, item) => {
        return itemTotal + (item.score || 0);
      }, 0);
      return sectionTotal + sectionScore;
    }, 0);
  } else {
    console.error('Parsed scoreDetails is not an array');
    throw new Error('Invalid scoreDetails format');
  }

  try {
    const url = EndUrls.AssessmentCreate;

    let data = JSON.stringify({
      userId: userId,
      courseId: identifierWithoutImg,
      batchId: batchId,
      contentId: identifierWithoutImg,
      attemptId: attemptId,
      assessmentSummary: scoreDetailsString,
      totalMaxScore: maxScore || 0,
      totalScore: totalScore || 0,
      lastAttemptedOn: lastAttemptedOn,
      timeSpent: seconds || 0,
    });

    let api_response = null;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        Cookie:
          'AWSALB=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+; AWSALBCORS=QVc9G+7LKggb8zF3qcLslwzgKzrKMO8SR2IhHCuIOYqAWLb7Z8j/dQsgOgAcWzoHng47JkYeBVsERcq2LH1Uqrcw371BlDe3KXU84ewyOlTU2Gxi9KwnIGIRKHW+',
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        api_response = { response: response.data, data: data };
      })
      .catch((error) => {
        console.log('error', error);
      });
    return api_response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Assessment Submission Failed'
    );
  }
};

export const telemetryTracking = async (telemetryObject) => {
  try {
    let ets = telemetryObject[telemetryObject.length - 1]?.ets;
    const msgid = uuid.v4();
    let payload = {
      id: 'api.sunbird.telemetry',
      ver: '3.0',
      params: {
        msgid: msgid,
      },
      ets: ets,
      events: telemetryObject,
    };
    const url = EndUrls.telemetryTracking;

    let data = JSON.stringify(payload);
    // console.log('url', url);
    // console.log('data', data);

    let api_response = null;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    // console.log('config', config);
    // console.log('data', data);

    await axios
      .request(config)
      .then((response) => {
        //console.log(JSON.stringify(response.data));
        api_response = { response: response.data };
      })
      .catch((error) => {
        console.log('error', error);
      });
    return api_response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Telemetry Submission Failed'
    );
  }
};

export const contentTracking = async (
  userId,
  courseId,
  batchId,
  contentId,
  contentType,
  contentMime,
  lastAccessOn,
  detailsObject
) => {
  try {
    const url = EndUrls.ContentCreate;

    let data = JSON.stringify({
      userId: userId,
      courseId: courseId,
      batchId: batchId,
      contentId: contentId,
      contentType: contentType,
      contentMime: contentMime,
      lastAccessOn: lastAccessOn,
      detailsObject: detailsObject,
    });

    let api_response = null;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        api_response = { response: response.data };
      })
      .catch((error) => {
        console.log('error', error);
      });
    return api_response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Content Submission Failed'
    );
  }
};
