import { useEffect, useRef, useState } from "react"
import { http } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { isAxiosError } from "axios"
import { Ban, FileKey2, Key, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { IServer } from "@/types/server"
import { setFormErrors } from "@/lib/utils"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { useEmitter } from "@/hooks/useEmitter"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form"

import { SelectServer } from "../selectbox/server-select"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"

export default function CreateVaultKey({
  userId,
  server,
  onCreated,
}: {
  userId: string
  server?: Pick<IServer, "id" | "name" | "type" | "key_port">
  onCreated?: () => void
}) {
  const { toast } = useToast()
  const emitter = useEmitter()
  const { t } = useTranslation("settings")
  const currentUser = useCurrentUser()
  const canShare =
    currentUser.permissions.share_server_key &&
    (userId === "" || userId === currentUser.id)

  const formSchema = z.object({
    server_id: z.string().min(1, t("vault.key.validation.server")),
    type: z.string().min(1, t("vault.key.validation.type")),
    username: z.string().optional(),
    password: z.string().optional(),
    shared: z.boolean(),
    key_port: z
      .string()
      .max(5, {
        message: t("vault.key.validation.port"),
      })
      .min(1, t("vault.key.validation.port_nonempty")),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      server_id: server?.id ?? "",
      type: server?.type === "ssh_certificate" ? "ssh_certificate" : "ssh",
      username: "",
      password: "",
      shared: false,
      key_port: String(server?.key_port ?? 22),
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState(false)
  const pending = useRef(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  useEffect(() => {
    if (!canShare) {
      form.setValue("shared", false)
    }
  }, [canShare, form])

  const handleCreate = (values: z.infer<typeof formSchema>) => {
    if (pending.current) return
    pending.current = true
    setSubmitting(true)
    setSubmitError(null)
    http
      .post(`/settings/vault/key`, {
        ...values,
        shared: values.type !== "no_key" && values.shared,
        sharing_scope: values.shared ? "key" : undefined,
        user_id: userId,
      })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("vault.key.toasts.success"),
            description: t("vault.key.toasts.success_msg"),
          })
          emitter.emit("REFETCH_VAULT")
          emitter.emit("REFETCH_SERVERS")
          setOpen(false)
          form.reset()
          onCreated?.()
        } else {
          setSubmitError(t("vault.key.toasts.error_msg"))
        }
      })
      .catch((e: unknown) => {
        if (!isAxiosError(e) || !setFormErrors(e, form)) {
          const status = isAxiosError(e) ? e.response?.status : undefined
          setSubmitError(
            t(
              status === 403
                ? "servers.connection.create_forbidden"
                : status === 409
                  ? "servers.actions.sharing.conflict"
                  : status === 404
                    ? "servers.actions.sharing.missing"
                    : "vault.key.toasts.error_msg"
            )
          )
        }
      })
      .finally(() => {
        pending.current = false
        setSubmitting(false)
      })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!pending.current) {
          setOpen(o)
          if (o) setSubmitError(null)
        }
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant={server ? "default" : "outline"}
          size="sm"
          className={server ? undefined : "ml-auto h-8 lg:flex"}
        >
          <Key className="mr-2 size-4" />
          {t("vault.key.button")}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[calc(100%-1.5rem)] sm:w-[800px] sm:max-w-full"
      >
        <SheetHeader className="mb-8">
          <SheetTitle>{t("vault.key.button")}</SheetTitle>
          <SheetDescription>
            {server
              ? t("servers.connection.add_description", { server: server.name })
              : t("vault.key.description")}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-5"
          >
            <fieldset disabled={submitting} className="space-y-5">
              <FormField
                control={form.control}
                name="server_id"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="server_id">
                      {t("vault.key.form.server")}
                    </Label>
                    {server ? (
                      <Input id="server_id" value={server.name} readOnly />
                    ) : (
                      <SelectServer
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      />
                    )}
                    <FormMessage className="mt-1" />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="key_type">{t("vault.key.form.type")}</Label>
                    <div className="mt-1 space-y-8 sm:col-span-2 sm:mt-0">
                      <RadioGroup
                        className={
                          server
                            ? "grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2"
                            : "grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3"
                        }
                        id="key_type"
                        aria-label={t("vault.key.form.type")}
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormItem>
                          <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                            <FormControl>
                              <RadioGroupItem value="ssh" className="sr-only" />
                            </FormControl>
                            <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent w-full">
                              <div className="flex flex-col gap-8 p-4">
                                <span>{t("vault.key.form.ssh_pw")}</span>
                                <div className="details flex justify-between">
                                  <div className="icons">
                                    <Key className="size-4" />
                                  </div>
                                  <div className="icons flex gap-2">
                                    <Icons.windows className="size-4" />
                                    <Icons.linux className="size-4" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </FormLabel>
                        </FormItem>

                        <FormItem>
                          <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                            <FormControl>
                              <RadioGroupItem
                                value="ssh_certificate"
                                className="sr-only"
                              />
                            </FormControl>
                            <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent w-full">
                              <div className="flex flex-col gap-8 p-4">
                                <span>{t("vault.key.form.ssh_cert")}</span>
                                <div className="details flex justify-between">
                                  <div className="icons">
                                    <FileKey2 className="size-4" />
                                  </div>
                                  <div className="icons flex gap-2">
                                    <Icons.windows className="size-4" />
                                    <Icons.linux className="size-4" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </FormLabel>
                        </FormItem>

                        {!server && (
                          <>
                            <FormItem>
                              <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                                <FormControl>
                                  <RadioGroupItem
                                    value="winrm"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent w-full">
                                  <div className="flex flex-col gap-8 p-4">
                                    <span>WinRM</span>
                                    <div className="details flex justify-between">
                                      <div className="icons">
                                        <Key className="size-4" />
                                      </div>
                                      <div className="icons flex gap-2">
                                        <Icons.windows className="size-4" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>

                            <FormItem>
                              <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                                <FormControl>
                                  <RadioGroupItem
                                    value="winrm_insecure"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent w-full">
                                  <div className="flex flex-col gap-8 p-4">
                                    <span>
                                      {t("vault.key.form.winrm_insecure")}
                                    </span>
                                    <div className="details flex justify-between">
                                      <div className="icons">
                                        <Key className="size-4" />
                                      </div>
                                      <div className="icons flex gap-2">
                                        <Icons.windows className="size-4" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>

                            <FormItem>
                              <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                                <FormControl>
                                  <RadioGroupItem
                                    value="no_key"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent w-full">
                                  <div className="flex flex-col gap-8 p-4">
                                    <span>{t("vault.key.form.no_key")}</span>
                                    <div className="details flex justify-between">
                                      <div className="icons">
                                        <Ban className="size-4" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </>
                        )}
                      </RadioGroup>
                      <FormMessage />
                    </div>
                    <FormMessage className="mt-1" />
                  </div>
                )}
              />
              {form.watch("type") !== "no_key" && (
                <>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="username">
                          {t("vault.key.form.username")}
                        </Label>
                        <Input id="username" {...field} maxLength={125} />
                        <FormMessage className="mt-1" />
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="password">
                          {t(
                            form.watch("type") === "ssh_certificate"
                              ? "vault.key.form.private_key"
                              : "vault.key.form.password"
                          )}
                        </Label>
                        {form.watch("type") === "ssh_certificate" ? (
                          <Textarea id="password" {...field} maxLength={2500} />
                        ) : (
                          <Input
                            id="password"
                            type="password"
                            {...field}
                            maxLength={200}
                          />
                        )}
                        <FormMessage className="mt-1" />
                      </div>
                    )}
                  />

                  {canShare && (
                    <FormField
                      control={form.control}
                      name="shared"
                      render={({ field }) => (
                        <div className="flex items-start gap-3 rounded-md border p-4">
                          <Checkbox
                            id="shared"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                          <div className="space-y-1">
                            <Label htmlFor="shared">
                              {t("vault.key.form.shared")}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {t("vault.key.form.shared_description")}
                            </p>
                          </div>
                        </div>
                      )}
                    />
                  )}
                </>
              )}

              <FormField
                control={form.control}
                name="key_port"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="port">
                      {t(
                        server
                          ? "servers.connection.ssh_port"
                          : "vault.key.form.port"
                      )}
                    </Label>
                    <div className="mt-1 space-y-8 sm:col-span-2 sm:mt-0">
                      {!server && (
                        <RadioGroup
                          className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3"
                          id="port"
                          value={field.value}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormItem>
                            <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                              <FormControl>
                                <RadioGroupItem
                                  value="22"
                                  className="sr-only"
                                />
                              </FormControl>
                              <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent w-full">
                                <div className="flex flex-col gap-8 p-4">
                                  <span>SSH</span>
                                  <div className="details flex justify-between">
                                    <span className="text-foreground/50">
                                      22
                                    </span>
                                    <div className="icons flex gap-2">
                                      <Icons.windows className="size-4" />
                                      <Icons.linux className="size-4" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </FormLabel>
                          </FormItem>

                          <FormItem className="relative">
                            <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                              <FormControl>
                                <RadioGroupItem
                                  value="5986"
                                  className="sr-only"
                                />
                              </FormControl>
                              <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent w-full">
                                <div className="flex flex-col gap-8 p-4">
                                  <span>WinRM</span>
                                  <div className="details flex justify-between">
                                    <span className="text-foreground/50">
                                      5986
                                    </span>
                                    <div className="icons flex gap-2">
                                      <Icons.windows className="size-4" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </FormLabel>
                          </FormItem>

                          <FormItem className="relative">
                            <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                              <FormControl>
                                <RadioGroupItem
                                  value="636"
                                  className="sr-only"
                                />
                              </FormControl>
                              <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent w-full">
                                <div className="flex flex-col gap-8 p-4">
                                  <span>AD / Samba</span>
                                  <div className="details flex justify-between">
                                    <span className="text-foreground/50">
                                      636
                                    </span>
                                    <div className="icons flex gap-2">
                                      <Icons.windows className="size-4" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      )}
                    </div>
                    <Input
                      type="text"
                      id="port"
                      {...field}
                      onChange={field.onChange}
                      className="mb-3"
                    />
                    <FormMessage className="mt-1" />
                  </div>
                )}
              />
              {submitError && (
                <Alert variant="destructive">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
              <SheetFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                  )}
                  <PlusCircle className="mr-2 size-4" />{" "}
                  {t("vault.key.form.submit")}
                </Button>
              </SheetFooter>
            </fieldset>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
