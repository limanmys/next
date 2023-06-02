import Cookies from "js-cookie"

import { authService } from "../../services"

export const useLogin = () => {
  const login = async (username: string, password: string) => {
    const user = await authService.login(username, password)
    if (user) {
      Cookies.set("currentUser", JSON.stringify(user.data))
    }
    return user
  }

  return { login }
}
