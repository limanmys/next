// @ts-nocheck

import { clsx, type ClassValue } from "clsx"
import { UseFormReturn } from "react-hook-form"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime() //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0 //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export function setFormErrors(e: Error, form: UseFormReturn<any>) {
  if (e.response && e.response.status === 422) {
    Object.keys(e.response.data).forEach((key) => {
      form.setError(key as keyof typeof values, {
        type: "manual",
        message: e.response.data[key],
      })
    })

    return true
  }

  return false
}
