export interface IAccessLog {
  level: string
  ts: number
  msg: string
  lmn_level: string
  log_id: string
  user_id: string
  route: string
  ip_address: any[]
  request_details: IRequestDetails
  extension_id: string
  view: string
}

export interface IRequestDetails {
  extension_id: string
  lmntargetFunction: string
  server_id: string
  token: string
}
