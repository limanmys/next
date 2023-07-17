import { useState } from "react"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Ban, FileKey2, Key, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

const formSchema = z.object({
  server_id: z.string().nonempty("Sunucu seçimi yapmalısınız."),
  type: z.string().nonempty("Anahtar tipi seçimi yapmalısınız."),
  username: z.string().optional(),
  password: z.string().optional(),
  key_port: z
    .string()
    .max(5, {
      message: "Bağlantı portu 5 karakterden uzun olamaz.",
    })
    .nonempty("Bağlantı portu boş bırakılamaz."),
})

export default function CreateVaultKey({ userId }: { userId: string }) {
  const { toast } = useToast()
  const emitter = useEmitter()

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
            title: "Başarılı",
            description: "Anahtar oluşturuldu.",
          })
          emitter.emit("REFETCH_VAULT")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: "Hata",
            description: "Anahtar oluşturulurken bir hata oluştu.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Anahtar oluşturulurken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <Key className="mr-2 h-4 w-4" />
          Anahtar Ekle
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:w-[800px] sm:max-w-full">
        <SheetHeader className="mb-8">
          <SheetTitle>Anahtar Ekle</SheetTitle>
          <SheetDescription>
            Bu pencereyi kullanarak sunucuya bağlantı anahtarı ekleyebilirsiniz.
          </SheetDescription>
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
                  <Label htmlFor="server_id">Sunucu</Label>
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
                  <Label htmlFor="type">Anahtar Türü</Label>
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
                              <span>SSH (Şifreli)</span>
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
                              <span>SSH (Sertifikalı)</span>
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
                              <span>WinRM (Güvensiz)</span>
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
                              <span>Anahtarsız Giriş</span>
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
                      <Label htmlFor="username">Kullanıcı Adı</Label>
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
                      <Label htmlFor="password">Şifre</Label>
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
                  <Label htmlFor="key_port">Kontrol Portu</Label>
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
                <PlusCircle className="mr-2 h-4 w-4" /> Oluştur
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
