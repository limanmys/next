import { ReactElement, useEffect } from "react"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import AdvancedLayout from "@/components/_layout/advanced_layout"
import { Form, FormField, FormMessage } from "@/components/form/form"

const AdvancedDnsSettingsPage: NextPageWithLayout = () => {
  const { t } = useTranslation("settings")
  const { toast } = useToast()

  const formSchema = z.object({
    dns1: z.string().min(1, t("advanced.dns.dns1_validation")),
    dns2: z.string().optional(),
    dns3: z.string().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  })

  const handleSave = (data: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post("/settings/advanced/dns", data)
      .then(() => {
        toast({
          title: t("success"),
          description: t("advanced.dns.success"),
        })
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("advanced.dns.error"),
          variant: "destructive",
        })
      })
  }

  useEffect(() => {
    apiService
      .getInstance()
      .get("/settings/advanced/dns")
      .then((res) => {
        form.reset(res.data)
      })
  }, [])

  return (
    <>
      <PageHeader
        title={t("advanced.dns.title")}
        description={t("advanced.dns.description")}
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <FormField
              control={form.control}
              name="dns1"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="dns1">DNS 1</Label>
                  <div className="relative">
                    <Input id="dns1" {...field} />
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="dns2"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="dns2">DNS 2</Label>
                  <div className="relative">
                    <Input id="dns2" {...field} />
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="dns3"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="dns3">DNS 3</Label>
                  <div className="relative">
                    <Input id="dns3" {...field} />
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!form.formState.isDirty || !form.formState.isValid}
              >
                <Save className="mr-2 h-4 w-4" />
                {t("advanced.dns.save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

AdvancedDnsSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdvancedLayout>{page}</AdvancedLayout>
}

export default AdvancedDnsSettingsPage
