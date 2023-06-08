import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  SIDEBARCTX_STATES,
  useSidebarContext,
} from "@/providers/sidebar-provider"
import { apiService } from "@/services"
import {
  Link2,
  MinusCircle,
  PlusCircle,
  Upload,
  UploadCloud,
} from "lucide-react"

import { IExtension } from "@/types/extension"
import { DivergentColumn } from "@/types/table"
import { compareNumericString } from "@/lib/utils"
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
import { useToast } from "@/components/ui/use-toast"
import AssignExtension from "@/components/server/assign-extension"

export default function ServerExtensionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IExtension[]>([])
  const [selected, setSelected] = useState<IExtension[]>([])
  const tableRef = useRef<any>()
  const sidebarCtx = useSidebarContext()
  const { toast } = useToast()

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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Eklenti Adı" />
      ),
      title: "Eklenti Adı",
      cell: ({ row }) => (
        <Link
          href={`/servers/${
            sidebarCtx[SIDEBARCTX_STATES.selected]
          }/extensions/${row.original.id}`}
        >
          {row.original.name}
          <Link2 className="ml-2 inline-block h-4 w-4" />
        </Link>
      ),
    },
    {
      accessorKey: "version",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Versiyon" />
      ),
      title: "Versiyon",
    },
    {
      accessorKey: "updated",
      accessorFn: (row) => {
        return new Date(row.updated).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Güncellenme Tarihi" />
      ),
      title: "Güncellenme Tarihi",
      sortingFn: compareNumericString,
    },
  ]

  const fetchData = () => {
    if (!router.query.server_id) return

    apiService
      .getInstance()
      .get(`/servers/${router.query.server_id}/extensions`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [router.query.server_id])

  const onAssignExtension = (extensions: IExtension[]) => {
    const values = extensions.map((i) => i.id)

    apiService
      .getInstance()
      .post(`extensions/assign?server_id=${router.query.server_id}`, {
        extensions: values,
      })
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Seçtiğiniz eklentiler sunucuya başarıyla atandı.",
        })
        sidebarCtx[SIDEBARCTX_STATES.refreshSelected]()
        fetchData()
      })
  }

  const onUnassignExtension = (extensions: IExtension[]) => {
    const values = extensions.map((i) => i.id)

    apiService
      .getInstance()
      .post(`extensions/unassign?server_id=${router.query.server_id}`, {
        extensions: values,
      })
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Seçtiğiniz eklentiler sunucudan başarıyla kaldırıldı.",
        })
        setSelected([])
        tableRef.current?.resetRowSelection()
        sidebarCtx[SIDEBARCTX_STATES.refreshSelected]()
        fetchData()
      })
  }

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Eklentiler</h2>
            <p className="text-muted-foreground">
              Sunucunuzda kullanılan eklentileri bu sayfa aracılığı ile
              yönetebilirsiniz.
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="rounded-full">
              <UploadCloud className="mr-2 h-4 w-4" />
              Eklenti Yükle
            </Button>
          </div>
        </div>
      </div>
      <DataTable
        tableRef={tableRef}
        columns={columns}
        data={data}
        loading={loading}
        selectable={true}
        onSelectedRowsChange={(rows) => setSelected(rows)}
      >
        <div className="flex gap-2">
          <AssignExtension
            serverId={router.query.server_id as string}
            onAssign={onAssignExtension}
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto hidden h-8 lg:flex"
                disabled={selected.length === 0}
              >
                <MinusCircle className="mr-2 h-4 w-4" />
                Çıkar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. Seçilen eklentiler sunucudan
                  kaldırılacaktır, devam etmek istiyor musunuz?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onUnassignExtension(selected)}
                >
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
