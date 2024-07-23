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
