import { ReactElement } from "react"
import { NextPageWithLayout } from "@/pages/_app"

import RoleLayout from "./_layout"

const RoleExtensionList: NextPageWithLayout = () => {
  return <>ext</>
}

RoleExtensionList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleExtensionList
