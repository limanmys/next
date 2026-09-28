import { useEffect, useReducer, useRef, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { http } from "@/services"
import autoAnimate from "@formkit/auto-animate"
import { isAxiosError } from "axios"
import { ArrowLeft, KeyRound, RotateCw } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"

import { IExtensionRenderResponse } from "@/types/extension"
import {
  IServerConnectionStatus,
  IServerKeySharing,
  ISshHostKeyChallenge,
} from "@/types/server"
import { isSshHostKeyChallenge, sshErrorMessage } from "@/lib/ssh-errors"
import CreateVaultKey from "@/components/settings/create-vault-key"
import { ServerConnectionStatus } from "@/components/settings/server-connection-status"
import { SshHostKeyDetails } from "@/components/settings/ssh-host-key-details"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { Icons } from "../ui/icons"
import Loading from "../ui/loading"

export default function ExtensionRenderer() {
  const router = useRouter()
  const [key, forceUpdate] = useReducer((x) => x + 1, 0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<{
    message: string
    code?: string
    connection_status?: IServerConnectionStatus
  } | null>(null)
  const [connection, setConnection] = useState<IServerKeySharing | null>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const [hostKeyChallenge, setHostKeyChallenge] =
    useState<ISshHostKeyChallenge | null>(null)
  const [approvingHostKey, setApprovingHostKey] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { i18n, t } = useTranslation("settings")
  const [title, setTitle] = useState<string>("")

  const deleteAllIframes = (node: HTMLDivElement) => {
    const iframes = node.querySelectorAll("iframe")
    iframes.forEach((iframe) => iframe.remove())
  }

  useEffect(() => {
    const node = container.current
    if (!node || !router.query.server_id || !router.query.extension_id) return
    const controller = new AbortController()
    let cleanupIframe: (() => void) | undefined
    const requestOptions = { signal: controller.signal }
    autoAnimate(node)
    setLoading(true)
    setError(null)
    setConnection(null)
    setHostKeyChallenge(null)
    deleteAllIframes(node)

    let slug = Array.isArray(router.query.slug)
      ? router.query.slug.join("/")
      : router.query.slug || ""
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.toString()) slug += `?${searchParams.toString()}`

    const load = async () => {
      try {
        const { data: metadata } = await http.get<IServerKeySharing>(
          `/servers/${router.query.server_id}/key_sharing`,
          requestOptions
        )
        if (controller.signal.aborted) return
        setConnection(metadata)
        if (metadata.connection_status?.source === "missing") {
          setError({
            code: "SERVER_CONNECTION_KEY_REQUIRED",
            message: "",
            connection_status: metadata.connection_status,
          })
          setLoading(false)
          return
        }
        if (metadata.connection_status?.requires_key !== false) {
          await http.post(
            `/servers/${router.query.server_id}/ssh_host_key`,
            {},
            requestOptions
          )
        }
        const res = await http.post<IExtensionRenderResponse>(
          `/servers/${router.query.server_id}/extensions/${router.query.extension_id}/${slug}`,
          {},
          requestOptions
        )
        if (controller.signal.aborted) return
        deleteAllIframes(node)
        if (res.status === 201 || typeof res.data.html !== "string") {
          setError({
            message: res.data.message || t("servers.connection.render_error"),
          })
          setLoading(false)
          return
        }
        const iframeElement = document.createElement("iframe")
        node.appendChild(iframeElement)
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
          if (controller.signal.aborted) return
          if (iframeElement.contentWindow) {
            iframeElement.contentWindow.window.location.hash =
              window.location.hash.split("#/")[1] || "#/"
            iframeElement.style.width = "100%"
            iframeElement.style.height = "var(--container-height)"

            setError(null)
            setLoading(false)
          }
        }

        if (iframeElement.contentWindow) {
          iframeElement.contentWindow.addEventListener("beforeunload", () => {
            forceUpdate()
          })

          iframeElement.contentWindow.addEventListener(
            "limanHashChange",
            function (e: Event) {
              // Change the hash of the parent window with e.detail data
              window.location.hash = (e as CustomEvent<string>).detail
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

        cleanupIframe = () => {
          window.removeEventListener("hashchange", onHashChanged)
          window.removeEventListener("liman:extension-reload", forceUpdate)
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) return
        deleteAllIframes(node)
        if (isAxiosError(err) && err.response?.status === 406) {
          void router.push(
            `/servers/${router.query.server_id}/settings/${router.query.extension_id}`
          )
          return
        }
        if (
          isAxiosError(err) &&
          err.response?.status === 409 &&
          isSshHostKeyChallenge(err.response.data)
        ) {
          setHostKeyChallenge(err.response.data)
        } else if (
          isAxiosError<{
            code?: string
            connection_status?: IServerConnectionStatus
          }>(err) &&
          err.response?.data?.code === "SERVER_CONNECTION_KEY_REQUIRED"
        ) {
          setError({
            code: "SERVER_CONNECTION_KEY_REQUIRED",
            message: "",
            connection_status: err.response.data.connection_status,
          })
        } else {
          const data = isAxiosError<{ code?: string; message?: string }>(err)
            ? err.response?.data
            : undefined
          setError({
            message:
              data?.code?.startsWith("SSH_") || !data
                ? sshErrorMessage(err, t)
                : data.message || t("servers.connection.render_error"),
          })
        }
        setLoading(false)
      }
    }
    void load()
    return () => {
      controller.abort()
      cleanupIframe?.()
      deleteAllIframes(node)
    }
  }, [
    router.query.server_id,
    router.query.extension_id,
    router.query.slug,
    i18n.language,
    key,
  ])

  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

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
      window.removeEventListener("message", () => {}, false)
    }
  }, [])

  const approveHostKeyAndContinue = async () => {
    if (!hostKeyChallenge || !router.query.server_id) return

    setApprovingHostKey(true)
    try {
      await http.post("/servers/" + router.query.server_id + "/ssh_host_key", {
        approve_host_key: true,
        replace_host_key: hostKeyChallenge.code === "SSH_HOST_KEY_MISMATCH",
        host_key_fingerprint: hostKeyChallenge.fingerprint,
      })
      setHostKeyChallenge(null)
      forceUpdate()
    } catch (err: unknown) {
      if (
        isAxiosError(err) &&
        err.response?.status === 409 &&
        isSshHostKeyChallenge(err.response.data)
      ) {
        setHostKeyChallenge(err.response.data)
      } else {
        setHostKeyChallenge(null)
        setError({ message: sshErrorMessage(err, t) })
      }
    } finally {
      setApprovingHostKey(false)
    }
  }

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
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="mx-auto my-10 max-w-xl rounded-lg border bg-card p-6 outline-none sm:p-8"
        >
          <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-muted">
            {error.code === "SERVER_CONNECTION_KEY_REQUIRED" ? (
              <KeyRound className="size-5" />
            ) : (
              <Icons.dugumluLogo className="h-6 w-8" />
            )}
          </div>
          <h1 className="text-xl font-semibold">
            {t(
              error.code === "SERVER_CONNECTION_KEY_REQUIRED"
                ? "servers.connection.required_title"
                : "servers.connection.error_title"
            )}
          </h1>
          {connection?.server && (
            <p className="mt-1 text-sm font-medium">{connection.server.name}</p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {error.code === "SERVER_CONNECTION_KEY_REQUIRED"
              ? t(
                  `servers.connection.reason.${error.connection_status?.reason || "not_shared"}`
                )
              : error.message}
          </p>
          {error.code === "SERVER_CONNECTION_KEY_REQUIRED" && (
            <>
              {error.connection_status && (
                <div className="mt-4">
                  <ServerConnectionStatus status={error.connection_status} />
                </div>
              )}
              <p className="mt-4 text-sm text-muted-foreground">
                {t("servers.connection.resolution")}
              </p>
            </>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {error.code === "SERVER_CONNECTION_KEY_REQUIRED" &&
              connection?.server && (
                <CreateVaultKey
                  userId=""
                  server={connection.server}
                  onCreated={() => forceUpdate()}
                />
              )}
            <Button onClick={() => forceUpdate()} size="sm" variant="outline">
              <RotateCw className="mr-2 size-4" />
              {t("servers.connection.retry")}
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href={`/servers/${router.query.server_id}/extensions`}>
                <ArrowLeft className="mr-2 size-4" />
                {t("servers.connection.back")}
              </Link>
            </Button>
          </div>
        </div>
      )}
      <AlertDialog open={hostKeyChallenge !== null}>
        <AlertDialogContent className="max-h-[85dvh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {hostKeyChallenge?.code === "SSH_HOST_KEY_MISMATCH"
                ? t("servers.actions.ssh_host_key.mismatch_title")
                : t("servers.actions.ssh_host_key.title")}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  {hostKeyChallenge?.code === "SSH_HOST_KEY_MISMATCH"
                    ? t("servers.actions.ssh_host_key.mismatch")
                    : t("servers.actions.ssh_host_key.description")}
                </p>
                {hostKeyChallenge && (
                  <SshHostKeyDetails hostKey={hostKeyChallenge} />
                )}
                <p className="font-medium text-destructive">
                  {t("servers.actions.ssh_host_key.warning")}
                </p>
                {!hostKeyChallenge?.can_approve && (
                  <p>{t("servers.actions.ssh_host_key.permission")}</p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={approvingHostKey}
              onClick={() => router.back()}
            >
              {t("servers.actions.ssh_host_key.cancel")}
            </AlertDialogCancel>
            {hostKeyChallenge?.can_approve && (
              <AlertDialogAction
                disabled={approvingHostKey}
                onClick={(event) => {
                  event.preventDefault()
                  void approveHostKeyAndContinue()
                }}
              >
                {approvingHostKey && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {hostKeyChallenge?.code === "SSH_HOST_KEY_MISMATCH"
                  ? t("servers.actions.ssh_host_key.replace")
                  : t("servers.actions.ssh_host_key.approve")}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
