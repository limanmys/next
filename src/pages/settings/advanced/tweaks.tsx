import { ReactElement, useEffect } from "react"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bug, FolderArchive, Puzzle, Save } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import { setFormErrors } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import AdvancedLayout from "@/components/_layout/advanced_layout"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form"

const AdvancedTweaksPage: NextPageWithLayout = () => {
  const { t } = useTranslation("settings")
  const { toast } = useToast()

  const formSchema = z.object({
    APP_LANG: z.string(),
    APP_NOTIFICATION_EMAIL: z.string().max(300).email(),
    APP_URL: z.string().max(300).url(),
    EXTENSION_TIMEOUT: z
      .string()
      .max(3, { message: t("advanced.tweaks.validation") })
      .refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: t("advanced.tweaks.validation"),
      }),
    APP_DEBUG: z.boolean(),
    EXTENSION_DEVELOPER_MODE: z.boolean(),
    NEW_LOG_LEVEL: z.string(),
    LDAP_IGNORE_CERT: z.boolean(),
    LOGIN_IMAGE: z.string().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleSave = (data: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post("/settings/advanced/tweaks", data)
      .then(() => {
        toast({
          title: t("success"),
          description: t("advanced.tweaks.success"),
        })
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("error"),
            description: t("advanced.tweaks.error"),
            variant: "destructive",
          })
        }
      })
  }

  useEffect(() => {
    apiService
      .getInstance()
      .get("/settings/advanced/tweaks")
      .then((res) => {
        form.reset(res.data)
      })
  }, [])

  return (
    <>
      <PageHeader
        title={t("advanced.tweaks.title")}
        description={t("advanced.tweaks.description")}
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <FormField
              control={form.control}
              name="APP_LANG"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="APP_LANG">
                    {t("advanced.tweaks.APP_LANG.label")}
                  </Label>
                  <div className="relative">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tr">Türkçe</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                    <small className="italic text-muted-foreground">
                      {t("advanced.tweaks.APP_LANG.subtext")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="APP_NOTIFICATION_EMAIL"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="APP_NOTIFICATION_EMAIL">
                    {t("advanced.tweaks.APP_NOTIFICATION_EMAIL.label")}
                  </Label>
                  <div className="relative">
                    <Input id="APP_NOTIFICATION_EMAIL" {...field} />
                  </div>
                  <small className="-mt-2 italic text-muted-foreground">
                    {t("advanced.tweaks.APP_NOTIFICATION_EMAIL.subtext")}
                  </small>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="APP_URL"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="APP_URL">
                    {t("advanced.tweaks.APP_URL.label")}
                  </Label>
                  <div className="relative">
                    <Input id="APP_URL" {...field} />
                  </div>
                  <small className="-mt-2 italic text-muted-foreground">
                    {t("advanced.tweaks.APP_URL.subtext")}
                  </small>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="EXTENSION_TIMEOUT"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="EXTENSION_TIMEOUT">
                    {t("advanced.tweaks.EXTENSION_TIMEOUT.label")}
                  </Label>
                  <div className="relative">
                    <Input id="EXTENSION_TIMEOUT" {...field} type="number" />
                  </div>
                  <small className="-mt-2 italic text-muted-foreground">
                    {t("advanced.tweaks.EXTENSION_TIMEOUT.subtext")}
                  </small>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="APP_DEBUG"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="flex space-x-3 space-y-0.5">
                    <Bug className="size-6 text-muted-foreground" />
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>
                        {t("advanced.tweaks.APP_DEBUG.label")}
                      </FormLabel>
                      <FormDescription>
                        {t("advanced.tweaks.APP_DEBUG.subtext")}
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

            <FormField
              control={form.control}
              name="EXTENSION_DEVELOPER_MODE"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="flex space-x-3 space-y-0.5">
                    <Puzzle className="size-6 text-muted-foreground" />
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>
                        {t("advanced.tweaks.EXTENSION_DEVELOPER_MODE.label")}
                      </FormLabel>
                      <FormDescription>
                        {t("advanced.tweaks.EXTENSION_DEVELOPER_MODE.subtext")}
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

            <FormField
              control={form.control}
              name="NEW_LOG_LEVEL"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="NEW_LOG_LEVEL">
                    {t("advanced.tweaks.NEW_LOG_LEVEL.label")}
                  </Label>
                  <div className="relative">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          {t("advanced.tweaks.NEW_LOG_LEVEL.minimal")}
                        </SelectItem>
                        <SelectItem value="2">
                          {t("advanced.tweaks.NEW_LOG_LEVEL.ext_log")}
                        </SelectItem>
                        <SelectItem value="3">
                          {t("advanced.tweaks.NEW_LOG_LEVEL.detailed_ext_log")}
                        </SelectItem>
                        <SelectItem value="0">
                          {t("advanced.tweaks.NEW_LOG_LEVEL.all")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <small className="italic text-muted-foreground">
                      {t("advanced.tweaks.NEW_LOG_LEVEL.subtext")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="LOGIN_IMAGE"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="LOGIN_IMAGE">Giriş Ekranı Marka Logosu</Label>
                  <div className="relative">
                    <Input
                      id="LOGIN_IMAGE"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            const base64Data = reader.result?.toString() || ""
                            form.setValue("LOGIN_IMAGE", base64Data)
                          }
                          reader.readAsDataURL(file)
                        } else {
                          form.setValue("LOGIN_IMAGE", "")
                        }
                      }}
                    />

                    {field.value && (
                      <Card className="mt-2 border-dashed">
                        <img
                          src={field.value}
                          className="max-h-40 w-auto rounded-lg object-cover"
                        />
                      </Card>
                    )}
                  </div>
                  <small className="-mt-2 italic text-muted-foreground">
                    Giriş ekranında gösterilecek marka logosu. Maksimum 1MB
                    boyutunda olmalıdır.
                  </small>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="LDAP_IGNORE_CERT"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="flex space-x-3 space-y-0.5">
                    <FolderArchive className="size-6 text-muted-foreground" />
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>
                        {t("advanced.tweaks.LDAP_IGNORE_CERT.label")}
                      </FormLabel>
                      <FormDescription>
                        {t("advanced.tweaks.LDAP_IGNORE_CERT.subtext")}
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

            <div className="flex justify-end pb-10">
              <Button type="submit">
                <Save className="mr-2 size-4" />
                {t("advanced.tweaks.save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

AdvancedTweaksPage.getLayout = function getLayout(page: ReactElement) {
  return <AdvancedLayout>{page}</AdvancedLayout>
}

export default AdvancedTweaksPage
