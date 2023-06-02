import { useEffect, useState } from "react"
import { authService } from "@/services"
import Cookies from "js-cookie"

import { IUser } from "@/types/user"

export const useCurrentUser = () => {
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    const currentUser = Cookies.get("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  return { user }
}
