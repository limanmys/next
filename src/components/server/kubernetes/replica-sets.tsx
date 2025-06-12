import { Clock, Copy, GitBranch, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IKubernetesDeploymentDetails } from "@/types/server"

import { getRelativeTimeString } from "@/lib/utils"
import { Badge } from "../../ui/badge"
import { Card, CardContent } from "../../ui/card"
import { Skeleton } from "../../ui/skeleton"

export default function KubernetesReplicaSets({
    kubernetes,
    loader = false
}: {
    kubernetes?: IKubernetesDeploymentDetails
    loader?: boolean
}) {
    const { t } = useTranslation("servers")

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold tracking-tight">
                    {t("kubernetes.replica_sets")}
                </h2>
                <Badge variant="secondary">
                    {kubernetes?.replicaSets.length || 0} {t("kubernetes.replica_sets_count")}
                </Badge>
            </div>
            {loader ? (
                <div className="space-y-4">
                    <Skeleton className="h-[120px] w-full" />
                </div>
            ) : (
                <div className="space-y-4">
                    {kubernetes?.replicaSets.map((replicaSet, index) => (
                        <Card key={index}>
                            <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <GitBranch className="size-4 text-purple-600" />
                                            <span className="font-medium">{replicaSet.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <Users className="mr-1 size-3" />
                                                <span>{replicaSet.readyReplicas}/{replicaSet.replicas} {t("kubernetes.replicas")}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-1 size-3" />
                                                <span>{getRelativeTimeString(replicaSet.creationTime)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant={replicaSet.readyReplicas === replicaSet.replicas ? "default" : "secondary"}>
                                        {replicaSet.readyReplicas === replicaSet.replicas ?
                                            t("kubernetes.healthy") : t("kubernetes.scaling")}
                                    </Badge>
                                </div>

                                {replicaSet.ownerReference.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <span className="text-sm font-medium">{t("kubernetes.owner_references")}:</span>
                                        <div className="grid grid-cols-1 gap-2">
                                            {replicaSet.ownerReference.map((owner, idx) => (
                                                <div key={idx} className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium">{owner.kind}: {owner.name}</span>
                                                        {owner.controller && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {t("kubernetes.controller")}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground font-mono">
                                                        {owner.apiVersion}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {(!kubernetes?.replicaSets || kubernetes.replicaSets.length === 0) && (
                        <div className="text-center py-8">
                            <Copy className="mx-auto size-12 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">{t("kubernetes.no_replica_sets")}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
