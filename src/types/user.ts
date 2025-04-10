export interface IUser {
  id: string
  name: string
  email: string
  status: number
  last_login_at: string
  last_login_ip: string
  created_at: any
  updated_at: string
  forceChange: boolean
  objectguid: string
  auth_type: string
  username: string
  locale: string
  otp_enabled: boolean
  session_time: number
  permissions: ILimanPermissions
}

export interface IAccessToken {
  access_token: string
  token_type: string
  expires_in: number
  user: IUser
}

export interface IAuthLog {
  id: string
  user_id: string
  ip_address: string
  user_agent: string
  created_at: string
  updated_at: string
  user: IUser
}

export type DashboardEnum =
  | "servers"
  | "extensions"
  | "users"
  | "version"
  | "most_used_extensions"
  | "most_used_servers"
  | "auth_logs"

export interface ILimanPermissions {
  server_details: boolean
  server_services: boolean
  add_server: boolean
  update_server: boolean
  view_logs: boolean
  view: {
    sidebar: "servers" | "extensions"
    dashboard: DashboardEnum[]
    redirect: string | null
  }
}
