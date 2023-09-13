import { useEffect, useState } from "react"
import Cookies from "js-cookie"

import { IUser } from "@/types/user"

const defaultUserObject: IUser = {
  status: 1,
  permissions: {
    server_details: true,
    server_services: true,
    add_server: true,
    update_server: true,
    view_logs: true,
  },
} as IUser

export function getCurrentUser(): IUser {
  const currentUser = Cookies.get("currentUser")
  if (!currentUser) return defaultUserObject
  return JSON.parse(currentUser || { user: defaultUserObject }).user
}

export function useCurrentUser(): IUser {
  const [currentUser, setCurrentUser] = useState<IUser>(defaultUserObject)

  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [])

  return currentUser as IUser
}
