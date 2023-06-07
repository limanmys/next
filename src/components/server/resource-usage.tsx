import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { Cpu, Download, HardDrive, MemoryStick, Upload } from "lucide-react"

import { IServerStats } from "@/types/server"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function ResourceUsage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([] as IServerStats[])
  let tempData = useRef([] as IServerStats[])
  const chartOptions = {
    chart: {
      fontFamily: "Inter",
      type: "area",
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          enabled: true,
          speed: 1,
        },
      },
    },
    stroke: {
      curve: "smooth",
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
  }

  useEffect(() => {
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
      <h2 className="mb-5 text-3xl font-bold tracking-tight">
        Kaynak Kullanımı
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
                <CardTitle>CPU Kullanımı</CardTitle>
                <div className="flex items-center">
                  <Cpu className="mr-2 h-4 w-4" />%{data[0]?.cpu}
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
                      name: "% CPU Kullanımı",
                      data: data.map((e) => ({ x: e.time, y: e.cpu })),
                    },
                  ]}
                  options={
                    {
                      ...chartOptions,
                      colors: ["#06d48b"],
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
                <CardTitle>Bellek Kullanımı</CardTitle>
                <div className="flex items-center">
                  <MemoryStick className="mr-2 h-4 w-4" /> %{data[0]?.ram}
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
                      name: "% RAM Kullanımı",
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
                <CardTitle>IO Kullanımı</CardTitle>
                <div className="flex items-center">
                  <HardDrive className="mr-2 h-4 w-4" /> %{data[0]?.io}
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
                      name: "% IO Kullanımı",
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
                <CardTitle>Network Kullanımı</CardTitle>
                <div className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />{" "}
                  {data[0]?.network.download} kb/s
                  <Upload className="ml-3 mr-2 h-4 w-4" />{" "}
                  {data[0]?.network.upload} kb/s
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
                      colors: ["#008ffb", "#00e396"],
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
