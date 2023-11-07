type IOperation = "create" | "install" | "update"
type IStatus = "pending" | "processing" | "done" | "failed"

export interface IQueue {
  id: string
  type: IOperation
  status: IStatus
  data: Data
  error: string
  created_at: string
  updated_at: string
}

export interface Data {
  path: string
  server_id: string
}
