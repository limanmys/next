"use client"

import { useCallback, useEffect, useState } from "react"

// Global type declaration for SefChat
declare global {
  interface Window {
    SefChat?: {
      init: (config: {
        baseUrl: string
        position: string
        width: number
        height: number
        buttonColor: string
      }) => void
    }
  }
}

export default function SefWidget() {
  const [widgetLoaded, setWidgetLoaded] = useState(false)

  const loadWidget = useCallback(() => {
    if (typeof window === "undefined") return

    const sefUrl = process.env.NEXT_PUBLIC_SEF_URL
    if (!sefUrl) {
      console.warn("NEXT_PUBLIC_SEF_URL is not defined")
      return
    }

    // Widget zaten yüklü ve init edilmiş mi kontrol et
    const existingFab = document.getElementById("sef-chat-fab")
    const existingPopover = document.getElementById("sef-chat-popover")

    if (window.SefChat && existingFab && existingPopover) {
      console.log("Widget already fully initialized")
      setWidgetLoaded(true)
      return
    }

    // Widget global'de var ama DOM'da yok, init et
    if (window.SefChat) {
      console.log("SefChat exists, initializing...")
      try {
        window.SefChat.init({
          baseUrl: sefUrl,
          position: "bottom-right",
          width: 400,
          height: 600,
          buttonColor: "oklch(0.21 0.006 285.885)",
        })
        setWidgetLoaded(true)
        console.log("Widget initialized successfully")
      } catch (error) {
        console.error("Widget init error:", error)
      }
      return
    }

    // Script zaten var mı kontrol et
    const existingScript =
      document.querySelector(`script[src="${sefUrl}/chat-widget.js"]`) ||
      document.querySelector("script#sef-chat-widget-script")

    if (existingScript) {
      console.log("Script exists, waiting for SefChat...")
      // Polling ile widget'ı bekle
      let attempts = 0
      const maxAttempts = 50 // 5 saniye
      const checkInterval = setInterval(() => {
        attempts++
        if (window.SefChat) {
          console.log("SefChat found after", attempts * 100, "ms")
          clearInterval(checkInterval)
          try {
            window.SefChat.init({
              baseUrl: sefUrl,
              position: "bottom-right",
              width: 400,
              height: 600,
              buttonColor: "oklch(0.21 0.006 285.885)",
            })
            setWidgetLoaded(true)
            console.log("Widget initialized successfully")
          } catch (error) {
            console.error("Widget init error:", error)
          }
        } else if (attempts >= maxAttempts) {
          console.error("Timeout waiting for SefChat")
          clearInterval(checkInterval)
        }
      }, 100)
      return
    }

    // Yeni script ekle
    console.log("Loading widget script...")
    const script = document.createElement("script")
    script.src = `${sefUrl}/chat-widget.js`
    script.id = "sef-chat-widget-script"

    script.onload = () => {
      console.log("Script loaded, checking for SefChat...")
      // Script yüklendi, widget'ı bekle
      let attempts = 0
      const maxAttempts = 30
      const checkInterval = setInterval(() => {
        attempts++
        if (window.SefChat) {
          console.log("SefChat initialized successfully")
          clearInterval(checkInterval)
          try {
            window.SefChat.init({
              baseUrl: sefUrl,
              position: "bottom-right",
              width: 400,
              height: 600,
              buttonColor: "oklch(0.21 0.006 285.885)",
            })
            setWidgetLoaded(true)
            console.log("Widget fully ready")
          } catch (error) {
            console.error("Widget init error:", error)
          }
        } else if (attempts >= maxAttempts) {
          console.error("SefChat not found after script load")
          clearInterval(checkInterval)
        }
      }, 100)
    }

    script.onerror = (error) => {
      console.error("Failed to load chat widget script:", error)
    }

    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    loadWidget()
  }, [loadWidget])

  return null
}
