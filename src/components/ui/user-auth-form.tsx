import { authService, http } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, CheckIcon, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLogin } from "@/hooks/auth/useLogin"
import { cn } from "@/lib/utils"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form/form"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./input-otp"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const [authTypes, setAuthTypes] = React.useState<string[]>(["liman"])

  React.useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const authTypesResponse = await http
          .get("/auth/types")
        setAuthTypes(authTypesResponse.data)

        const authGateResponse = await http
          .get("/auth/gate")
        loginForm.setValue("type", authGateResponse.data)
      } catch (error) {
        console.error("An error occurred while fetching auth data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuthData()
  }, [])

  const formSchema = z.object({
    type: z.enum(["liman", "ldap", "keycloak"]),
    name: z.string({
      required_error: "Kullanıcı adı alanı boş olamaz.",
    }),
    password: z.string({
      required_error: "Lütfen parolanızı giriniz.",
    }),
  })

  const loginForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "liman",
    },
  })

  const [otpSetup, setOtpSetup] = React.useState(false)
  const [otpData, setOtpData] = React.useState<{
    secret: string
    image: string
    message: string
  }>()
  const [otpCredentials, setOtpCredentials] = React.useState<{
    username: string
    password: string
  }>()

  const [enableOtp, setEnableOtp] = React.useState(false)

  const otpSchema = formSchema.and(
    z.object({
      otp: z.string({
        required_error: "Lütfen doğrulama kodunu giriniz.",
      }),
    })
  )

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
  })

  const [forceChange, setForceChange] = React.useState(false)

  const forceChangeSchema = z
    .object({
      name: z.string(),
      password: z.string(),
      newPassword: z.string(),
      newPasswordConfirm: z.string(),
    })
    .refine((data) => data.newPassword === data.newPasswordConfirm, {
      message: "Şifreler uyuşmuyor.",
      path: ["newPasswordConfirm"],
    })

  const forceChangeForm = useForm<z.infer<typeof forceChangeSchema>>({
    resolver: zodResolver(forceChangeSchema),
  })

  const [error, setError] = React.useState("")
  const { login } = useLogin()

  const getRedirectUri = () => {
    let redirectUri = (router.query.redirect || "/") as string
    redirectUri = redirectUri
      .replace("http://", "")
      .replace("https://", "")
      .replace("www.", "")

    return redirectUri
  }

  const onLogin = async (data: z.infer<typeof otpSchema>) => {
    setIsLoading(true)

    try {
      if (!data.otp) await login(data.name, data.password, "", data.type)
      else await login(data.name, data.password, data.otp, data.type)

      setError("")
      setTimeout(() => {
        router.push(getRedirectUri())
      }, 500)
    } catch (e: any) {
      if (!e.response) {
        setError(e.message)
        return
      }

      if (e.response.data.message) {
        setError(e.response.data.message)
      } else {
        setError(e.message)
      }

      if (e.response.data.new_password) {
        setError(
          e.response.data.new_password[1] ||
          e.response.data.new_password[0] ||
          e.response.data.new_password
        )
      }

      if (e.response.status === 405) {
        forceChangeForm.reset({
          name: data.name,
          password: data.password,
          newPassword: "",
          newPasswordConfirm: "",
        })
        setForceChange(true)
      }

      if (e.response.status === 402) {
        setOtpCredentials({
          username: data.name,
          password: data.password,
        })
        setOtpData(e.response.data)
        setOtpSetup(true)
      }

      if (e.response.status === 406) {
        otpForm.reset({
          ...data,
          otp: "",
        })
        setEnableOtp(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onForceChange = async (data: z.infer<typeof forceChangeSchema>) => {
    setIsLoading(true)
    const { name, password, newPassword } = data
    try {
      await authService.login(name, password, newPassword)
      await login(name, newPassword, "")

      setError("")
      setTimeout(() => {
        router.push(getRedirectUri())
      }, 500)
    } catch (e: any) {
      if (!e.response) {
        setError(e.message)
        return
      }

      if (e.response.data.message) {
        setError(e.response.data.message)
      } else {
        setError(e.message)
      }

      if (e.response.data.new_password) {
        setError(
          e.response.data.new_password[1] ||
          e.response.data.new_password[0] ||
          e.response.data.new_password
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const saveTwoFactorToken = async (
    secret: string,
    username?: string,
    password?: string
  ) => {
    if (!secret || !username || !password) {
      setError("Kurulum için gerekli bilgiler eksik.")
      return
    }

    try {
      setIsLoading(true)
      authService
        .saveTwoFactorToken(secret, username, password)
        .then(() => {
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
      <div className="grid gap-4">
        {error && (
          <Alert>
            <AlertCircle className="size-4" />
            <AlertTitle>Bilgi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!otpSetup && !enableOtp && !forceChange && (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLogin as any)}
              className="grid gap-4"
            >
              <FormField
                control={loginForm.control}
                name="type"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="type">Giriş Kapısı Seçimi</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="liman">
                          <Icons.dugumluLogo className="size-12 h-6" />
                        </SelectItem>
                        {authTypes.includes("ldap") && (
                          <SelectItem value="ldap">LDAP</SelectItem>
                        )}
                        {authTypes.includes("keycloak") && (
                          <SelectItem value="keycloak">Keycloak</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={loginForm.control}
                name="name"
                render={({ field }) => (
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="name">Kullanıcı Adı</Label>
                    <Input
                      id="name"
                      placeholder="example@liman.dev"
                      autoComplete="new-password"
                      {...field}
                    />
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Parola</Label>

                      <small className="italic text-muted-foreground">
                        <Link href="/auth/forgot_password" tabIndex={-1}>
                          Şifrenizi mi unuttunuz?
                        </Link>
                      </small>
                    </div>
                    <Input
                      id="password"
                      placeholder="••••••••••"
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                    <FormMessage />
                  </div>
                )}
              />

              <Button disabled={isLoading} className="mt-4" type="submit">
                {isLoading ? (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 size-4" />
                )}
                Giriş Yap
              </Button>
            </form>
          </Form>
        )}

        {forceChange && (
          <Form {...forceChangeForm}>
            <form
              onSubmit={forceChangeForm.handleSubmit(onForceChange)}
              className="grid gap-4"
            >
              <FormField
                control={forceChangeForm.control}
                name="name"
                render={({ field }) => (
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="name">
                      Şifresi Değiştirilecek Kullanıcı
                    </Label>
                    <Input value={field.value} disabled />
                  </div>
                )}
              />

              <FormField
                control={forceChangeForm.control}
                name="newPassword"
                render={({ field }) => (
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="newPassword">Yeni Parolanız</Label>
                    <Input
                      id="newPassword"
                      placeholder="••••••••••"
                      type="password"
                      {...field}
                    />
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={forceChangeForm.control}
                name="newPasswordConfirm"
                render={({ field }) => (
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="newPasswordConfirm">
                      Yeni Parolanızı Onaylayın
                    </Label>
                    <Input
                      id="newPasswordConfirm"
                      placeholder="••••••••••"
                      type="password"
                      {...field}
                    />
                    <FormMessage />
                  </div>
                )}
              />

              <Button disabled={isLoading} className="mt-4" type="submit">
                {isLoading ? (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 size-4" />
                )}
                Giriş Yap
              </Button>
            </form>
          </Form>
        )}

        {otpSetup && (
          <div className="mt-5 flex grow flex-col items-center justify-center">
            <div
              dangerouslySetInnerHTML={{
                __html: otpData?.image || "",
              }}
              style={{
                borderRadius: "24px",
                overflow: "hidden",
              }}
            ></div>

            <p className="mt-5 text-center">
              Google Authenticator uygulamasına QR kodu tarattıktan sonra kaydet
              düğmesine basınız.
            </p>

            <Button
              disabled={isLoading}
              className="mt-8 w-full"
              onClick={() =>
                saveTwoFactorToken(
                  otpData?.secret || "",
                  otpCredentials?.username,
                  otpCredentials?.password
                )
              }
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              ) : (
                <CheckIcon className="mr-2 size-4" />
              )}
              Kurulumu Tamamla
            </Button>
          </div>
        )}

        {enableOtp && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onLogin)}
              className="grid gap-4"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP Şifresi</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Telefonunuza gönderilen şifreyi giriniz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isLoading} className="mt-4" type="submit">
                {isLoading ? (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 size-4" />
                )}
                Giriş Yap
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  )
}
