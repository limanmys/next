export interface IService {
  name: string
  description: string
  status: IServiceStatus
}

export interface IServiceStatus {
  loaded: boolean
  active: boolean
  running: string
}
