import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormField, FormMessage } from "@/components/form/form"

export default function KeyInputs({
  formRef,
  data,
}: {
  formRef: any
  data: any
}) {
  const { t } = useTranslation("servers")

  const keySchema = z.object({
    username: z
      .string()
      .min(1, t("create.steps.key_inputs.validation.username")),
    password: z
      .string()
      .min(1, t("create.steps.key_inputs.validation.password")),
    shared: z.string(),
  })

  const form = useForm<z.infer<typeof keySchema>>({
    resolver: zodResolver(keySchema),
    defaultValues: {
      username: "",
      password: "",
      shared: "true",
      ...data,
    },
    mode: "onChange",
  })
  formRef.current = form

  return (
    <div className="space-y-8 divide-y divide-foreground/10 sm:space-y-5">
      <div>
        <div>
          <h3 className="text-lg font-medium leading-6 text-foreground">
            {t("create.steps.key_inputs.name")} ({t(data.key_type)})
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-foreground/60">
            {t("create.steps.key_inputs.description")}
          </p>
        </div>

        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-foreground/10 sm:pt-5">
                    <Label htmlFor="username" className="sm:mt-px sm:pt-2">
                      {t("create.steps.key_inputs.username.label")}
                    </Label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <Input
                        type="text"
                        id="username"
                        placeholder="root"
                        {...field}
                      />
                      <p className="mt-2 text-sm text-foreground/60">
                        {t("create.steps.key_inputs.username.information", {
                          key_type: t(data.key_type),
                        })}
                      </p>
                      <FormMessage />
                    </div>
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-foreground/10 sm:pt-5">
                    <Label htmlFor="password" className="sm:mt-px sm:pt-2">
                      {t("create.steps.key_inputs.password.label")}
                    </Label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      {data.key_type === "ssh_certificate" ? (
                        <Textarea id="password" {...field} />
                      ) : (
                        <Input type="password" id="password" {...field} />
                      )}

                      <p className="mt-2 text-sm text-foreground/60">
                        {t("create.steps.key_inputs.password.information", {
                          key_type: t(data.key_type),
                        })}
                      </p>
                      <FormMessage />
                    </div>
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="shared"
              render={({ field }) => (
                <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-foreground/10 sm:pt-5">
                    <Label htmlFor="shared" className="sm:mt-px sm:pt-2">
                      {t("create.steps.key_inputs.shared.label")}
                    </Label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <Checkbox
                        id="shared"
                        checked={field.value === "true" ? true : false}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "true" : "false")
                        }
                      />

                      <p className="mt-2 text-sm text-foreground/60">
                        {t("create.steps.key_inputs.shared.information", {
                          key_type: t(data.key_type),
                        })}
                      </p>
                      <FormMessage />
                    </div>
                  </div>
                </div>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}
