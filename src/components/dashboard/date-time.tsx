"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function DateTimeView() {
  const [date, setDate] = useState(new Date())
  const { i18n } = useTranslation()

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 15000)
    return () => clearInterval(timer)
  })

  return (
    <>
      {date.toLocaleString(i18n.language, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </>
  )
}
