import { useState } from "react"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle, Settings } from "lucide-react"
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

import { SelectServer } from "../selectbox/server-select"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useToast } from "../ui/use-toast"

const formSchema = z.object({
  server_id: z.string().nonempty("Sunucu seçimi yapmalısınız."),
  name: z.string().nonempty("İsim alanı boş bırakılamaz."),
  value: z.string().nonempty("Değer alanı boş bırakılamaz."),
})

export default function CreateVaultSetting({ userId }: { userId: string }) {
  const { toast } = useToast()
  const emitter = useEmitter()

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
            title: "Başarılı",
            description: "Ayar oluşturuldu.",
          })
          emitter.emit("REFETCH_VAULT")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: "Hata",
            description: "Ayar oluşturulurken bir hata oluştu.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Ayar oluşturulurken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <Settings className="mr-2 h-4 w-4" />
          Ayar Ekle
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:w-[600px] sm:max-w-full">
        <SheetHeader className="mb-8">
          <SheetTitle>Ayar Ekle</SheetTitle>
          <SheetDescription>
            Bu pencereyi kullanarak seçilmiş olan kullanıcıya ait ayar
            ekleyebilirsiniz.
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
              name="name"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Anahtar</Label>
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
                  <Label htmlFor="value">Değer</Label>
                  <Input id="value" {...field} />
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
