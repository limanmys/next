import { FileText, Settings } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IKubernetesDeploymentDetails } from "@/types/server"

import { getRelativeTimeString } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Skeleton } from "../../ui/skeleton"

export default function KubernetesDeploymentDetails({
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
                {t("kubernetes.deployment_details")}
            </h2>
            <div className="grid grid-cols-2 gap-5">
                {loader ? (
                    <>
                        <Skeleton className="h-[200px] w-full" />
                        <Skeleton className="h-[200px] w-full" />
                    </>
                ) : (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center">
                                        <FileText className="mr-2 size-4" />
                                        {t("kubernetes.basic_info")}
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">{t("kubernetes.name")}:</span>
                                    <span className="font-medium">{kubernetes?.metadata.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">{t("kubernetes.namespace")}:</span>
                                    <span className="font-medium">{kubernetes?.metadata.namespace}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">{t("kubernetes.uid")}:</span>
                                    <span className="font-mono text-xs">{kubernetes?.metadata.uid}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">{t("kubernetes.created")}:</span>
                                    <span className="text-sm">{kubernetes?.metadata.creationTimestamp && getRelativeTimeString(kubernetes.metadata.creationTimestamp)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center">
                                        <Settings className="mr-2 size-4" />
                                        {t("kubernetes.strategy")}
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">{t("kubernetes.strategy_type")}:</span>
                                    <span className="font-medium">{kubernetes?.spec.strategy.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">{t("kubernetes.desired_replicas")}:</span>
                                    <span className="font-medium">{kubernetes?.spec.replicas}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">{t("kubernetes.observed_generation")}:</span>
                                    <span className="font-medium">{kubernetes?.status.observedGeneration}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">{t("kubernetes.unavailable_replicas")}:</span>
                                    <span className="font-medium">{kubernetes?.status.unavailableReplicas || 0}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    )
}
