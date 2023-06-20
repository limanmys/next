import { ReactElement } from "react"
import { NextPageWithLayout } from "@/pages/_app"

import PageHeader from "@/components/ui/page-header"
import AccessLayout from "@/components/_layout/access_layout"

const AccessLdapPage: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader
        title="LDAP Bağlantısı"
        description="Liman'a giriş yaparken LDAP bağlantısı kullanabilir ve detaylı şekilde erişim yetkilerini konfigüre edebilirsiniz."
      />
    </>
  )
}

AccessLdapPage.getLayout = function getLayout(page: ReactElement) {
  return <AccessLayout>{page}</AccessLayout>
}

export default AccessLdapPage
