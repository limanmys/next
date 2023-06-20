export interface IFunction {
  id: string
  morph_id: string
  created_at: string
  updated_at: string
  type: string
  key: string
  value: string
  extra: string
  blame: string
  morph_type: string
  display_name: string
  description: string
}

export interface IMiniFunction {
  name: string
  description: string
}
