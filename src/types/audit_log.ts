import { IUser } from "./user"

export interface IAuditLog {
  id: string
  user_id: string
  ip_address: string
  action: string
  type: string
  details: any
  message: string
  created_at: string
  user: IUser
}
