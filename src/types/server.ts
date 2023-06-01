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
