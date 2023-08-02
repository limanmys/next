import { ReactElement, useEffect } from "react"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import AdvancedLayout from "@/components/_layout/advanced_layout"
import { Form, FormField, FormMessage } from "@/components/form/form"

const formSchema = z.object({
  dns1: z.string().nonempty("DNS 1 alanı boş bırakılamaz."),
  dns2: z.string().optional(),
  dns3: z.string().optional(),
})

const AdvancedDnsSettingsPage: NextPageWithLayout = () => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleSave = (data: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post("/settings/advanced/dns", data)
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
      .get("/settings/advanced/dns")
      .then((res) => {
        form.reset(res.data)
      })
  }, [])

  return (
    <>
      <PageHeader
        title="DNS Ayarları"
        description="Liman'ın bağlanacağı uçları ve aktif dizin sunucuları çözmesini sağlayan DNS ayarlarını buradan yapabilirsiniz."
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <FormField
              control={form.control}
              name="dns1"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="dns1">DNS 1</Label>
                  <div className="relative">
                    <Input id="dns1" {...field} />
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="dns2"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="dns2">DNS 2</Label>
                  <div className="relative">
                    <Input id="dns2" {...field} />
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="dns3"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="dns3">DNS 3</Label>
                  <div className="relative">
                    <Input id="dns3" {...field} />
                  </div>
                  <FormMessage />
                </div>
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

AdvancedDnsSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdvancedLayout>{page}</AdvancedLayout>
}

export default AdvancedDnsSettingsPage
