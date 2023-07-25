import { ReactElement } from "react"
import Head from "next/head"
import { NextPageWithLayout } from "@/pages/_app"

import PageHeader from "@/components/ui/page-header"
import NotificationLayout from "@/components/_layout/notifications_layout"

const MailNotificationPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Mail Bildirimleri | Liman</title>
      </Head>

      <PageHeader
        title="Mail Bildirimleri"
        description="Zamanlanmış mail bildirimi ayarlarını bu sayfa aracılığı ile yapabilirsiniz."
      />

      <div className="px-8">test</div>
    </>
  )
}

MailNotificationPage.getLayout = function getLayout(page: ReactElement) {
  return <NotificationLayout>{page}</NotificationLayout>
}

export default MailNotificationPage
