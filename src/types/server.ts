import { IExtension } from "./extension"

export interface IServer {
  id: string
  name: string
  type: string
  ip_address: string
  control_port: string
  user_id: string
  created_at: string
  updated_at: string
  os: string
  enabled: string
  key_port: number
  shared_key: number
  is_online: boolean
  extension_count: number
  extensions: IExtension[]
  is_favorite: boolean
  can_run_command: boolean
}

export interface IMenu {
  name:
  | string
  | {
    tr: string
    en: string
    de: string
  }
  url: string
  icon: string | undefined
  children?: IMenu[]
}

export interface IServerDetails {
  hostname: string
  os: string
  services: number
  processes: string
  uptime: string
  user: string
}

export interface IServerStats {
  cpu: number
  ram: number
  io: number
  network: IServerNetworkStats
  time: number
}

export interface IServerNetworkStats {
  download: number
  upload: number
}

export interface IServerCpuUsage {
  pid: string
  percent: string
  user: string
  cmd: string
}

export interface IServerDiskUsage {
  percent: string
  source: string
  size: string
  used: string
}

export interface IServerSpecs {
  cpu: string
  ram: string
  model: string
  manufacturer: string
}

// Kubernetes deployment details types
export interface IKubernetesDeploymentDetails {
  metadata: IKubernetesMetadata
  spec: IKubernetesSpec
  status: IKubernetesStatus
  pods: IKubernetesPod[]
  replicaSets: IKubernetesReplicaSet[]
}

export interface IKubernetesMetadata {
  annotations: { [key: string]: string }
  creationTimestamp: string
  labels: { [key: string]: string }
  name: string
  namespace: string
  uid: string
}

export interface IKubernetesSpec {
  replicas: number
  selector: {
    matchLabels: { [key: string]: string }
  }
  strategy: {
    type: string
  }
  template: {
    metadata: {
      creationTimestamp: string | null
      labels: { [key: string]: string }
    }
    spec: {
      containers: IKubernetesContainer[]
    }
  }
}

export interface IKubernetesContainer {
  name: string
  image: string
  ports: IKubernetesPort[]
  env: IKubernetesEnvVar[]
  command: string[] | null
  args: string[] | null
}

export interface IKubernetesPort {
  containerPort: number
  protocol: string
  name: string
}

export interface IKubernetesEnvVar {
  name: string
  value: string
}

export interface IKubernetesStatus {
  availableReplicas: number
  conditions: IKubernetesCondition[]
  observedGeneration: number
  readyReplicas: number
  replicas: number
  unavailableReplicas: number
}

export interface IKubernetesCondition {
  type: string
  status: string
  lastUpdateTime: string
  lastTransitionTime: string
  reason: string
  message: string
}

export interface IKubernetesPod {
  name: string
  status: string
  creationTime: string
  node: string
  containerStatuses: IKubernetesContainerStatus[]
}

export interface IKubernetesContainerStatus {
  name: string
  ready: boolean
  started: boolean
  image: string
}

export interface IKubernetesReplicaSet {
  name: string
  replicas: number
  readyReplicas: number
  creationTime: string
  ownerReference: IKubernetesOwnerReference[]
}

export interface IKubernetesOwnerReference {
  apiVersion: string
  kind: string
  name: string
  uid: string
  controller: boolean
  blockOwnerDeletion: boolean
}
