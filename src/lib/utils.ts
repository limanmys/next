import { clsx, type ClassValue } from "clsx"
import Cookies from "js-cookie"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAuthorizationHeader() {
  const currentUser = Cookies.get("currentUser")

  if (!currentUser) return {}
  return {
    Authorization: `Bearer ${
      JSON.parse(currentUser || "")?.access_token || ""
    }`,
  }
}

export function compareNumericString(rowA: any, rowB: any, id: any) {
  let a = Number.parseFloat(rowA.original[id])
  let b = Number.parseFloat(rowB.original[id])
  if (Number.isNaN(a)) a = 0
  if (Number.isNaN(b)) b = 0
  if (a > b) return 1
  if (a < b) return -1
  return 0
}
