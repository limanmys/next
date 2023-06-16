import * as React from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"

import { IServer } from "@/types/server"

const Context = React.createContext([] as any)

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const router = useRouter()
  const [selected, setSelected] = React.useState<string>("")
  const [selectedLoading, setSelectedLoading] = React.useState<boolean>(true)
  const [selectedData, setSelectedData] = React.useState<IServer>({} as IServer)
  const [settingsActive, setSettingsActive] = React.useState<boolean>(false)
  const [serversLoading, setServersLoading] = React.useState<boolean>(true)
  const [servers, setServers] = React.useState<IServer[]>([])
  const [collapsed, setCollapsed] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (router.asPath.includes("/settings")) {
      setSettingsActive(true)
      setSelected("")
    } else {
      setSettingsActive(false)
    }
  }, [router.asPath])

  React.useEffect(() => {
    if (router.query.server_id) {
      setSelected(router.query.server_id as string)
    } else {
      setSelected("")
    }
  }, [router.query.server_id])

  const refreshSelected = () => {
    apiService
      .getInstance()
      .get(`/menu/servers/${selected}`)
      .then((res) => {
        setSelectedData(res.data)
      })
  }

  const refreshServers = () => {
    apiService
      .getInstance()
      .get("/menu/servers")
      .then((res) => {
        setServers(res.data)
        setServersLoading(false)
      })
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Context.Provider
      value={[
        selected,
        setSelected,
        selectedData,
        setSelectedData,
        selectedLoading,
        setSelectedLoading,
        refreshSelected,
        settingsActive,
        setSettingsActive,
        serversLoading,
        setServersLoading,
        servers,
        setServers,
        refreshServers,
        collapsed,
        setCollapsed,
        toggleSidebar,
      ]}
    >
      {children}
    </Context.Provider>
  )
}

export function useSidebarContext() {
  return React.useContext(Context)
}

export const SIDEBARCTX_STATES = {
  selected: 0,
  setSelected: 1,
  selectedData: 2,
  setSelectedData: 3,
  selectedLoading: 4,
  setSelectedLoading: 5,
  refreshSelected: 6,
  settingsActive: 7,
  setSettingsActive: 8,
  serversLoading: 9,
  setServersLoading: 10,
  servers: 11,
  setServers: 12,
  refreshServers: 13,
  collapsed: 14,
  setCollapsed: 15,
  toggleSidebar: 16,
}
