import { ReactElement, useEffect } from "react"
import Head from "next/head"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, UserCheck2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

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

const formSchema = z.object({
  client_id: z.string().nonempty("Client ID alanı boş bırakılamaz."),
  client_secret: z.string().nonempty("Client Secret alanı boş bırakılamaz."),
  redirect_uri: z.string().nonempty("Redirect URI alanı boş bırakılamaz."),
  base_url: z.string().nonempty("Base URL alanı boş bırakılamaz."),
  realm: z.string().nonempty("Realm alanı boş bırakılamaz."),
  active: z.boolean(),
})

const AccessKeycloakPage: NextPageWithLayout = () => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleSave = (data: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post("/settings/access/keycloak/configuration", data)
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Keycloak ayarları başarıyla kaydedildi.",
        })
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Keycloak ayarları kaydedilirken bir hata oluştu.",
          variant: "destructive",
        })
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
      <Head>
        <title>Keycloak | Liman</title>
      </Head>

      <PageHeader
        title="Keycloak"
        description="Keycloak auth gatewayini kullanarak Liman üzerine kullanıcı girişi yapılmasını sağlayabilirsiniz."
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="client_id">Client ID</Label>
                  <div className="relative">
                    <Input
                      id="client_id"
                      placeholder="my-keycloak-client"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      Client ID değeri Keycloak üzerinde oluşturduğunuz client
                      için verilen ID değeridir.
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
                  <Label htmlFor="client_secret">Client Secret</Label>
                  <div className="relative">
                    <Input
                      id="client_secret"
                      placeholder="******************"
                      type="password"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      Client Secret değeri Keycloak üzerinde oluşturduğunuz
                      client için oluşmuş secret değeridir.
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
                  <Label htmlFor="redirect_uri">Redirect URI</Label>
                  <div className="relative">
                    <Input
                      id="redirect_uri"
                      placeholder="https://liman.fabrikam.com/keycloak/callback"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      Redirect URI değeri Liman URL&apos;niz /keycloak/callback
                      şeklinde olmalıdır ve bu değeri clientinizde de izin
                      verilen redirect uri&apos;lar kısmında belirtmelisiniz.
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
                  <Label htmlFor="base_url">Base URL</Label>
                  <div className="relative">
                    <Input
                      id="base_url"
                      placeholder="https://keycloak.fabrikam.com"
                      {...field}
                    />
                    <small className="italic text-muted-foreground">
                      Base URL değeri Keycloak URL&apos;nizdir.
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
                  <Label htmlFor="realm">Realm</Label>
                  <div className="relative">
                    <Input id="realm" placeholder="my-sweet-realm" {...field} />
                    <small className="italic text-muted-foreground">
                      Realm değeri Keycloak üzerinde oluşturduğunuz realmin
                      adıdır.
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
                  <div className="space-y-0.5 space-x-3 flex">
                    <UserCheck2 className="h-6 w-6 text-muted-foreground" />
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>Entegrasyonu aktifleştir</FormLabel>
                      <FormDescription>
                        Entegrasyonu aktifleştirdiğinizde Keycloak sunucunuz
                        üzerindeki kullanıcılar Liman&apos;a giriş
                        yapabilecektir.
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
                <Save className="mr-2 h-4 w-4" />
                Kaydet
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
