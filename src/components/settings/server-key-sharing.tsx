import { useEffect, useState } from "react"
import Link from "next/link"
import { http } from "@/services"
import { useTranslation } from "react-i18next"

import { IServer, IServerKeySharing } from "@/types/server"
import { useEmitter } from "@/hooks/useEmitter"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { KeySharingDialog } from "@/components/settings/key-sharing-dialog"
import { ServerConnectionStatus } from "@/components/settings/server-connection-status"

export function ServerKeySharing({ server }: { server: IServer }) {
  const { t } = useTranslation("settings")
  const emitter = useEmitter()
  const [data, setData] = useState<IServerKeySharing | null>(null)
  const [error, setError] = useState(false)
  const [revision, setRevision] = useState(0)
  const [selection, setSelection] = useState<{
    keyId: string
    shared: boolean
  } | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    setData(null)
    setError(false)
    http
      .get<IServerKeySharing>(`/servers/${server.id}/key_sharing`, {
        signal: controller.signal,
      })
      .then((response) => {
        if (!controller.signal.aborted) setData(response.data)
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true)
      })
    return () => controller.abort()
  }, [server.id, revision])

  const target = data?.shared_key ?? data?.own_key
  return (
    <section
      className="space-y-3 rounded-md border p-4"
      aria-labelledby={`sharing-${server.id}`}
    >
      <h3 id={`sharing-${server.id}`} className="text-sm font-medium">
        {t("servers.actions.sharing.title")}
      </h3>
      <p className="text-sm text-muted-foreground">
        {t("servers.actions.sharing.description")}
      </p>
      {!data && !error && (
        <p role="status" className="flex items-center gap-2 text-sm">
          <Icons.spinner className="size-4 animate-spin motion-reduce:animate-none" />
          {t("servers.actions.sharing.loading")}
        </p>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {t("servers.actions.sharing.error")}
            <Button
              variant="outline"
              onClick={() => setRevision((value) => value + 1)}
            >
              {t("servers.actions.ssh_host_key.retry")}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {data && (
        <>
          {data.connection_status && (
            <ServerConnectionStatus status={data.connection_status} />
          )}
          <p role="status" className="text-sm">
            {t(
              data.shared_key
                ? data.shared_key.is_owner
                  ? "servers.actions.sharing.own_shared"
                  : "servers.actions.sharing.other_shared"
                : "servers.actions.sharing.not_shared"
            )}
          </p>
          {!data.own_key && !data.shared_key && (
            <p className="text-sm text-muted-foreground">
              {t("servers.actions.sharing.no_own_key")}
            </p>
          )}
          {target && (
            <Button
              variant="outline"
              disabled={data.shared_key ? !data.can_unshare : !data.can_share}
              onClick={() =>
                setSelection({
                  keyId: target.id,
                  shared: Boolean(data.shared_key),
                })
              }
            >
              {t(
                data.shared_key
                  ? "vault.actions.sharing.unshare"
                  : "vault.actions.sharing.share"
              )}
            </Button>
          )}
          {target && !(data.shared_key ? data.can_unshare : data.can_share) && (
            <p className="text-sm text-muted-foreground">
              {t("servers.actions.sharing.permission")}
            </p>
          )}
          <Link
            href="/settings/vault"
            className="block text-sm text-primary underline underline-offset-4"
          >
            {t("servers.actions.sharing.vault")}
          </Link>
        </>
      )}
      {selection && (
        <KeySharingDialog
          open={true}
          setOpen={(open) => {
            if (!open) setSelection(null)
          }}
          keyId={selection.keyId}
          shared={selection.shared}
          serverName={server.name}
          onChanged={() => {
            setRevision((value) => value + 1)
            emitter.emit("REFETCH_SERVERS")
          }}
        />
      )}
    </section>
  )
}
