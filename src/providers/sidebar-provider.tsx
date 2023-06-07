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
}
