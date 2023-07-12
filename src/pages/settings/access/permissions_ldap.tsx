import { ReactElement, useState } from "react"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound, LogIn, User2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import AccessLayout from "@/components/_layout/access_layout"
import { Form, FormField, FormMessage } from "@/components/form/form"

const loginSchema = z.object({
  username: z.string({
    required_error: "Kullanıcı adı alanı boş bırakılamaz.",
  }),
  password: z.string({
    required_error: "Şifre alanı boş bırakılamaz.",
  }),
})

const AccessKeycloakPage: NextPageWithLayout = () => {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })

  const loginData = {
    username: "",
    password: "",
  }

  const [loggedIn, setLoggedIn] = useState(false)

  const handleLogin = (data: z.infer<typeof loginSchema>) => {
    apiService
      .getInstance()
      .post("/settings/access/ldap/login", {
        ...data,
      })
      .then((res) => {
        if (res.data.status) {
          toast({
            title: "Başarılı",
            description:
              "Giriş başarılı, işlemlerinizi gerçekleştirebilirsiniz.",
          })
          loginData.username = data.username
          loginData.password = data.password
          setLoggedIn(true)
        } else {
          toast({
            title: "Hata",
            description: "Giriş başarısız, lütfen bilgilerinizi kontrol edin.",
            variant: "destructive",
          })
        }
      })
  }

  return (
    <>
      <PageHeader
        title="LDAP Erişim İzinleri"
        description="Hangi LDAP gruplarının ve kullanıcılarının Liman'a giriş yapabileceğini veya yapamayacağını bu sayfa aracılığıyla detaylı şekilde ayarlayabilirsiniz."
      />

      <div className="px-8">
        {!loggedIn && (
          <div className="container w-full items-center justify-center flex h-[60vh]">
            <Card className="w-[55%] ">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleLogin)}
                  className="space-y-5 p-5"
                >
                  <div>
                    <h3 className="text-lg leading-6 font-medium">
                      Giriş yapın
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      LDAP erişim izinlerini düzenleyebilmek için kullanıcı ve
                      gruplara sorgu atma yetkisi bulunan bir LDAP kullanıcısı
                      ile giriş yapınız.
                    </p>
                  </div>

                  <h3 className="text-muted-foreground font-medium"></h3>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="username">Kullanıcı Adı</Label>
                        <div className="relative">
                          <Input
                            id="username"
                            placeholder="Administrator"
                            className="pl-10"
                            {...field}
                          />
                          <User2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
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
                        <Label htmlFor="password">Şifre</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            className="pl-10"
                            {...field}
                            type="password"
                          />
                          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                        <FormMessage />
                      </div>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit">
                      <LogIn className="mr-2 h-4 w-4" />
                      Giriş Yap
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          </div>
        )}
      </div>
    </>
  )
}

AccessKeycloakPage.getLayout = function getLayout(page: ReactElement) {
  return <AccessLayout>{page}</AccessLayout>
}

export default AccessKeycloakPage
