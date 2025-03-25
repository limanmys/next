import { NextPageWithLayout } from "@/pages/_app"
import { http } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { MinusCircle, PlusCircle } from "lucide-react"
import { useRouter } from "next/router"
import { ReactElement, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import RoleLayout from "@/components/_layout/role_layout"
import { Form, FormField, FormMessage } from "@/components/form/form"
import { SelectExtension } from "@/components/selectbox/extension-select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useEmitter } from "@/hooks/useEmitter"
import { setFormErrors } from "@/lib/utils"
import { IFunction } from "@/types/function"
import { DivergentColumn } from "@/types/table"

const RoleVariablesList: NextPageWithLayout = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IFunction[]>([])
  const [selected, setSelected] = useState<IFunction[]>([])
  const tableRef = useRef<any>(undefined)
  const { t } = useTranslation("settings")
  const { toast } = useToast()

  const router = useRouter()
  const emitter = useEmitter()

  const columns: DivergentColumn<IFunction, string>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "key",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("roles.variables.key")}
        />
      ),
      title: t("roles.variables.key"),
    },
    {
      accessorKey: "value",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("roles.variables.value")}
        />
      ),
      title: t("roles.variables.value"),
    },
  ]

  const fetchData = (id?: string) => {
    http
      .get(`/settings/roles/${id ? id : router.query.role_id}/variables`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!router.query.role_id) return

    fetchData()
  }, [router.query.role_id])

  useEffect(() => {
    emitter.on("REFETCH_VARIABLES", (id) => {
      fetchData(id as string)
    })
    return () => emitter.off("REFETCH_VARIABLES")
  }, [])

  const deleteSelected = () => {
    if (!selected?.length) return

    http
      .delete(`/settings/roles/${router.query.role_id}/functions`, {
        data: {
          permission_ids: selected.map((s) => s.id),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("success"),
            description: t("roles.variables.delete.success"),
          })
          fetchData()
          emitter.emit("REFETCH_ROLE", router.query.role_id)
          tableRef.current?.resetRowSelection()
          setSelected([])
        } else {
          toast({
            title: t("error"),
            description: t("roles.variables.delete.error"),
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("roles.variables.delete.error"),
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title={t("roles.variables.title")}
        description={t("roles.variables.description")}
      />

      <DataTable
        tableRef={tableRef}
        columns={columns}
        data={data}
        loading={loading}
        selectable={true}
        onSelectedRowsChange={(rows) => setSelected(rows)}
      >
        <div className="flex gap-2">
          <CreateVariable />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto h-8 lg:flex"
                size="sm"
                disabled={!selected?.length}
              >
                <MinusCircle className="mr-2 size-4" />
                {t("roles.variables.delete.button")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("roles.variables.delete.title")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("roles.variables.delete.description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("roles.variables.delete.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteSelected()}>
                  {t("roles.variables.delete.delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DataTable>
    </>
  )
}

function CreateVariable() {
  const router = useRouter()
  const { t, i18n } = useTranslation("settings")
  const { toast } = useToast()
  const emitter = useEmitter()

  const formSchema = z.object({
    key: z.string().min(1),
    value: z.any(),
    type: z.any(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
      value: "",
      type: "string",
    },
  })

  const [selectedExtension, setSelectedExtension] = useState<string>(null!)
  const [data, setData] = useState<any[]>([])
  const [selectedVariable, setSelectedVariable] = useState<any>(null!)

  const fetchVariableList = (extension: string) => {
    if (!extension) return

    setSelectedExtension(extension)

    if (extension === "default") {
      setData([])
      return
    }

    http
      .get(`/settings/extensions/${extension}/variables`)
      .then((res) => {
        setData(res.data)
      })
  }

  const [open, setOpen] = useState<boolean>(false)
  // Reset form on open state change
  useEffect(() => {
    if (open) {
      form.reset()
      setSelectedExtension(null!)
      setData([])
      setSelectedVariable(null!)
    }
  }, [open])
  const handleCreate = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    http
      .post(`/settings/roles/${router.query.role_id}/variables`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("success"),
            description: t("roles.variables.create.success"),
          })
          emitter.emit("REFETCH_VARIABLES", router.query.role_id)
          emitter.emit("REFETCH_ROLE", router.query.role_id)
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: t("error"),
            description: t("roles.variables.create.error"),
            variant: "destructive",
          })
        }
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("error"),
            description: t("roles.variables.create.error"),
            variant: "destructive",
          })
        }
      })
      .finally(() => {
        // reset all states and values
        setSelectedExtension(null!)
        setData([])
        setSelectedVariable(null!)
      })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <PlusCircle className="mr-2 size-4" />
          {t("roles.variables.create.button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{t("roles.variables.create.title")}</DialogTitle>
          <DialogDescription>
            {t("roles.variables.create.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-5"
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key" className="text-right">
                {t("roles.variables.create.extension")}
              </Label>
              <div className="col-span-3">
                <SelectExtension
                  onValueChange={(value) => fetchVariableList(value)}
                  endpoint={`/settings/roles/${router.query.role_id}/extensions?variable_selector=1`}
                />
              </div>
            </div>

            {selectedExtension &&
              selectedExtension !== "default" &&
              data.length > 0 && (
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="key" className="text-right">
                        {t("roles.variables.create.key_selectable")}
                      </Label>
                      <div className="col-span-3">
                        <Select
                          onValueChange={(value) => {
                            const obj = data.find((item) => item.key === value)
                            setSelectedVariable(obj)
                            form.setValue("type", obj.type)
                            if (obj.type === "multiselect") {
                              form.setValue("value", [])
                            }
                            field.onChange(value)
                          }}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "roles.variables.create.key_placeholder"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {data.map((item) => (
                              <SelectItem key={item.key} value={item.key}>
                                {item.options.label[i18n.language] || item.key}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                />
              )}

            {selectedVariable &&
              selectedVariable.type &&
              selectedVariable.type === "text" && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="value" className="-mt-6 text-right">
                        {selectedVariable.options.label[i18n.language] ||
                          selectedVariable.key}
                      </Label>
                      <div className="col-span-3">
                        <Input id="value" {...field} />
                        <small className="italic text-muted-foreground">
                          {selectedVariable.options.description[
                            i18n.language
                          ] || selectedVariable.key}
                        </small>
                        <FormMessage className="mt-1" />
                      </div>
                    </div>
                  )}
                />
              )}

            {selectedVariable &&
              selectedVariable.type &&
              selectedVariable.type === "select" && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="value" className="-mt-6 text-right">
                        {selectedVariable.options.label[i18n.language] ||
                          selectedVariable.key}
                      </Label>
                      <div className="col-span-3">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "roles.variables.create.value_placeholder"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedVariable.options.selections.map(
                              (item: any) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label[i18n.language] || item.value}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <small className="italic text-muted-foreground">
                          {selectedVariable.options.description[
                            i18n.language
                          ] || selectedVariable.key}
                        </small>
                        <FormMessage className="mt-1" />
                      </div>
                    </div>
                  )}
                />
              )}

            {selectedVariable &&
              selectedVariable.type &&
              selectedVariable.type === "radio" && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="value" className="-mt-6 text-right">
                        {selectedVariable.options.label[i18n.language] ||
                          selectedVariable.key}
                      </Label>
                      <div className="col-span-3">
                        <div className="grid grid-cols-2 gap-4">
                          <RadioGroup
                            id="value"
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            {selectedVariable.options.selections.map(
                              (item: any) => (
                                <div className="flex items-center gap-2">
                                  <RadioGroupItem
                                    key={item.value}
                                    value={item.value}
                                  />
                                  <Label>
                                    {item.label[i18n.language] || item.value}
                                  </Label>
                                </div>
                              )
                            )}
                          </RadioGroup>
                        </div>
                        <small className="italic text-muted-foreground">
                          {selectedVariable.options.description[
                            i18n.language
                          ] || selectedVariable.key}
                        </small>
                        <FormMessage className="mt-1" />
                      </div>
                    </div>
                  )}
                />
              )}

            {selectedVariable &&
              selectedVariable.type &&
              selectedVariable.type === "multiselect" && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="value" className="-mt-6 text-right">
                        {selectedVariable.options.label[i18n.language] ||
                          selectedVariable.key}
                      </Label>
                      <div className="col-span-3 flex flex-col gap-3">
                        {selectedVariable.options.selections.map(
                          (item: any) => {
                            return (
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  key={item.value}
                                  value={item.value}
                                  checked={field.value.includes(item.value)}
                                  onCheckedChange={(value) => {
                                    if (value) {
                                      field.onChange([
                                        ...field.value,
                                        item.value,
                                      ])
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (v: any) => v !== item.value
                                        )
                                      )
                                    }
                                  }}
                                />
                                <Label htmlFor={item.value}>
                                  {item.label[i18n.language] || item.value}
                                </Label>
                              </div>
                            )
                          }
                        )}
                        <small className="italic text-muted-foreground">
                          {selectedVariable.options.description[
                            i18n.language
                          ] || selectedVariable.key}
                        </small>
                        <FormMessage className="mt-1" />
                      </div>
                    </div>
                  )}
                />
              )}

            {(selectedExtension === "default" || data.length === 0) && (
              <>
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="key" className="text-right">
                        {t("roles.variables.create.key")}
                      </Label>
                      <div className="col-span-3">
                        <Input id="key" {...field} />
                        <FormMessage className="mt-1" />
                      </div>
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="value" className="text-right">
                        {t("roles.variables.create.value")}
                      </Label>
                      <div className="col-span-3">
                        <Input id="value" {...field} />
                        <FormMessage className="mt-1" />
                      </div>
                    </div>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button type="submit">
                <PlusCircle className="mr-2 size-4" />
                {t("roles.variables.create.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

RoleVariablesList.getLayout = function getLayout(page: ReactElement<any>) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleVariablesList
