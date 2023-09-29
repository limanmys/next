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

export default function ConnectionInformation({
  formRef,
  data,
}: {
  formRef: any
  data: any
}) {
  const { t } = useTranslation("servers")

  const informationSchema = z.object({
    ip_address: z
      .string()
      .nonempty(t("create.steps.connection_information.validation.ip_address")),
    port: z
      .string()
      .max(5, {
        message: t("create.steps.connection_information.validation.port.max"),
      })
      .nonempty(
        t("create.steps.connection_information.validation.port.nonempty")
      ),
  })

  const form = useForm<z.infer<typeof informationSchema>>({
    resolver: zodResolver(informationSchema),
    defaultValues: {
      ip_address: "",
      port: "",
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
            {t("create.steps.connection_information.name")}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-foreground/60">
            {t("create.steps.connection_information.description")}
          </p>
        </div>
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="ip_address"
              render={({ field }) => (
                <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-foreground/10 sm:pt-5">
                    <Label htmlFor="ip_address" className="sm:mt-px sm:pt-2">
                      {t(
                        "create.steps.connection_information.ip_address.label"
                      )}
                    </Label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <Input
                        type="text"
                        id="ip_address"
                        placeholder="127.0.0.1"
                        {...field}
                      />
                      <p className="mt-2 text-sm text-foreground/60">
                        {t(
                          "create.steps.connection_information.ip_address.information"
                        )}
                      </p>
                      <FormMessage />
                    </div>
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-foreground/10 sm:pt-5">
                    <Label htmlFor="port" className="sm:mt-px sm:pt-2">
                      {t("create.steps.connection_information.port.label")}
                    </Label>
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
                              <RadioGroupItem
                                value="5986"
                                className="sr-only"
                              />
                            </FormControl>
                            <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                              <div className="flex flex-col gap-8 p-4">
                                <span>WinRM</span>
                                <div className="details flex justify-between">
                                  <span className="text-foreground/50">
                                    5986
                                  </span>
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
                                  <span className="text-foreground/50">
                                    636
                                  </span>
                                  <div className="icons flex gap-2">
                                    <Icons.windows className="h-4 w-4" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <div>
                        <Input
                          type="text"
                          id="port"
                          {...field}
                          onChange={field.onChange}
                          className="mb-3"
                        />
                        <FormMessage />
                      </div>
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
