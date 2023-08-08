import { ReactElement } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import AdvancedLayout from "@/components/_layout/advanced_layout"
import { Form, FormField, FormMessage } from "@/components/form/form"

const formSchema = z.object({
  type: z.string().nonempty("Bir tip seçimi yapınız."),
  ip_address: z.string().nonempty("IP adresi boş bırakılamaz."),
  port: z.string().nonempty("Port boş bırakılamaz."),
})

const AdvancedLogRotationPage: NextPageWithLayout = () => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleSave = (data: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post("/settings/advanced/log_rotation", data)
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Log yönlendirme ayarları başarıyla kaydedildi.",
        })
      })
      .catch(() => {
        toast({
          title: "Hata",
          description:
            "Log yönlendirme ayarları kaydedilirken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title="Log Yönlendirme Ayarları"
        description="Liman'ın önemli sistem loglarını ve mesajlarını rsyslog aracılığı ile yönlendirmenizi sağlar."
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <FormField
              control={form.control}
              name="ip_address"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="ip_address">IP Adresi</Label>
                  <div className="relative">
                    <Input id="ip_address" {...field} />
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
                  <Label htmlFor="port">Port</Label>
                  <div className="relative">
                    <Input id="port" {...field} />
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="type">Bağlantı Türü</Label>
                  <div className="relative">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bir bağlantı türü seçiniz." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="udp">UDP</SelectItem>
                      </SelectContent>
                    </Select>
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

AdvancedLogRotationPage.getLayout = function getLayout(page: ReactElement) {
  return <AdvancedLayout>{page}</AdvancedLayout>
}

export default AdvancedLogRotationPage
