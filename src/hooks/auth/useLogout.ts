import { authService } from "@/services"
import Cookies from "js-cookie"

export const useLogout = () => {
  const logout = () => {
    authService.logout()
    Cookies.remove("currentUser")
  }

  return { logout }
}
