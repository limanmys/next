import { IExtension } from "./extension"
import { IServer } from "./server"

export interface IMostUsedExtension {
  id: string
  user_id: string
  extension_id: string
  server_id: string
  usage: number
  extension: IExtension
  server: IServer
}
