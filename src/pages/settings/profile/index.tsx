import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import md5 from "blueimp-md5"
import { Save } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { IUser } from "@/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Loading from "@/components/ui/loading"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormField, FormMessage } from "@/components/form/form"
import AuthLog from "@/components/profile/auth_log"

const formSchema = z
  .object({
    name: z.string().min(3, "Ad soyad en az 3 karakter olmalıdır."),
    email: z.string().email("Geçerli bir e-posta adresi giriniz."),
    old_password: z.string().optional(),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Şifreler eşleşmiyor.",
    path: ["password_confirmation"],
  })

export default function ProfilePage() {
  const { toast } = useToast()

  const [user, setUser] = useState<IUser>({} as IUser)
  const [loading, setLoading] = useState<boolean>(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...user,
    },
    mode: "onChange",
  })

  useEffect(() => {
    apiService
      .getInstance()
      .get<{ user: IUser }>("/profile/")
      .then((res) => {
        setLoading(false)
        setUser(res.data.user)
        form.reset(res.data.user)
      })
  }, [])

  const handleSave = (values: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post(`/profile`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Başarılı",
            description:
              "Bilgileriniz başarıyla düzenlendi. Değişikleri görmek için tekrardan giriş yapmanız gerekmektedir.",
          })
        } else {
          toast({
            title: "Hata",
            description: "Bilgileriniz düzenlenirken bir hata oluştu.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Bilgileriniz düzenlenirken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title="Profil"
        description="Kullanıcı adınızı, e-posta adresinizi ve şifrenizi değiştirebilir ve en son giriş yaptığınız tarih ve IP adresi gibi detayları görüntüleyebilirsiniz."
      />

      <div className="p-8">
        {loading ? (
          <Card>
            <div
              className="flex w-full items-center justify-center"
              style={{ height: "calc(var(--container-height) - 50vh)" }}
            >
              <Loading />
            </div>
          </Card>
        ) : (
          <>
            <Card className="relative">
              <Avatar
                className="absolute -top-8 h-16 w-16"
                style={{
                  left: "calc(50% - 32px)",
                }}
              >
                <AvatarImage
                  src={`https://gravatar.com/avatar/${md5(user.email)}?d=404`}
                  alt={user.name}
                />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>

              <CardHeader className="mt-8 flex items-center justify-center">
                <CardTitle>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="mt-8 overflow-hidden">
              <div className="grid grid-cols-4">
                <div className="bg-foreground/5 p-5">
                  <h3 className="font-semibold">Profil Bilgileri</h3>
                  <p className="mt-5 text-sm text-muted-foreground">
                    Kullanıcı adınızı, e-posta adresinizi ve şifrenizi bu
                    kısımdan güncelleyebilirsiniz.
                  </p>
                </div>
                <div className="col-span-3 p-5">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSave)}
                      className="mt-1 space-y-5"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="name">İsim Soyisim</Label>
                            <Input
                              id="name"
                              placeholder="Liman Kullanıcısı"
                              {...field}
                            />
                            <FormMessage className="mt-1" />
                          </div>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="email">E-posta Adresi</Label>
                            <Input
                              id="email"
                              placeholder="Liman Kullanıcısı"
                              {...field}
                            />
                            <FormMessage className="mt-1" />
                          </div>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="old_password"
                        render={({ field }) => (
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="old_password">Eski Parolanız</Label>
                            <Input
                              id="old_password"
                              type="password"
                              {...field}
                            />
                            <FormMessage className="mt-1" />
                          </div>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Parolanız</Label>
                            <Input id="password" type="password" {...field} />
                            <FormMessage className="mt-1" />
                          </div>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password_confirmation"
                        render={({ field }) => (
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="password_confirmation">
                              Parola Onayı
                            </Label>
                            <Input
                              id="password_confirmation"
                              type="password"
                              {...field}
                            />
                            <FormMessage className="mt-1" />
                          </div>
                        )}
                      />

                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Kaydet
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </Card>
            <Card className="mt-8 overflow-hidden">
              <div className="grid grid-cols-4">
                <div className="bg-foreground/5 p-5">
                  <h3 className="font-semibold">Giriş Kayıtları</h3>
                  <p className="mt-5 text-sm text-muted-foreground">
                    Hesabınıza yapılmış olan giriş kayıtlarını IP adresleri ile
                    birlikte bu kısımdan görüntüleyebilirsiniz.
                  </p>
                </div>
                <div className="col-span-3 py-5">
                  <AuthLog />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  )
}
