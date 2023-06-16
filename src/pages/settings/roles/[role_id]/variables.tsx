import { ReactElement } from "react"
import { NextPageWithLayout } from "@/pages/_app"

import RoleLayout from "./_layout"

const RoleVariablesList: NextPageWithLayout = () => {
  return <>ext</>
}

RoleVariablesList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleVariablesList
