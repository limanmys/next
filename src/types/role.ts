export interface IRole {
  id: string
  name: string
  created_at: string
  updated_at: string
  counts: IRoleCounts
}

export interface IRoleCounts {
  users: number
  servers: number
  extensions: number
  liman: number
  functions: number
  variables: number
}
