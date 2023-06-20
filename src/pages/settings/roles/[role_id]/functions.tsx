import { ReactElement, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { MinusCircle } from "lucide-react"

import { IExtension } from "@/types/extension"
import { DivergentColumn } from "@/types/table"
import { useEmitter } from "@/hooks/useEmitter"
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
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import AssignFunction from "@/components/settings/assign-function"
import { FunctionExtensionActions } from "@/components/settings/function-extension-actions"

import RoleLayout from "../../../../components/_layout/role_layout"

const RoleFunctionsList: NextPageWithLayout = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IExtension[]>([])
  const [selected, setSelected] = useState<IExtension[]>([])
  const tableRef = useRef<any>()
  const { toast } = useToast()

  const router = useRouter()
  const emitter = useEmitter()

  const [extensions, setExtensions] = useState<IExtension[]>([])

  useEffect(() => {
    if (!router.query.role_id) return

    apiService
      .getInstance()
      .get(`/settings/roles/${router.query.role_id}/extensions`)
      .then((res) => {
        setExtensions(res.data.selected)
      })
  }, [router.query.role_id])

  const columns: DivergentColumn<IExtension, string>[] = [
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
      accessorKey: "display_name",
      header: ({ column }) => (
        <FunctionExtensionActions
          column={column}
          title="Eklenti Adı"
          extensions={extensions}
        />
      ),
      title: "Eklenti Adı",
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fonksiyon Adı" />
      ),
      title: "Fonksiyon Adı",
    },
  ]

  const fetchData = (id?: string) => {
    apiService
      .getInstance()
      .get(`/settings/roles/${id ? id : router.query.role_id}/functions`)
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
    emitter.on("REFETCH_FUNCTIONS", (id) => {
      fetchData(id as string)
    })
    return () => emitter.off("REFETCH_FUNCTIONS")
  }, [])

  const deleteSelected = () => {
    if (!selected?.length) return

    apiService
      .getInstance()
      .delete(`/settings/roles/${router.query.role_id}/functions`, {
        data: {
          permission_ids: selected.map((s) => s.id),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Başarılı",
            description: "İzinler başarıyla silindi.",
          })
          fetchData()
          tableRef.current?.resetRowSelection()
          emitter.emit("REFETCH_ROLE", router.query.role_id)
          setSelected([])
        } else {
          toast({
            title: "Hata",
            description: "İzinler silinirken bir hata oluştu.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "İzinler silinirken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title="Fonksiyon İzinleri"
        description="Eklentilerin iç izinlerini detaylı şekilde bu sayfa aracılığıyla yönetebilirsiniz."
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
          <AssignFunction />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto h-8 lg:flex"
                size="sm"
                disabled={!selected?.length}
              >
                <MinusCircle className="mr-2 h-4 w-4" />
                Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. Seçilen izinler kaldırılacaktır, devam
                  etmek istiyor musunuz?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteSelected()}>
                  Onayla
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DataTable>
    </>
  )
}

RoleFunctionsList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleFunctionsList
