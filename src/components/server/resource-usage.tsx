import { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { Cpu, Download, HardDrive, MemoryStick, Upload } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"

import { IServerStats } from "@/types/server"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function ResourceUsage({ loader = false }) {
  const { resolvedTheme: theme } = useTheme()
  const { t } = useTranslation("servers")
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([] as IServerStats[])
  let tempData = useRef([] as IServerStats[])
  const chartOptions = useMemo(
    () => ({
      theme: {
        mode: theme,
      },
      chart: {
        background: "transparent",
        fontFamily: "Inter, var(--font-sans)",
        type: "area",
        sparkline: {
          enabled: true,
        },
        animations: {
          enabled: false,
        },
      },
      stroke: {
        curve: "straight",
      },
      fill: {
        opacity: 0.3,
      },
      xaxis: {
        type: "datetime",
        crosshairs: {
          width: 1,
        },
      },
      colors: ["#008ffb", "#00e396"],
      tooltip: {
        enabled: true,
        x: {
          format: "dd MMM yyyy HH:mm:ss",
        },
      },
    }),
    [theme]
  )

  useEffect(() => {
    setLoading(true)
    if (loader) return
    if (!router.query.server_id) return

    const f = () =>
      apiService
        .getInstance()
        .get(`/servers/${router.query.server_id}/stats`)
        .then((response) => {
          setLoading(false)
          const d = response.data
          d.time = Date.now()
          if (tempData.current.length == 0) {
            tempData.current = [
              ...Array(10)
                .fill(null)
                .map(
                  (e, i) =>
                    (e = {
                      cpu: 0,
                      ram: 0,
                      io: 0,
                      network: {
                        download: 0,
                        upload: 0,
                      },
                      time: Date.now() - 20000 - 3000 * i,
                    })
                ),
            ]
          }
          tempData.current = [d, ...tempData.current.splice(0, 10)]
          setData(tempData.current)
        })

    f()
    const timer = setInterval(f, 5000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.server_id])

  return (
    <div className="p-[24px]">
      <h2 className="mb-5 text-2xl font-bold tracking-tight">
        {t("system_status.resource_usage")}
      </h2>
      <div className="grid grid-cols-4 gap-5">
        {loading ? (
          <>
            <Skeleton className="h-[174px] w-full" />
            <Skeleton className="h-[174px] w-full" />
            <Skeleton className="h-[174px] w-full" />
            <Skeleton className="h-[174px] w-full" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{t("system_status.cpu_usage")}</CardTitle>
                <div className="flex items-center">
                  <Cpu className="mr-2 size-4" />%{data[0]?.cpu}
                </div>
              </CardHeader>
              <CardContent
                style={{
                  margin: "-24px",
                }}
                className="resource-charts"
              >
                <Chart
                  type="area"
                  height={100}
                  width="100%"
                  series={[
                    {
                      name: "% " + t("system_status.cpu_usage"),
                      data: data.map((e) => ({ x: e.time, y: e.cpu })),
                    },
                  ]}
                  options={
                    {
                      ...chartOptions,
                      colors: ["#10b981"],
                      yaxis: {
                        show: false,
                        min: 0,
                        max: 100,
                      },
                    } as any
                  }
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("system_status.ram_usage")}</CardTitle>
                <div className="flex items-center">
                  <MemoryStick className="mr-2 size-4" /> %{data[0]?.ram}
                </div>
              </CardHeader>
              <CardContent
                style={{
                  margin: "-24px",
                }}
                className="resource-charts"
              >
                <Chart
                  type="area"
                  height={100}
                  width="100%"
                  series={[
                    {
                      name: "% " + t("system_status.ram_usage"),
                      data: data.map((e) => ({ x: e.time, y: e.ram })),
                    },
                  ]}
                  options={
                    {
                      ...chartOptions,
                      colors: ["#06b6d4"],
                      yaxis: {
                        show: false,
                        min: 0,
                        max: 100,
                      },
                    } as any
                  }
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("system_status.io_usage")}</CardTitle>
                <div className="flex items-center">
                  <HardDrive className="mr-2 size-4" /> %{data[0]?.io}
                </div>
              </CardHeader>
              <CardContent
                style={{
                  margin: "-24px",
                }}
                className="resource-charts"
              >
                <Chart
                  type="area"
                  height={100}
                  width="100%"
                  series={[
                    {
                      name: "% " + t("system_status.io_usage"),
                      data: data.map((e) => ({ x: e.time, y: e.io })),
                    },
                  ]}
                  options={
                    {
                      ...chartOptions,
                      colors: ["#064fd4"],
                      yaxis: {
                        show: false,
                        min: 0,
                        max: 100,
                      },
                    } as any
                  }
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-end justify-between">
                  {t("system_status.network_usage")}{" "}
                  <small className="text-foreground/50">kb/s</small>
                </CardTitle>
                <div className="flex items-center">
                  <Download className="mr-2 size-4" />{" "}
                  {data[0]?.network.download}
                  <Upload className="ml-3 mr-2 size-4" />{" "}
                  {data[0]?.network.upload}
                </div>
              </CardHeader>
              <CardContent
                style={{
                  margin: "-24px",
                }}
                className="resource-charts"
              >
                <Chart
                  type="area"
                  height={100}
                  width="100%"
                  series={[
                    {
                      name: "Download",
                      data: data.map((e) => ({
                        x: e.time,
                        y: e.network.download,
                      })),
                    },
                    {
                      name: "Upload",
                      data: data.map((e) => ({
                        x: e.time,
                        y: e.network.upload,
                      })),
                    },
                  ]}
                  options={
                    {
                      ...chartOptions,
                      colors: ["#c026d3", "#9333ea"],
                    } as any
                  }
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
