import { NextResponse, type NextRequest } from "next/server"

import { IUser } from "./types/user"

const authRoutes = ["/auth/login"]

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.includes("_next") ||
    request.nextUrl.pathname.includes("favicon")
  ) {
    return NextResponse.next()
  }

  const currentUser = request.cookies.get("currentUser")?.value

  if (!currentUser && !authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (currentUser && Date.now() > JSON.parse(currentUser).expired_at) {
    request.cookies.delete("currentUser")
    const response = NextResponse.redirect(new URL("/auth/login", request.url))
    response.cookies.delete("currentUser")
    return response
  }

  if (currentUser && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
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
