import { cn } from "@/lib/utils"

export type Status = "success" | "error" | "warning" | "information"

export default function StatusBadge({ status }: { status: Status }) {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    information: "bg-blue-500",
  }

  return (
    <div
      className={cn("mr-1 inline-block h-2 w-2 rounded-full", colors[status])}
    ></div>
  )
}
