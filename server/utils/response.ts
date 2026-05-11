export type ApiResponse<T = any> = {
  code: number
  message: string
  data: T | null
}

export function success<T>(data: T, message: string = 'success'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
  }
}

export function error(message: string, code: number = 9999): ApiResponse<null> {
  return {
    code,
    message,
    data: null,
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: 1001,
  TOKEN_EXPIRED: 1002,
  FORBIDDEN: 1003,
  BAD_REQUEST: 2001,
  NOT_FOUND: 2002,
  ALREADY_EXISTS: 2003,
  USER_NOT_FOUND: 3001,
  WRONG_PASSWORD: 3002,
  USER_BANNED: 3003,
  PET_NOT_FOUND: 4001,
  PET_OFFLINE: 4002,
  ADOPTION_EXISTS: 5001,
  ADOPTION_STATUS_ERROR: 5002,
  TOO_MANY_REQUESTS: 4290,
  SYSTEM_ERROR: 9999,
} as const
