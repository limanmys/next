import { NextResponse, type NextRequest } from "next/server"

import { IUser } from "./types/user"

const authRoutes = ["/auth/login"]

export function middleware(request: NextRequest) {
  const urlBeforeRedirect = request.nextUrl.pathname

  if (
    request.nextUrl.pathname.includes("_next") ||
    request.nextUrl.pathname.includes("favicon") ||
    request.nextUrl.pathname.includes("locales") ||
    isStaticAsset(request)
  ) {
    return NextResponse.next()
  }

  const currentUser = request.cookies.get("currentUser")?.value

  if (!currentUser && !authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(
      new URL("/auth/login?redirect=" + request.nextUrl.pathname, request.url)
    )
  }

  if (currentUser && Date.now() > JSON.parse(currentUser).expired_at) {
    console.log(request.referrer)

    request.cookies.delete("currentUser")
    const response = NextResponse.redirect(
      new URL("/auth/login?redirect=" + urlBeforeRedirect, request.url)
    )
    response.cookies.delete("currentUser")
    return response
  }

  if (currentUser && authRoutes.includes(request.nextUrl.pathname)) {
    let url = request.nextUrl.searchParams.get("redirect") || "/"
    return NextResponse.redirect(new URL(url, request.url))
  }

  if (currentUser) {
    const parse = JSON.parse(currentUser || "") as { user: IUser }
    const user: IUser = parse.user ? parse.user : ({ status: 0 } as IUser)

    // Check if regular users settings page access is disabled
    if (
      user.status === 0 &&
      request.nextUrl.pathname.includes("settings/") &&
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
