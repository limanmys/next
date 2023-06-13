import { useRef, useState } from "react"
import { AxiosResponse } from "axios"

interface DownloadFileProps {
  readonly apiDefinition: () => Promise<AxiosResponse<Blob>>
  readonly preDownloading: () => void
  readonly postDownloading: () => void
  readonly onError: () => void
  readonly getFileName: () => string
}

interface DownloadedFileInfo {
  readonly download: () => Promise<void>
  readonly ref: React.MutableRefObject<HTMLAnchorElement | null>
  readonly name: string | undefined
  readonly url: string | undefined
}

export const useDownloadFile = ({
  apiDefinition,
  preDownloading,
  postDownloading,
  onError,
  getFileName,
}: DownloadFileProps): DownloadedFileInfo => {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const [url, setFileUrl] = useState<string>()
  const [name, setFileName] = useState<string>()

  const download = async () => {
    try {
      preDownloading()
      const { data } = await apiDefinition()
      const url = URL.createObjectURL(new Blob([data]))
      setFileUrl(url)
      setFileName(getFileName())
      setTimeout(() => {
        ref.current?.click()
        postDownloading()
        URL.revokeObjectURL(url)
      }, 1000)
    } catch (error) {
      onError()
    }
  }

  return { download, ref, url, name }
}
