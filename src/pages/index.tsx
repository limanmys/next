import { useSidebarContext } from "@/providers/sidebar-provider"

import DashboardCards from "@/components/dashboard/cards"

export default function IndexPage() {
  return (
    <div className="wrapper p-[24px]">
      <h2 className="text-3xl font-bold tracking-tight">Pano</h2>

      <DashboardCards />
    </div>
  )
}
