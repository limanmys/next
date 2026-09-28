import { useEffect, useReducer, useRef, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { http } from "@/services"
import { IApiRequestConfig } from "@/services/api.service"
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
import {
  extensionSearchParamsUrl,
  mountExtensionFrame,
} from "@/lib/extension-frame"
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

interface IExtensionError {
  message: string
  code?: string
  connection_status?: IServerConnectionStatus
}

export default function ExtensionRenderer() {
  const router = useRouter()
  const [key, forceUpdate] = useReducer((x) => x + 1, 0)
  const [checkKey, recheckConnection] = useReducer((x) => x + 1, 0)
  const [loading, setLoading] = useState<boolean>(true)
  const [renderError, setRenderError] = useState<IExtensionError | null>(null)
  const [connectionError, setConnectionError] =
    useState<IExtensionError | null>(null)
  const error = renderError || connectionError
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
    const requestOptions: IApiRequestConfig = {
      signal: controller.signal,
      handleGatewayTimeoutLocally: true,
    }
    autoAnimate(node)
    setLoading(true)
    setRenderError(null)
    deleteAllIframes(node)

    let slug = Array.isArray(router.query.slug)
      ? router.query.slug.join("/")
      : router.query.slug || ""
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.toString()) slug += `?${searchParams.toString()}`

    const load = async () => {
      try {
        const res = await http.post<IExtensionRenderResponse>(
          `/servers/${router.query.server_id}/extensions/${router.query.extension_id}/${slug}`,
          {},
          requestOptions
        )
        if (controller.signal.aborted) return
        if (res.status === 201 || typeof res.data.html !== "string") {
          setRenderError({
            message: res.data.message || t("servers.connection.render_error"),
          })
        }
        if (typeof res.data.html !== "string") {
          setLoading(false)
          return
        }
        setTitle(`${res.data.extension_name} - ${res.data.server_name} | Liman`)
        cleanupIframe = mountExtensionFrame({
          container: node,
          html: res.data.html,
          theme,
          signal: controller.signal,
          onReady: () => {
            setLoading(false)
          },
          onReload: () => forceUpdate(),
        })
      } catch (err: unknown) {
        if (controller.signal.aborted) return
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
          setRenderError({
            code: "SERVER_CONNECTION_KEY_REQUIRED",
            message: "",
            connection_status: err.response.data.connection_status,
          })
        } else {
          const data = isAxiosError<{ code?: string; message?: string }>(err)
            ? err.response?.data
            : undefined
          setRenderError({
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

  // Diagnostics report over the frame; they never gate or restart its render.
  useEffect(() => {
    if (!router.query.server_id || !router.query.extension_id) return
    const controller = new AbortController()
    const requestOptions: IApiRequestConfig = {
      signal: controller.signal,
      handleGatewayTimeoutLocally: true,
    }
    setConnection(null)
    setConnectionError(null)
    setHostKeyChallenge(null)
    const check = async () => {
      try {
        const { data: metadata } = await http.get<IServerKeySharing>(
          `/servers/${router.query.server_id}/key_sharing`,
          requestOptions
        )
        if (controller.signal.aborted) return
        setConnection(metadata)
        if (metadata.connection_status?.source === "missing") {
          setConnectionError({
            code: "SERVER_CONNECTION_KEY_REQUIRED",
            message: "",
            connection_status: metadata.connection_status,
          })
          return
        }
        if (metadata.connection_status?.requires_key !== false) {
          await http.post(
            `/servers/${router.query.server_id}/ssh_host_key`,
            {},
            requestOptions
          )
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) return
        if (
          isAxiosError(err) &&
          err.response?.status === 409 &&
          isSshHostKeyChallenge(err.response.data)
        ) {
          setHostKeyChallenge(err.response.data)
        } else {
          setConnectionError({ message: sshErrorMessage(err, t) })
        }
      }
    }
    void check()
    return () => controller.abort()
  }, [
    router.query.server_id,
    router.query.extension_id,
    i18n.language,
    key,
    checkKey,
  ])

  const retryConnection = () => {
    recheckConnection()
    if (renderError || !container.current?.querySelector("iframe"))
      forceUpdate()
  }

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
    const onMessage = (event: MessageEvent<unknown>) => {
      const frameWindow =
        container.current?.querySelector("iframe")?.contentWindow
      if (
        !frameWindow ||
        event.source !== frameWindow ||
        event.origin !== window.location.origin
      )
        return
      if (
        !event.data ||
        typeof event.data !== "object" ||
        !("type" in event.data) ||
        !("data" in event.data)
      )
        return
      if (
        event.data.type !== "setSearchParams" ||
        typeof event.data.data !== "string"
      )
        return
      const newUrl = extensionSearchParamsUrl(
        window.location.pathname,
        window.location.search,
        event.data.data
      )
      if (!newUrl) return
      window.history.pushState({}, "", newUrl + window.location.hash)
      forceUpdate()
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  const approveHostKeyAndContinue = async () => {
    if (!hostKeyChallenge || !router.query.server_id) return

    setApprovingHostKey(true)
    try {
      const requestOptions: IApiRequestConfig = {
        handleGatewayTimeoutLocally: true,
      }
      await http.post(
        "/servers/" + router.query.server_id + "/ssh_host_key",
        {
          approve_host_key: true,
          replace_host_key: hostKeyChallenge.code === "SSH_HOST_KEY_MISMATCH",
          host_key_fingerprint: hostKeyChallenge.fingerprint,
        },
        requestOptions
      )
      setHostKeyChallenge(null)
      retryConnection()
    } catch (err: unknown) {
      if (
        isAxiosError(err) &&
        err.response?.status === 409 &&
        isSshHostKeyChallenge(err.response.data)
      ) {
        setHostKeyChallenge(err.response.data)
      } else {
        setHostKeyChallenge(null)
        setConnectionError({ message: sshErrorMessage(err, t) })
      }
    } finally {
      setApprovingHostKey(false)
    }
  }

  return (
    <div
      className="relative isolate"
      style={{ minHeight: "var(--container-height)" }}
    >
      <div
        id="iframe-container"
        ref={container}
        inert={Boolean(error || hostKeyChallenge)}
      />
      {title && (
        <Head>
          <title>{title}</title>
        </Head>
      )}
      {loading && (
        <div
          className="absolute inset-0 flex w-full items-center justify-center"
          style={{ height: "var(--container-height)" }}
        >
          <Loading />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-start justify-center overflow-y-auto bg-background/95 p-4">
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
              <p className="mt-1 text-sm font-medium">
                {connection.server.name}
              </p>
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
                    onCreated={retryConnection}
                  />
                )}
              <Button onClick={retryConnection} size="sm" variant="outline">
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
        </div>
      )}
      <AlertDialog
        open={hostKeyChallenge !== null}
        onOpenChange={(open) => {
          if (!open) setHostKeyChallenge(null)
        }}
      >
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
              onClick={() => setHostKeyChallenge(null)}
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
