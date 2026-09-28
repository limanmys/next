import { useRef, useState } from "react"
import { http } from "@/services"
import { isAxiosError } from "axios"
import { useTranslation } from "react-i18next"

import { useEmitter } from "@/hooks/useEmitter"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"

export function KeySharingDialog({
  open,
  setOpen,
  keyId,
  shared,
  serverName,
  onChanged,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  keyId: string
  shared: boolean
  serverName: string
  onChanged?: () => void
}) {
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const emitter = useEmitter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pending = useRef(false)
  const change = async () => {
    if (pending.current) return
    pending.current = true
    setLoading(true)
    setError(null)
    try {
      await http.patch(`/settings/vault/key/${keyId}/sharing`, {
        shared: !shared,
      })
      toast({
        title: t("vault.actions.sharing.success"),
        description: t(
          shared
            ? "vault.actions.sharing.unshared_msg"
            : "vault.actions.sharing.shared_msg"
        ),
      })
      emitter.emit("REFETCH_VAULT")
      // A row-owned editor must retain its unsaved name/address fields.
      // The panel callback refreshes its metadata without unmounting the row.
      if (!onChanged) emitter.emit("REFETCH_SERVERS")
      onChanged?.()
      setOpen(false)
    } catch (failure: unknown) {
      const status = isAxiosError(failure)
        ? failure.response?.status
        : undefined
      setError(
        t(
          status === 409
            ? "servers.actions.sharing.conflict"
            : status === 403
              ? "servers.actions.sharing.permission"
              : status === 404
                ? "servers.actions.sharing.missing"
                : "vault.actions.sharing.error_msg"
        )
      )
      onChanged?.()
    } finally {
      pending.current = false
      setLoading(false)
    }
  }
  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!loading) {
          setError(null)
          setOpen(value)
        }
      }}
    >
      <AlertDialogContent className="max-h-[85dvh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t(
              shared
                ? "vault.actions.sharing.unshare"
                : "vault.actions.sharing.share"
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              shared
                ? "servers.actions.sharing.unshare_confirm"
                : "servers.actions.sharing.share_confirm",
              { server: serverName }
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {t("servers.actions.edit.form.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(event) => {
              event.preventDefault()
              void change()
            }}
          >
            {loading && (
              <Icons.spinner className="mr-2 size-4 animate-spin motion-reduce:animate-none" />
            )}
            {t(
              shared
                ? "vault.actions.sharing.unshare"
                : "vault.actions.sharing.share"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
