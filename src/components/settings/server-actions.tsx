import { useState } from "react"
import { useSidebarContext } from "@/providers/sidebar-provider"
import { http } from "@/services"
import { Row } from "@tanstack/react-table"
import { isAxiosError } from "axios"
import { Edit2, Key, MoreHorizontal, ShieldCheck, Trash } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IServer, ISshHostKeyChallenge } from "@/types/server"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { useEmitter } from "@/hooks/useEmitter"
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
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Icons } from "../ui/icons"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { useToast } from "../ui/use-toast"

export function ServerRowActions({ row }: { row: Row<IServer> }) {
  const server = row.original
  const user = useCurrentUser()
  const { toast } = useToast()
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [hostKeyDialog, setHostKeyDialog] = useState(false)
  const [hostKeyChallenge, setHostKeyChallenge] =
    useState<ISshHostKeyChallenge | null>(null)
  const [hostKeyLoading, setHostKeyLoading] = useState(false)
  const { t } = useTranslation("settings")

  const checkHostKey = async () => {
    setHostKeyLoading(true)
    try {
      await http.post(`/servers/${server.id}/ssh_host_key`)
      setHostKeyChallenge(null)
      setHostKeyDialog(true)
    } catch (error: unknown) {
      if (
        isAxiosError<ISshHostKeyChallenge>(error) &&
        error.response?.status === 409
      ) {
        setHostKeyChallenge(error.response.data)
        setHostKeyDialog(true)
      } else {
        toast({
          title: t("error"),
          description: t("servers.actions.ssh_host_key.error"),
          variant: "destructive",
        })
      }
    } finally {
      setHostKeyLoading(false)
    }
  }

  return (
    user.permissions.update_server && (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-5 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={() => setEditDialog(true)}>
              <Edit2 className="mr-2 size-3.5" />
              {t("servers.actions.edit_btn")}
            </DropdownMenuItem>
            {["ssh", "ssh_certificate"].includes(server.type) && (
              <DropdownMenuItem onClick={() => void checkHostKey()}>
                <ShieldCheck className="mr-2 size-3.5" />
                {t("servers.actions.ssh_host_key.button")}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
              <Trash className="mr-2 size-3.5" />
              {t("servers.actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DeleteServer
          open={deleteDialog}
          setOpen={setDeleteDialog}
          server={server}
        />
        <Edit open={editDialog} setOpen={setEditDialog} server={server} />
        <SshHostKeyApproval
          open={hostKeyDialog}
          setOpen={setHostKeyDialog}
          server={server}
          challenge={hostKeyChallenge}
          loading={hostKeyLoading}
        />
      </>
    )
  )
}

function SshHostKeyApproval({
  open,
  setOpen,
  server,
  challenge,
  loading,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  server: IServer
  challenge: ISshHostKeyChallenge | null
  loading: boolean
}) {
  const { toast } = useToast()
  const { t } = useTranslation("settings")
  const [approving, setApproving] = useState(false)

  const approve = async () => {
    if (!challenge) return

    setApproving(true)
    try {
      await http.post(`/servers/${server.id}/ssh_host_key`, {
        approve_host_key: true,
        replace_host_key: challenge.code === "SSH_HOST_KEY_MISMATCH",
        host_key_fingerprint: challenge.fingerprint,
      })
      toast({
        title: t("success"),
        description: t("servers.actions.ssh_host_key.success"),
      })
      setOpen(false)
    } catch {
      toast({
        title: t("error"),
        description: t("servers.actions.ssh_host_key.error"),
        variant: "destructive",
      })
    } finally {
      setApproving(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {challenge?.code === "SSH_HOST_KEY_MISMATCH"
              ? t("servers.actions.ssh_host_key.mismatch_title")
              : challenge
                ? t("servers.actions.ssh_host_key.title")
                : t("servers.actions.ssh_host_key.trusted_title")}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              {challenge ? (
                <>
                  <p>
                    {challenge.code === "SSH_HOST_KEY_MISMATCH"
                      ? t("servers.actions.ssh_host_key.mismatch")
                      : t("servers.actions.ssh_host_key.description")}
                  </p>
                  <div
                    className="rounded-md border bg-muted p-3 font-mono text-xs"
                    dir="ltr"
                  >
                    <div>
                      {challenge.host}:{challenge.port}
                    </div>
                    <div className="mt-2 break-all">
                      {challenge.fingerprint}
                    </div>
                  </div>
                  <p className="font-medium text-destructive">
                    {t("servers.actions.ssh_host_key.warning")}
                  </p>
                </>
              ) : (
                <p>{t("servers.actions.ssh_host_key.trusted_description")}</p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={approving || loading}>
            {t("servers.actions.ssh_host_key.cancel")}
          </AlertDialogCancel>
          {challenge && (
            <AlertDialogAction
              disabled={approving || loading}
              onClick={(event) => {
                event.preventDefault()
                void approve()
              }}
            >
              {approving && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              {challenge.code === "SSH_HOST_KEY_MISMATCH"
                ? t("servers.actions.ssh_host_key.replace")
                : t("servers.actions.ssh_host_key.approve")}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function Edit({
  open,
  setOpen,
  server,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  server: IServer
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string>(server.name)
  const [ipAddress, setIpAddress] = useState<string>(server.ip_address)
  const [sharedKey, setSharedKey] = useState<number>(server.shared_key)
  const { t } = useTranslation("settings")
  const sidebarCtx = useSidebarContext()

  const handleEdit = () => {
    setLoading(true)

    http
      .patch(`/servers/${server.id}`, {
        name: name,
        ip_address: ipAddress,
        shared_key: sharedKey,
      })
      .then(() => {
        toast({
          title: t("success"),
          description: t("servers.actions.edit.success_msg"),
        })
        emitter.emit("REFETCH_SERVERS")
        sidebarCtx.refreshServers()
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("servers.actions.edit.error_msg"),
          variant: "destructive",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("servers.actions.edit.title")}</DialogTitle>
          <DialogDescription>
            {t("servers.actions.edit.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <Label htmlFor="edit">{t("servers.actions.edit.form.name")}</Label>
          <Input
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <Label htmlFor="edit">
            {t("servers.actions.edit.form.ip_address")}
          </Label>
          <Input
            id="ip_address"
            onChange={(e) => setIpAddress(e.target.value)}
            value={ipAddress}
          />
        </div>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-xs space-y-0">
            <div className="flex space-x-3 space-y-0.5">
              <Key className="size-6 text-muted-foreground" />
              <div className="flex flex-col space-y-0.5">
                <Label>{t("servers.actions.edit.form.shared_key")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("servers.actions.edit.form.shared_key_message")}
                </p>
              </div>
            </div>
            <Switch
              id="shared_key"
              checked={sharedKey == 1 ? true : false}
              onCheckedChange={() => setSharedKey(sharedKey == 1 ? 0 : 1)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="mr-2"
          >
            {t("servers.actions.edit.form.cancel")}
          </Button>
          <Button disabled={loading} onClick={() => handleEdit()}>
            {!loading ? (
              <Edit2 className="mr-2 size-4" />
            ) : (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {t("servers.actions.edit.form.submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DeleteServer({
  open,
  setOpen,
  server,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  server: IServer
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation("settings")
  const sidebarCtx = useSidebarContext()

  const handleDelete = () => {
    setLoading(true)

    http
      .delete(`/servers/${server.id}`)
      .then(() => {
        toast({
          title: t("success"),
          description: t("servers.actions.delete_dialog.success_msg"),
        })
        emitter.emit("REFETCH_SERVERS")
        sidebarCtx.refreshServers()
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("servers.actions.delete_dialog.error_msg"),
          variant: "destructive",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("servers.actions.delete_dialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span
              dangerouslySetInnerHTML={{
                // TODO: Localization
                // Couldn't find a better way to use tags with localized strings
                // If i find any i'll change it.
                __html: t("servers.actions.delete_dialog.description", {
                  server: server.name,
                }),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("servers.actions.delete_dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            {loading && <Icons.spinner className="size-4 animate-spin" />}
            {t("servers.actions.delete_dialog.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
