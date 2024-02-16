import { apiService } from "@/services"
import { Check, ChevronLeft, Clock, Loader, UploadCloud, X } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { TusClientProvider } from "use-tus"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { TusUpload } from "@/components/ui/tus-upload"
import { useToast } from "@/components/ui/use-toast"
import { compareNumericString } from "@/lib/utils"
import { IQueue } from "@/types/queue"
import { DivergentColumn } from "@/types/table"

export default function PackageInstallPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IQueue[]>([])
  const { t, i18n } = useTranslation("servers")

  const columns: DivergentColumn<IQueue, string>[] = [
    {
      accessorKey: "data.path",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("packages.accessor_path_title")}
        />
      ),
      title: t("packages.accessor_path_title"),
      accessorFn: (row) => {
        // Get filename from path
        const path = row.data.path
        const filename = path.substring(path.lastIndexOf("/") + 1)

        return filename
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("packages.accessor_status_title")}
        />
      ),
      title: t("packages.accessor_status_title"),
      accessorFn: (row) => t(`packages.status_${row.status}`),
      cell: ({ row }) => {
        const status = row.original.status
        const color =
          status === "done"
            ? "green"
            : status === "failed"
            ? "red"
            : status === "pending" || status === "processing"
            ? "yellow"
            : "gray"

        const Icon =
          status === "done"
            ? Check
            : status === "failed"
            ? X
            : status === "pending"
            ? Clock
            : Loader

        return (
          <div className="flex items-center gap-2">
            <div
              className={`${status === "processing" && "animate-spin-slow"}`}
            >
              <Icon className={`text-${color}-500 h-4 w-4 `} />
            </div>

            <Badge className={`bg-${color}-500 hover:bg-${color}-700`}>
              {t(`packages.status_${status}`)}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "error",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("packages.accessor_error_title")}
        />
      ),
      title: t("packages.accessor_error_title"),
      cell: ({ row }) => {
        const error = row.original.error

        return error ? (
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-red-500" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>{t("packages.no_error")}</span>
          </div>
        )
      },
      accessorFn: (row) => row.error || t("packages.no_error"),
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("packages.accessor_last_changed_title")}
        />
      ),
      title: t("packages.accessor_last_changed_title"),
      accessorFn: (row) =>
        new Date(row.updated_at).toLocaleDateString(i18n.language, {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      sortingFn: compareNumericString,
    },
  ]

  const fetchData = () => {
    if (!router.query.server_id) return

    apiService
      .getInstance()
      .get<IQueue[]>(`/servers/${router.query.server_id}/packages/queue`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()

    const interval = setInterval(() => {
      fetchData()
    }, 10000)

    return () => clearInterval(interval)
  }, [router.query.server_id])

  return (
    <>
      <PageHeader
        title={t("packages.upload")}
        description={t("packages.page_header.description")}
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8 lg:flex"
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("packages.go_back")}
          </Button>
          <TusClientProvider>
            <UploadPackage />
          </TusClientProvider>
        </div>
      </DataTable>
    </>
  )
}

function UploadPackage() {
  const [open, setOpen] = useState<boolean>(false)
  const { t } = useTranslation("servers")
  const router = useRouter()
  const { toast } = useToast()

  const onSuccess = (file: string | undefined) => {
    if (!file) {
      return
    }

    apiService
      .getInstance()
      .post<IQueue>(`/servers/${router.query.server_id}/packages/queue`, {
        file,
      })
      .then(() => {
        setOpen(false)
        toast({
          title: t("success"),
          description: t("packages.upload_success"),
        })
      })
      .catch((err) => {
        toast({
          title: t("error"),
          description: err.response.data.file || err.response.data.message || err.response.data,
        })
      })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="ml-auto h-8 lg:flex">
          <UploadCloud className="mr-2 h-4 w-4" />
          {t("packages.upload")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("packages.upload")}</DialogTitle>
          <DialogDescription>
            {t("packages.upload_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <TusUpload onSuccess={onSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
