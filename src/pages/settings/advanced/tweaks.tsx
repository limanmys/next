import { ReactElement, useEffect } from "react"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bug, FolderArchive, Puzzle, Save, ShieldCheck } from "lucide-react"
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

const formSchema = z.object({
  APP_LANG: z.string(),
  OTP_ENABLED: z.boolean(),
  APP_NOTIFICATION_EMAIL: z.string().email(),
  APP_URL: z.string().url(),
  EXTENSION_TIMEOUT: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Geçerli bir sayı giriniz.",
    }),
  APP_DEBUG: z.boolean(),
  EXTENSION_DEVELOPER_MODE: z.boolean(),
  NEW_LOG_LEVEL: z.string(),
  LDAP_IGNORE_CERT: z.boolean(),
})

const AdvancedTweaksPage: NextPageWithLayout = () => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleSave = (data: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post("/settings/advanced/tweaks", data)
      .then(() => {
        toast({
          title: "Başarılı",
          description: "İnce ayarlar başarıyla kaydedildi.",
        })
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "İnce ayarlar kaydedilirken bir hata oluştu.",
          variant: "destructive",
        })
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
        title="İnce Ayarlar"
        description="Liman ile ilgili ince ayarları bu sayfadan değiştirebilirsiniz."
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <FormField
              control={form.control}
              name="APP_LANG"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="APP_LANG">Sistem Dili</Label>
                  <div className="relative">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bir şifreleme türü seçiniz." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tr">Türkçe</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                    <small className="italic text-muted-foreground">
                      Türkçe, İngilizce ve Almanca seçenekleri arasından
                      değişiklik yaparak varsayılan sistem dilini
                      değiştirebilirsiniz.
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="OTP_ENABLED"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="flex space-x-3 space-y-0.5">
                    <ShieldCheck className="h-6 w-6 text-muted-foreground" />
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>İki Faktörlü Doğrulama</FormLabel>
                      <FormDescription>
                        Aktif ettiğinizde tüm kullanıcılar zorunlu olarak tercih
                        ettiğiniz iki faktörlü doğrulama uygulaması aracılığıyla
                        kodlar alarak giriş yapacaktır.
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
              name="APP_NOTIFICATION_EMAIL"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="APP_NOTIFICATION_EMAIL">
                    Sistem E-Postası
                  </Label>
                  <div className="relative">
                    <Input id="APP_NOTIFICATION_EMAIL" {...field} />
                  </div>
                  <small className="-mt-2 italic text-muted-foreground">
                    Bu alana girdiğiniz e-posta adresi Liman tarafından
                    kullanılarak size bildirimleri ve uyarıları gönderecektir.
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
                  <Label htmlFor="APP_URL">Uygulama Adresi</Label>
                  <div className="relative">
                    <Input id="APP_URL" {...field} />
                  </div>
                  <small className="-mt-2 italic text-muted-foreground">
                    Maillerde ve bildimlerde eklenecek Liman sisteminin adresi.
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
                    Eklenti İstek Zaman Aşımı
                  </Label>
                  <div className="relative">
                    <Input id="EXTENSION_TIMEOUT" {...field} type="number" />
                  </div>
                  <small className="-mt-2 italic text-muted-foreground">
                    Liman&apos;ın eklentilere göndereceği isteklerde
                    kullanılacak zaman aşımı süresi.
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
                    <Bug className="h-6 w-6 text-muted-foreground" />
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>Geliştirici Modu</FormLabel>
                      <FormDescription>
                        Aktif edildiğinde Liman sistemi daha detaylı loglar
                        gönderecek ve hata mesajları değişecektir.
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
                    <Puzzle className="h-6 w-6 text-muted-foreground" />
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>Eklenti Geliştirici Modu</FormLabel>
                      <FormDescription>
                        Aktif edildiğinde eklenti geliştiricileri için daha
                        detaylı hata mesajları ve loglar gönderilecektir.
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
                  <Label htmlFor="NEW_LOG_LEVEL">Loglama Seviyesi</Label>
                  <div className="relative">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bir şifreleme türü seçiniz." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Minimal</SelectItem>
                        <SelectItem value="2">Eklenti Log</SelectItem>
                        <SelectItem value="3">
                          Detaylı Eklenti Logları
                        </SelectItem>
                        <SelectItem value="0">Tüm İşlemleri Logla</SelectItem>
                      </SelectContent>
                    </Select>
                    <small className="italic text-muted-foreground">
                      Liman&apos;ın loglanma davranışını bu kısım aracılığıyla
                      değiştirebilirsiniz.
                    </small>
                  </div>
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
                    <FolderArchive className="h-6 w-6 text-muted-foreground" />
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>
                        LDAP Sertifika Kontrolünü Devre Dışı Bırak
                      </FormLabel>
                      <FormDescription>
                        Aktif edildiğinde sisteme sertifika eklenmesine gerek
                        olmadan LDAP sunucularına bağlanılabilirsiniz. Eklenti
                        klasörü içerisinde .ignoreme adında bir dosya
                        oluşturmanız gerekecektir.
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

AdvancedTweaksPage.getLayout = function getLayout(page: ReactElement) {
  return <AdvancedLayout>{page}</AdvancedLayout>
}

export default AdvancedTweaksPage
