import { IMenu } from "./server"

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
  updated: number
  licensed: boolean
}

export interface IExtensionSetting {
  required: IExtensionVariable[]
  advanced: IExtensionVariable[]
  has_global_variables: boolean
  values: {
    [key: string]: string
  }
}

type IExtensionVariableTypes = "text" | "password" | "server" | "extension"

export interface IExtensionVariable {
  variable: string
  type: IExtensionVariableTypes
  name: string
  required: boolean
  global: boolean
  writable: boolean
  value: string
}
