import { useEffect, useState } from "react"
import { apiService } from "@/services"

import { IUser } from "@/types/user"

import { Avatar, AvatarFallback } from "../ui/avatar"
import { Skeleton } from "../ui/skeleton"

export default function LatestLoggedInUsers() {
  const [loading, setLoading] = useState<Boolean>(true)
  const [data, setData] = useState<IUser[]>([])

  useEffect(() => {
    apiService
      .getInstance()
      .get<IUser[]>("/dashboard/latest_logged_in_users")
      .then((res) => {
        setData(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      <h3 className="p-8 pb-3 text-lg font-semibold">
        Son Giriş Yapan Kullanıcılar
      </h3>

      <div className="flex flex-col divide-y">
        {data.map((item) => {
          return (
            <div key={item.id}>
              <div className="flex px-8 py-4">
                <div className="avatar mr-5">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{item && item.name[0]}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex flex-col gap-[6px]">
                  <h5 className="font-semibold">
                    {item.name} {item.status == 1 && "(Yönetici)"}
                  </h5>

                  <div className="text-sm">
                    <span className="font-medium text-muted-foreground">
                      Son Giriş Tarihi:{" "}
                    </span>{" "}
                    <span className="text-muted-foreground/80">
                      {new Date(item.last_login_at).toLocaleDateString(
                        "tr-TR",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium text-muted-foreground">
                      Giriş Yapılan Son IP:{" "}
                    </span>{" "}
                    <span className="text-muted-foreground/80">
                      {item.last_login_ip}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {loading && (
          <>
            {[...Array(5)].map((_, i) => (
              <div className="flex px-8 py-4" key={i}>
                <div className="avatar mr-5">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback />
                  </Avatar>
                </div>

                <div className="flex flex-col gap-[6px] w-full">
                  <h5 className="font-semibold">
                    <Skeleton className="h-5" />
                  </h5>

                  <div className="text-sm">
                    <span className="font-medium text-muted-foreground flex items-center gap-[6px]">
                      Son Giriş Tarihi: <Skeleton className="h-4 w-[50%]" />
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium text-muted-foreground flex items-center gap-[6px]">
                      Giriş Yapılan Son IP: <Skeleton className="h-4 w-[50%]" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}
