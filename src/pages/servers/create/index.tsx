import { Server } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import PageHeader from "@/components/ui/page-header"

export default function CreateTypePage() {
    const { t } = useTranslation("servers")

    return (
        <>
            <PageHeader
                title={t("create_type.title")}
                description={t("create_type.description")}
                rightSide={
                    <Link href="/servers">
                        <Button className="rounded-full">
                            <Server className="mr-2 size-4" />
                            {t("create.servers")}
                        </Button>
                    </Link>
                }
            />

            <div className="mt-8 px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Server Card */}
                    <Card className="relative cursor-pointer transition-all hover:shadow-lg hover:scale-105">
                        <Link href="/servers/create/server">
                            <CardHeader className="text-center pb-4">
                                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Server className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{t("create_type.server.title")}</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    {t("create_type.server.description")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        {t("create_type.server.features.ssh")}
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        {t("create_type.server.features.winrm")}
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        {t("create_type.server.features.traditional")}
                                    </div>
                                </div>
                                <Button className="w-full mt-6" variant="outline">
                                    {t("create_type.server.button")}
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>

                    {/* Kubernetes Card */}
                    <Card className="relative cursor-pointer transition-all hover:shadow-lg hover:scale-105">
                        <Link href="/servers/create/kubernetes">
                            <CardHeader className="text-center pb-4">
                                <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                                    <Icons.kubernetes className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{t("create_type.kubernetes.title")}</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    {t("create_type.kubernetes.description")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        {t("create_type.kubernetes.features.deployment")}
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        {t("create_type.kubernetes.features.scaling")}
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        {t("create_type.kubernetes.features.monitoring")}
                                    </div>
                                </div>
                                <Button className="w-full mt-6" variant="outline">
                                    {t("create_type.kubernetes.button")}
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>
                </div>
            </div>
        </>
    )
}
