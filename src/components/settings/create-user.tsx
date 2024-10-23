import { useState } from "react"
import { http } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { setFormErrors } from "@/lib/utils"
import { useEmitter } from "@/hooks/useEmitter"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Form, FormField, FormMessage } from "@/components/form/form"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useToast } from "../ui/use-toast"

export default function CreateUser() {
  const { toast } = useToast()
  const emitter = useEmitter()
  const { t } = useTranslation("settings")

  const formSchema = z
    .object({
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
      status: z.string(),
      password: z
        .string()
        .min(8, {
          message: t("users.validation.password_min"),
        })
        .max(50, {
          message: t("users.validation.password_max"),
        }),
      password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("users.validation.password_confirmation"),
      path: ["password_confirmation"],
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      status: "0",
      password: "",
      password_confirmation: "",
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const handleCreate = (values: z.infer<typeof formSchema>) => {
    http
      .post(`/settings/users`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("success"),
            description: t("users.toasts.success_msg"),
          })
          emitter.emit("REFETCH_USERS")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: t("error"),
            description: t("users.toasts.error_msg"),
            variant: "destructive",
          })
        }
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("error"),
            description: t("users.toasts.error_msg"),
            variant: "destructive",
          })
        }
      })
  }

  return (
    <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <PlusCircle className="mr-2 size-4" />
          {t("users.create.button")}
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader className="mb-8">
          <SheetTitle>{t("users.create.title")}</SheetTitle>
          <SheetDescription>{t("users.create.description")}</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">{t("users.create.user_type")}</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                  <Input id="username" placeholder="limanuser" {...field} />
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
                  />
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
                    {t("users.create.password_confirmation")}
                  </Label>
                  <Input
                    id="password_confirmation"
                    {...field}
                    className="col-span-3"
                    type="password"
                  />
                  <FormMessage className="mt-1" />
                </div>
              )}
            />
            <SheetFooter>
              <Button type="submit">
                <PlusCircle className="mr-2 size-4" />{" "}
                {t("users.create.create")}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
