import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react"
import { AlertCircle, UploadCloud } from "lucide-react"
import { useTranslation } from "react-i18next"
import { UploadOptions, useTus } from "use-tus"

import { getAuthorizationHeader } from "@/lib/utils"

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
  const { upload, setUpload, isSuccess } = useTus({
    autoAbort: true,
  })
  const [progress, setProgress] = useState<number>(0)
  const [uploading, setUploading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const defaultOpts: UploadOptions = {
    endpoint: "/upload",
    retryDelays: [0, 1000, 3000, 5000, 10000],
    overridePatchMethod: true,
    chunkSize: 1000 * 1000,
    onProgress: (bytesUploaded, bytesTotal) => {
      setUploading(true)
      setProgress((bytesUploaded / bytesTotal) * 100)
    },
    onError: (error) => {
      setUploading(false)
      setError(error.message)
    },
    headers: {
      ...getAuthorizationHeader(),
      Accept: "application/json",
    },
  }

  const urlRef = useRef<string | null | undefined>("")

  const uploadedUrl = useMemo(() => {
    urlRef.current = isSuccess ? upload?.url : ""

    return isSuccess && upload?.url
  }, [upload, isSuccess])

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

        onSuccess: async function () {
          setTimeout(() => {
            setUploading(false)
            onSuccess(
              urlRef.current?.substring(urlRef.current?.lastIndexOf("/") + 1)
            )
          }, 2000)
        },
      })
    },
    [setUpload, uploadedUrl]
  )

  const handleStart = useCallback(() => {
    if (!upload) {
      return
    }

    // Start upload the file.
    setUploading(true)
    upload.start()
  }, [upload])

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("information")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Input type="file" accept=".deb,.rpm" onChange={handleSetUpload} />
      <Progress value={progress} className="h-[10px]" />

      <div className="mt-5 flex justify-end">
        <Button onClick={handleStart} disabled={uploading}>
          {!uploading ? (
            <UploadCloud className="mr-2 h-4 w-4" />
          ) : (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t("upload")}
        </Button>
      </div>
    </div>
  )
}
