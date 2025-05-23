import { http } from "@/services"
import { useEffect, useState } from "react"

import { Icons } from "@/components/ui/icons"
import { UserAuthForm } from "@/components/ui/user-auth-form"

export default function AuthenticationPage() {
  const [loginBranding, setLoginBranding] = useState<string>("")

  useEffect(() => {
    http
      .get("/auth/branding")
      .then((res) => {
        setLoginBranding(res.data.image)
      })
  }, [])

  const [randomBgNumber] = useState(() => Math.floor(Math.random() * 4) + 1)

  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative lg:h-full flex-col my-10 lg:my-0 lg:bg-muted lg:p-10 text-white lg:dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover bg-center hidden lg:block"
            style={{
              backgroundImage: `url(/images/auth-bg-${randomBgNumber}.jpg)`,
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Icons.dugumluLogo className="h-10 w-24 fill-white" />
          </div>
          <div className="relative z-20 mt-auto">
            {!loginBranding && (
              <Icons.aciklab className="h-12 w-64 fill-white" />
            )}

            {loginBranding && (
              <img src={loginBranding} alt="Logo" className="max-h-32 w-auto" />
            )}
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="mb-5 flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Hesabınıza giriş yapın
              </h1>
              <p className="text-sm text-muted-foreground">
                Giriş yapmak için sistem yöneticinizin size sağladığı giriş
                bilgilerini giriniz.
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  )
}
