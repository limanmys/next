export interface ICertificate {
  id: string
  server_hostname: string
  origin: string
  created_at: string
  updated_at: string
  valid_to: string
  valid_from: string
}

export interface ICertificateDetails {
  ip_address: string
  port: number
  valid_to: string
  valid_from: string
  issuer_cn: string
  issuer_dc: string
  authority_key_identifier: string
  subject_key_identifier: string
}
