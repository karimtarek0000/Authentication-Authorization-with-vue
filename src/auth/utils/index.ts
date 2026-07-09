import { AxiosError } from 'axios'

export const handleError = (error: AxiosError) => {
  // if (error instanceof AxiosError) {
  //   if (error.response?.status === 429) {
  //     return Promise.reject(new Error('Too many attempts, please try again later'))
  //   }
  //   if (error.response?.status === 423) {
  //     return Promise.reject(new Error('Account is locked, please contact support'))
  //   }
  //   if (error.response?.status === 401) {
  //     return Promise.reject(new Error('Email or password is incorrect'))
  //   }
  // }

  return Promise.reject(new Error(error?.message || 'An error occurred, please try again'))
}
