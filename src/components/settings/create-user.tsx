import { useState } from "react"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, {
        message: "Kullanıcı adı en az 2 karakter olmalıdır.",
      })
      .max(50, {
        message: "Kullanıcı adı en fazla 50 karakter olmalıdır.",
      }),
    username: z.string(),
    email: z.string().email({
      message: "Geçerli bir e-posta adresi giriniz.",
    }),
    status: z.string(),
    password: z
      .string()
      .min(8, {
        message: "Şifre en az 8 karakter olmalıdır.",
      })
      .max(50, {
        message: "Şifre en fazla 50 karakter olmalıdır.",
      }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Şifreler eşleşmiyor.",
    path: ["password_confirmation"],
  })

export default function CreateUser() {
  const { toast } = useToast()
  const emitter = useEmitter()

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
    apiService
      .getInstance()
      .post(`/settings/users`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Başarılı",
            description: "Kullanıcı başarıyla oluşturuldu.",
          })
          emitter.emit("REFETCH_USERS")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: "Hata",
            description: "Kullanıcı oluşturulurken bir hata oluştu.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Kullanıcı oluşturulurken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          Ekle
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader className="mb-8">
          <SheetTitle>Kullanıcı Oluştur</SheetTitle>
          <SheetDescription>
            Bu pencereyi kullanarak yeni bir kullanıcı oluşturabilirsiniz.
          </SheetDescription>
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
                  <Label htmlFor="status">Kullanıcı Türü</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Kullanıcı</SelectItem>
                      <SelectItem value="1">Yönetici</SelectItem>
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
                  <Label htmlFor="name">İsim Soyisim</Label>
                  <Input id="name" placeholder="Liman Kullanıcısı" {...field} />
                  <FormMessage className="mt-1" />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username">Kullanıcı Adı</Label>
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
                  <Label htmlFor="email">E-Posta</Label>
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
                  <Label htmlFor="password">Şifre</Label>
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
                  <Label htmlFor="password_confirmation">Şifreyi Onayla</Label>
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
                <PlusCircle className="mr-2 h-4 w-4" /> Oluştur
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
