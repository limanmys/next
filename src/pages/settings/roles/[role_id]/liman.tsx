import { ReactElement } from "react"
import { NextPageWithLayout } from "@/pages/_app"

import RoleLayout from "./_layout"

const RoleLimanList: NextPageWithLayout = () => {
  return <>liman</>
}

RoleLimanList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleLimanList
