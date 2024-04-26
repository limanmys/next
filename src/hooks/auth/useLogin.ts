import { authService } from "../../services"

export const useLogin = () => {
  const login = async (username: string, password: string, token?: string, type = "liman") => {
    const user = await authService.login(username, password, undefined, token, type)
    return user
  }

  return { login }
}
