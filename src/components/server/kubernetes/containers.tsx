import { Container, Hash, Network, Terminal } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IKubernetesDeploymentDetails } from "@/types/server"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "../../ui/badge"
import { Separator } from "../../ui/separator"
import { Skeleton } from "../../ui/skeleton"

export default function KubernetesContainers({
    kubernetes,
    loader = false
}: {
    kubernetes?: IKubernetesDeploymentDetails
    loader?: boolean
}) {
    const { t } = useTranslation("servers")

    return (
        <div className="w-full space-y-6 p-6 border-b">
            <h2 className="mb-5 text-2xl font-bold tracking-tight">
                {t("kubernetes.container_configuration")}
            </h2>

            {loader ? (
                <div className="space-y-4">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                </div>
            ) : (
                <div className="space-y-4 bg-background">
                    {kubernetes?.spec.template.spec.containers.map((container, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg border p-6">
                            <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />

                            {/* Container Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Container className="h-4 w-4 text-emerald-600" />
                                        <h3 className="font-semibold text-lg tracking-tight">{container.name}</h3>
                                    </div>
                                    <Badge variant="outline" className="font-mono text-xs">
                                        {container.image}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                {/* Ports Section */}
                                {container.ports && container.ports.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                                <Network className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h4 className="font-medium text-sm">
                                                {t("kubernetes.ports")}
                                            </h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {container.ports.map((port, portIdx) => (
                                                <Badge
                                                    key={portIdx}
                                                    variant="secondary"
                                                    className="font-mono"
                                                >
                                                    {port.containerPort}/{port.protocol}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Environment Variables Section */}
                                {container.env && container.env.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                                <Hash className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <h4 className="font-medium text-sm">
                                                {t("kubernetes.environment_variables")}
                                            </h4>
                                        </div>
                                        <ScrollArea className="max-h-48 overflow-y-auto">
                                            {container.env.map((envVar, envIdx) => (
                                                <div
                                                    key={envIdx}
                                                    className="flex items-center justify-between rounded-full border p-3 mb-2 last:mb-0 hover:bg-muted transition-colors"
                                                >
                                                    <span className="font-mono text-sm font-medium">
                                                        {envVar.name}
                                                    </span>
                                                    <span className="max-w-xs truncate font-mono text-sm text-muted-foreground">
                                                        {envVar.value || (
                                                            <span className="italic">
                                                                &lt;empty&gt;
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    </div>
                                )}
                            </div>

                            {/* Commands and Args Section */}
                            {(container.command || container.args) && (
                                <>
                                    <Separator className="my-6" />
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                                                <Terminal className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <h4 className="font-medium text-sm">
                                                {t("kubernetes.command_args")}
                                            </h4>
                                        </div>

                                        <div className="space-y-3">
                                            {container.command && (
                                                <div className="rounded-lg border p-4">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            Command
                                                        </Badge>
                                                    </div>
                                                    <code className="block font-mono text-sm break-all">
                                                        {container.command.join(' ')}
                                                    </code>
                                                </div>
                                            )}
                                            {container.args && (
                                                <div className="rounded-lg border p-4">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            Args
                                                        </Badge>
                                                    </div>
                                                    <code className="block font-mono text-sm break-all">
                                                        {container.args.join(' ')}
                                                    </code>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {(!kubernetes?.spec.template.spec.containers || kubernetes.spec.template.spec.containers.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                                <Container className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold mb-1">
                                {t("kubernetes.no_containers")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                No containers found in this deployment
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
