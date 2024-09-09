import { useEffect, useState } from "react"
import Cookies from "js-cookie"

import { IUser } from "@/types/user"

const defaultUserObject: IUser = {
  name: "",
  status: 1,
  permissions: {
    server_details: true,
    server_services: true,
    add_server: true,
    update_server: true,
    view_logs: true,
    view: {
      sidebar: "servers",
    },
  },
} as IUser

export function getCurrentUser(): IUser {
  const currentUser = Cookies.get("currentUser")
  if (!currentUser) return defaultUserObject
  return JSON.parse(
    currentUser || `{ "user": ${JSON.stringify(defaultUserObject)} }`
  ).user
}

export function useCurrentUser(): IUser {
  const [currentUser, setCurrentUser] = useState<IUser>(() => getCurrentUser())

  useEffect(() => {
    const updatedUser = getCurrentUser()
    setCurrentUser(updatedUser)
  }, [])

  return currentUser
}
