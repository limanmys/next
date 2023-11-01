import { useState } from "react"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle, Settings } from "lucide-react"
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

import { SelectServer } from "../selectbox/server-select"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useToast } from "../ui/use-toast"

export default function CreateVaultSetting({ userId }: { userId: string }) {
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const emitter = useEmitter()

  const formSchema = z.object({
    server_id: z.string().min(1, t("vault.create.validation.server")),
    name: z.string().min(1, t("vault.create.validation.key")),
    value: z.string().min(1, t("vault.create.validation.value")),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      server_id: "",
      name: "",
      value: "",
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const handleCreate = (values: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post(`/settings/vault`, {
        ...values,
        user_id: userId,
      })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("vault.create.toasts.success"),
            description: t("vault.create.toasts.success_msg"),
          })
          emitter.emit("REFETCH_VAULT")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: t("vault.create.toasts.error"),
            description: t("vault.create.toasts.error_msg"),
            variant: "destructive",
          })
        }
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("vault.create.toasts.error"),
            description: t("vault.create.toasts.error_msg"),
            variant: "destructive",
          })
        }
      })
  }

  return (
    <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <Settings className="mr-2 h-4 w-4" />
          {t("vault.create.button")}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:w-[600px] sm:max-w-full">
        <SheetHeader className="mb-8">
          <SheetTitle>{t("vault.create.button")}</SheetTitle>
          <SheetDescription>{t("vault.create.description")}</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="server_id"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="server_id">
                    {t("vault.create.form.server")}
                  </Label>
                  <SelectServer
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  />
                  <FormMessage className="mt-1" />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">{t("vault.create.form.key")}</Label>
                  <Input id="name" {...field} />
                  <FormMessage className="mt-1" />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="value">{t("vault.create.form.value")}</Label>
                  <Input id="value" {...field} />
                  <FormMessage className="mt-1" />
                </div>
              )}
            />
            <SheetFooter>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" />{" "}
                {t("vault.create.form.submit")}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
