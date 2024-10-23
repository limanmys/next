import { http } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import md5 from "blueimp-md5"
import { Save, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form"
import AuthLog from "@/components/profile/auth_log"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Loading from "@/components/ui/loading"
import PageHeader from "@/components/ui/page-header"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { setFormErrors } from "@/lib/utils"
import { IUser } from "@/types/user"

export default function ProfilePage() {
  const { t } = useTranslation("settings")

  const formSchema = z
    .object({
      name: z.string().min(3, t("profile.validations.name")),
      email: z.string().email(t("profile.validations.email")),
      otp_enabled: z.boolean(),
      old_password: z.string().optional(),
      password: z.string().optional(),
      password_confirmation: z.string().optional(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("profile.validations.password"),
      path: ["password_confirmation"],
    })

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
    http
      .get<{ user: IUser }>("/profile/")
      .then((res) => {
        setLoading(false)
        setUser(res.data.user)
        form.reset(res.data.user)
      })
  }, [])

  const handleSave = (values: z.infer<typeof formSchema>) => {
    http
      .post(`/profile`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("success"),
            description: t("profile.toasts.success"),
          })
        } else {
          toast({
            title: t("error"),
            description: t("profile.toasts.error"),
            variant: "destructive",
          })
        }
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("error"),
            description: t("profile.toasts.error"),
            variant: "destructive",
          })
        }
      })
  }

  return (
    <>
      <PageHeader
        title={t("profile.title")}
        description={t("profile.description")}
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
                className="absolute -top-8 size-16"
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
                  <h3 className="font-semibold">{t("profile.form.title")}</h3>
                  <p className="mt-5 text-sm text-muted-foreground">
                    {t("profile.form.description")}
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
                            <Label htmlFor="name">
                              {t("profile.form.name")}
                            </Label>
                            <Input
                              id="name"
                              placeholder={t("profile.form.name_placeholder")}
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
                            <Label htmlFor="email">
                              {t("profile.form.email")}
                            </Label>
                            <Input
                              id="email"
                              placeholder={t("profile.form.email_placeholder")}
                              {...field}
                            />
                            <FormMessage className="mt-1" />
                          </div>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="otp_enabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="flex space-x-3 space-y-0.5">
                              <ShieldCheck className="size-6 text-muted-foreground" />
                              <div className="flex flex-col space-y-0.5">
                                <FormLabel>
                                  {t("advanced.tweaks.OTP_ENABLED.label")}
                                </FormLabel>
                                <FormDescription>
                                  {t("advanced.tweaks.OTP_ENABLED.subtext")}
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
                        name="old_password"
                        render={({ field }) => (
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="old_password">
                              {t("profile.form.old_password")}
                            </Label>
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
                            <Label htmlFor="password">
                              {t("profile.form.password")}
                            </Label>
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
                              {t("profile.form.password_confirmation")}
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
                        <Save className="mr-2 size-4" />
                        {t("profile.form.save")}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </Card>
            <Card className="mt-8 overflow-hidden">
              <div className="grid grid-cols-4">
                <div className="bg-foreground/5 p-5">
                  <h3 className="font-semibold">
                    {t("profile.auth_log.title")}
                  </h3>
                  <p className="mt-5 text-sm text-muted-foreground">
                    {t("profile.auth_log.description")}
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
