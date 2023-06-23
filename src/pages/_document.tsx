import { Head, Html, Main, NextScript } from "next/document"

import { cn } from "@/lib/utils"

export default function Document() {
  return (
    <Html lang="tr">
      <Head />
      <body className={cn("font-inter min-h-screen bg-background antialiased")}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
