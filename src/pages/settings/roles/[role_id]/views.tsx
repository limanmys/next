import { ReactElement, useEffect } from "react"
import { useRouter } from "next/router"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import { setFormErrors } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import RoleLayout from "@/components/_layout/role_layout"
import { Form, FormField, FormMessage } from "@/components/form/form"

const RoleViewList: NextPageWithLayout = () => {
  const router = useRouter()
  const { t } = useTranslation("settings")
  const { toast } = useToast()

  const DashboardEnum = z.enum([
    "servers",
    "users",
    "version",
    "most_used_extensions",
    "most_used_servers",
  ])

  const formSchema = z.object({
    sidebar: z.enum(["servers", "extensions"]),
    dashboard: z.array(DashboardEnum),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const fetchData = () => {
    apiService
      .getInstance()
      .get(`/settings/roles/${router.query.role_id}/views`)
      .then((res) => {
        form.reset(res.data)
      })
  }

  useEffect(() => {
    if (router.query.role_id) fetchData()
  }, [router.query.role_id])

  const handleCheckboxChange = (value: z.infer<typeof DashboardEnum>) => {
    const currentDashboard = form.getValues("dashboard")
    if (currentDashboard.includes(value)) {
      form.setValue(
        "dashboard",
        currentDashboard.filter((item) => item !== value)
      )
    } else {
      form.setValue("dashboard", [...currentDashboard, value])
    }
  }

  const handleSave = (data: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post(`/settings/roles/${router.query.role_id}/views`, {
        views: data,
      })
      .then(() => {
        toast({
          title: t("success"),
          description: t("roles.views.success"),
        })
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("error"),
            description: t("roles.views.error"),
            variant: "destructive",
          })
        }
      })
  }

  return (
    <>
      <PageHeader
        title={t("roles.views.title")}
        description={t("roles.views.description")}
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <FormField
              control={form.control}
              name="sidebar"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="sidebar">{t("roles.views.sidebar")}</Label>
                  <div className="relative">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("roles.views.sidebar_placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="servers">
                          {t("roles.views.sidebar_servers")}
                        </SelectItem>
                        <SelectItem value="extensions">
                          {t("roles.views.sidebar_extensions")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <small className="italic text-muted-foreground">
                      {t("roles.views.sidebar_description")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <div className="space-y-3">
              <Label>{t("roles.views.dashboard")}</Label>
              <Card>
                <CardContent className="flex flex-col gap-3 p-3">
                  {DashboardEnum.options.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={item}
                        checked={form.watch("dashboard", []).includes(item)}
                        onCheckedChange={() => handleCheckboxChange(item)}
                      />
                      <Label htmlFor={item}>{t(`roles.views.${item}`)}</Label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <small className="italic text-muted-foreground">
                {t("roles.views.dashboard_description")}
              </small>
            </div>

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

RoleViewList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleViewList