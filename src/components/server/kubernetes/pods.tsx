import { CheckCircle, Clock, Layers, Server, XCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IKubernetesDeploymentDetails } from "@/types/server"

import { getRelativeTimeString } from "@/lib/utils"
import { Badge } from "../../ui/badge"
import { Card, CardContent } from "../../ui/card"
import { Skeleton } from "../../ui/skeleton"

export default function KubernetesPods({
    kubernetes,
    loader = false
}: {
    kubernetes?: IKubernetesDeploymentDetails
    loader?: boolean
}) {
    const { t } = useTranslation("servers")

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'running':
                return <CheckCircle className="size-4 text-green-500" />
            case 'pending':
                return <Clock className="size-4 text-yellow-500" />
            case 'failed':
                return <XCircle className="size-4 text-red-500" />
            default:
                return <Clock className="size-4 text-gray-500" />
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'running':
                return 'default'
            case 'pending':
                return 'secondary'
            case 'failed':
                return 'destructive'
            default:
                return 'outline'
        }
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold tracking-tight">
                    {t("kubernetes.pods")}
                </h2>
                <Badge variant="secondary">
                    {kubernetes?.pods.length || 0} {t("kubernetes.pods_count")}
                </Badge>
            </div>
            {loader ? (
                <div className="space-y-4">
                    <Skeleton className="h-[100px] w-full" />
                    <Skeleton className="h-[100px] w-full" />
                </div>
            ) : (
                <div className="space-y-4">
                    {kubernetes?.pods.map((pod, index) => (
                        <Card key={index}>
                            <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(pod.status)}
                                            <span className="font-medium">{pod.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <Server className="mr-1 size-3" />
                                                <span>{pod.node}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-1 size-3" />
                                                <span>{getRelativeTimeString(pod.creationTime)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusBadgeVariant(pod.status)}>
                                        {pod.status}
                                    </Badge>
                                </div>

                                {pod.containerStatuses.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <span className="text-sm font-medium">{t("kubernetes.containers")}:</span>
                                        <div className="grid grid-cols-1 gap-2">
                                            {pod.containerStatuses.map((container, idx) => (
                                                <div key={idx} className="flex items-center justify-between rounded-lg bg-muted/30 p-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium">{container.name}</span>
                                                        <Badge variant={container.ready ? "default" : "secondary"} className="text-xs">
                                                            {container.ready ? t("kubernetes.ready") : t("kubernetes.not_ready")}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground font-mono">
                                                        {container.image}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {(!kubernetes?.pods || kubernetes.pods.length === 0) && (
                        <div className="text-center py-8">
                            <Layers className="mx-auto size-12 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">{t("kubernetes.no_pods")}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
