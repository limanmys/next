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

  const [error, setError] = React.useState("")
  const { login } = useLogin()
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (forceChange) {
      if (newPassword !== newPasswordConfirm) {
        setError("Girdiğiniz şifreler uyuşmuyor.")
        setIsLoading(false)
        return
      }

      authService.login(name, password, newPassword).then(() => {
        login(name, newPassword)
          .then(() => {
            setTimeout(() => {
              router.push("/")
            }, 1000)
          })
          .catch((e) => {
            setError(e.response.data.message)
          })
          .finally(() => {
            setIsLoading(false)
          })
      })

      return
    }

    if (!name || !password) {
      setError("Kullanıcı adı veya şifre boş olamaz.")
      setIsLoading(false)
    } else {
      login(name, password)
        .then(() => {
          setTimeout(() => {
            router.push("/")
          }, 1000)
        })
        .catch((e) => {
          setError(e.response.data.message)
          if (e.response.status === 405) {
            setForceChange(true)
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
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

          <Button disabled={isLoading} className="mt-4">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Giriş Yap
          </Button>
        </div>
      </form>
    </div>
  )
}
