import { useState } from "react"
import { apiService } from "@/services"
import { UploadCloud } from "lucide-react"
import { useTranslation } from "react-i18next"

import { useEmitter } from "@/hooks/useEmitter"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function UploadExtension() {
  const { toast } = useToast()
  const emitter = useEmitter()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const { t } = useTranslation("settings")

  const upload = async (customRequest: any) => {
    return new Promise<number>((resolve, reject) => {
      setLoading(true)
      apiService
        .getInstance()
        .post(
          `/settings/extensions/upload`,
          {
            extension: file,
            ...customRequest,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: t("success"),
              description: res.data.message,
            })
            emitter.emit("REFETCH_EXTENSIONS")
            setOpen(false)
            resolve(res.status)
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 413) {
            toast({
              title: t("error"),
              description: t("extensions.upload.file_too_large"),
              variant: "destructive",
            })
            reject(413)
            return
          }

          if (error.response && error.response.status === 422) {
            toast({
              title: t("error"),
              description:
                error.response.data[Object.keys(error.response.data)[0]],
              variant: "destructive",
            })
            reject(422)
            return
          }

          toast({
            title: t("error"),
            description: JSON.stringify(error.response.data),
            variant: "destructive",
          })
          reject(500)
        })
        .finally(() => setLoading(false))
    })
  }

  const handleCreate = () => {
    upload({}).then((status) => {
      if (status === 200) {
        setFile(null)
        setOpen(false)
      }
    })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="ml-auto h-8 lg:flex">
          <UploadCloud className="mr-2 h-4 w-4" />
          {t("extensions.upload.upload")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("extensions.upload.title")}</DialogTitle>
          <DialogDescription>
            {t("extensions.upload.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <Label htmlFor="extension">{t("extensions.upload.file")}</Label>
          <Input
            id="extension"
            type="file"
            accept=".zip,.signed,.lmne"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="mr-2"
          >
            {t("extensions.upload.cancel")}
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {!loading ? (
              <UploadCloud className="mr-2 h-4 w-4" />
            ) : (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("extensions.upload.upload")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
