import { NextPageWithLayout } from "@/pages/_app"
import { http } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, UserCheck2 } from "lucide-react"
import { ReactElement, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { setFormErrors } from "@/lib/utils"

const AccessOidcPage: NextPageWithLayout = () => {
  const { toast } = useToast()
  const { t } = useTranslation("settings")

  const formSchema = z.object({
    issuer_url: z.string().nonempty(t("access.oidc.formScema.issuer_url")),
    client_id: z.string().nonempty(t("access.oidc.formScema.client_id")),
    client_secret: z
      .string()
      .nonempty(t("access.oidc.formScema.client_secret")),
    redirect_uri: z
      .string()
      .nonempty(t("access.oidc.formScema.redirect_uri")),
    auth_endpoint: z
      .string()
      .nonempty(t("access.oidc.formScema.auth_endpoint")),
    userinfo_endpoint: z
      .string()
      .nonempty(t("access.oidc.formScema.userinfo_endpoint")),
    token_endpoint: z
      .string()
      .nonempty(t("access.oidc.formScema.token_endpoint")),
    active: z.boolean(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleSave = (data: z.infer<typeof formSchema>) => {
    http
      .post("/settings/access/oidc/configuration", data)
      .then(() => {
        toast({
          title: t("success"),
          description: t("access.oidc.toast.success.description"),
        })
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("error"),
            description: t("access.oidc.toast.fail.description"),
            variant: "destructive",
          })
        }
      })
  }

  useEffect(() => {
    http
      .get("/settings/access/oidc/configuration")
      .then((res) => {
        form.reset(res.data)
      })
  }, [])

  return (
    <>
      <PageHeader
        title={t("access.oidc.page_header.title")}
        description={t("access.oidc.page_header.description")}
      />

      <div className="p-8 pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <FormField
              control={form.control}
              name="issuer_url"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="issuer_url">
                    {t("access.oidc.form.issuer_url")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="issuer_url"
                      placeholder="https://your-oidc-provider.com/realms/your-realm"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      {t("access.oidc.form.issuer_url_info")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="client_id">
                    {t("access.oidc.form.client_id")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="client_id"
                      placeholder="your_client_id"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      {t("access.oidc.form.client_id_info")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="client_secret"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="client_secret">
                    {t("access.oidc.form.client_secret")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="client_secret"
                      placeholder="******************"
                      type="password"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      {t("access.oidc.form.client_secret_info")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="redirect_uri"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="redirect_uri">
                    {t("access.oidc.form.redirect_uri")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="redirect_uri"
                      placeholder="https://liman.company.com/api/auth/oidc/callback"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      {t("access.oidc.form.redirect_uri_info")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="auth_endpoint"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="auth_endpoint">
                    {t("access.oidc.form.auth_endpoint")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="auth_endpoint"
                      placeholder="/authorize"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      {t("access.oidc.form.auth_endpoint_info")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="userinfo_endpoint"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="userinfo_endpoint">
                    {t("access.oidc.form.userinfo_endpoint")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="userinfo_endpoint"
                      placeholder="/userinfo"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      {t("access.oidc.form.userinfo_endpoint_info")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="token_endpoint"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="token_endpoint">
                    {t("access.oidc.form.token_endpoint")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="token_endpoint"
                      placeholder="/oauth/token"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      {t("access.oidc.form.token_endpoint_info")}
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-xs space-y-0">
                  <div className="flex space-x-3 space-y-0.5">
                    <UserCheck2 className="size-6 text-muted-foreground" />
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>
                        {t("access.oidc.form.integration")}
                      </FormLabel>
                      <FormDescription>
                        {t("access.oidc.form.integration_info")}
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
                {t("access.oidc.form.save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

AccessOidcPage.getLayout = function getLayout(page: ReactElement<any>) {
  return <AccessLayout>{page}</AccessLayout>
}

export default AccessOidcPage
