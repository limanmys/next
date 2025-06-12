import { http } from "@/services"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import KubernetesContainers from "@/components/server/kubernetes/containers"
import KubernetesDeploymentDetails from "@/components/server/kubernetes/deployment-details"
import KubernetesMetadata from "@/components/server/kubernetes/metadata"
import KubernetesPods from "@/components/server/kubernetes/pods"
import KubernetesReplicaSets from "@/components/server/kubernetes/replica-sets"
import KubernetesSpecs from "@/components/server/kubernetes/specs"
import { IKubernetesDeploymentDetails, IServer, IServerDetails } from "@/types/server"

interface IContainerDetails {
    server: IServer
    details: IServerDetails
    kubernetes: IKubernetesDeploymentDetails
}

export default function ContainerStatus() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<IContainerDetails>({} as IContainerDetails)
    const { t } = useTranslation("servers")

    useEffect(() => {
        setLoading(true)
        if (!router.query.server_id) return

        // Get basic server info
        Promise.all([
            http.get(`/servers/${router.query.server_id}`),
            http.get(`/servers/${router.query.server_id}/kubernetes_deployment_details`)
        ])
            .then(([serverRes, kubernetesRes]) => {
                setLoading(false)
                setData({
                    server: serverRes.data.server,
                    details: serverRes.data.details,
                    kubernetes: kubernetesRes.data
                })
            })
            .catch(() => {
                setLoading(false)
            })
    }, [router.query.server_id])

    if (!router.query.server_id || loading) {
        return (
            <div className="flex flex-col">
                <KubernetesSpecs loader />
                <KubernetesDeploymentDetails loader />
                <div className="flex flex-col">
                    <KubernetesContainers loader />
                    <div className="grid grid-cols-2 divide-x">
                        <KubernetesPods loader />
                        <KubernetesReplicaSets loader />
                    </div>
                    <KubernetesMetadata loader />
                </div>
            </div>
        )
    }

    if (data.server?.os !== "kubernetes") {
        return (
            <div className="flex items-center justify-center">
                <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
                        {t("warning")}
                    </h1>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">
                        {t("not_supported")}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <KubernetesSpecs kubernetes={data.kubernetes} />
            <KubernetesDeploymentDetails kubernetes={data.kubernetes} />
            <div className="flex flex-col">
                <KubernetesContainers kubernetes={data.kubernetes} />
                <div className="grid grid-cols-2 divide-x">
                    <KubernetesPods kubernetes={data.kubernetes} />
                    <KubernetesReplicaSets kubernetes={data.kubernetes} />
                </div>
                <KubernetesMetadata kubernetes={data.kubernetes} />
            </div>
        </div>
    )
}