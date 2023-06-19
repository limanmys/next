import { ReactElement, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"

import { IExtension } from "@/types/extension"
import { DivergentColumn } from "@/types/table"
import { useEmitter } from "@/hooks/useEmitter"
import { Checkbox } from "@/components/ui/checkbox"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"
import AssignFunction from "@/components/settings/assign-function"
import { FunctionExtensionActions } from "@/components/settings/function-extension-actions"

import RoleLayout from "./_layout"

const RoleFunctionsList: NextPageWithLayout = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IExtension[]>([])
  const [selected, setSelected] = useState<IExtension[]>([])
  const tableRef = useRef()

  const router = useRouter()
  const emitter = useEmitter()

  const [extensions, setExtensions] = useState<IExtension[]>([])

  useEffect(() => {
    if (!router.query.role_id) return
    apiService
      .getInstance()
      .get(`/settings/extensions`)
      .then((res) => {
        setExtensions(res.data)
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
    if (!router.query.role_id) return

    apiService
      .getInstance()
      .get(`/settings/roles/${id ? id : router.query.role_id}/functions`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [router.query.role_id])

  useEffect(() => {
    emitter.on("REFETCH_FUNCTIONS", (id) => {
      fetchData(id as string)
    })
    return () => emitter.off("REFETCH_FUNCTIONS")
  }, [])

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
        <AssignFunction />
      </DataTable>
    </>
  )
}

RoleFunctionsList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleFunctionsList
