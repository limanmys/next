import { useEffect, useState } from "react"

import { IServer } from "@/types/server"
import { DivergentColumn } from "@/types/table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

export default function Servers() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IServer[]>([])

  const columns: DivergentColumn<IServer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
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
        <DataTableColumnHeader column={column} title="Sunucu Adı" />
      ),
      title: "Sunucu Adı",
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "ip_address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="IP Adresi" />
      ),
      title: "IP Adresi",
    },
    {
      accessorKey: "control_port",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kontrol Portu" />
      ),
      title: "Kontrol Portu",
    },
    {
      accessorKey: "extension_count",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Eklenti Sayısı" />
      ),
      title: "Eklenti Sayısı",
    },
  ]

  useEffect(() => {
    setLoading(true)
    fetch(`https://liman.io/api/servers`, {
      headers: {
        "liman-token":
          "P53xvcLDByZeEf9Tb7Ksjfd2COrYTxK8JfCtct2UPOTSTMRKaTOIMoOlxJUceQYj",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <div className="p-[24px]">
        <h2 className="mb-5 text-3xl font-bold tracking-tight">Sunucular</h2>
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          selectable={true}
          onSelectedRowsChange={(rows) => console.log(rows)}
        />
      </div>
    </>
  )
}
