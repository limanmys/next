import * as React from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"

import { IExtension } from "@/types/extension"
import { IServer } from "@/types/server"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"

interface SidebarContextType {
  selected: string
  setSelected: React.Dispatch<React.SetStateAction<string>>
  selectedData: IServer
  setSelectedData: React.Dispatch<React.SetStateAction<IServer>>
  selectedLoading: boolean
  setSelectedLoading: React.Dispatch<React.SetStateAction<boolean>>
  refreshSelected: () => void
  settingsActive: boolean
  setSettingsActive: React.Dispatch<React.SetStateAction<boolean>>
  serversLoading: boolean
  setServersLoading: React.Dispatch<React.SetStateAction<boolean>>
  servers: IServer[]
  setServers: React.Dispatch<React.SetStateAction<IServer[]>>
  refreshServers: () => void
  // Add extension menu support
  extensionsLoading: boolean
  setExtensionsLoading: React.Dispatch<React.SetStateAction<boolean>>
  extensions: IExtension[]
  setExtensions: React.Dispatch<React.SetStateAction<IExtension[]>>
  refreshExtensions: () => void
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
)

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const router = useRouter()
  const user = useCurrentUser()
  const [selected, setSelected] = React.useState<string>("")
  const [selectedLoading, setSelectedLoading] = React.useState<boolean>(true)
  const [selectedData, setSelectedData] = React.useState<IServer>({} as IServer)
  const [settingsActive, setSettingsActive] = React.useState<boolean>(false)

  // Server menu state
  const [serversLoading, setServersLoading] = React.useState<boolean>(true)
  const [servers, setServers] = React.useState<IServer[]>([])

  // Extension menu state
  const [extensionsLoading, setExtensionsLoading] =
    React.useState<boolean>(true)
  const [extensions, setExtensions] = React.useState<IExtension[]>([])

  const [collapsed, setCollapsed] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (router.asPath.startsWith("/settings")) {
      setSettingsActive(true)
      setSelected("")
    } else {
      setSettingsActive(false)
    }
  }, [router.asPath])

  React.useEffect(() => {
    if (user.permissions.view.sidebar === "extensions") {
      setSelected("")
      return
    }

    if (router.query.server_id) {
      setSelected(router.query.server_id as string)
    } else {
      setSelected("")
    }
  }, [router.query.server_id, user.permissions.view.sidebar])

  const refreshSelected = React.useCallback(() => {
    apiService
      .getInstance()
      .get(`/menu/servers/${selected}`)
      .then((res) => {
        setSelectedData(res.data)
      })
  }, [selected])

  const refreshServers = React.useCallback(() => {
    apiService
      .getInstance()
      .get("/menu/servers")
      .then((res) => {
        setServers(res.data)
        setServersLoading(false)
      })
  }, [])

  // Add extension menu support
  const refreshExtensions = React.useCallback(() => {
    apiService
      .getInstance()
      .get("/menu/extensions")
      .then((res) => {
        setExtensions(res.data)
        setExtensionsLoading(false)
      })
  }, [])

  const toggleSidebar = React.useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  const contextValue = React.useMemo(
    () => ({
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
      extensionsLoading,
      setExtensionsLoading,
      extensions,
      setExtensions,
      refreshExtensions,
      collapsed,
      setCollapsed,
      toggleSidebar,
    }),
    [
      selected,
      selectedData,
      selectedLoading,
      settingsActive,
      serversLoading,
      servers,
      collapsed,
      refreshSelected,
      refreshServers,
      extensionsLoading,
      extensions,
      refreshExtensions,
      toggleSidebar,
    ]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebarContext = () => {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}
