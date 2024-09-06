import { ReactElement, useEffect } from "react"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, UserCheck2 } from "lucide-react"
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

const AccessKeycloakPage: NextPageWithLayout = () => {
  const { toast } = useToast()
  const { t } = useTranslation("settings")

  const formSchema = z.object({
    client_id: z.string().nonempty(t("access.keycloak.formScema.client_id")),
    client_secret: z
      .string()
      .nonempty(t("access.keycloak.formScema.client_secret")),
    redirect_uri: z
      .string()
      .nonempty(t("access.keycloak.formScema.redirect_uri")),
    base_url: z.string().nonempty(t("access.keycloak.formScema.base_url")),
    realm: z.string().nonempty(t("access.keycloak.formScema.realm")),
    active: z.boolean(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleSave = (data: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post("/settings/access/keycloak/configuration", data)
      .then(() => {
        toast({
          title: t("success"),
          description: t("access.keycloak.toast.success.description"),
        })
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("error"),
            description: t("access.keycloak.toast.fail.description"),
            variant: "destructive",
          })
        }
      })
  }

  useEffect(() => {
    apiService
      .getInstance()
      .get("/settings/access/keycloak/configuration")
      .then((res) => {
        form.reset(res.data)
      })
  }, [])

  return (
    <>
      <PageHeader
        title={t("access.keycloak.page_header.title")}
        description={t("access.keycloak.page_header.description")}
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="client_id">
                    {t("access.keycloak.form.client_id")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="client_id"
                      placeholder="my-keycloak-client"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      {t("access.keycloak.form.info_id")}
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
                    {t("access.keycloak.form.client_secret")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="client_secret"
                      placeholder="******************"
                      type="password"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      {t("access.keycloak.form.info_secret")}
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
                    {t("access.keycloak.form.redirect_url")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="redirect_uri"
                      placeholder="https://liman.fabrikam.com/keycloak/callback"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      {t("access.keycloak.form.redirect_info")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="base_url"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="base_url">
                    {t("access.keycloak.form.base_url")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="base_url"
                      placeholder="https://keycloak.fabrikam.com"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      {t("access.keycloak.form.base_info")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="realm"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="realm">
                    {t("access.keycloak.form.realm")}
                  </Label>
                  <div className="relative">
                    <Input id="realm" placeholder="my-sweet-realm" {...field} />
                    <small className="italic text-muted-foreground">
                      {t("access.keycloak.form.realm_info")}
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
                        {t("access.keycloak.form.integration")}
                      </FormLabel>
                      <FormDescription>
                        {t("access.keycloak.form.integration_info")}
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
                {t("access.keycloak.form.save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

AccessKeycloakPage.getLayout = function getLayout(page: ReactElement) {
  return <AccessLayout>{page}</AccessLayout>
}

export default AccessKeycloakPage
