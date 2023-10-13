import * as React from "react"
import { useRouter } from "next/router"
import { authService } from "@/services"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { useLogin } from "@/hooks/auth/useLogin"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Alert, AlertDescription, AlertTitle } from "./alert"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const [name, setName] = React.useState("")
  const [password, setPassword] = React.useState("")

  const [forceChange, setForceChange] = React.useState(false)
  const [newPassword, setNewPassword] = React.useState("")
  const [newPasswordConfirm, setNewPasswordConfirm] = React.useState("")

  const [otpSetup, setOtpSetup] = React.useState(false)
  const [otpData, setOtpData] = React.useState<{
    secret: string
    image: string
    message: string
  }>()

  const [enableOtp, setEnableOtp] = React.useState(false)
  const [otp, setOtp] = React.useState("")

  const [error, setError] = React.useState("")
  const { login } = useLogin()
  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)

    let redirectUri = (router.query.redirect || "/") as string
    redirectUri = redirectUri.replace("http", "")

    try {
      if (forceChange) {
        if (newPassword !== newPasswordConfirm) {
          throw new Error("Girdiğiniz şifreler uyuşmuyor.")
        }

        await authService.login(name, password, newPassword)
        await login(name, newPassword, otp)
      } else {
        if (!name || !password) {
          throw new Error("Kullanıcı adı veya şifre boş olamaz.")
        }

        await login(name, password, otp)

        if (forceChange) {
          setForceChange(false)
        }
      }

      setError("")
      setTimeout(() => {
        router.push(redirectUri)
      }, 1000)
    } catch (e: any) {
      if (e.response.data.message) {
        setError(e.response.data.message)
      } else {
        setError(e.message)
      }

      if (e.response.status === 405) {
        setForceChange(true)
      }

      if (e.response.status === 402) {
        setOtpData(e.response.data)
        setOtpSetup(true)
      }

      if (e.response.status === 406) {
        setEnableOtp(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const saveTwoFactorToken = async (
    secret: string,
    username: string,
    password: string
  ) => {
    try {
      setIsLoading(true)
      authService
        .saveTwoFactorToken(secret, username, password)
        .then((res) => {
          setError("Kurulum başarılı. Tekrar giriş yapınız.")
        })
        .catch((err) => {
          setError(err.response.data.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
      setOtpSetup(false)
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!otpSetup && !enableOtp && (
            <>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Kullanıcı Adı
                </Label>
                <Input
                  id="email"
                  placeholder="example@liman.dev"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="password">
                  Şifre
                </Label>
                <Input
                  id="password"
                  placeholder="***********"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {forceChange && (
            <>
              <div className="mt-5 grid gap-1">
                <Label className="sr-only" htmlFor="password">
                  Yeni Şifre
                </Label>
                <Input
                  id="password"
                  placeholder="Yeni Şifreniz"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="password">
                  Yeni Şifreyi Onayla
                </Label>
                <Input
                  id="password"
                  placeholder="Yeni Şifreyi Onayla"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                />
              </div>
            </>
          )}

          {otpSetup && (
            <div className="mt-5 flex grow flex-col items-center justify-center">
              <div
                dangerouslySetInnerHTML={{
                  __html: otpData?.image || "",
                }}
              ></div>

              <p className="mt-5 text-center">
                Google Authenticator uygulamasına QR kodu tarattıktan sonra
                kaydet düğmesine basınız.
              </p>

              <Button
                disabled={isLoading}
                className="mt-8 w-full"
                onClick={() =>
                  saveTwoFactorToken(otpData?.secret || "", name, password)
                }
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Kurulumu Tamamla
              </Button>
            </div>
          )}

          {enableOtp && (
            <>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="otp">
                  İki Aşamalı Doğrulama Kodu
                </Label>
                <Input
                  id="otp"
                  placeholder="******"
                  autoCapitalize="none"
                  autoComplete="otp"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </>
          )}

          {!otpSetup && (
            <Button disabled={isLoading} className="mt-4">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Giriş Yap
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
