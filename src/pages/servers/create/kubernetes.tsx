import { useSidebarContext } from "@/providers/sidebar-provider"
import { http } from "@/services"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { ChevronLeft, ChevronRight, PlusCircle, Server } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import KubernetesConnection from "@/components/server/create-kubernetes/kubeconfig"
import NamespaceDeploymentSelection from "@/components/server/create-kubernetes/namespace-deployment-selection"
import Summary from "@/components/server/create-kubernetes/summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import PageHeader from "@/components/ui/page-header"
import Steps from "@/components/ui/steps"
import { useToast } from "@/components/ui/use-toast"
import { opacityAnimation } from "@/lib/anim"

export default function KubernetesCreatePage() {
    const { toast } = useToast()
    const [parent] = useAutoAnimate(opacityAnimation)
    const router = useRouter()
    const sidebarCtx = useSidebarContext()
    const { t } = useTranslation("servers")

    const [data, setData] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const [step, setStep] = useState<number>(0)
    const steps = [
        {
            name: t("create_kubernetes.steps.connection_information.name"),
            description: t("create_kubernetes.steps.connection_information.description"),
            ref: useRef<any>(undefined),
            component: KubernetesConnection,
            validation: async (data: any) => {
                try {
                    const res = await http
                        .post("/kubernetes/namespaces", {
                            kubeconfig: btoa(data.kubeconfig),
                        })
                    return {
                        isValid: res.status === 200,
                        message: res.data,
                    }
                } catch (e: any) {
                    return {
                        isValid: e.response?.status === 200,
                        message: e.response?.data,
                    }
                }
            },
        },
        {
            name: t("create_kubernetes.steps.namespace_deployment.name", "Namespace & Deployment"),
            description: t("create_kubernetes.steps.namespace_deployment.description", "Select namespace and deployment"),
            ref: useRef<any>(undefined),
            component: NamespaceDeploymentSelection,
            validation: async (data: any) => {
                try {
                    const res = await http
                        .post("/kubernetes/deployment_details", {
                            kubeconfig: btoa(data.kubeconfig),
                            namespace: data.namespace,
                            deployment: data.deployment,
                        })
                    return {
                        isValid: res.status === 200,
                        message: res.data,
                    }
                } catch (e: any) {
                    return {
                        isValid: e.response?.status === 200,
                        message: e.response?.data,
                    }
                }
            },
        },
        {
            name: t("create_kubernetes.steps.summary.name"),
            description: t("create_kubernetes.steps.summary.description"),
            ref: useRef<any>(undefined),
            component: Summary,
            validation: async () => {
                return {
                    isValid: true,
                    message: "",
                }
            },
        },
    ]

    const nextStep = () => {
        setLoading(true)

        if (!steps[step].ref?.current) {
            return
        }
        const formRef = steps[step].ref.current
        formRef.trigger()

        setTimeout(async () => {
            if (formRef.formState.isValid) {
                setData({ ...data, ...formRef.getValues() })
                const validator = await steps[step].validation({
                    ...data,
                    ...formRef.getValues(),
                })
                if (!validator.isValid) {
                    Object.keys(validator.message).forEach((key) => {
                        formRef.setError(key, {
                            type: "custom",
                            message: validator.message[key],
                        })
                    })

                    toast({
                        title: t("error"),
                        description: t("create_kubernetes.errors.validation"),
                        variant: "destructive",
                    })
                    setLoading(false)

                    return
                }

                if (
                    formRef.getValues().key_type &&
                    formRef.getValues().key_type === "no_key"
                ) {
                    setStep(step + 3)
                    setLoading(false)

                    return
                }

                setStep(step + 1)
            } else {
                toast({
                    title: t("error"),
                    description: t("create_kubernetes.errors.validation"),
                    variant: "destructive",
                })
            }
            setLoading(false)
        }, 250)
    }

    const createServer = () => {
        setLoading(true)
        http
            .post("/servers", data)
            .then(() => {
                sidebarCtx.refreshServers()
                toast({
                    title: t("success"),
                    description: t("create_kubernetes.errors.success"),
                })
                router.push("/servers")
            })
            .catch(() => {
                toast({
                    title: t("error"),
                    description: t("create_kubernetes.errors.error"),
                    variant: "destructive",
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
            <PageHeader
                title={t("create_kubernetes.title")}
                description={t("create_kubernetes.description")}
                rightSide={
                    <div className="flex gap-2">
                        <Link href="/servers/create">
                            <Button variant="outline" className="rounded-full">
                                <ChevronLeft className="mr-2 size-4" />
                                {t("create_type.back")}
                            </Button>
                        </Link>
                        <Link href="/servers">
                            <Button className="rounded-full">
                                <Server className="mr-2 size-4" />
                                {t("create.servers")}
                            </Button>
                        </Link>
                    </div>
                }
            />
            <div className="mt-5 grid grid-cols-4 gap-8 px-8">
                <Steps steps={steps} current={step} />
                <div className="col-span-3 space-y-8">
                    <Card>
                        <CardContent className="mt-6" ref={parent}>
                            {steps.map((s, index) => {
                                if (index !== step) return null
                                return <s.component formRef={s.ref} key={s.name} data={data} />
                            })}
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between mb-5">
                        <Button
                            variant="outline"
                            onClick={() => setStep(step - 1)}
                            disabled={step === 0}
                        >
                            <ChevronLeft className="mr-2 size-4" />
                            {t("create_kubernetes.back")}
                        </Button>
                        {step !== steps.length - 1 ? (
                            <Button
                                variant="outline"
                                onClick={() => nextStep()}
                                disabled={step === steps.length - 1 || loading}
                            >
                                {loading && (
                                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                                )}
                                {t("create_kubernetes.next")}
                                <ChevronRight className="ml-2 size-4" />
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                onClick={() => createServer()}
                                disabled={loading}
                            >
                                {loading && (
                                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                                )}
                                {!loading && <PlusCircle className="mr-2 size-4" />}
                                {t("create_kubernetes.create")}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
