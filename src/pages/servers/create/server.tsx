import { useSidebarContext } from "@/providers/sidebar-provider"
import { http } from "@/services"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { isAxiosError } from "axios"
import { ChevronLeft, ChevronRight, PlusCircle, Server } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import ConnectionInformation from "@/components/server/create-server/connection-information"
import GeneralSettings from "@/components/server/create-server/general-settings"
import KeyInputs from "@/components/server/create-server/key"
import KeySelection from "@/components/server/create-server/key-selection"
import Summary from "@/components/server/create-server/summary"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import PageHeader from "@/components/ui/page-header"
import Steps from "@/components/ui/steps"
import { useToast } from "@/components/ui/use-toast"
import { opacityAnimation } from "@/lib/anim"
import { ISshHostKeyChallenge } from "@/types/server"

function isSshHostKeyChallenge(value: unknown): value is ISshHostKeyChallenge {
    if (typeof value !== "object" || value === null) return false

    const challenge = value as Partial<ISshHostKeyChallenge>
    return (
        (challenge.code === "SSH_HOST_KEY_UNKNOWN" ||
            challenge.code === "SSH_HOST_KEY_MISMATCH") &&
        typeof challenge.host === "string" &&
        typeof challenge.port === "number" &&
        typeof challenge.fingerprint === "string"
    )
}

