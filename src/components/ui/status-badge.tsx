import { cn } from "@/lib/utils"

export type Status = "critical" | "high" | "medium" | "low" | "trivial"

export default function StatusBadge({ status }: { status: Status }) {
  function getPriorityColorClass(priority: Status) {
    switch (priority) {
      case "critical":
        return "bg-red-600"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-400"
      case "low":
        return "bg-blue-500"
      case "trivial":
        return "bg-green-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div
      className={cn("mr-1 inline-block size-2 rounded-full", getPriorityColorClass(status))}
    ></div>
  )
}
