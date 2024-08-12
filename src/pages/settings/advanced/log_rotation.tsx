import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { ReactElement, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import AdvancedLayout from "@/components/_layout/advanced_layout"
import { Form, FormField, FormMessage } from "@/components/form/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { setFormErrors } from "@/lib/utils"

const AdvancedLogRotationPage: NextPageWithLayout = () => {
  const { t } = useTranslation("settings")
  const { toast } = useToast()

  const formSchema = z.object({
    type: z.string().min(1),
    ip_address: z.string().min(1),
    port: z.string().min(1),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    apiService
      .getInstance()
      .get("/settings/advanced/log_rotation")
      .then((res) => {
        form.reset(res.data)
      })
      .catch((e) => {
        toast({
          title: t("error"),
          description: t("advanced.logrotation.error"),
          variant: "destructive",
        })
      })
  }, [])

  const handleSave = (data: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post("/settings/advanced/log_rotation", data)
      .then(() => {
        toast({
          title: t("success"),
          description: t("advanced.logrotation.success"),
        })
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("error"),
            description: t("advanced.logrotation.error"),
            variant: "destructive",
          })
        }
      })
  }

  return (
    <>
      <PageHeader
        title={t("advanced.logrotation.title")}
        description={t("advanced.logrotation.description")}
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <FormField
              control={form.control}
              name="ip_address"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="ip_address">
                    {t("advanced.logrotation.ip_address")}
                  </Label>
                  <div className="relative">
                    <Input id="ip_address" {...field} />
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="port">Port</Label>
                  <div className="relative">
                    <Input id="port" {...field} />
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="type">{t("advanced.logrotation.type")}</Label>
                  <div className="relative">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "advanced.logrotation.type_placeholder"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="udp">UDP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 size-4" />
                {t("advanced.logrotation.save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

AdvancedLogRotationPage.getLayout = function getLayout(page: ReactElement) {
  return <AdvancedLayout>{page}</AdvancedLayout>
}

export default AdvancedLogRotationPage
