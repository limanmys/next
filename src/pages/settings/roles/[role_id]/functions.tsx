import { ReactElement } from "react"
import { NextPageWithLayout } from "@/pages/_app"

import RoleLayout from "./_layout"

const RoleFunctionsList: NextPageWithLayout = () => {
  return <>ext</>
}

RoleFunctionsList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleFunctionsList
