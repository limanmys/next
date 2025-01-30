import { http } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form, FormField, FormMessage } from "@/components/form/form"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useEmitter } from "@/hooks/useEmitter"
import { setFormErrors } from "@/lib/utils"
import { IUser } from "@/types/user"

import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { ScrollArea } from "../ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useToast } from "../ui/use-toast"

export default function EditUser() {
  const { toast } = useToast()
  const emitter = useEmitter()
  const { t } = useTranslation("settings")

  const formSchema = z.object({
    id: z.string(),
    name: z
      .string()
      .min(2, {
        message: t("users.validation.n_min"),
      })
      .max(50, {
        message: t("users.validation.n_max"),
      }),
    username: z
      .string()
      .min(2, {
        message: t("users.validation.name_min"),
      })
      .max(50, {
        message: t("users.validation.name_max"),
      }),
    email: z.string().email({
      message: t("users.validation.email"),
    }),
    status: z.coerce.number(),
    password: z.string().optional(),
    roles: z.array(z.string()).optional(),
    session_time: z.coerce.number().min(15).max(999999),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      username: "",
      email: "",
      status: 0,
      password: "",
      roles: [],
      session_time: 120,
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const handleEdit = (values: z.infer<typeof formSchema>) => {
    http
      .patch(`/settings/users/${values.id}`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("success"),
            description: t("users.toasts.edit_success_msg"),
          })
          emitter.emit("REFETCH_USERS")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: t("error"),
            description: t("users.toasts.edit_error_msg"),
            variant: "destructive",
          })
        }
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("error"),
            description: t("users.toasts.edit_error_msg"),
            variant: "destructive",
          })
        }
      })
  }

  const [user, setUser] = useState<IUser>()
  const [roles, setRoles] = useState<
    {
      id: number
      name: string
      selected: boolean
    }[]
  >([])

  useEffect(() => {
    emitter.on("EDIT_USER", (data) => {
      const d = data as IUser
      setUser(d)
      setOpen(true)
      form.reset({
        id: d.id,
        name: d.name,
        username: d.username,
        email: d.email,
        status: d.status,
        password: "",
        roles: [],
        session_time: d.session_time,
      })

      http.get(`/settings/users/${d.id}/roles`).then((res) => {
        setRoles(res.data)
        form.reset({
          id: d.id,
          name: d.name,
          username: d.username,
          email: d.email,
          status: d.status,
          password: "",
          roles: res.data.filter((r: any) => r.selected).map((r: any) => r.id),
          session_time: d.session_time,
        })
      })
    })

    return () => emitter.off("EDIT_USER")
  }, [])

  return (
    <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
      <SheetContent side="right" className="sm:w-[500px] sm:max-w-full">
        <SheetHeader className="mb-8">
          <SheetTitle>{t("users.edit.title")}</SheetTitle>
          <SheetDescription>{t("users.edit.description")}</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-5">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">{t("users.create.user_type")}</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">
                        {t("users.create.user")}
                      </SelectItem>
                      <SelectItem value="1">
                        {t("users.create.admin")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="mt-1" />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">{t("users.create.name_surname")}</Label>
                  <Input
                    id="name"
                    placeholder={t("users.create.name_surname_placeholder")}
                    {...field}
                  />
                  <FormMessage className="mt-1" />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username">{t("users.create.username")}</Label>
                  <Input
                    id="username"
                    placeholder="limanuser"
                    {...field}
                    disabled={user?.auth_type === "ldap"}
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
                  <Label htmlFor="email">{t("users.create.email")}</Label>
                  <Input
                    id="email"
                    placeholder="user@liman.dev"
                    {...field}
                    type="email"
                    disabled={user?.auth_type === "ldap"}
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
                  <Label htmlFor="password">{t("users.create.password")}</Label>
                  <Input
                    id="password"
                    {...field}
                    className="col-span-3"
                    type="password"
                    disabled={user?.auth_type === "ldap"}
                  />
                  <FormMessage className="mt-1" />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="session_time"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="session_time">
                    {t("users.create.session_time")}
                  </Label>
                  <Input
                    type="number"
                    id="session_time"
                    placeholder={t("users.create.session_time_placeholder")}
                    {...field}
                  />
                  <FormMessage className="mt-1" />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="roles">{t("users.edit.roles")}</Label>
                  <Card>
                    <div className="p-3">
                      <ScrollArea className="h-24">
                        <div className="flex flex-col gap-2">
                          {roles.map((role) => (
                            <div
                              key={role.id}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={role.name}
                                value={role.id}
                                checked={role.selected}
                                onCheckedChange={(e) => {
                                  setRoles(
                                    roles.map((r) =>
                                      r.id === role.id
                                        ? {
                                            ...r,
                                            selected: e as boolean,
                                          }
                                        : r
                                    )
                                  )
                                  // Fell to async state trap
                                  field.onChange(
                                    roles
                                      .map((r) =>
                                        r.id === role.id
                                          ? {
                                              ...r,
                                              selected: e as boolean,
                                            }
                                          : r
                                      )
                                      .filter((r) => r.selected)
                                      .map((r) => r.id)
                                  )
                                }}
                              />
                              <Label htmlFor={role.name}>{role.name}</Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </Card>
                  <FormMessage className="mt-1" />
                </div>
              )}
            />

            <SheetFooter>
              <Button type="submit">
                <Edit2 className="mr-2 size-4" /> {t("users.edit.submit")}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
