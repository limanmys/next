import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  SIDEBARCTX_STATES,
  useSidebarContext,
} from "@/providers/sidebar-provider"
import { apiService } from "@/services"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { ChevronLeft, ChevronRight, PlusCircle, Server } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import PageHeader from "@/components/ui/page-header"
import Steps from "@/components/ui/steps"
import { useToast } from "@/components/ui/use-toast"
import ConnectionInformation from "@/components/server/create-server/connection-information"
import GeneralSettings from "@/components/server/create-server/general-settings"
import KeyInputs from "@/components/server/create-server/key"
import KeySelection from "@/components/server/create-server/key-selection"
import Summary from "@/components/server/create-server/summary"

export default function ServerCreatePage() {
  const { toast } = useToast()
  const [parent] = useAutoAnimate()
  const router = useRouter()
  const sidebarCtx = useSidebarContext()

  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [step, setStep] = useState<number>(0)
  const steps = [
    {
      name: "Bağlantı Bilgileri",
      description: "Sunucu bağlantısını kontrol edin.",
      ref: useRef<any>(),
      component: ConnectionInformation,
      validation: async (data: any) => {
        try {
          const res = await apiService
            .getInstance()
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
      name: "Genel Ayarlar",
      description: "Sunucu adını ve işletim sistemini belirleyin.",
      ref: useRef<any>(),
      component: GeneralSettings,
      validation: async (data: any) => {
        try {
          const res = await apiService
            .getInstance()
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
      name: "Anahtar Seçimi",
      description:
        "Sunucunuza bağlantı kurulabilmesi için bir anahtar türü seçiniz.",
      ref: useRef<any>(),
      component: KeySelection,
      validation: async (data: any) => {
        return {
          isValid: true,
          message: "",
        }
      },
    },
    {
      name: "Anahtar",
      description: "Sunucunuza bağlantı kurmak için anahtar sağlayın.",
      ref: useRef<any>(),
      component: KeyInputs,
      validation: async (data: any) => {
        if (data.key_type == "no_key") {
          return {
            isValid: true,
            message: "",
          }
        }

        try {
          const res = await apiService
            .getInstance()
            .post("/servers/check_connection", data)
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
      name: "Özet",
      description: "Seçimlerinizi kontrol edin ve onaylayın.",
      ref: useRef<any>(),
      component: Summary,
      validation: async (data: any) => {
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
            title: "Hata",
            description: "Lütfen devam etmeden önce girdinizi kontrol edin.",
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
          title: "Hata",
          description: "Lütfen devam etmeden önce girdinizi kontrol edin.",
          variant: "destructive",
        })
      }
      setLoading(false)
    }, 250)
  }

  const createServer = () => {
    setLoading(true)
    apiService
      .getInstance()
      .post("/servers", data)
      .then(() => {
        sidebarCtx[SIDEBARCTX_STATES.refreshServers]()
        toast({
          title: "Başarılı",
          description: "Sunucu başarıyla oluşturuldu.",
        })
        router.push("/servers")
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Sunucu oluşturulurken hata oluştu.",
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
        title="Sunucu Ekle"
        description="Liman Merkezi Yönetim Sistemine halihazırda kurmuş olduğunuz Windows ve Linux sunucularınızı ekleyebilirsiniz."
        rightSide={
          <Link href="/servers">
            <Button className="rounded-full">
              <Server className="mr-2 h-4 w-4" />
              Sunucular
            </Button>
          </Link>
        }
      />
      <div className="mt-8 grid grid-cols-4 gap-8 px-8">
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

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Geri
            </Button>
            {step !== steps.length - 1 ? (
              <Button
                variant="outline"
                onClick={() => nextStep()}
                disabled={step === steps.length - 1 || loading}
              >
                {loading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                İleri
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => createServer()}
                disabled={loading}
              >
                {loading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!loading && <PlusCircle className="mr-2 h-4 w-4" />}
                Ekle
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
