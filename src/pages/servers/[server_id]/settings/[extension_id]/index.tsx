import { http } from "@/services"
import { FileWarning, Loader2, Save } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { SelectExtension } from "@/components/selectbox/extension-select"
import { SelectServer } from "@/components/selectbox/server-select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Loading from "@/components/ui/loading"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import { IExtensionSetting, IExtensionVariable } from "@/types/extension"

export default function ExtensionSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(true)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [data, setData] = useState<IExtensionSetting>({} as IExtensionSetting)
  const [values, setValues] = useState<{
    [key: string]: string
  }>({})
  const [error, setError] = useState<string>("")
  const { t } = useTranslation("servers")

  useEffect(() => {
    if (!router.query.server_id || !router.query.extension_id) return

    setLoading(true)
    http
      .get<IExtensionSetting>(
        `/servers/${router.query.server_id}/extensions/${router.query.extension_id}/settings`
      )
      .then((res) => {
        setData(res.data)
        setValues(res.data.values)
      })
      .finally(() => setLoading(false))
  }, [router.query.server_id, router.query.extension_id])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormLoading(true)

    http
      .post(
        `/servers/${router.query.server_id}/extensions/${router.query.extension_id}/settings`,
        values
      )
      .then(() => {
        toast({
          title: t("extensions.settings.toast.title"),
          description: t("extensions.settings.toast.description"),
        })
        setError("")

        setTimeout(() => {
          router.push(
            `/servers/${router.query.server_id}/extensions/${router.query.extension_id}`
          )
        }, 3000)
      })
      .catch((err) => {
        setError(err.response.data.message)
        toast({
          title: t("extensions.settings.alert_title"),
          description: removeTags(err.response.data.message),
          variant: "destructive",
        })
      })
      .finally(() => {
        setFormLoading(false)
      })
  }

  function removeTags(str: string) {
    if (str === null || str === "") return false
    else str = str.toString()

    return str.replace(/(<([^>]+)>|<script([^>]+)>)/gi, "")
  }

  return (
    <>
      <PageHeader
        title={t("extensions.settings.page_header.title")}
        description={t("extensions.settings.page_header.description")}
      />

      <div className="p-8 pt-0">
        {error && (
          <Alert className="mb-8" variant="destructive">
            <FileWarning className="size-4" />
            <AlertTitle>{t("extensions.settings.alert_title")}</AlertTitle>
            <AlertDescription>{removeTags(error)}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <Card>
            <div
              className="flex w-full items-center justify-center"
              style={{ height: "calc(var(--container-height) - 50vh)" }}
            >
              <Loading />
            </div>
          </Card>
        ) : (
          <>
            <Card className="overflow-hidden">
              <div className="grid grid-cols-4">
                <div className="bg-foreground/5 p-5">
                  <h3 className="font-semibold">
                    {t("extensions.settings.card.obligatory_settings_h3")}
                  </h3>
                  <p className="mt-5 text-sm text-muted-foreground">
                    {t("extensions.settings.card.obligatory_settings_p")}
                  </p>
                </div>
                <div className="col-span-3 p-5">
                  {data.required && data.required.length == 0 && (
                    <p className="text-muted-foreground">
                      {t("extensions.settings.no_need_settings")}
                    </p>
                  )}
                  <form onSubmit={handleSubmit}>
                    <ExtensionSettings
                      inputs={data.required}
                      values={values}
                      setValues={setValues}
                    />
                    <Button
                      type="submit"
                      className="mt-5"
                      disabled={formLoading}
                    >
                      {!formLoading ? (
                        <Save className="mr-2 size-4" />
                      ) : (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      )}{" "}
                      {t("extensions.settings.save")}
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
            {data.advanced && data.advanced.length != 0 && (
              <Card className="mt-8 overflow-hidden">
                <div className="grid grid-cols-4">
                  <div className="bg-foreground/5 p-5">
                    <h3 className="font-semibold">
                      {t("extensions.settings.card.advanced_settings_h3")}
                    </h3>
                    <p className="mt-5 text-sm text-muted-foreground">
                      {t("extensions.settings.card.advanced_settings_p")}
                    </p>
                  </div>
                  <div className="col-span-3 p-5">
                    <form onSubmit={handleSubmit}>
                      <ExtensionSettings
                        inputs={data.advanced}
                        values={values}
                        setValues={setValues}
                      />
                      <Button
                        type="submit"
                        className="mt-5"
                        disabled={formLoading}
                      >
                        {!formLoading ? (
                          <Save className="mr-2 size-4" />
                        ) : (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        )}{" "}
                        {t("extensions.settings.save")}
                      </Button>
                    </form>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </>
  )
}

function ExtensionSettings({
  inputs,
  values,
  setValues,
}: {
  inputs: IExtensionVariable[]
  values: { [key: string]: string }
  setValues: any
}) {
  return (
    <div className="space-y-3">
      {inputs.map((input) => {
        if (input.type === "text") {
          return (
            <div className="space-y-1">
              <Label htmlFor={input.variable}>
                {input.name}{" "}
                {input.required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                name={input.variable}
                id={input.variable}
                key={input.variable}
                value={values[input.variable]}
                onChange={(e) =>
                  setValues({ ...values, [input.variable]: e.target.value })
                }
                required={input.required}
              />
            </div>
          )
        }

        if (input.type === "number") {
          return (
            <div className="space-y-1">
              <Label htmlFor={input.variable}>
                {input.name}{" "}
                {input.required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                name={input.variable}
                type={input.type}
                id={input.variable}
                key={input.variable}
                value={values[input.variable]}
                onChange={(e) =>
                  setValues({ ...values, [input.variable]: e.target.value })
                }
                required={input.required}
              />
            </div>
          )
        }

        if (input.type === "password") {
          return (
            <div className="space-y-1">
              <Label htmlFor={input.variable}>
                {input.name}{" "}
                {input.required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                name={input.variable}
                id={input.variable}
                key={input.variable}
                value={values[input.variable]}
                onChange={(e) =>
                  setValues({ ...values, [input.variable]: e.target.value })
                }
                required={input.required}
                type="password"
              />
            </div>
          )
        }

        if (input.type === "server") {
          return (
            <div className="space-y-1">
              <Label htmlFor={input.variable}>
                {input.name}{" "}
                {input.required && <span className="text-red-500">*</span>}
              </Label>
              <SelectServer
                defaultValue={values[input.variable]}
                onValueChange={(value) =>
                  setValues({ ...values, [input.variable]: value })
                }
              />
            </div>
          )
        }

        if (input.type === "extension") {
          return (
            <div className="space-y-1">
              <Label htmlFor={input.variable}>
                {input.name}{" "}
                {input.required && <span className="text-red-500">*</span>}
              </Label>
              <SelectExtension
                defaultValue={values[input.variable]}
                onValueChange={(value) =>
                  setValues({ ...values, [input.variable]: value })
                }
              />
            </div>
          )
        }
      })}
    </div>
  )
}
