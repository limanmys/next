import { authService } from "@/services"

export const useLogout = () => {
  const logout = () => {
    return authService.logout()
  }

  return { logout }
}
