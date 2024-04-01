import { ReactElement, useEffect } from "react"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Fingerprint, Mail, Save, Server, UserCheck2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import { setFormErrors } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import AccessLayout from "@/components/_layout/access_layout"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form"

const AccessLdapPage: NextPageWithLayout = () => {
  const { toast } = useToast()
  const { t } = useTranslation("settings")

  const formSchema = z.object({
    server_address: z.string().nonempty(t("access.ldap.formScema.address")),
    objectguid: z.string().nonempty(t("access.ldap.formScema.objectguid")),
    mail: z.string().nonempty(t("access.ldap.formScema.mail")),
    active: z.boolean(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleSave = (data: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post("/settings/access/ldap/configuration", data)
      .then(() => {
        toast({
          title: t("access.ldap.toast.success.title"),
          description: t("access.ldap.toast.success.description"),
        })
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("access.ldap.toast.success.description"),
            description: t("access.ldap.toast.fail.description"),
            variant: "destructive",
          })
        }
      })
  }

  useEffect(() => {
    apiService
      .getInstance()
      .get("/settings/access/ldap/configuration")
      .then((res) => {
        form.reset(res.data)
      })
  }, [])

  return (
    <>
      <PageHeader
        title={t("access.ldap.page_header.title")}
        description={t("access.ldap.page_header.description")}
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <FormField
              control={form.control}
              name="server_address"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="server_address">
                    {t("access.ldap.forms.server_address")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="server_address"
                      className="pl-10"
                      placeholder="ldaps.fabrikam.com"
                      {...field}
                    />
                    <Server className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                    <small className="italic text-muted-foreground">
                      {t("access.ldap.forms.server_info")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="objectguid"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="objectguid">
                    {t("access.ldap.forms.object_guid")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="objectguid"
                      className="pl-10"
                      placeholder="objectguid"
                      {...field}
                    />
                    <Fingerprint className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                    <small className="italic text-muted-foreground">
                      {t("access.ldap.forms.object_guid_info")}
                    </small>
                  </div>

                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="mail"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="mail">{t("access.ldap.forms.mail")}</Label>
                  <div className="relative">
                    <Input
                      id="mail"
                      className="pl-10"
                      placeholder="mail"
                      {...field}
                    />
                    <Mail className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                    <small className="italic text-muted-foreground">
                      {t("access.ldap.forms.mail_info")}
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="flex space-x-3 space-y-0.5">
                    <UserCheck2 className="size-6 text-muted-foreground" />
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>
                        {t("access.ldap.forms.integration")}
                      </FormLabel>
                      <FormDescription>
                        {t("access.ldap.forms.integration_info")}
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
                {t("access.ldap.forms.save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

AccessLdapPage.getLayout = function getLayout(page: ReactElement) {
  return <AccessLayout>{page}</AccessLayout>
}

export default AccessLdapPage
