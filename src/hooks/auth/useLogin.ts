import Cookies from "js-cookie"

import { authService } from "../../services"

export const useLogin = () => {
  const login = async (username: string, password: string, token?: string) => {
    const user = await authService.login(username, password, undefined, token)
    if (user) {
      Cookies.set("currentUser", JSON.stringify(user.data))
    }
    return user
  }

  return { login }
}
