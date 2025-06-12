import { Hash, Tag } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IKubernetesDeploymentDetails } from "@/types/server"

import { Badge } from "../../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Skeleton } from "../../ui/skeleton"

export default function KubernetesMetadata({
    kubernetes,
    loader = false
}: {
    kubernetes?: IKubernetesDeploymentDetails
    loader?: boolean
}) {
    const { t } = useTranslation("servers")

    return (
        <div className="space-y-6 p-6 border-t">
            <h2 className="text-2xl font-bold tracking-tight">
                {t("kubernetes.additional_information")}
            </h2>
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
                                    <Tag className="mr-2 size-4" />
                                    {t("kubernetes.labels")}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {kubernetes?.metadata.labels && Object.entries(kubernetes.metadata.labels).map(([key, value]) => (
                                    <Badge key={key} variant="secondary" className="font-mono text-xs">
                                        {key}: {value}
                                    </Badge>
                                ))}
                                {(!kubernetes?.metadata.labels || Object.keys(kubernetes.metadata.labels).length === 0) && (
                                    <span className="text-sm text-muted-foreground">{t("kubernetes.no_labels")}</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center">
                                    <Hash className="mr-2 size-4" />
                                    {t("kubernetes.annotations")}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {kubernetes?.metadata.annotations && Object.entries(kubernetes.metadata.annotations).map(([key, value]) => (
                                    <div key={key} className="border-l-2 border-muted pl-3">
                                        <div className="font-mono text-xs text-muted-foreground">{key}</div>
                                        <div className="text-sm break-all">{value}</div>
                                    </div>
                                ))}
                                {(!kubernetes?.metadata.annotations || Object.keys(kubernetes.metadata.annotations).length === 0) && (
                                    <span className="text-sm text-muted-foreground">{t("kubernetes.no_annotations")}</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
