import { NextPageWithLayout } from "@/pages/_app"
import { http } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound, LinkIcon, LogIn, User2, Users2 } from "lucide-react"
import { ReactElement, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import AccessLayout from "@/components/_layout/access_layout"
import { Form, FormField, FormMessage } from "@/components/form/form"
import AsyncTransferList from "@/components/settings/async-transfer-list"
import LdapRoleMapping from "@/components/settings/ldap-role-mapping"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

const AccessLdapPermissionsPage: NextPageWithLayout = () => {
  const { t } = useTranslation("settings")
  const { toast } = useToast()

  const loginSchema = z.object({
    username: z.string().min(1, t("access.permissions.validation.username")),
    password: z.string().min(1, t("access.permissions.validation.password")),
  })

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })

  const [loggedIn, setLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })

  const handleLogin = (data: z.infer<typeof loginSchema>) => {
    http
      .post("/settings/access/ldap/login", {
        ...data,
      })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("success"),
            description: t("access.permissions.login_success"),
          })
          setLoginData({
            ...loginData,
            username: data.username,
            password: data.password,
          })
          setLoggedIn(true)
        } else {
          toast({
            title: t("error"),
            description: t("access.permissions.login_error"),
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("access.permissions.login_error"),
          variant: "destructive",
        })
      })
  }

  const [userListLoading, setUserListLoading] = useState(true)
  const [userList, setUserList] = useState([])
  const [selectedUserList, setSelectedUserList] = useState([])
  const fetchUsersList = (param?: string) => {
    http
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
    http
      .post("settings/access/ldap/permissions/users", {
        username: loginData.username,
        password: loginData.password,
        users: users.map((it) => it.id),
      })
      .then(() => {
        toast({
          title: t("success"),
          description: t("access.permissions.user_success"),
        })
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("access.permissions.user_error"),
          variant: "destructive",
        })
      })
  }

  const [groupListLoading, setGroupListLoading] = useState(true)
  const [groupList, setGroupList] = useState([])
  const [selectedGroupList, setSelectedGroupList] = useState([])
  const fetchGroupsList = (param?: string) => {
    http
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
    http
      .post("settings/access/ldap/permissions/groups", {
        username: loginData.username,
        password: loginData.password,
        groups: groups.map((it) => it.id),
      })
      .then(() => {
        toast({
          title: t("success"),
          description: t("access.permissions.group_success"),
        })
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("access.permissions.group_error"),
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title={t("access.permissions.title")}
        description={t("access.permissions.description")}
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
                      {t("access.permissions.login_title")}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("access.permissions.login_description")}
                    </p>
                  </div>

                  <h3 className="font-medium text-muted-foreground"></h3>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="username">
                          {t("access.permissions.username")}
                        </Label>
                        <div className="relative">
                          <Input
                            id="username"
                            placeholder="Administrator"
                            className="pl-10"
                            {...field}
                          />
                          <User2 className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
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
                        <Label htmlFor="password">
                          {t("access.permissions.password")}
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            className="pl-10"
                            {...field}
                            type="password"
                          />
                          <KeyRound className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                        </div>
                        <FormMessage />
                      </div>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit">
                      <LogIn className="mr-2 size-4" />
                      {t("access.permissions.login")}
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
                  <User2 className="mr-2 size-4" />
                  {t("access.permissions.user.title")}
                </TabsTrigger>
                <TabsTrigger value="groups" className="w-full">
                  <Users2 className="mr-2 size-4" />
                  {t("access.permissions.group.title")}
                </TabsTrigger>
                <TabsTrigger value="role_mapping" className="w-full">
                  <LinkIcon className="mr-2 size-4" />
                  Rol Bağlama
                </TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <AsyncTransferList
                  loading={userListLoading}
                  leftTitle={t("access.permissions.user.left")}
                  rightTitle={t("access.permissions.user.right")}
                  items={userList}
                  selected={selectedUserList}
                  onSave={handleUserListSave}
                  onSearch={(v: string) => fetchUsersList(v)}
                />
              </TabsContent>
              <TabsContent value="groups">
                <AsyncTransferList
                  loading={groupListLoading}
                  leftTitle={t("access.permissions.group.left")}
                  rightTitle={t("access.permissions.group.right")}
                  items={groupList}
                  selected={selectedGroupList}
                  onSave={handleGroupListSave}
                  onSearch={(v: string) => fetchGroupsList(v)}
                />
              </TabsContent>
              <TabsContent value="role_mapping">
                <LdapRoleMapping
                  username={loginData.username}
                  password={loginData.password}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </>
  )
}

AccessLdapPermissionsPage.getLayout = function getLayout(page: ReactElement<any>) {
  return <AccessLayout>{page}</AccessLayout>
}

export default AccessLdapPermissionsPage
