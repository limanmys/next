import { http } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Key, Save, Server, User2, UserCheck2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { setFormErrors } from "@/lib/utils"

export default function MailSettingsPage() {
  const { toast } = useToast()
  const { t } = useTranslation("settings")

  const formSchema = z.object({
    encryption: z.enum(["tls", "ssl", "none"]),
    host: z.string().min(1, "Sunucu adresi boş bırakılamaz."),
    port: z
      .string()
      .min(1, "Port boş bırakılamaz.")
      .max(5, "Port geçersiz.")
      .refine((val) => !Number.isNaN(parseInt(val, 10))),
    username: z.string().min(1, "Kullanıcı adı boş bırakılamaz."),
    password: z.string().optional(),
    active: z.boolean(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleSave = (data: z.infer<typeof formSchema>) => {
    http
      .post("/settings/mail", data)
      .then(() => {
        toast({
          title: t("success"),
          description: t("email.toasts.success"),
        })
      })
      .catch((err) => {
        if (!setFormErrors(err, form)) {
          toast({
            title: t("error"),
            description: err.response.data.message,
            variant: "destructive",
          })
        }
      })
  }

  useEffect(() => {
    http
      .get<z.infer<typeof formSchema>>("/settings/mail")
      .then((res) => {
        form.reset(res.data)
      })
  }, [])

  return (
    <>
      <PageHeader
        title={t("email.title")}
        description={t("email.description")}
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="host">{t("email.form.host.label")}</Label>
                    <div className="relative">
                      <Input
                        id="host"
                        className="pl-10"
                        placeholder="mail.liman.dev"
                        {...field}
                        maxLength={255}
                      />
                      <Server className="pointer-events-none absolute left-3 top-[0.6rem] size-4 text-muted-foreground" />
                      <small className="italic text-muted-foreground">
                        {t("email.form.host.subtext")}
                      </small>
                    </div>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="port">{t("email.form.port.label")}</Label>
                    <div className="relative">
                      <Input
                        id="port"
                        placeholder="587"
                        {...field}
                        maxLength={5}
                      />
                      <small className="italic text-muted-foreground">
                        {t("email.form.port.subtext")}
                      </small>
                    </div>
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="username">
                    {t("email.form.username.label")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      className="pl-10"
                      placeholder="noreply@liman.dev"
                      {...field}
                      maxLength={255}
                    />
                    <User2 className="pointer-events-none absolute left-3 top-[0.6rem] size-4 text-muted-foreground" />
                    <small className="italic text-muted-foreground">
                      {t("email.form.username.subtext")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="password">
                    {t("email.form.password.label")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      className="pl-10"
                      placeholder="*******************"
                      type="password"
                      {...field}
                      maxLength={255}
                    />
                    <Key className="pointer-events-none absolute left-3 top-[0.6rem] size-4 text-muted-foreground" />
                    <small className="italic text-muted-foreground">
                      {t("email.form.password.subtext")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="encryption"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="encryption">
                    {t("email.form.encryption.label")}
                  </Label>
                  <div className="relative">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bir şifreleme türü seçiniz." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="none">
                          {t("email.form.encryption.none")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <small className="italic text-muted-foreground">
                      {t("email.form.encryption.subtext")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-xs">
                  <div className="flex space-x-3 space-y-0.5">
                    <UserCheck2 className="size-6 text-muted-foreground" />
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>{t("email.form.active.label")}</FormLabel>
                      <FormDescription>
                        {t("email.form.active.subtext")}
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl className="mt-[0!important]">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 size-4" />
                {t("email.form.save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
