import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

interface Endpoint {
    type: string
    address: string
    hostname: string | null
    port: number
    protocol: string
    path: string
    priority: number
    url: string
    accessible: boolean
    response_time: number
    status_code: number | null
    error: string | null
    isBest?: boolean
}

import {
    Form,
    FormControl,
    FormField,
    FormMessage
} from "@/components/form/form"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { http } from "@/services"

const formSchema = z.object({
    namespace: z.string().min(1, "Namespace seçimi zorunludur"),
    deployment: z.string().min(1, "Deployment seçimi zorunludur"),
    endpoint: z.string().min(1, "Endpoint seçimi zorunludur"),
    address: z.string().optional(),
    port: z.number().optional(),
})

export default function NamespaceDeploymentSelection({
    formRef,
    data,
}: {
    formRef: any
    data: any
}) {
    const { t } = useTranslation("servers")
    const [namespaces, setNamespaces] = useState<any[]>([])
    const [deployments, setDeployments] = useState<any[]>([])
    const [endpoints, setEndpoints] = useState<Endpoint[]>([])
    const [namespacesLoading, setNamespacesLoading] = useState(true)
    const [deploymentsLoading, setDeploymentsLoading] = useState(false)
    const [endpointsLoading, setEndpointsLoading] = useState(false)
    const [noEndpointsWarning, setNoEndpointsWarning] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            namespace: data.namespace || "",
            deployment: data.deployment || "",
            endpoint: data.endpoint || "",
            address: data.address || "",
            port: data.port || undefined,
        },
        mode: "onChange",
    })

    formRef.current = form

    // Load namespaces on mount
    useEffect(() => {
        if (data.kubeconfig) {
            loadNamespaces()
        }
    }, [data.kubeconfig])

    const loadNamespaces = async () => {
        try {
            setNamespacesLoading(true)
            const res = await http.post("/kubernetes/namespaces", {
                kubeconfig: btoa(data.kubeconfig),
            })
            if (res.status === 200) {
                // API'den dönen veri array ise direkt kullan, değilse array'e çevir
                const namespaceData = Array.isArray(res.data) ? res.data : [res.data]
                setNamespaces(namespaceData)
            }
        } catch (error) {
            console.error("Failed to load namespaces:", error)
        } finally {
            setNamespacesLoading(false)
        }
    }

    const loadDeployments = async (namespace: string) => {
        try {
            setDeploymentsLoading(true)
            const res = await http.post("/kubernetes/deployments", {
                kubeconfig: btoa(data.kubeconfig),
                namespace: namespace,
            })
            if (res.status === 200) {
                // API'den dönen veri array ise direkt kullan, değilse array'e çevir
                const deploymentData = Array.isArray(res.data) ? res.data : [res.data]
                setDeployments(deploymentData)
            }
        } catch (error) {
            console.error("Failed to load deployments:", error)
            setDeployments([])
        } finally {
            setDeploymentsLoading(false)
        }
    }

    const loadEndpoints = async (namespace: string, deployment: string) => {
        try {
            setEndpointsLoading(true)
            setNoEndpointsWarning(false)
            const res = await http.post("/kubernetes/get_reachable_ip", {
                kubeconfig: btoa(data.kubeconfig),
                namespace: namespace,
                deployment: deployment,
            })
            if (res.status === 200) {
                const endpointData = res.data.endpoints || []

                if (endpointData.length === 0) {
                    // No endpoints found, show warning and clear deployment selection
                    setNoEndpointsWarning(true)
                    setEndpoints([])
                    form.setValue("deployment", "")
                    form.setValue("endpoint", "")
                    form.setValue("address", "")
                    form.setValue("port", undefined)
                    return
                }

                const bestEndpoint = res.data.bestEndpoint

                // Mark best endpoint for special display
                const endpointsWithBest = endpointData.map((endpoint: Endpoint) => ({
                    ...endpoint,
                    isBest: bestEndpoint && endpoint.url === bestEndpoint.url
                }))

                setEndpoints(endpointsWithBest)
            }
        } catch (error) {
            console.error("Failed to load endpoints:", error)
            setEndpoints([])
            setNoEndpointsWarning(true)
            form.setValue("deployment", "")
            form.setValue("endpoint", "")
            form.setValue("address", "")
            form.setValue("port", undefined)
        } finally {
            setEndpointsLoading(false)
        }
    }

    const handleNamespaceChange = (namespace: string) => {
        form.setValue("namespace", namespace)
        form.setValue("deployment", "") // Reset deployment when namespace changes
        form.setValue("endpoint", "") // Reset endpoint when namespace changes
        form.setValue("address", "")
        form.setValue("port", undefined)
        setDeployments([])
        setEndpoints([])
        setNoEndpointsWarning(false)
        if (namespace) {
            loadDeployments(namespace)
        }
    }

    const handleDeploymentChange = (deployment: string) => {
        form.setValue("deployment", deployment)
        form.setValue("endpoint", "") // Reset endpoint when deployment changes
        form.setValue("address", "")
        form.setValue("port", undefined)
        setEndpoints([])
        setNoEndpointsWarning(false)
        if (deployment && form.watch("namespace")) {
            loadEndpoints(form.watch("namespace"), deployment)
        }
    }

    const handleEndpointChange = (endpointUrl: string) => {
        form.setValue("endpoint", endpointUrl)

        // Find the selected endpoint and set address and port
        const selectedEndpoint = endpoints.find(ep => ep.url === endpointUrl)
        if (selectedEndpoint) {
            // Prefer hostname over address if available
            const addressValue = selectedEndpoint.hostname || selectedEndpoint.address
            form.setValue("address", addressValue)
            form.setValue("port", selectedEndpoint.port)
        }
    }

    return (
        <div className="space-y-8 divide-y divide-foreground/10 sm:space-y-5">
            <div>
                <div>
                    <h3 className="text-lg font-medium leading-6 text-foreground">
                        {t("create_kubernetes.steps.namespace_deployment.title")}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-foreground/60">
                        {t("create_kubernetes.steps.namespace_deployment.description")}
                    </p>
                </div>

                <Form {...form}>
                    <form>
                        <FormField
                            control={form.control}
                            name="namespace"
                            render={({ field }) => (
                                <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-foreground/10 sm:pt-5">
                                        <Label htmlFor="namespace" className="sm:mt-px sm:pt-2">
                                            {t("create_kubernetes.steps.namespace_deployment.namespace.label")}
                                        </Label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    handleNamespaceChange(value)
                                                }}
                                                value={field.value}
                                                disabled={namespacesLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("create_kubernetes.steps.namespace_deployment.namespace.placeholder")} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {namespaces.map((namespace) => (
                                                        <SelectItem
                                                            key={namespace.name || namespace}
                                                            value={namespace.name || namespace}
                                                        >
                                                            {namespace.name || namespace}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="mt-2 text-sm text-foreground/60">
                                                {t("create_kubernetes.steps.namespace_deployment.namespace.information")}
                                            </p>
                                            <FormMessage />
                                        </div>
                                    </div>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="deployment"
                            render={({ field }) => (
                                <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-foreground/10 sm:pt-5">
                                        <Label htmlFor="deployment" className="sm:mt-px sm:pt-2">
                                            {t("create_kubernetes.steps.namespace_deployment.deployment.label")}
                                        </Label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    handleDeploymentChange(value)
                                                }}
                                                value={field.value}
                                                disabled={deploymentsLoading || !form.watch("namespace")}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("create_kubernetes.steps.namespace_deployment.deployment.placeholder")} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {deployments.map((deployment) => (
                                                        <SelectItem
                                                            key={deployment.name || deployment}
                                                            value={deployment.name || deployment}
                                                        >
                                                            {deployment.name || deployment}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="mt-2 text-sm text-foreground/60">
                                                {t("create_kubernetes.steps.namespace_deployment.deployment.information")}
                                            </p>
                                            {noEndpointsWarning && (
                                                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                                    <div className="flex">
                                                        <div className="flex-shrink-0">
                                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-3">
                                                            <h3 className="text-sm font-medium text-red-800">
                                                                Erişilebilir Servis Bulunamadı
                                                            </h3>
                                                            <div className="mt-2 text-sm text-red-700">
                                                                <p>
                                                                    Bu deployment için erişilebilir bir servis portu bulunamadı.
                                                                    Bu servis Liman'a eklenemez. Lütfen başka bir deployment seçin.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <FormMessage />
                                        </div>
                                    </div>
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-foreground/10 sm:pt-5">
                                        <Label htmlFor="endpoint" className="sm:mt-px sm:pt-2">
                                            Erişilebilir Servis Portu
                                        </Label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    handleEndpointChange(value)
                                                }}
                                                value={field.value}
                                                disabled={endpointsLoading || !form.watch("deployment")}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Erişilebilir bir port seçin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {endpoints.map((endpoint, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={endpoint.url}
                                                            disabled={!endpoint.accessible}
                                                        >
                                                            <div className="flex items-center justify-between w-full">
                                                                <span>
                                                                    {endpoint.isBest && "⭐ "}
                                                                    {endpoint.hostname || endpoint.address}:{endpoint.port} ({endpoint.protocol})
                                                                </span>
                                                                <span className={`ml-2 text-xs ${endpoint.accessible
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                    }`}>
                                                                    {endpoint.accessible ? '✓' : '✗'}
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="mt-2 text-sm text-foreground/60">
                                                Deployment için erişilebilir servis portlarından birini seçin
                                            </p>
                                            <FormMessage />
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </div>
    )
}
