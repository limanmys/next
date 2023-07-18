"use client"

import { useEffect, useState } from "react"

export default function DateTimeView() {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 15000)
    return () => clearInterval(timer)
  })

  return (
    <>
      {date.toLocaleString("tr-TR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </>
  )
}
