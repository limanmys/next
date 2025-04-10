import axios, { AxiosInstance } from "axios"

import { useLogout } from "@/hooks/auth/useLogout"

export class ApiService {
  protected readonly instance: AxiosInstance
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    this.instance.interceptors.request.use((config) => {
      config.headers["x-language"] = localStorage.getItem("LANGUAGE") || "tr"
      return config
    })

    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          if (window.location.pathname == "/auth/login") {
            return Promise.reject(error)
          }

          const { logout } = useLogout()

          if (window.$setAuthDialog) {
            logout().finally(() => {
              window.$setAuthDialog(true)
            })
          } else {
            logout().finally(() => {
              window.location.href =
                "/auth/login?redirect=" + window.location.pathname
            })
          }
        }
        if (error.response && error.response.status === 504) {
          window.location.href = "/504"
        }
        return Promise.reject(error)
      }
    )
  }

  /**
   * DEPRECATED
   * @returns AxiosInstance
   */
  getInstance = () => {
    return this.instance
  }
}
