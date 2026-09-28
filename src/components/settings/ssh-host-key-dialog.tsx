import { useEffect, useRef, useState } from "react"
import { http } from "@/services"
import { isAxiosError } from "axios"
import { ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  IServer,
  ISshHostKeyChallenge,
  ISshHostKeyStatus,
} from "@/types/server"
import { isSshHostKeyChallenge, sshErrorMessage } from "@/lib/ssh-errors"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"
import { SshHostKeyDetails } from "@/components/settings/ssh-host-key-details"

export function SshHostKeyDialog({
  open,
  setOpen,
  server,
  restoreFocus,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  server: IServer
  restoreFocus: () => void
}) {
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const [challenge, setChallenge] = useState<ISshHostKeyChallenge | null>(null)
  const [status, setStatus] = useState<ISshHostKeyStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [approving, setApproving] = useState(false)
  const [verified, setVerified] = useState(false)
  const request = useRef<AbortController | null>(null)

  const check = async (approval?: ISshHostKeyChallenge) => {
    if (request.current) return
    const controller = new AbortController()
    request.current = controller
    setLoading(true)
    setApproving(Boolean(approval))
    setError(null)
    setVerified(false)
    setChallenge(null)
    setStatus(null)
    try {
      const response = await http.post<ISshHostKeyStatus>(
        `/servers/${server.id}/ssh_host_key`,
        approval
          ? {
              approve_host_key: true,
              replace_host_key: approval.code === "SSH_HOST_KEY_MISMATCH",
              host_key_fingerprint: approval.fingerprint,
            }
          : {},
        { signal: controller.signal }
      )
      if (controller.signal.aborted) return
      setStatus(response.data)
      if (approval)
        toast({
          title: t("success"),
          description: t("servers.actions.ssh_host_key.success"),
        })
    } catch (failure: unknown) {
      if (controller.signal.aborted) return
      if (
        isAxiosError(failure) &&
        failure.response?.status === 409 &&
        isSshHostKeyChallenge(failure.response.data)
      ) {
        setChallenge(failure.response.data)
        if (approval) setError(t("servers.actions.ssh_host_key.changed_again"))
      } else {
        setError(sshErrorMessage(failure, t))
      }
    } finally {
      if (request.current === controller) {
        request.current = null
        setLoading(false)
        setApproving(false)
      }
    }
  }

  useEffect(() => {
    if (open) void check()
    return () => {
      request.current?.abort()
      request.current = null
    }
  }, [open, server.id])

  const key = challenge ?? status
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!approving) setOpen(value)
      }}
    >
      <DialogContent
        className="max-h-[85dvh] overflow-y-auto sm:max-w-xl"
        closeLabel={t("servers.actions.ssh_host_key.cancel")}
        closeDisabled={approving}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          restoreFocus()
        }}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("servers.actions.ssh_host_key.button")}</DialogTitle>
          <DialogDescription>
            {t("servers.actions.ssh_host_key.check_description", {
              server: server.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4" aria-busy={loading}>
          {loading && (
            <p role="status" className="flex items-center gap-2 text-sm">
              <Icons.spinner className="size-4 animate-spin motion-reduce:animate-none" />
              {t("servers.actions.ssh_host_key.checking")}
            </p>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {challenge && (
            <Alert
              variant={
                challenge.code === "SSH_HOST_KEY_MISMATCH"
                  ? "destructive"
                  : "default"
              }
            >
              <AlertDescription>
                {t(
                  challenge.code === "SSH_HOST_KEY_MISMATCH"
                    ? "servers.actions.ssh_host_key.mismatch"
                    : "servers.actions.ssh_host_key.description"
                )}
              </AlertDescription>
            </Alert>
          )}
          {status?.status === "trusted" && (
            <p role="status" className="flex items-start gap-2 text-sm">
              <ShieldCheck className="size-4 shrink-0" />
              {t("servers.actions.ssh_host_key.trusted_description")}
            </p>
          )}
          {status?.status === "not_applicable" && (
            <p>{t("servers.actions.ssh_host_key.not_applicable")}</p>
          )}
          {key?.fingerprint && <SshHostKeyDetails hostKey={key} />}
          {challenge && (
            <>
              <p className="text-sm text-muted-foreground">
                {t("servers.actions.ssh_host_key.warning")}{" "}
                {t("servers.actions.ssh_host_key.scope")}
              </p>
              {challenge.can_approve === false ? (
                <p className="text-sm">
                  {t("servers.actions.ssh_host_key.permission")}
                </p>
              ) : (
                <label className="flex cursor-pointer items-start gap-2 text-sm">
                  <Checkbox
                    checked={verified}
                    onCheckedChange={(checked) => setVerified(checked === true)}
                  />
                  <span>{t("servers.actions.ssh_host_key.verified")}</span>
                </label>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={approving}
            onClick={() => setOpen(false)}
          >
            {t("servers.actions.ssh_host_key.cancel")}
          </Button>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => void check()}
          >
            {t("servers.actions.ssh_host_key.retry")}
          </Button>
          {challenge && challenge.can_approve !== false && (
            <Button
              disabled={loading || !verified}
              variant={
                challenge.code === "SSH_HOST_KEY_MISMATCH"
                  ? "destructive"
                  : "default"
              }
              onClick={() => void check(challenge)}
            >
              {t(
                challenge.code === "SSH_HOST_KEY_MISMATCH"
                  ? "servers.actions.ssh_host_key.replace"
                  : "servers.actions.ssh_host_key.approve"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
