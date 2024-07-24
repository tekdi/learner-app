import EndUrls from './EndUrls';
import axios from 'axios';

export const getAccessToken = async () => {
  const url = EndUrls.get_token;
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
        //console.log(response?.data?.result?.access_token);
        api_response = response.data.result.access_token;
      }
    })
    .catch((error) => {
      //console.log(error);
    });
  return api_response;
};

//read content
export const readContent = async (content_do_id) => {
  const url =
    EndUrls.read_content +
    content_do_id +
    `?fields=transcripts,ageGroup,appIcon,artifactUrl,attributions,attributions,audience,author,badgeAssertions,board,body,channel,code,concepts,contentCredits,contentType,contributors,copyright,copyrightYear,createdBy,createdOn,creator,creators,description,displayScore,domain,editorState,flagReasons,flaggedBy,flags,framework,gradeLevel,identifier,itemSetPreviewUrl,keywords,language,languageCode,lastUpdatedOn,license,mediaType,medium,mimeType,name,originData,osId,owner,pkgVersion,publisher,questions,resourceType,scoreDisplayConfig,status,streamingUrl,subject,template,templateId,totalQuestions,totalScore,versionKey,visibility,year,primaryCategory,additionalCategories,interceptionPoints,interceptionType`;

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
      //console.log(JSON.stringify(response.data));
      api_response = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return api_response;
};

//hierarchy content
export const hierarchyContent = async (content_do_id) => {
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
      //console.log(JSON.stringify(response.data));
      api_response = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return api_response;
};
