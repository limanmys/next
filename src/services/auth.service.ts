import axios, { AxiosInstance } from "axios"

export class AuthService {
  protected readonly instance: AxiosInstance
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
  }

  login = (
    email: string,
    password: string,
    newPassword?: string,
    token?: string,
    type = "liman"
  ) => {
    if (newPassword) {
      return this.instance.post("/change_password", {
        email,
        password,
        new_password: newPassword,
        type,
      })
    }

    return this.instance.post("/login", {
      email,
      password,
      token,
      type,
    })
  }

  saveTwoFactorToken = (secret: string, username: string, password: string) => {
    return this.instance.post("/setup_mfa", {
      secret,
      email: username,
      password,
    })
  }

  logout = () => {
    return this.instance.post("/logout")
  }
}
