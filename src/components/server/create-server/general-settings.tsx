import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form"

export default function GeneralSettings({
  formRef,
  data,
}: {
  formRef: any
  data: any
}) {
  const { t } = useTranslation("servers")

  const generalSchema = z.object({
    name: z.string().min(1, t("create.steps.general_settings.validation.name")),
    os_type: z
      .string()
      .min(1, t("create.steps.general_settings.validation.os_type")),
  })

  const form = useForm<z.infer<typeof generalSchema>>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      name: "",
      os_type: "",
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
            {t("create.steps.general_settings.name")}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-foreground/60">
            {t("create.steps.general_settings.description")}
          </p>
        </div>
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-foreground/10 sm:pt-5">
                    <Label htmlFor="name" className="sm:mt-px sm:pt-2">
                      {t("create.steps.general_settings.sname.label")}
                    </Label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <Input
                        type="text"
                        id="name"
                        placeholder="Liman Server"
                        {...field}
                      />
                      <p className="mt-2 text-sm text-foreground/60">
                        {t("create.steps.general_settings.sname.information")}
                      </p>
                      <FormMessage />
                    </div>
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="os_type"
              render={({ field }) => (
                <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-foreground/10 sm:pt-5">
                    <Label htmlFor="os_type" className="sm:mt-px sm:pt-2">
                      {t("create.steps.general_settings.os_type.label")}
                    </Label>
                    <div className="mt-1 space-y-8 sm:col-span-2 sm:mt-0">
                      <RadioGroup
                        className="grid grid-cols-2 gap-8 pt-2"
                        id="os_type"
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormItem>
                          <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                            <FormControl>
                              <RadioGroupItem
                                value="windows"
                                className="sr-only"
                              />
                            </FormControl>
                            <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                              <div className="flex flex-col gap-8 p-4">
                                <span>Microsoft Windows</span>
                                <div className="details flex justify-between">
                                  <div className="icons flex gap-2">
                                    <Icons.windows className="size-4" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </FormLabel>
                        </FormItem>

                        <FormItem className="relative">
                          <FormLabel className="relative [&:has([data-state=checked])>div]:border-primary">
                            <FormControl>
                              <RadioGroupItem
                                value="linux"
                                className="sr-only"
                              />
                            </FormControl>
                            <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                              <div className="flex flex-col gap-8 p-4">
                                <span>GNU/Linux</span>
                                <div className="details flex justify-between">
                                  <div className="icons flex gap-2">
                                    <Icons.linux className="size-4" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
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
