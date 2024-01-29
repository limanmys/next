import axios, { AxiosInstance } from "axios"

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

    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          window.location.href =
            "/auth/login?redirect=" + window.location.pathname
        }
        if (error.response && error.response.status === 504) {
          window.location.href = "/504"
        }
        return Promise.reject(error)
      }
    )
  }

  getInstance = () => {
    this.instance.defaults.headers["x-language"] =
      localStorage.getItem("LANGUAGE") || "tr"

    return this.instance
  }
}
