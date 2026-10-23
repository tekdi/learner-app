import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EndUrls from './EndUrls'

// Access token is otherwise refreshed only on cold start (LanguageScreen), so a
// session resumed from background keeps sending an expired token and APIs like
// targetedSolutions fail silently until the user logs in again (PS-7466).
// On a 401, refresh the token once and retry the original request.
type RefreshResult = { accessToken: string | null; rejected: boolean }
let refreshPromise: Promise<RefreshResult> | null = null

// Called when the server rejects the refresh token (expired/revoked). Registered by
// sessionManager, which logs the user out. Kept as a callback to avoid an import cycle.
let onSessionExpired: (() => void) | null = null
export const setSessionExpiredHandler = (handler: (() => void) | null) => {
  onSessionExpired = handler
}

const requestNewTokens = async (): Promise<RefreshResult> => {
  const refresh_token = await AsyncStorage.getItem('refreshToken')
  if (!refresh_token) return { accessToken: null, rejected: false }
  try {
    // Same headers as refreshToken() in AuthService
    const token = await AsyncStorage.getItem('Accesstoken')
    let tenantId
    try {
      tenantId = JSON.parse((await AsyncStorage.getItem('tenantData')) || '[]')?.[0]?.tenantId
    } catch (e) {}
    const result = await axios.post(
      EndUrls.refresh_token,
      { refresh_token },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          tenantId: `${tenantId}`,
        },
        _skipAuthRefresh: true,
      } as any
    )
    const access_token = result?.data?.result?.access_token
    if (!access_token) return { accessToken: null, rejected: false }
    await AsyncStorage.setItem('Accesstoken', access_token)
    if (result?.data?.result?.refresh_token) {
      await AsyncStorage.setItem('refreshToken', result.data.result.refresh_token)
    }
    console.log("check refreshtoken",JSON.stringify(result?.data?.result));
    return { accessToken: access_token, rejected: false }
  } catch (e: any) {
    const status = e?.response?.status
    // Log the status only: the error's config.data contains the refresh token.
    console.log('refreshAccessToken failed', status ?? e?.message)
    const rejected = status === 400 || status === 401 || status === 403
    if (rejected) onSessionExpired?.()
    return { accessToken: null, rejected }
  }
}

/**
 * Exchanges the stored refresh token for a new access + refresh token pair and stores both.
 * `rejected` is true when the server refused the refresh token (the session-expired handler
 * has then logged the user out). Network errors (offline) are not a rejection and leave the
 * stored tokens untouched. Concurrent callers (401 retries, app launch, the 30s check) share
 * one request, so a rotated refresh token is never sent twice.
 */
export const refreshSession = (): Promise<RefreshResult> => {
  if (!refreshPromise) {
    refreshPromise = requestNewTokens().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

/** Same as refreshSession(), returning only the new access token (null on failure). */
export const refreshAccessToken = async (): Promise<string | null> =>
  (await refreshSession()).accessToken

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config: any = error?.config
    if (
      error?.response?.status !== 401 ||
      !config ||
      config._retry ||
      config._skipAuthRefresh ||
      config.url === EndUrls.refresh_token ||
      config.url === EndUrls.login
    ) {
      return Promise.reject(error)
    }
    // Only retry requests that were authenticated with the stored access token
    const authHeader = config.headers?.Authorization ?? config.headers?.authorization
    const xAuthHeader = config.headers?.['x-auth-token']
    const sentToken = xAuthHeader || authHeader?.replace?.(/^Bearer /, '')
    const storedToken = await AsyncStorage.getItem('Accesstoken')
    if (!sentToken || !storedToken) return Promise.reject(error)

    let newToken: string | null = storedToken
    if (sentToken === storedToken) {
      newToken = await refreshAccessToken()
    }
    // else: token was already refreshed by a parallel request, just retry
    if (!newToken) return Promise.reject(error)

    config._retry = true
    if (authHeader) config.headers.Authorization = `Bearer ${newToken}`
    if (xAuthHeader) config.headers['x-auth-token'] = newToken
    return axios(config)
  }
)

// Same 401 → refresh → retry for the few calls that use fetch directly (ATM answer-sheet
// submit, ImageAPIService). Only requests sent with the stored access token are retried.
const originalFetch = global.fetch
if (originalFetch && !(originalFetch as any)._authRefreshPatched) {
  const patchedFetch = async (input: any, init: any = {}) => {
    const response = await originalFetch(input, init)
    if (response.status !== 401 || typeof input !== 'string' || input === EndUrls.refresh_token) {
      return response
    }
    const headers = new Headers(init.headers)
    const sentToken =
      headers.get('x-auth-token') || headers.get('Authorization')?.replace(/^Bearer /, '')
    const storedToken = await AsyncStorage.getItem('Accesstoken')
    if (!sentToken || !storedToken) return response

    // Token already refreshed by a parallel request: just retry with it.
    const newToken = sentToken === storedToken ? await refreshAccessToken() : storedToken
    if (!newToken) return response

    if (headers.get('Authorization')) headers.set('Authorization', `Bearer ${newToken}`)
    if (headers.get('x-auth-token')) headers.set('x-auth-token', newToken)
    return originalFetch(input, { ...init, headers })
  }
  ;(patchedFetch as any)._authRefreshPatched = true
  global.fetch = patchedFetch as typeof fetch
}



export async function get(url: string, headers: any = {}) {
  return await axios.get(url, {
    ...headers,
    headers: {
      ...headers?.headers,
    }
  })
}

export async function post(
  url: string,
  body: any,
  headers: any = {},
  onUploadProgress: any = {}
) {
  return await axios.post(url, body, {
    ...headers,
    headers: {
      ...headers?.headers,
    },
    onUploadProgress
  })
}

export async function update(url: string, body: any, headers: any = {}) {
  return await axios.put(url, body, {
    ...headers,
    headers: {
      ...headers?.headers,
    }
  })
}

export async function destroy(url: string, body: any, headers: any = {}) {
  return await axios.delete(url, {
    headers: {
      ...headers?.headers,
    },
    data: body
  })
}

export async function patch(url: string, body: any, headers: any = {}) {
  return await axios.patch(url, body, {
    ...headers,
    headers: {
      ...headers?.headers,
    }
  })
}

export const handleResponseException = (obj: any) => {
  const { response, message } = obj
  return {
    status: response?.status ? response?.status : 404,
    error: response?.data?.message ? response?.data?.message : message,
    ...(response ? response?.data : response)
  }
}

