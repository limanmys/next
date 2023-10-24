import { SyntheticEvent, useState } from "react"
import Link from "next/link"
import { apiService } from "@/services"
import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string>("")

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault()

    setLoading(true)
    apiService
      .getInstance()
      .post("/auth/forgot_password", { email })
      .then((res) => {
        setLoading(false)
        setError(res.data.message)
      })
      .catch((err) => {
        setLoading(false)
        setError(err.response.data.message)
      })
  }

  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: "url(/images/auth-bg.jpg)",
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Icons.dugumluLogo className="h-10 w-24 fill-white" />
          </div>
          <div className="relative z-20 mt-auto">
            <Icons.aciklab className="h-[3rem] w-[16rem] fill-white" />
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Şifremi unuttum
              </h1>
              <p className="text-sm text-muted-foreground">
                Şifrenizi sıfırlamak için e-posta adresinizi yazınız.
              </p>
            </div>

            <form onSubmit={onSubmit}>
              <div className="grid gap-2">
                {error && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Bilgi</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="email">
                    E-Posta Adresiniz
                  </Label>
                  <Input
                    id="email"
                    placeholder="example@liman.dev"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button disabled={loading} className="mt-4">
                  {loading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Şifre Sıfırlama Bağlantısı Gönder
                </Button>

                <small className="text-center text-muted-foreground mt-5 italic">
                  <Link href="/auth/login">Giriş yap</Link>
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
