import { ReactElement } from "react"
import { NextPageWithLayout } from "@/pages/_app"

import RoleLayout from "./_layout"

const RoleServerList: NextPageWithLayout = () => {
  return <>server</>
}

RoleServerList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleServerList
