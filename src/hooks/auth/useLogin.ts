import { authService } from "../../services"

export const useLogin = () => {
  const login = async (username: string, password: string, token?: string) => {
    const user = await authService.login(username, password, undefined, token)
    return user
  }

  return { login }
}
