import { http } from "@/services"
import autoAnimate from "@formkit/auto-animate"
import { ArrowLeft } from "lucide-react"
import { useTheme } from "next-themes"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useReducer, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "../ui/button"
import { Icons } from "../ui/icons"
import Loading from "../ui/loading"

export default function ExtensionRenderer() {
  const router = useRouter()
  const [key, forceUpdate] = useReducer((x) => x + 1, 0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>()
  const container = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const [title, setTitle] = useState<string>("")

  const deleteAllIframes = (node: HTMLDivElement) => {
    const iframes = node.querySelectorAll("iframe")
    iframes.forEach((iframe) => iframe.remove())
  }

  useEffect(() => {
    if (
      !container.current ||
      !router.query.server_id ||
      !router.query.extension_id
    ) {
      return
    }
    autoAnimate(container.current)

    setLoading(true)
    deleteAllIframes(container.current)

    if (
      container.current &&
      container.current.querySelectorAll("iframe").length === 0
    ) {
      let slug = ""
      if (router.query.slug) {
        // check if router.query.slug is array
        if (Array.isArray(router.query.slug)) {
          slug = router.query.slug.join("/")
        } else {
          slug = router.query.slug
        }
      }

      // Add browser search queries to the slug
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.toString()) {
        slug += `?${searchParams.toString()}`
      }

      http
        .post(
          `/servers/${router.query.server_id}/extensions/${router.query.extension_id}/${slug}`
        )
        .then((res) => {
          deleteAllIframes(container.current as HTMLDivElement)

          if (res.status === 201) {
            setError(res.data)
            setLoading(false)
          }

          const iframeElement = document.createElement("iframe")
          container.current!.appendChild(iframeElement)
          iframeElement.style.width = "0px"
          iframeElement.style.height = "0px"
          iframeElement.setAttribute("allowtransparency", "true")
          iframeElement.setAttribute("allowTransparency", "true")
          iframeElement.style.backgroundColor = "transparent"
          const iframeDoc = iframeElement.contentDocument
          if (iframeDoc) {
            iframeDoc.open()
            iframeDoc.write(res.data.html)
            setTitle(
              `${res.data.extension_name} - ${res.data.server_name} | Liman`
            )
            iframeDoc.close()

            const colorSchemeMeta = document.createElement("meta")
            colorSchemeMeta.setAttribute("name", "color-scheme")
            colorSchemeMeta.setAttribute("content", theme ? theme : "light")

            iframeDoc.head.appendChild(colorSchemeMeta)

            const themeColor = document.createElement("meta")
            themeColor.setAttribute("name", "theme-color")
            themeColor.setAttribute(
              "content",
              theme ? (theme === "dark" ? "#030711" : "#ffffff") : "#ffffff"
            )

            iframeDoc.head.appendChild(themeColor)
          }

          iframeElement.onload = () => {
            if (iframeElement.contentWindow) {
              iframeElement.contentWindow.window.location.hash =
                window.location.hash.split("#/")[1] || "#/"
              iframeElement.style.width = "100%"
              iframeElement.style.height = "var(--container-height)"

              setError(false)
              setLoading(false)
            }
          }

          if (iframeElement.contentWindow) {
            iframeElement.contentWindow.addEventListener("beforeunload", () => {
              forceUpdate()
            })

            iframeElement.contentWindow.addEventListener(
              "limanHashChange",
              function (e: any) {
                // Change the hash of the parent window with e.detail data
                window.location.hash = e.detail
              }
            )
          }

          const onHashChanged = () => {
            iframeElement &&
              iframeElement.contentWindow &&
              (iframeElement.contentWindow.window.location.hash =
                window.location.hash.split("#/")[1] || "#/")
          }

          window.addEventListener("hashchange", onHashChanged)

          window.addEventListener("liman:extension-reload", forceUpdate)

          return () => {
            window.removeEventListener("hashchange", onHashChanged)
            window.removeEventListener("liman:extension-reload", forceUpdate)
          }
        })
        .catch((err) => {
          deleteAllIframes(container.current as HTMLDivElement)

          if (err.response && err.response.status === 406) {
            router.push(
              `/servers/${router.query.server_id}/settings/${router.query.extension_id}`
            )
            return
          }

          setError(err.response.data || err.response)
          setLoading(false)
        })
    }
  }, [
    router.query.server_id,
    router.query.extension_id,
    router.query.slug,
    container.current,
    i18n.language,
    key,
  ])

  useEffect(() => {
    if (container.current) {
      const iframes = container.current.querySelectorAll("iframe")
      iframes.forEach((iframe) => {
        if (iframe.contentDocument) {
          iframe.contentDocument
            .querySelector("[name='color-scheme']")
            ?.remove()
          iframe.contentDocument.querySelector("[name='theme-color']")?.remove()

          const colorSchemeMeta = document.createElement("meta")
          colorSchemeMeta.setAttribute("name", "color-scheme")
          colorSchemeMeta.setAttribute("content", theme ? theme : "light")

          iframe.contentDocument.head.appendChild(colorSchemeMeta)

          const themeColor = document.createElement("meta")
          themeColor.setAttribute("name", "theme-color")
          themeColor.setAttribute(
            "content",
            theme ? (theme === "dark" ? "#030711" : "#ffffff") : "#ffffff"
          )

          iframe.contentDocument.head.appendChild(themeColor)
        }
      })
    }
  }, [theme])

  useEffect(() => {
    window.addEventListener(
      "message",
      (
        e: MessageEvent<{
          type: string
          data: string
        }>
      ) => {
        if (!e.data || !e.data.type) return

        if (e.data.type !== "setSearchParams") return

        // Set search params to the browser from e.data.data
        const searchParams = new URLSearchParams(e.data.data)
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`
        window.history.pushState({}, "", newUrl)
        forceUpdate()
      },
      false
    )

    return () => {
      window.removeEventListener("message", () => { }, false)
    }
  }, [])

  return (
    <div
      id="iframe-container"
      ref={container}
      key={`${router.query.server_id} + ${router.query.extension_id} + ${key}`}
    >
      {!loading && !error && title && (
        <Head>
          <title>{title}</title>
        </Head>
      )}
      {loading && (
        <div
          className="flex w-full items-center justify-center"
          style={{ height: "var(--container-height)" }}
        >
          <Loading />
        </div>
      )}
      {error && (
        <div>
          <div
            className="container mx-auto flex items-center px-6 py-12"
            style={{ height: "calc(var(--container-height) - 30vh)" }}
          >
            <div className="mx-auto flex max-w-sm flex-col items-center text-center">
              <Icons.dugumluLogo className="w-18 mb-10 h-12" />
              <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
                Bir hata oluştu
              </h1>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                {error.message}
              </p>
              <div className="mt-6 flex w-full shrink-0 items-center gap-x-3 sm:w-auto">
                <Button onClick={() => router.back()} size="sm">
                  <ArrowLeft className="mr-2 size-4" />
                  Geri dön
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  size="sm"
                  className="px-4"
                  variant="secondary"
                >
                  Panoya git
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
