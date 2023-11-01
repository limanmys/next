import { useState } from "react"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Ban, FileKey2, Key, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { setFormErrors } from "@/lib/utils"
import { useEmitter } from "@/hooks/useEmitter"
import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form"

import { SelectServer } from "../selectbox/server-select"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"

export default function CreateVaultKey({ userId }: { userId: string }) {
  const { toast } = useToast()
  const emitter = useEmitter()
  const { t } = useTranslation("settings")

  const formSchema = z.object({
    server_id: z.string().min(1, t("vault.key.validation.server")),
    type: z.string().min(1, t("vault.key.validation.type")),
    username: z.string().optional(),
    password: z.string().optional(),
    key_port: z
      .string()
      .max(5, {
        message: t("vault.key.validation.port"),
      })
      .min(1, t("vault.key.validation.port_nonempty")),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      server_id: "",
      type: "ssh",
      username: "",
      password: "",
      key_port: "22",
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const handleCreate = (values: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post(`/settings/vault/key`, {
        ...values,
        user_id: userId,
      })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("vault.key.toasts.success"),
            description: t("vault.key.toasts.success_msg"),
          })
          emitter.emit("REFETCH_VAULT")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: t("vault.key.toasts.error"),
            description: t("vault.key.toasts.error_msg"),
            variant: "destructive",
          })
        }
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("vault.key.toasts.error"),
            description: t("vault.key.toasts.error_msg"),
            variant: "destructive",
          })
        }
      })
  }

  return (
    <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <Key className="mr-2 h-4 w-4" />
          {t("vault.key.button")}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:w-[800px] sm:max-w-full">
        <SheetHeader className="mb-8">
          <SheetTitle>{t("vault.key.button")}</SheetTitle>
          <SheetDescription>{t("vault.key.description")}</SheetDescription>
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
                    {t("vault.key.form.server")}
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
              name="type"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="type">{t("vault.key.form.type")}</Label>
                  <div className="mt-1 space-y-8 sm:col-span-2 sm:mt-0">
                    <RadioGroup
                      className="grid grid-cols-3 gap-8 pt-2"
                      id="key_type"
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="ssh" className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <div className="flex flex-col gap-8 p-4">
                              <span>{t("vault.key.form.ssh_pw")}</span>
                              <div className="details flex justify-between">
                                <div className="icons">
                                  <Key className="h-4 w-4" />
                                </div>
                                <div className="icons flex gap-2">
                                  <Icons.windows className="h-4 w-4" />
                                  <Icons.linux className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>

                      <FormItem>
                        <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem
                              value="ssh_certificate"
                              className="sr-only"
                            />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <div className="flex flex-col gap-8 p-4">
                              <span>{t("vault.key.form.ssh_cert")}</span>
                              <div className="details flex justify-between">
                                <div className="icons">
                                  <FileKey2 className="h-4 w-4" />
                                </div>
                                <div className="icons flex gap-2">
                                  <Icons.windows className="h-4 w-4" />
                                  <Icons.linux className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>

                      <FormItem>
                        <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="winrm" className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <div className="flex flex-col gap-8 p-4">
                              <span>WinRM</span>
                              <div className="details flex justify-between">
                                <div className="icons">
                                  <Key className="h-4 w-4" />
                                </div>
                                <div className="icons flex gap-2">
                                  <Icons.windows className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>

                      <FormItem>
                        <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem
                              value="winrm_insecure"
                              className="sr-only"
                            />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <div className="flex flex-col gap-8 p-4">
                              <span>{t("vault.key.form.winrm_insecure")}</span>
                              <div className="details flex justify-between">
                                <div className="icons">
                                  <Key className="h-4 w-4" />
                                </div>
                                <div className="icons flex gap-2">
                                  <Icons.windows className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>

                      <FormItem>
                        <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem
                              value="no_key"
                              className="sr-only"
                            />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <div className="flex flex-col gap-8 p-4">
                              <span>{t("vault.key.form.no_key")}</span>
                              <div className="details flex justify-between">
                                <div className="icons">
                                  <Ban className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                    <FormMessage />
                  </div>
                  <FormMessage className="mt-1" />
                </div>
              )}
            />
            {form.watch("type") !== "no_key" && (
              <>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="username">
                        {t("vault.key.form.username")}
                      </Label>
                      <Input id="username" {...field} />
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
                        {t("vault.key.form.password")}
                      </Label>
                      {form.watch("type") === "ssh_certificate" ? (
                        <Textarea id="password" {...field} />
                      ) : (
                        <Input id="password" type="password" {...field} />
                      )}
                      <FormMessage className="mt-1" />
                    </div>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="key_port"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="key_port">{t("vault.key.form.port")}</Label>
                  <div className="mt-1 space-y-8 sm:col-span-2 sm:mt-0">
                    <RadioGroup
                      className="grid grid-cols-3 gap-8 pt-2"
                      id="port"
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="22" className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <div className="flex flex-col gap-8 p-4">
                              <span>SSH</span>
                              <div className="details flex justify-between">
                                <span className="text-foreground/50">22</span>
                                <div className="icons flex gap-2">
                                  <Icons.windows className="h-4 w-4" />
                                  <Icons.linux className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>

                      <FormItem className="relative">
                        <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="5986" className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <div className="flex flex-col gap-8 p-4">
                              <span>WinRM</span>
                              <div className="details flex justify-between">
                                <span className="text-foreground/50">5986</span>
                                <div className="icons flex gap-2">
                                  <Icons.windows className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>

                      <FormItem className="relative">
                        <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="636" className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <div className="flex flex-col gap-8 p-4">
                              <span>AD / Samba</span>
                              <div className="details flex justify-between">
                                <span className="text-foreground/50">636</span>
                                <div className="icons flex gap-2">
                                  <Icons.windows className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </div>
                  <Input
                    type="text"
                    id="port"
                    {...field}
                    onChange={field.onChange}
                    className="mb-3"
                  />
                  <FormMessage className="mt-1" />
                </div>
              )}
            />
            <SheetFooter>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" />{" "}
                {t("vault.key.form.submit")}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
