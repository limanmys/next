import { ReactElement, useEffect, useState } from "react"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound, LogIn, User2, Users2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import AccessLayout from "@/components/_layout/access_layout"
import { Form, FormField, FormMessage } from "@/components/form/form"
import AsyncTransferList from "@/components/settings/async-transfer-list"

const loginSchema = z.object({
  username: z.string().nonempty("Kullanıcı adı alanı boş bırakılamaz."),
  password: z.string().nonempty("Şifre alanı boş bırakılamaz."),
})

const AccessKeycloakPage: NextPageWithLayout = () => {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })

  const [loggedIn, setLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })

  const handleLogin = (data: z.infer<typeof loginSchema>) => {
    apiService
      .getInstance()
      .post("/settings/access/ldap/login", {
        ...data,
      })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Başarılı",
            description:
              "Giriş başarılı, işlemlerinizi gerçekleştirebilirsiniz.",
          })
          setLoginData({
            ...loginData,
            username: data.username,
            password: data.password,
          })
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

  const [userListLoading, setUserListLoading] = useState(true)
  const [userList, setUserList] = useState([])
  const [selectedUserList, setSelectedUserList] = useState([])
  const fetchUsersList = (param?: string) => {
    apiService
      .getInstance()
      .get("settings/access/ldap/permissions/users", {
        params: {
          username: loginData.username,
          password: loginData.password,
          search_query: param,
        },
      })
      .then((res) => {
        setUserList(
          res.data.items.map((it: string) => {
            return {
              id: it,
              name: it,
            }
          })
        )
        setSelectedUserList(
          res.data.selected.map((it: string) => {
            return {
              id: it,
              name: it,
            }
          })
        )
        setUserListLoading(false)
      })
  }

  useEffect(() => {
    if (loggedIn) {
      fetchUsersList()
    }
  }, [loggedIn])

  const handleUserListSave = (users: any[]) => {
    apiService
      .getInstance()
      .post("settings/access/ldap/permissions/users", {
        username: loginData.username,
        password: loginData.password,
        users: users.map((it) => it.id),
      })
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Kullanıcı listesi başarıyla güncellendi.",
        })
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Kullanıcı listesi güncellenemedi.",
          variant: "destructive",
        })
      })
  }

  const [groupListLoading, setGroupListLoading] = useState(true)
  const [groupList, setGroupList] = useState([])
  const [selectedGroupList, setSelectedGroupList] = useState([])
  const fetchGroupsList = (param?: string) => {
    apiService
      .getInstance()
      .get("settings/access/ldap/permissions/groups", {
        params: {
          username: loginData.username,
          password: loginData.password,
          search_query: param,
        },
      })
      .then((res) => {
        setGroupList(
          res.data.items.map((it: string) => {
            return {
              id: it,
              name: it,
            }
          })
        )
        setSelectedGroupList(
          res.data.selected.map((it: string) => {
            return {
              id: it,
              name: it,
            }
          })
        )
        setGroupListLoading(false)
      })
  }

  useEffect(() => {
    if (loggedIn) {
      fetchGroupsList()
    }
  }, [loggedIn])

  const handleGroupListSave = (groups: any[]) => {
    apiService
      .getInstance()
      .post("settings/access/ldap/permissions/groups", {
        username: loginData.username,
        password: loginData.password,
        groups: groups.map((it) => it.id),
      })
      .then((res) => {
        if (res.data.status) {
          toast({
            title: "Başarılı",
            description: "Grup listesi başarıyla güncellendi.",
          })
        } else {
          toast({
            title: "Hata",
            description: "Grup listesi güncellenemedi.",
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
          <div className="container flex h-[60vh] w-full items-center justify-center">
            <Card className="w-[55%] ">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleLogin)}
                  className="space-y-5 p-5"
                >
                  <div>
                    <h3 className="text-lg font-medium leading-6">
                      Giriş yapın
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      LDAP erişim izinlerini düzenleyebilmek için kullanıcı ve
                      gruplara sorgu atma yetkisi bulunan bir LDAP kullanıcısı
                      ile giriş yapınız.
                    </p>
                  </div>

                  <h3 className="font-medium text-muted-foreground"></h3>
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
                          <User2 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                          <KeyRound className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
        {loggedIn && (
          <div className="flex w-full flex-col">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="users" className="w-full">
                  <User2 className="mr-2 h-4 w-4" />
                  Kullanıcı İzinleri
                </TabsTrigger>
                <TabsTrigger value="groups" className="w-full">
                  <Users2 className="mr-2 h-4 w-4" />
                  Grup İzinleri
                </TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <AsyncTransferList
                  loading={userListLoading}
                  leftTitle="Seçilebilir Kullanıcılar"
                  rightTitle="Giriş Yapabilen Kullanıcılar"
                  items={userList}
                  selected={selectedUserList}
                  onSave={handleUserListSave}
                  onSearch={(v: string) => fetchUsersList(v)}
                />
              </TabsContent>
              <TabsContent value="groups">
                <AsyncTransferList
                  loading={groupListLoading}
                  leftTitle="Seçilebilir Gruplar"
                  rightTitle="Giriş Yapabilen Gruplar"
                  items={groupList}
                  selected={selectedGroupList}
                  onSave={handleGroupListSave}
                  onSearch={(v: string) => fetchGroupsList(v)}
                />
              </TabsContent>
            </Tabs>
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
