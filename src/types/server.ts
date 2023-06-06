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
}

export interface IExtension {
  id: string
  name: string
  version: string
  icon: string
  service?: string
  created_at: string
  updated_at: string
  order: number
  sslPorts: any
  issuer: string
  language: string
  support: string
  displays: any
  status: string
  require_key: string
  display_name: string
  menus: IMenu[]
}

export interface IMenu {
  name: string
  url: string
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
