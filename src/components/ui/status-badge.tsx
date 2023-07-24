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
      className={cn("w-2 h-2 rounded-full inline-block mr-1", colors[status])}
    ></div>
  )
}