export default function ServerCreatePage() {
    const { toast } = useToast()
    const [parent] = useAutoAnimate(opacityAnimation)
    const router = useRouter()
    const sidebarCtx = useSidebarContext()
    const { t } = useTranslation("servers")

    const [data, setData] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const [step, setStep] = useState<number>(0)
    const [hostKeyChallenge, setHostKeyChallenge] =
        useState<ISshHostKeyChallenge | null>(null)
    const [pendingHostKeyData, setPendingHostKeyData] =
        useState<Record<string, unknown> | null>(null)
    const steps = [
        {
            name: t("create.steps.connection_information.name"),
            description: t("create.steps.connection_information.description"),
            ref: useRef<any>(undefined),
            component: ConnectionInformation,
            validation: async (data: any) => {
                try {
                    const res = await http
                        .post("/servers/check_access", data)
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
            name: t("create.steps.general_settings.name"),
            description: t("create.steps.general_settings.description"),
            ref: useRef<any>(undefined),
            component: GeneralSettings,
            validation: async (data: any) => {
                try {
                    const res = await http
                        .post("/servers/check_name", data)
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
            name: t("create.steps.key_selection.name"),
            description: t("create.steps.key_selection.description"),
            ref: useRef<any>(undefined),
            component: KeySelection,
            validation: async () => {
                return {
                    isValid: true,
                    message: "",
                }
            },
        },
        {
            name: t("create.steps.key_inputs.name"),
            description: t("create.steps.key_inputs.description"),
            ref: useRef<any>(undefined),
            component: KeyInputs,
            validation: async (data: any) => {
                if (data.key_type == "no_key") {
                    return {
                        isValid: true,
                        message: "",
                    }
                }

                try {
                    const res = await http
                        .post("/servers/check_connection", data)
                    return {
                        isValid: res.status === 200,
                        message: res.data,
                    }
                } catch (e: unknown) {
                    if (
                        isAxiosError(e) &&
                        e.response?.status === 409 &&
                        isSshHostKeyChallenge(e.response.data)
                    ) {
                        return {
                            isValid: false,
                            message: {},
                            hostKeyChallenge: e.response.data,
                        }
                    }

                    return {
                        isValid: false,
                        message:
                            isAxiosError(e) && typeof e.response?.data === "object"
                                ? e.response.data
                                : {},
                    }
                }
            },
        },
        {
            name: t("create.steps.summary.name"),
            description: t("create.steps.summary.description"),
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
                const currentData = {
                    ...data,
                    ...formRef.getValues(),
                }
                setData(currentData)
                const validator = await steps[step].validation(currentData)
                if (
                    "hostKeyChallenge" in validator &&
                    isSshHostKeyChallenge(validator.hostKeyChallenge)
                ) {
                    setPendingHostKeyData(currentData)
                    setHostKeyChallenge(validator.hostKeyChallenge)
                    setLoading(false)
                    return
                }
                if (!validator.isValid) {
                    Object.keys(validator.message).forEach((key) => {
                        formRef.setError(key, {
                            type: "custom",
                            message: validator.message[key],
                        })
                    })

                    toast({
                        title: t("error"),
                        description: t("create.errors.validation"),
                        variant: "destructive",
                    })
                    setLoading(false)

                    return
                }

                if (
                    formRef.getValues().key_type &&
                    formRef.getValues().key_type === "no_key"
                ) {
                    setStep(step + 2)
                    setLoading(false)

                    return
                }

                setStep(step + 1)
            } else {
                toast({
                    title: t("error"),
                    description: t("create.errors.validation"),
                    variant: "destructive",
                })
            }
            setLoading(false)
        }, 250)
    }

    const approveHostKey = async () => {
        if (!hostKeyChallenge || !pendingHostKeyData) return

        setLoading(true)
        try {
            await http.post("/servers/check_connection", {
                ...pendingHostKeyData,
                approve_host_key: true,
                replace_host_key:
                    hostKeyChallenge.code === "SSH_HOST_KEY_MISMATCH",
                host_key_fingerprint: hostKeyChallenge.fingerprint,
            })
            setHostKeyChallenge(null)
            setPendingHostKeyData(null)
            setStep(step + 1)
        } catch (error: unknown) {
            if (
                isAxiosError(error) &&
                error.response?.status === 409 &&
                isSshHostKeyChallenge(error.response.data)
            ) {
                setHostKeyChallenge(error.response.data)
                return
            }

            if (
                isAxiosError<Record<string, unknown>>(error) &&
                error.response?.status === 422
            ) {
                const formRef = steps[step].ref.current
                let hasCredentialError = false

                for (const field of ["username", "password"] as const) {
                    const message = error.response.data[field]
                    if (typeof message === "string") {
                        formRef.setError(field, {
                            type: "custom",
                            message,
                        })
                        hasCredentialError = true
                    }
                }

                if (hasCredentialError) {
                    setHostKeyChallenge(null)
                    setPendingHostKeyData(null)
                    toast({
                        title: t("error"),
                        description: t("create.errors.validation"),
                        variant: "destructive",
                    })
                    return
                }
            }

            toast({
                title: t("error"),
                description: t("ssh_host_key.approval_error"),
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const createServer = () => {
        setLoading(true)
        http
            .post("/servers", data)
            .then(() => {
                sidebarCtx.refreshServers()
                toast({
                    title: t("success"),
                    description: t("create.errors.success"),
                })
                router.push("/servers")
            })
            .catch(() => {
                toast({
                    title: t("error"),
                    description: t("create.errors.error"),
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
                title={t("create_server.title")}
                description={t("create_server.description")}
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
                            {t("create.back")}
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
                                {t("create.next")}
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
                                {t("create.create")}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <AlertDialog
                open={hostKeyChallenge !== null}
                onOpenChange={(open) => {
                    if (!open && !loading) {
                        setHostKeyChallenge(null)
                        setPendingHostKeyData(null)
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("ssh_host_key.title")}</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3">
                                <p>
                                    {hostKeyChallenge?.code === "SSH_HOST_KEY_MISMATCH"
                                        ? t("ssh_host_key.mismatch")
                                        : t("ssh_host_key.description")}
                                </p>
                                <div
                                    className="rounded-md border bg-muted p-3 font-mono text-xs"
                                    dir="ltr"
                                >
                                    <div>
                                        {hostKeyChallenge?.host}:{hostKeyChallenge?.port}
                                    </div>
                                    <div className="mt-2 break-all">
                                        {hostKeyChallenge?.fingerprint}
                                    </div>
                                </div>
                                <p className="font-medium text-destructive">
                                    {t("ssh_host_key.warning")}
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>
                            {t("ssh_host_key.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={loading}
                            onClick={(event) => {
                                event.preventDefault()
                                void approveHostKey()
                            }}
                        >
                            {loading && (
                                <Icons.spinner className="mr-2 size-4 animate-spin" />
                            )}
                            {hostKeyChallenge?.code === "SSH_HOST_KEY_MISMATCH"
                                ? t("ssh_host_key.replace")
                                : t("ssh_host_key.approve")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
