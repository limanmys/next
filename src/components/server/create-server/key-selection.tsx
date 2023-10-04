import { zodResolver } from "@hookform/resolvers/zod"
import { Ban, FileKey2, Key } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Icons } from "@/components/ui/icons"
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

export default function KeySelection({
  formRef,
  data,
}: {
  formRef: any
  data: any
}) {
  const { t } = useTranslation("servers")

  const keySchema = z.object({
    key_type: z
      .string()
      .min(1, t("create.steps.key_selection.validation.key_type")),
  })

  const form = useForm<z.infer<typeof keySchema>>({
    resolver: zodResolver(keySchema),
    defaultValues: {
      key_type: "",
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
            {t("create.steps.key_selection.name")}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-foreground/60">
            {t("create.steps.key_selection.description")}
          </p>
        </div>
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="key_type"
              render={({ field }) => (
                <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-foreground/10 sm:pt-5">
                    <Label htmlFor="key_type" className="sm:mt-px sm:pt-2">
                      {t("create.steps.key_selection.key_type.label")}
                    </Label>
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
                                <span>{t("ssh")}</span>
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
                                <span>{t("ssh_certificate")}</span>
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
                              <RadioGroupItem
                                value="winrm"
                                className="sr-only"
                              />
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
                                <span>{t("winrm_insecure")}</span>
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
                                <span>{t("no_key")}</span>
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
