import { Activity, Container, Layers, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IKubernetesDeploymentDetails } from "@/types/server"

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Skeleton } from "../../ui/skeleton"

export default function KubernetesSpecs({
    kubernetes,
    loader = false
}: {
    kubernetes?: IKubernetesDeploymentDetails
    loader?: boolean
}) {
    const { t } = useTranslation("servers")

    return (
        <div className="border-b p-[24px]">
            <h2 className="mb-5 text-2xl font-bold tracking-tight">
                {t("kubernetes.deployment_specs")}
            </h2>
            <div className="grid grid-cols-4 gap-5">
                {loader ? (
                    <>
                        <Skeleton className="h-[174px] w-full" />
                        <Skeleton className="h-[174px] w-full" />
                        <Skeleton className="h-[174px] w-full" />
                        <Skeleton className="h-[174px] w-full" />
                    </>
                ) : (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center justify-between">
                                        {t("kubernetes.replicas")}
                                        <Users className="ml-2 inline-block size-4" />
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {kubernetes?.status.readyReplicas || 0}/{kubernetes?.spec.replicas || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {t("kubernetes.ready_replicas")}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center justify-between">
                                        {t("kubernetes.containers")}
                                        <Container className="ml-2 inline-block size-4" />
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {kubernetes?.spec.template.spec.containers.length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {t("kubernetes.container_count")}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center justify-between">
                                        {t("kubernetes.pods")}
                                        <Layers className="ml-2 inline-block size-4" />
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {kubernetes?.pods.length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {t("kubernetes.running_pods")}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center justify-between">
                                        {t("kubernetes.status")}
                                        <Activity className="ml-2 inline-block size-4" />
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {kubernetes?.status.availableReplicas === kubernetes?.spec.replicas ?
                                        t("kubernetes.healthy") : t("kubernetes.degraded")}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {t("kubernetes.deployment_status")}
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    )
}
