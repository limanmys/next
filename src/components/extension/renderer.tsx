import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { ArrowLeft } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"

import { Button } from "../ui/button"
import { Icons } from "../ui/icons"
import Loading from "../ui/loading"

export default function ExtensionRenderer() {
  const router = useRouter()
  const [keyval, setKeyval] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>()
  const container = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { i18n } = useTranslation()

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

      apiService
        .getInstance()
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
            iframeElement.contentWindow.onbeforeunload = () => {
              setKeyval((prevState) => {
                return prevState + 1
              })
            }

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
    keyval,
    i18n.language,
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

  return (
    <div
      id="iframe-container"
      ref={container}
      key={`${router.query.server_id} + ${router.query.extension_id} + ${keyval}`}
    >
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
                  <ArrowLeft className="mr-2 h-4 w-4" />
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
