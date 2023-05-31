import * as React from "react"
import Link from "next/link"

import { Icons } from "@/components/icons"

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <Icons.logo className="w-18 h-6 dark:fill-white" />
      </Link>
    </div>
  )
}
