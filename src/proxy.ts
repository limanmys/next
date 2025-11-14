import { NextResponse, type NextRequest } from "next/server"

import { IUser } from "./types/user"

const authRoutes = ["/auth/login"]
const safeToRedirect = ["/auth", "/notifications", "/servers", "/settings"]

export function proxy(request: NextRequest) {
  let urlBeforeRedirect = request.nextUrl.pathname
  if (urlBeforeRedirect === "/auth/login") {
    urlBeforeRedirect = "/"
  }

  if (
    request.nextUrl.pathname.includes("_next") ||
    request.nextUrl.pathname.includes("favicon") ||
    request.nextUrl.pathname.includes("locales") ||
    isStaticAsset(request)
  ) {
    return NextResponse.next()
  }

  const currentUser = request.cookies.get("currentUser")?.value

  if (
    !currentUser &&
    (request.nextUrl.pathname.includes("forgot_password") ||
      request.nextUrl.pathname.includes("reset_password"))
  ) {
    return NextResponse.next()
  }

  if (!currentUser && !authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(
      new URL("/auth/login?redirect=" + request.nextUrl.pathname, request.url)
    )
  }

  if (currentUser && authRoutes.includes(request.nextUrl.pathname)) {
    let url = request.nextUrl.searchParams.get("redirect") || "/"

    // Check if url is safe
    const isSafe =
      new URL(url, request.url).origin === new URL(request.url).origin &&
      (() => {
        for (const safeUrl of safeToRedirect) {
          if (url.startsWith(safeUrl)) {
            return true
          }
        }
        return false
      })()

    if (!isSafe) {
      url = "/"
    }

    return NextResponse.redirect(new URL(url, request.url))
  }

  if (currentUser) {
    const parse = JSON.parse(currentUser || "") as { user: IUser }
    const user: IUser = parse.user ? parse.user : ({ status: 0 } as IUser)

    // Check if regular users settings page access is disabled
    if (
      user.status === 0 &&
      request.nextUrl.pathname.includes("settings/") &&
      !request.nextUrl.pathname.startsWith("/servers/") &&
      !request.nextUrl.pathname.includes("profile") &&
      !request.nextUrl.pathname.includes("vault") &&
      !request.nextUrl.pathname.includes("tokens")
    ) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

function isStaticAsset(req: NextRequest) {
  const extensions = [
    ".js",
    ".css",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".mp3",
  ]
  const requestPath = req.nextUrl.pathname.toLowerCase()
  return extensions.some((extension) => requestPath.endsWith(extension))
}
