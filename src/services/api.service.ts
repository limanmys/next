import axios, { AxiosInstance } from "axios"

import { getAuthorizationHeader } from "@/lib/utils"

export class ApiService {
  protected readonly instance: AxiosInstance
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAuthorizationHeader(),
      },
    })

    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (error.response.status === 401) {
          window.location.href = "/auth/login"
        }
        if (error.response.status === 504) {
          window.location.href = "/504"
        }
        return Promise.reject(error)
      }
    )
  }

  getInstance = () => {
    this.instance.defaults.headers.authorization = getAuthorizationHeader()
      .Authorization as string

    return this.instance
  }
}
