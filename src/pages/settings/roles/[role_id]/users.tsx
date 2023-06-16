import { ReactElement } from "react"
import { NextPageWithLayout } from "@/pages/_app"

import TransferList from "@/components/ui/transfer-list"

import RoleLayout from "./_layout"

const RoleUserList: NextPageWithLayout = () => {
  return (
    <>
      <TransferList />
    </>
  )
}

RoleUserList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleUserList
