export interface INotification {
  id: string
  notification_id: string
  title: string
  content: string
  level: string
  send_at: string
  send_at_humanized: string
  read_at: any
  seen_at: any
}

export interface IExternalNotification {
  id: string
  name: string
  ip: string
  last_used: string
  created_at: string
  updated_at: string
}
