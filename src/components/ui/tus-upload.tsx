import { ChangeEvent, useCallback, useState } from "react"
import { AlertCircle, UploadCloud } from "lucide-react"
import { useTranslation } from "react-i18next"
import { TusHooksUploadOptions, useTus } from "use-tus"

import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Button } from "./button"
import { Icons } from "./icons"
import { Input } from "./input"
import { Progress } from "./progress"

export const TusUpload = ({
  onSuccess,
}: {
  onSuccess: (filename: string | undefined) => void
}) => {
  const { t } = useTranslation("common")
  const {
    upload,
    setUpload,
    isUploading: uploading,
  } = useTus({
    autoAbort: true,
  })
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<string>("")

  const defaultOpts: TusHooksUploadOptions = {
    endpoint: "/upload",
    retryDelays: [0, 1000, 3000, 5000, 10000],
    overridePatchMethod: true,
    chunkSize: 1000 * 1000,
    onBeforeRequest(req) {
      return new Promise((resolve) => {
        var xhr = req.getUnderlyingObject()
        xhr.withCredentials = true
        resolve()
      })
    },
    onProgress: (bytesUploaded, bytesTotal) => {
      setProgress((bytesUploaded / bytesTotal) * 100)
    },
    onError: (error) => {
      setError(error.message)
    },
    headers: {
      Accept: "application/json",
    },
  }

  const handleSetUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.item(0)

      if (!file) {
        return
      }

      setUpload(file, {
        ...defaultOpts,

        metadata: {
          filename: file.name,
          filetype: file.type,
        },

        onSuccess: async function (upload) {
          onSuccess(upload.url?.substring(upload.url.lastIndexOf("/") + 1))
        },
      })
    },
    [setUpload]
  )

  const handleStart = useCallback(() => {
    if (!upload) {
      return
    }

    // Start upload the file.
    upload.start()
  }, [upload])

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <Alert>
          <AlertCircle className="size-4" />
          <AlertTitle>{t("information")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Input type="file" accept=".deb,.rpm" onChange={handleSetUpload} />
      <Progress value={progress} className="h-[10px]" />

      <div className="mt-5 flex justify-end">
        <Button onClick={handleStart} disabled={uploading}>
          {!uploading ? (
            <UploadCloud className="mr-2 size-4" />
          ) : (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          )}
          {t("upload")}
        </Button>
      </div>
    </div>
  )
}
