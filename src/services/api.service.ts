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
  }

  getInstance = () => {
    this.instance.defaults.headers.authorization = getAuthorizationHeader()
      .Authorization as string
    return this.instance
  }
}
