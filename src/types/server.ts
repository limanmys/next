import { IExtension } from "./extension"

export interface IServer {
  id: string
  name: string
  type: string
  ip_address: string
  control_port: string
  user_id: string
  created_at: string
  updated_at: string
  os: string
  enabled: string
  key_port: number
  shared_key: number
  is_online: boolean
  extension_count: number
  extensions: IExtension[]
  is_favorite: boolean
  can_run_command: boolean
}

export interface IMenu {
  name:
    | string
    | {
        tr: string
        en: string
        de: string
      }
  url: string
  icon: string | undefined
  children?: IMenu[]
}

export interface IServerDetails {
  hostname: string
  os: string
  services: number
  processes: string
  uptime: string
  user: string
}

export interface IServerStats {
  cpu: number
  ram: number
  io: number
  network: IServerNetworkStats
  time: number
}

export interface IServerNetworkStats {
  download: number
  upload: number
}

export interface IServerCpuUsage {
  pid: string
  percent: string
  user: string
  cmd: string
}

export interface IServerDiskUsage {
  percent: string
  source: string
  size: string
  used: string
}

export interface IServerSpecs {
  cpu: string
  ram: string
  model: string
  manufacturer: string
}
