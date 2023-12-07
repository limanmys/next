export interface ISubscription {
  type: string
  owner: string
  valid: boolean
  client_count: number
  timestamp: number
  functions: string
}

export interface ILimanSubscription {
  issuer: string
  issued: string
  issued_no: string
  membership_start_time: number
  coverage_start: number
  coverage_end: number
  package_type: string
}
