// TODO: Create server-side pagination for this page

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { ScrollText } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IAccessLog } from "@/types/access_log"
import { DivergentColumn } from "@/types/table"
import { compareNumericString } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import PageHeader from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function ServerExtensionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IAccessLog[]>([])
  const { i18n } = useTranslation()
  const { t } = useTranslation("servers")

  const columns: DivergentColumn<IAccessLog, string>[] = [
    {
      accessorKey: "extension_id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("access_logs.extension_id.title")}
        />
      ),
      title: t("access_logs.extension_id.title"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <AccessLogDetailsWindow id={row.original.log_id} />{" "}
          {row.original.extension_id}
        </div>
      ),
    },
    {
      accessorKey: "view",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("access_logs.view.title")}
        />
      ),
      title: t("access_logs.view.title"),
    },
    {
      accessorKey: "user_id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("access_logs.user_id.title")}
        />
      ),
      title: t("access_logs.user_id.title"),
    },
    {
      accessorKey: "ts",
      accessorFn: (row) => {
        return new Date(row.ts * 1000).toLocaleDateString(i18n.language, {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("access_logs.ts.title")}
        />
      ),
      title: t("access_logs.ts.title"),
      sortingFn: compareNumericString,
    },
  ]

  const fetchData = () => {
    if (!router.query.server_id) return

    apiService
      .getInstance()
      .get(`/servers/${router.query.server_id}/access_logs`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [router.query.server_id])

  return (
    <>
      <PageHeader
        title={t("access_logs.page_header.title")}
        description={t("access_logs.page_header.description")}
      />
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      />
    </>
  )
}

function AccessLogDetailsWindow({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>([])
  const { t } = useTranslation("servers")

  const fetchStatus = () => {
    setLoading(true)
    apiService
      .getInstance()
      .get(`/servers/${router.query.server_id}/access_logs/${id}`)
      .then((response) => {
        setData(response.data)
        setLoading(false)
      })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ScrollText
          className="h-4 w-4 cursor-pointer"
          onClick={() => fetchStatus()}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("access_logs.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("access_logs.dialog.description")}
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="relative grid gap-4">
            <Accordion type="single" collapsible className="w-full">
              {data?.map((item: any, index: any) => {
                return (
                  <AccordionItem value={index + 1} key={index + 1}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>
                      <pre className="max-w-0">{item.message}</pre>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
